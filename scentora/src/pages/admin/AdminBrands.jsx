import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import { FormField, TextAreaField, SelectField } from '../../components/common/FormField';
import { PencilIcon, PlusIcon } from '../../components/common/icons';
import { getBrandSlug } from '../../data/brands';

export default function AdminBrands() {
  const { brandList, updateBrand, addBrand, catalog } = useAdminData();
  const { success, error } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', tagline: '', country: '', founded: '', description: '', heroImage: '', status: 'active' });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', tagline: '', country: '', founded: '', description: '', heroImage: '', status: 'active' });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b.slug);
    setForm({ name: b.name, tagline: b.tagline, country: b.country, founded: b.founded || '', description: b.description, heroImage: b.heroImage, status: b.status || 'active' });
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      error('Brand name is required');
      return;
    }
    if (editing) {
      updateBrand(editing, form);
      success('Brand updated');
    } else {
      const res = addBrand(form);
      if (res.error) error(res.error);
      else success('Brand added');
    }
    setModalOpen(false);
  };

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Brands</h1>
          <p>{brandList.length} maison(s) in the catalog</p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}>
          <PlusIcon width={15} height={15} /> Add brand
        </button>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Brand</th><th>Country</th><th>Products</th><th>Featured</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brandList.map((b) => {
                const count = catalog.filter((p) => p.brand === b.name).length;
                return (
                  <tr key={b.slug}>
                    <td>
                      <div className="admin-product-cell">
                        <img src={b.heroImage} alt="" />
                        <div>
                          <strong>{b.name}</strong>
                          <small>{getBrandSlug(b.name)}</small>
                        </div>
                      </div>
                    </td>
                    <td>{b.country}</td>
                    <td>{count}</td>
                    <td>{b.featured ? <span className="stat-badge stat-badge--success">Featured</span> : <span className="text-muted">—</span>}</td>
                    <td>
                      <span className={`stat-badge ${(b.status || 'active') === 'active' ? 'stat-badge--success' : 'stat-badge--neutral'}`}>
                        {(b.status || 'active') === 'active' ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn icon-btn--sm" onClick={() => openEdit(b)} aria-label="Edit brand">
                        <PencilIcon width={14} height={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit brand' : 'Add brand'}
        size="lg"
      >
        <form onSubmit={save} className="admin-form">
          <div className="admin-form__grid">
            <FormField label="Brand name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <FormField label="Country" name="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="admin-form__grid">
            <FormField label="Founded (year)" name="founded" type="number" value={form.founded} onChange={(e) => setForm({ ...form, founded: e.target.value })} />
            <SelectField label="Status" name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={['active', 'hidden']} />
          </div>
          <FormField label="Tagline" name="tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <TextAreaField label="Description" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          <FormField label="Banner image URL" name="heroImage" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="https://images.unsplash.com/…" />
          <div className="modal__footer-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">{editing ? 'Save changes' : 'Add brand'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}