import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/16/solid'; // Import the user icon from Heroicons
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

/**
 * @description ProfileMenu component
 * @returns {React.FC}
 */
const ProfileMenu: React.FC = () => {
    const navigate = useNavigate(); // Get the navigate function from react-router-dom
    const { logout, lastlogin, username } = useAuth(); // Get the logout function from AuthContext

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <details className="dropdown">
            <summary className="btn m-1">
                <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    <div
                        className='flex flex-col items-start'
                    >
                        <p>Hello, {username}</p>
                        <p className='text-xs'>last login, {dayjs(lastlogin).format('dddd/MM/YYYY:HH:mm')}</p>
                    </div>
                </div>
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                    <a onClick={handleLogout}>Logout</a>
                </li>
            </ul>
        </details>
    );
};

export default ProfileMenu;