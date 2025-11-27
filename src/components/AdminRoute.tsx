import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    // Si no hay usuario o el rol no es admin, redirigir al home
    if (!user || profile?.rol !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Si es admin, renderizar la ruta hija
    return <Outlet />;
};

export default AdminRoute;
