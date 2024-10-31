import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    // Check for the access token in localStorage
    const accessToken = localStorage.getItem('accessToken');

    // If there is no access token, redirect to the login page
    if (!accessToken) {
        return <Navigate to="/auth/signin" replace />;
    }

    // If access token exists, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;