import { faAngleDoubleLeft, faAngleDoubleRight, faBriefcase, faComments, faDollarSign, faHome, faPlus, faUserGroup, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerHeight <= 765) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const menuItems = [
        { url: '/', title: 'Home', icon: faHome },
        { url: '/candidates', title: 'Candidate', icon: faUserGroup },
        { url: '/jobs', title: 'Job', icon: faBriefcase },
        { url: '/interviews', title: 'Interview', icon: faComments },
        { url: '/offers', title: 'Offer', icon: faDollarSign },
        { url: '/users', title: 'User', icon: faUserTie },
    ];

    return (
        <aside>
            <ul className="menu-list top border-b border-slate-300">
                <li className="menu-item flex justify-between items-center *:p-3">
                    {!isCollapsed && <span className="text-md font-bold">Management</span>}
                    <Link to={'/candidates/add'} className="flex justify-between items-center cursor-pointer">
                        <FontAwesomeIcon icon={faPlus} className="text-md flex justify-center items-center hover:drop-shadow-md"></FontAwesomeIcon>
                    </Link>
                </li>
            </ul>
            <ul className="menu-list middle flex-grow">
                {menuItems.map(item => (
                    <li className="menu-item" key={item.title}>
                        <Link to={item.url} className="menu-link flex items-center p-3 hover:bg-blue-500 hover:text-white">
                            <FontAwesomeIcon icon={item.icon} className="w-6 h-6 flex justify-center items-center"></FontAwesomeIcon>
                            {!isCollapsed && <span className="ml-4">{item.title}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            <ul className="menu-list top border-b border-slate-300">
                <li className="menu-item flex justify-between items-center *:p-3">
                    {!isCollapsed && <span className="text-md">Settings</span>}
                    <FontAwesomeIcon icon={isCollapsed ? faAngleDoubleRight : faAngleDoubleLeft}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-md flex justify-center items-center hover:drop-shadow-md"></FontAwesomeIcon>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;