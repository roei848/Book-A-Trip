import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface Props {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();
  if (currentUser?.role !== UserRole.Admin) return <Navigate to="/" replace />;
  return <>{children}</>;
};
