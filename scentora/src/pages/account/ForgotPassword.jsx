import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useToast } from '../../context/ToastContext';
import { MailIcon } from '../../components/common/icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { success } = useToast();

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    success('Reset link sent to your email.');
  };

  return (
    <div className="container container--page">
      <Breadcrumbs />
      <div className="auth-page">
        <div className="auth-page__form auth-page__form--center">
          <span className="section__eyebrow">Password recovery</span>
          <h1>Forgot your password?</h1>
          <p className="auth-page__subtitle">
            Enter the email you signed up with and we'll send you a reset link
            within minutes.
          </p>
          {sent ? (
            <div className="auth-page__success" role="status">
              <p>
                Reset link sent to <strong>{email}</strong>
              </p>
              <p className="auth-page__check">Check your inbox (and spam folder).</p>
              <Link to="/login" className="btn btn--primary">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="auth-form">
              <div className="auth-form__field">
                <MailIcon />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                  autoFocus
                />
              </div>
              <button className="btn btn--dark btn--block btn--lg" type="submit">
                Send reset link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}