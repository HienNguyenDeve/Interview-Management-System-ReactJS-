import './App.css'
import { AuthProvider } from './context/auth.context'
import { ToastProvider } from './context/toast.context'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ManagerLayout from './shared/layouts/ManagerLayout'
import Home from './pages/Home'
import AnonymousRoute from './shared/components/AnonymousRoute'
import AnonymousLayout from './shared/layouts/AnomnymousLayout'
import Login from './pages/auth/Login'
import PrivateRoute from './shared/components/PrivateRoute'
import UserList from './pages/manager/user/UserList'
import CandidateList from './pages/manager/candidate/CandidateList'
import InterviewList from './pages/manager/interview/InterviewList'
import { JobList } from './pages/manager/job/JobList'

function App() {

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className='main-content min-h-screen flex flex-col'>
            <Routes>
              {/* Admin Router */}
              <Route element={<PrivateRoute requiredRoles={["Admin", "HR Manager", "Recruiter"]} />}>
                <Route path='/' element={<ManagerLayout><Home /></ManagerLayout>}></Route>
                <Route path='/users' element={<ManagerLayout><UserList /></ManagerLayout>}></Route>
                <Route path='/candidates' element={<ManagerLayout><CandidateList /></ManagerLayout>}></Route>
                <Route path='/interviews' element={<ManagerLayout><InterviewList /></ManagerLayout>}></Route>
                <Route path='/jobs' element={<ManagerLayout><JobList /></ManagerLayout>}></Route>
                <Route path='/' element={<ManagerLayout><Home /></ManagerLayout>}></Route>
                <Route path='/' element={<ManagerLayout><Home /></ManagerLayout>}></Route>
                <Route path='/' element={<ManagerLayout><Home /></ManagerLayout>}></Route>
              </Route>

              <Route element={<AnonymousRoute />}>
                {/* Auth Router */}
                <Route path="/auth/login" element={<AnonymousLayout><Login /></AnonymousLayout>}>
                </Route>
              </Route>
              <Route path="/403" element></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
