import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { FormField, SelectField, CheckboxField } from '../../components/common/FormField';
import { useUser } from '../../context/UserContext';

export default function AdminSettings() {
  const { success } = useToast();
  const { user, updateProfile } = useUser();

  const [store, setStore] = useState({
    name: 'Scentora',
    tagline: 'The Art of Perfume',
    email: 'hello@scentora.com',
    phone: '+1 (800) 555-0199',
    currency: 'USD',
    timezone: 'America/New_York',
    address: '121 Madison Avenue, New York, NY 10016',
  });

  const [prefs, setPrefs] = useState({
    lowStockAlerts: true,
    orderNotifications: true,
    reviewNotifications: true,
    weeklyDigest: false,
    autoArchive: false,
  });

  const [admin, setAdmin] = useState({
    name: user.name || 'Admin User',
    email: user.email || 'admin@scentora.com',
  });

  const saveStore = (e) => { e.preventDefault(); success('Store settings saved'); };
  const savePrefs = (e) => { e.preventDefault(); success('Preferences saved'); };
  const saveAdmin = (e) => {
    e.preventDefault();
    updateProfile(admin);
    success('Profile updated');
  };

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Configure the storefront and preferences</p>
        </div>
      </div>

      <div className="admin-grid admin-grid--2">
        <form onSubmit={saveStore} className="admin-card">
          <h3>Store details</h3>
          <div className="admin-form">
            <div className="admin-form__grid">
              <FormField label="Store name" name="sName" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
              <FormField label="Tagline" name="sTagline" value={store.tagline} onChange={(e) => setStore({ ...store, tagline: e.target.value })} />
            </div>
            <div className="admin-form__grid">
              <FormField label="Contact email" name="sEmail" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} />
              <FormField label="Phone" name="sPhone" value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} />
            </div>
            <div className="admin-form__grid">
              <SelectField label="Currency" name="sCurrency" value={store.currency} onChange={(e) => setStore({ ...store, currency: e.target.value })} options={['USD', 'EUR', 'GBP']} />
              <FormField label="Time zone" name="sTime" value={store.timezone} onChange={(e) => setStore({ ...store, timezone: e.target.value })} />
            </div>
            <FormField label="Store address" name="sAddr" value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} />
            <button type="submit" className="btn btn--primary">Save store details</button>
          </div>
        </form>

        <form onSubmit={savePrefs} className="admin-card">
          <h3>Notification preferences</h3>
          <div className="admin-form">
            {Object.entries(prefs).map(([key, val]) => (
              <CheckboxField
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                name={key}
                checked={val}
                onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
              />
            ))}
            <button type="submit" className="btn btn--primary">Save preferences</button>
          </div>
        </form>
      </div>

      <form onSubmit={saveAdmin} className="admin-card">
        <h3>Admin profile</h3>
        <div className="admin-form">
          <div className="admin-form__grid">
            <FormField label="Full name" name="aName" value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} />
            <FormField label="Email" name="aEmail" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} />
          </div>
          <button type="submit" className="btn btn--primary">Update profile</button>
        </div>
      </form>

      <div className="admin-card admin-card--danger-zone">
        <h3>Danger zone</h3>
        <div className="admin-form__row">
          <div>
            <strong>Reset demo data</strong>
            <p className="text-muted">Restore the catalog, orders and coupons to the original seed data.</p>
          </div>
          <button className="btn btn--danger" onClick={() => { localStorage.removeItem('scentora_admin_catalog_v1'); success('Demo data reset'); window.location.reload(); }}>
            Reset data
          </button>
        </div>
      </div>
    </div>
  );
}