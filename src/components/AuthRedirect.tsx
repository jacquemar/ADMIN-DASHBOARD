import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import Loader from '../common/Loader';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth/signin', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Loader />; // Afficher un loader pendant la redirection
  }

  return <>{children}</>;
};

export default AuthRedirect; 