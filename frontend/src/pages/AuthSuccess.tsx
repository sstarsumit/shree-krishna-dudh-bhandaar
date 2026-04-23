import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      loadUser().then(() => navigate('/', { replace: true }));
    } else {
      navigate('/login');
    }
  }, []);

  return <div>Signing in...</div>;
};

export default AuthSuccess;
