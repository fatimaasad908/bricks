import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!user && !localStorage.getItem('bricks_token')) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (user?.role !== 'admin' || user?.email !== 'asadfatima93@gmail.com')) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
