import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { addressBook as seedAddresses } from '../../data/reviews';
import { FormField, SelectField } from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import { PencilIcon, TrashIcon, PlusIcon } from '../../components/common/icons';

export default function Addresses() {
  const [addresses, setAddresses] = useState(seedAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    label: '', fullName: '', line1: '', line2: '', city: '', state: '', postal: '', country: 'United States', phone: '',
  });
  const [errors, setErrors] = useState({});
  const { success } = useToast();

  const openAdd = () => {
    setEditing(null);
    setForm({ label: '', fullName: '', line1: '', line2: '', city: '', state: '', postal: '', country: 'United States', phone: '' });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a.id);
    setForm({ ...a });
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.label) errs.label = 'Label is required';
    if (!form.fullName.trim()) errs.fullName = 'Full name required';
    if (!form.line1.trim()) errs.line1 = 'Street required';
    if (!form.city.trim()) errs.city = 'City required';
    if (!form.postal.trim()) errs.postal = 'Postal code required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (editing) {
      setAddresses((prev) => prev.map((a) => (a.id === editing ? { ...a, ...form } : a)));
      success('Address updated');
    } else {
      setAddresses((prev) => [...prev, { id: Date.now(), ...form, isDefault: false }]);
      success('Address added');
    }
    setModalOpen(false);
  };

  const remove = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    success('Address removed');
  };

  const setDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    success('Default address updated');
  };

  return (
    <div>
      <div className="account-card__head account-card__head--page">
        <h1 className="page-title">Addresses</h1>
        <button className="btn btn--primary btn--sm" onClick={openAdd}>
          <PlusIcon width={14} height={14} /> Add address
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="account-card__empty">No saved addresses yet.</p>
      ) : (
        <div className="address-grid">
          {addresses.map((a) => (
            <div className="address-card" key={a.id}>
              <div className="address-card__head">
                <strong>{a.label}</strong>
                {a.isDefault && <span className="status-pill status-pill--delivered">Default</span>}
              </div>
              <p>{a.fullName}</p>
              <p>{a.line1}{a.line2 && `, ${a.line2}`}</p>
              <p>{a.city}, {a.state} {a.postal}</p>
              <p>{a.country}</p>
              <p>{a.phone}</p>
              <div className="address-card__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => openEdit(a)}>
                  <PencilIcon width={13} height={13} /> Edit
                </button>
                {!a.isDefault && (
                  <button className="btn btn--ghost btn--sm" onClick={() => setDefault(a.id)}>
                    Set default
                  </button>
                )}
                <button
                  className="icon-btn icon-btn--sm"
                  onClick={() => remove(a.id)}
                  aria-label={`Delete ${a.label}`}
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit address' : 'Add address'}
      >
        <form onSubmit={save} className="checkout-form">
          <FormField label="Label" name="label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home, Office…" error={errors.label} required />
          <FormField label="Full name" name="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} required />
          <FormField label="Street address" name="line1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} error={errors.line1} required />
          <FormField label="Apt, suite (optional)" name="line2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
          <div className="checkout-form__row">
            <FormField label="City" name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} error={errors.city} required />
            <FormField label="Postal" name="postal" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} error={errors.postal} required />
          </div>
          <div className="checkout-form__row">
            <FormField label="State" name="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <SelectField label="Country" name="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} options={['United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Italy']} />
          </div>
          <FormField label="Phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="modal__footer-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}