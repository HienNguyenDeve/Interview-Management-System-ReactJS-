import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth.hook";
import { useState } from "react";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Header() {
    const { logout , currentUser } = useAuth();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

    const onLogout = () => {
        logout();
    }

    const onProfileMenuMouseEnter = () => {
        setIsProfileMenuOpen(true);
    }

    const onProfileMenuMouseLeave = () => {
        if (!document.querySelector(".profile-actions:hover")) {
            setIsProfileMenuOpen(false);
        }
    }

    const profileMenuItems = [
        { title: "Profile", onclick: () => navigate('/profile'), icon: faUser },
        { title: "Logput", onclick: onLogout, icon: faSignOutAlt},
    ];

    return (
        <header className="bg-blue-500 text-white shadow-md flex justify-between items-center h-16 px-4">
            <Link to={"/"} className="logo text-2xl font-bold">IMS</Link>
            <div className="profile-menu-container h-full flex items-center"
                onMouseEnter={onProfileMenuMouseEnter} onMouseLeave={onProfileMenuMouseLeave}>
                <div className="profile-menu flex items-center">
                    <div className="profile-infor mr-4 *:block">
                        <span className="font-bold">{currentUser?.username}</span>
                        <span className="text-xs text-right">{currentUser?.departmentName}</span>
                    </div>
                    <img src={currentUser?.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white" />
                </div>
                {isProfileMenuOpen && (
                    <div>
                        {profileMenuItems.map(item => (
                            <div key={item.title} className="profile-action p-4 hover:bg-blue-500 hover:text-white 
                                cursor-pointer first:rouded-t-md last:rounded-b-md" 
                                onClick={item.onclick}>
                                <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-2"></FontAwesomeIcon>
                                <span className="ml-2">{item.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;