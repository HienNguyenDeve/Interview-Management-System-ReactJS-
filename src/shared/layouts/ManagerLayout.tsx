import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface ManagerLayoutProps {
    readonly children: React.ReactNode;
}

function ManagerLayout({ children }: ManagerLayoutProps) {
    return (
        <>
            <Header></Header>
            <main className="'flex-1 flex bg-slate-50">
                <Sidebar />
                <div className="main-content w-full p-4 h-[calc(100vh-64px)] overflow-y-auto">
                    {children}
                </div>
            </main>
        </>
    );
}

export default ManagerLayout;