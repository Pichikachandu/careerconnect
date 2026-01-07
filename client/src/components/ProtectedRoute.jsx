import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();

    // 1. Check if user is logged in
    const userRole = localStorage.getItem('userRole'); // 'student', 'admin', 'company'

    // Identify which auth token to check based on expected roles? 
    // Actually, simple check: if userRole exists, we assume logged in.
    // Ideally we should check specific tokens (studentToken, adminToken), but userRole is the common switch.

    if (!userRole) {
        // Not logged in, redirect to login selection or home
        // Since we don't know who they are, send to home or a generic login?
        // App.jsx has /login/:role. Let's send to home for safety.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 2. Check if user has permission
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // User is logged in but role is not allowed. 
        // Redirect to their appropriate dashboard.
        if (userRole === 'student') return <Navigate to="/dashboard/student" replace />;
        if (userRole === 'admin') return <Navigate to="/dashboard/admin" replace />;
        if (userRole === 'company') return <Navigate to="/dashboard/company" replace />;
        return <Navigate to="/" replace />;
    }

    // 3. Authorized
    return children;
};

export default ProtectedRoute;
