import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { PUBLIC_PATHS } from '../config/public-paths';
import { RootState } from '../store/store';

interface ProtectedRouteProps {
    children: ReactNode | ReactNode[];
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const location = useLocation().pathname;

    if (!user && !PUBLIC_PATHS.includes(location)) {
        return <Navigate to="/login" replace />;
    }

    if (user && PUBLIC_PATHS.includes(location)) {
        return <Navigate to="/" replace />;
    }

    return children;
};
