import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import { FormField, SelectField, CheckboxField } from '../../components/common/FormField';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/common/icons';

const EMPTY = { code: '', discountType: 'percentage', discountValue: '10', minPurchase: '', maxUses: '', active: true };

export default function AdminCoupons() {
  const { coupons: couponList, addCoupon, updateCoupon, removeCoupon } = useAdminData();
  const { success, error } = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c) => {
    setEditing(c.code);
    setForm({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, minPurchase: c.minPurchase || '', maxUses: c.maxUses || '', active: c.active });
    setModal(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.code.trim()) { error('Code is required'); return; }
    if (editing) {
      updateCoupon(editing, form);
      success('Coupon updated');
    } else {
      const res = addCoupon(form);
      if (res.error) error(res.error);
      else success('Coupon added');
    }
    setModal(false);
  };

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Coupons</h1>
          <p>{couponList.length} promotion(s) active</p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}><PlusIcon width={15} height={15} /> Add coupon</button>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Code</th><th>Discount</th><th>Min. purchase</th><th>Uses</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {couponList.map((c) => (
                <tr key={c.code}>
                  <td className="admin-mono">{c.code}</td>
                  <td>
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}%`
                      : `$${c.discountValue}`
                    }
                  </td>
                  <td>{c.minPurchase ? `$${c.minPurchase}` : '—'}</td>
                  <td>{c.usedCount}/{c.maxUses || '∞'}</td>
                  <td>
                    <span className={`stat-badge ${c.active ? 'stat-badge--success' : 'stat-badge--neutral'}`}>
                      {c.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-cell-actions">
                      <button className="icon-btn icon-btn--sm" onClick={() => openEdit(c)} aria-label="Edit"><PencilIcon width={14} height={14} /></button>
                      <button className="icon-btn icon-btn--sm" onClick={() => { removeCoupon(c.code); success('Coupon deleted'); }} aria-label="Delete"><TrashIcon width={14} height={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit coupon' : 'Add coupon'} size="sm">
        <form onSubmit={save} className="admin-form">
          <FormField label="Coupon code" name="code" value={form.code.toUpperCase()} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <div className="admin-form__grid">
            <SelectField label="Discount type" name="discountType" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} options={['percentage', 'fixed']} />
            <FormField label="Discount value" name="discountValue" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          </div>
          <div className="admin-form__grid">
            <FormField label="Min. purchase ($)" name="minPurchase" type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: e.target.value })} />
            <FormField label="Max uses" name="maxUses" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
          </div>
          <CheckboxField label="Active" name="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          <div className="modal__footer-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">{editing ? 'Save changes' : 'Add coupon'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}