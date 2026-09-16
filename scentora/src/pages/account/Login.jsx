import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { FormField } from '../../components/common/FormField';
import { MailIcon, LockIcon, UserIcon } from '../../components/common/icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    login({ email, password }).then(() => {
      setLoading(false);
      success('Welcome back!');
      navigate(email.includes('admin') ? '/admin' : '/account');
    });
  };

  return (
    <div className="container container--page">
      <Breadcrumbs />
      <div className="auth-page">
        <div className="auth-page__hero">
          <img
            src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1000&auto=format&fit=crop"
            alt="Luxury fragrance"
            loading="lazy"
          />
        </div>
        <div className="auth-page__form">
          <span className="section__eyebrow">Welcome back</span>
          <h1>Sign in to SCENTORA</h1>
          <p className="auth-page__subtitle">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>

          {error && <div className="auth-page__error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__field">
              <MailIcon />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
            </div>
            <div className="auth-form__field">
              <LockIcon />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
            <div className="auth-form__row">
              <label className="checkbox">
                <input type="checkbox" className="checkbox__input" defaultChecked />
                <span className="checkbox__box" />
                <span className="checkbox__label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-page__link">
                Forgot password?
              </Link>
            </div>
            <button
              className="btn btn--dark btn--block btn--lg"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}