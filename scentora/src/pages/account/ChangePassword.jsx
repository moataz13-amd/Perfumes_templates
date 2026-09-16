import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { FormField } from '../../components/common/FormField';

export default function ChangePassword() {
  const { success, error } = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.current) errs.current = 'Enter your current password';
    if (form.next.length < 6) errs.next = 'New password must be at least 6 characters';
    if (form.confirm !== form.next) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (form.current === form.next) {
      setErrors({ next: 'New password must be different.' });
      return;
    }
    setErrors({});
    setDone(true);
    success('Password changed successfully');
  };

  return (
    <div>
      <h1 className="page-title">Change Password</h1>
      <div className="account-card">
        {done ? (
          <div className="auth-page__success">
            <p>Your password has been updated.</p>
            <p>Next time you sign in, use your new password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="checkout-form profile-form">
            <FormField
              label="Current password"
              name="current"
              type="password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              error={errors.current}
              required
            />
            <FormField
              label="New password"
              name="next"
              type="password"
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
              error={errors.next}
              required
            />
            <FormField
              label="Confirm new password"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.confirm}
              required
            />
            <button type="submit" className="btn btn--primary">
              Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}