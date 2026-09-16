import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

export default function Logout() {
  const { logout } = useUser();
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    success('You have been signed out.');
    const t = setTimeout(() => navigate('/'), 600);
    return () => clearTimeout(t);
  }, [logout, navigate, success]);

  return <div className="container container--page">Signing you out…</div>;
}