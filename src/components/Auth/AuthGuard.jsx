import { useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const AuthGuard = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.petedillo.com/login?redirect=${redirectUrl}`;
    }
  }, [user]);

  if (!user) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  return children;
};

export default AuthGuard;
