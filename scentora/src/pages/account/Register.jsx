import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { MailIcon, LockIcon, UserIcon } from '../../components/common/icons';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useUser();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    register({ name, email, password }).then(() => {
      setLoading(false);
      success('Account created successfully!');
      navigate('/account');
    });
  };

  return (
    <div className="container container--page">
      <Breadcrumbs />
      <div className="auth-page">
        <div className="auth-page__hero">
          <img
            src="https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=1000&auto=format&fit=crop"
            alt="Luxury fragrance"
            loading="lazy"
          />
        </div>
        <div className="auth-page__form">
          <span className="section__eyebrow">New customer</span>
          <h1>Create your account</h1>
          <p className="auth-page__subtitle">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

          {error && <div className="auth-page__error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__field">
              <UserIcon />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Full name"
              />
            </div>
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
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                aria-label="Password"
              />
            </div>
            <p className="auth-page__terms">
              By creating an account you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
            <button
              className="btn btn--dark btn--block btn--lg"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}