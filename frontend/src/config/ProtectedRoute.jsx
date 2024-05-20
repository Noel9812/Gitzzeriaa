import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure the path is correct

const ProtectedRoute = ({ children }) => {
    
    const { currentUser, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>; // Or any other loading indicator
    }
    
    if (!currentUser) {
        // Redirect them to the login page, but save the current location they were trying to go to
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;