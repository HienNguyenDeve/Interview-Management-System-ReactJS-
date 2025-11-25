import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth.hook"
import { useToast } from "../../hooks/use-toast.hook";
import { useEffect, useRef, useState } from "react";
import { ModalType } from "../../enums/modal-type.enum";
import * as Yup from 'yup';
import { AuthService } from "../../services/auth.service";
import { AxiosError } from "axios";
import { ToastType } from "../../enums/core/common/toast-type.enum";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Modal } from "../../core/components/modals/Modal";
import { ModalSize } from "../../enums/modal-size.enum";
import LoginRequestModel from "../../models/auth/login-request.model";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast(); // Innitialize useToast
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<ModalType>(ModalType.INFO);
    const toastShownRef = useRef(false); // Initialize useRef flag

    const initialValues: LoginRequestModel = {
        username: '',
        password: ''
    }

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must be at most 20 characters')
    })

    const onSubmit = async (values: LoginRequestModel) => {
        try {
            const response = await AuthService.login(values);
            if (response.status === 200 && response.data) {
                login(response.data);
                navigate('/');
            } else {
                setModalMessage('Login failed');
                setModalType(ModalType.DANGER);
                setShowModal(true);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === 401) {
                    setModalMessage('Invalid creadentials');
                } else {
                    setModalMessage(error.response?.data?.message || 'Login failed');
                }
            } else if (error instanceof Error) {
                setModalMessage(error.message);
            } else {
                setModalMessage('Login failed');
            }
            setModalType(ModalType.DANGER);
            setShowModal(true);
            showToast(ToastType.Error, 'Login failed. Please try again.') // Show error toast
        }
    }

    // Add useEffect to handle token expiration toast
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get("tokenExpired") && !toastShownRef.current) {
            showToast(ToastType.Error, "Your session has expired. Please login again.");
            toastShownRef.current = true; // Set flag to true after showing toast
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [showToast, navigate, location.search, location.pathname]);

    const formik = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form className='*:mb-3'>
                <div className="form-group">
                    <label htmlFor="username" className="block mb-2">Username</label>
                    <Field type="text" name="username" className="form-control p-2
                        border border-slate-300 rounded-sm w-full" />
                    <ErrorMessage name="username" component="div" className="text-red-500" />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="block mb-2">Password</label>
                    <Field type="password" name="passowrd" className="form-control p-2
                        border border-slate-300 rounded-sm w-full" />
                    <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
                <div className="form-group">
                    <button type="submit" className="p-2 px-4 bg-blue-500 hover:bg-blue-700
                        text-white rounded-full w-full">Login</button>
                </div>
            </Form>
        </Formik>
    )
    return (
        <section className="h-screen w-full flex justify-center items-center">
            <div className="form-login w-[450px] border border-slate-300
                rounded-md shadow-md p-5 bg-white">
                <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
                {formik}
            </div>
            <Modal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Login Status"
                modalType={modalType}
                modalSize={ModalSize.SMALL}>
                <p>{modalMessage}</p>
            </Modal>
        </section>
    )
}

export default Login;