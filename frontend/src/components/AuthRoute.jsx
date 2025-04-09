import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AuthProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // Show loading when checking authorization
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-black opacity-50 z-100 text-8xl text-white">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  
  // Render the protected routes if valid
  return <Outlet />;
};

export default AuthProtectedRoute;