import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { FormField, TextAreaField, CheckboxField } from '../../components/common/FormField';
import { GripIcon, PencilIcon, PlusIcon, StarIcon } from '../../components/common/icons';
import { cx } from '../../utils/helpers';

const BLOCK_TYPES = [
  { key: 'hero', label: 'Hero banner' },
  { key: 'rail', label: 'Product rail' },
  { key: 'category', label: 'Category showcase' },
  { key: 'brand', label: 'Brand showcase' },
  { key: 'editorial', label: 'Editorial campaign' },
];

const INITIAL_BLOCKS = [
  { id: 'b1', type: 'hero', enabled: true, title: 'Welcome to SCENTORA', status: 'published' },
  { id: 'b2', type: 'category', enabled: true, title: 'Shop by collection', status: 'published' },
  { id: 'b3', type: 'rail', enabled: true, title: 'New arrivals', status: 'published' },
  { id: 'b4', type: 'brand', enabled: true, title: 'Featured maisons', status: 'published' },
  { id: 'b5', type: 'editorial', enabled: true, title: 'The Art of Layering', status: 'draft' },
];

export default function AdminContent() {
  const { success } = useToast();
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', enabled: true });

  const toggle = (id) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
    success('Section updated');
  };

  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ title: b.title, enabled: b.enabled });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setBlocks((prev) => prev.map((b) => (b.id === editing ? { ...b, title: form.title, enabled: form.enabled } : b)));
    setEditing(null);
    success('Section saved');
  };

  const move = (id, dir) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const addBlock = (type) => {
    const def = BLOCK_TYPES.find((b) => b.key === type);
    setBlocks((prev) => [...prev, { id: `b${Date.now()}`, type, enabled: true, title: def.label, status: 'draft' }]);
    success('Section added');
  };

  const remove = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    success('Section removed');
  };

  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Homepage</h1>
          <p>Manage the composition of the storefront landing page</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowAdd((s) => !s)}>
          <PlusIcon width={15} height={15} /> Add section
        </button>
      </div>

      {showAdd && (
        <div className="admin-card">
          <h3>Add a new section</h3>
          <div className="admin-block-picker">
            {BLOCK_TYPES.map((b) => (
              <button
                key={b.key}
                className="admin-block-picker__item"
                onClick={() => { addBlock(b.key); setShowAdd(false); }}
              >
                <strong>{b.label}</strong>
                <span className="text-muted">Add to homepage</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="admin-card admin-card--table">
        <h3>Homepage sections</h3>
        {blocks.length === 0 && <p className="text-muted">No sections yet.</p>}
        <div className="admin-blocks">
          {blocks.map((b, i) => (
            <div key={b.id} className={cx('admin-block', !b.enabled && 'is-disabled')}>
              <div className="admin-block__icon">
                <GripIcon width={16} height={16} />
              </div>
              <div className="admin-block__info">
                <strong>{b.title}</strong>
                <span className="text-muted">{BLOCK_TYPES.find((t) => t.key === b.type)?.label}</span>
              </div>
              <div className="admin-block__status">
                <span className={`stat-badge ${b.status === 'published' ? 'stat-badge--success' : 'stat-badge--warning'}`}>
                  {b.status}
                </span>
              </div>
              <div className="admin-block__actions">
                <button className="icon-btn icon-btn--sm" onClick={() => move(b.id, -1)} aria-label="Move up" disabled={i === 0}>
                  <span className="chevron-up">↑</span>
                </button>
                <button className="icon-btn icon-btn--sm" onClick={() => move(b.id, 1)} aria-label="Move down" disabled={i === blocks.length - 1}>
                  <span className="chevron-down">↓</span>
                </button>
                <button className="icon-btn icon-btn--sm" onClick={() => openEdit(b)} aria-label="Edit">
                  <PencilIcon width={14} height={14} />
                </button>
                <button className="icon-btn icon-btn--sm" onClick={() => toggle(b.id)} aria-label="Toggle visibility">
                  {b.enabled ? <StarIcon width={14} height={14} /> : <PlusIcon width={14} height={14} />}
                </button>
                <button className="icon-btn icon-btn--sm admin-block__remove" onClick={() => remove(b.id)} aria-label="Remove">
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="admin-card">
          <h3>Edit section</h3>
          <form onSubmit={saveEdit} className="admin-form" style={{ maxWidth: 480 }}>
            <FormField label="Section title" name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <CheckboxField label="Visible on homepage" name="enabled" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            <div className="modal__footer-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn--primary">Save section</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <h3>SEO & store meta</h3>
        <div className="admin-form">
          <FormField label="SEO title" name="seoTitle" defaultValue="Scentora — Premium Perfume Boutique" placeholder="Page <title>" />
          <TextAreaField label="Meta description" name="seoDesc" defaultValue="Discover 59+ designer and niche fragrances. Fast shipping, easy returns, and expert guidance from our perfume concierge." rows={3} />
          <TextAreaField label="Google tag (analytics)" name="seoTag" rows={2} placeholder="G-XXXXXXX" />
        </div>
      </div>
    </div>
  );
}