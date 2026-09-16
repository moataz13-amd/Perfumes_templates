import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { FormField } from '../../components/common/FormField';

export default function Profile() {
  const { user, updateProfile } = useUser();
  const { success } = useToast();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    success('Profile updated');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <div className="account-card">
        <h2>Personal information</h2>
        <form onSubmit={handleSave} className="checkout-form profile-form">
          <FormField
            label="Full name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <FormField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <FormField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="profile-form__row">
            <button type="submit" className="btn btn--primary">
              Save changes
            </button>
            {saved && <span className="profile-form__saved">Saved ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}