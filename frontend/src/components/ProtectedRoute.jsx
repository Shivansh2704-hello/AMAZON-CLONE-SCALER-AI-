import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e47911]"></div>
      </div>
    );
  }

  // In "No Login Required" mode, we always have a user (Default User).
  // But we'll keep the logic robust to allow the app to function normally.
  return children;
};

export default ProtectedRoute;
