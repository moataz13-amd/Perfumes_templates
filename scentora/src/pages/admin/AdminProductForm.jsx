import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { brands } from '../../data/brands';
import { FormField, SelectField, TextAreaField, CheckboxField } from '../../components/common/FormField';

const EMPTY = {
  name: '',
  brand: 'Dior',
  category: 'Men',
  gender: 'Men',
  price: '',
  compareAtPrice: '',
  sku: '',
  scentFamily: 'Aromatic Fresh',
  concentration: 'Eau de Parfum',
  description: '',
  shortDescription: '',
  topNotes: '',
  heartNotes: '',
  baseNotes: '',
  longevity: 'Long-lasting',
  sillage: 'Moderate',
  size: ['50', '100'],
  image: '',
  image2: '',
  stock: 10,
  tags: '',
  isNew: true,
  isBestSeller: false,
  isSale: false,
  status: 'draft',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { getProductById, addProduct, updateProduct } = useAdminData();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const seeded = isEdit ? getProductById(id) : null;

  const [form, setForm] = useState(() =>
    seeded
      ? {
          name: seeded.name,
          brand: seeded.brand,
          category: seeded.category,
          gender: seeded.gender,
          price: seeded.price,
          compareAtPrice: seeded.compareAtPrice || '',
          sku: seeded.sku,
          scentFamily: seeded.scentFamily,
          concentration: seeded.concentration,
          description: seeded.description,
          shortDescription: seeded.shortDescription,
          topNotes: seeded.topNotes,
          heartNotes: seeded.heartNotes,
          baseNotes: seeded.baseNotes,
          longevity: seeded.longevity,
          sillage: seeded.sillage,
          size: seeded.size,
          image: seeded.images?.[0] || '',
          image2: seeded.images?.[1] || '',
          stock: seeded.stock,
          tags: (seeded.tags || []).join(', '),
          isNew: seeded.isNew,
          isBestSeller: seeded.isBestSeller,
          isSale: Boolean(seeded.compareAtPrice && seeded.compareAtPrice > seeded.price),
          status: seeded.status || 'active',
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState('general');

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSize = (s) => {
    setForm((prev) => ({
      ...prev,
      size: prev.size.includes(s)
        ? prev.size.filter((x) => x !== s)
        : [...prev.size, s],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Enter a valid price';
    if (form.description.trim().length < 20) errs.description = 'Add a description (min. 20 chars)';
    if (!form.topNotes.trim()) errs.topNotes = 'Required';
    if (!form.heartNotes.trim()) errs.heartNotes = 'Required';
    if (!form.baseNotes.trim()) errs.baseNotes = 'Required';
    if (!form.image.trim()) errs.image = 'Add an image URL';
    return errs;
  };

  const save = (publish = false) => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTab('general');
      error('Please fix the highlighted fields.');
      return;
    }
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      gender: form.gender,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      sku: form.sku || undefined,
      scentFamily: form.scentFamily,
      concentration: form.concentration,
      description: form.description,
      shortDescription: form.shortDescription,
      topNotes: form.topNotes,
      heartNotes: form.heartNotes,
      baseNotes: form.baseNotes,
      longevity: form.longevity,
      sillage: form.sillage,
      size: form.size,
      images: [form.image, form.image2].filter(Boolean),
      stock: Number(form.stock) || 0,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isSale: form.isSale,
      status: publish ? 'active' : form.status,
      occasion: 'Everyday',
    };

    if (isEdit) {
      updateProduct(id, payload);
      success('Product updated');
    } else {
      addProduct(payload, { publish });
      success(publish ? 'Product published' : 'Draft saved');
    }
    navigate('/admin/products');
  };

  if (isEdit && !seeded) {
    return <div className="admin-dash"><h1>Product not found</h1><Link to="/admin/products">Back to products</Link></div>;
  }

  const FAMILIES = ['Aromatic Fresh', 'Aromatic Foug\u00e8re', 'Woody Aromatic', 'Woody Oriental', 'Woody Floral', 'Woody Earthy', 'Woody Spicy', 'Woody Amber', 'Floral', 'Floral Fruity', 'Floral Woody', 'Oriental Floral', 'Oriental Woody', 'White Floral', 'Aldehyde Floral', 'Aquatic Fresh', 'Aquatic Aromatic', 'Aquatic Woody', 'Citrus Aromatic', 'Citrus Woody', 'Chypre Fruity', 'Chypre Green', 'Fruity Smoky', 'Smoky Sweet', 'Spicy Woody', 'Gourmand', 'Floral Musk'];

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>{isEdit ? 'Edit product' : 'Add product'}</h1>
          <p>{isEdit ? `Editing ${seeded.name}` : 'Create a new catalog entry'}</p>
        </div>
        <div className="admin-page-head__actions">
          <button className="btn btn--ghost" onClick={() => save(false)}>
            {isEdit ? 'Save changes' : 'Save Draft'}
          </button>
          <button className="btn btn--primary" onClick={() => save(true)}>
            Publish
          </button>
        </div>
      </div>

      <div className="admin-form-tabs">
        {[
          ['general', 'General'],
          ['notes', 'Scent Notes'],
          ['media', 'Images & SEO'],
          ['inventory', 'Inventory'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? 'is-active' : ''}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {tab === 'general' && (
          <div className="admin-form">
            <div className="admin-form__grid">
              <FormField label="Product name" name="name" value={form.name} onChange={set('name')} error={errors.name} required />
              <SelectField label="Brand" name="brand" value={form.brand} onChange={set('brand')} options={brands.map((b) => b.name)} />
            </div>
            <div className="admin-form__grid admin-form__grid--3">
              <FormField label="Price ($)" name="price" type="number" value={form.price} onChange={set('price')} error={errors.price} required />
              <FormField label="Compare-at price ($)" name="compareAtPrice" type="number" value={form.compareAtPrice} onChange={set('compareAtPrice')} />
              <FormField label="SKU" name="sku" value={form.sku} onChange={set('sku')} placeholder="Auto-generated" />
            </div>
            <div className="admin-form__grid admin-form__grid--4">
              <SelectField label="Category" name="category" value={form.category} onChange={set('category')} options={['Men', 'Women', 'Unisex', 'Niche', 'Gift Sets']} />
              <SelectField label="Gender" name="gender" value={form.gender} onChange={set('gender')} options={['Men', 'Women', 'Unisex']} />
              <SelectField label="Concentration" name="concentration" value={form.concentration} onChange={set('concentration')} options={['Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne', 'Extrait de Parfum']} />
              <SelectField label="Fragrance family" name="scentFamily" value={form.scentFamily} onChange={set('scentFamily')} options={FAMILIES} />
            </div>
            <TextAreaField label="Description" name="description" value={form.description} onChange={set('description')} rows={5} error={errors.description} />
            <FormField label="Short description" name="shortDescription" value={form.shortDescription} onChange={set('shortDescription')} placeholder="One line for cards" />
            <div className="admin-form__checkboxes">
              <CheckboxField label="New arrival" name="isNew" checked={form.isNew} onChange={set('isNew')} />
              <CheckboxField label="Best seller" name="isBestSeller" checked={form.isBestSeller} onChange={set('isBestSeller')} />
              <CheckboxField label="On sale" name="isSale" checked={form.isSale} onChange={set('isSale')} />
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className="admin-form">
            <FormField label="Top notes" name="topNotes" value={form.topNotes} onChange={set('topNotes')} placeholder="Calabrian Bergamot, Lavender" error={errors.topNotes} />
            <FormField label="Heart notes" name="heartNotes" value={form.heartNotes} onChange={set('heartNotes')} placeholder="Sichuan Pepper, Rose" error={errors.heartNotes} />
            <FormField label="Base notes" name="baseNotes" value={form.baseNotes} onChange={set('baseNotes')} placeholder="Ambroxan, Cedarwood" error={errors.baseNotes} />
            <div className="admin-form__grid admin-form__grid--3">
              <SelectField label="Longevity" name="longevity" value={form.longevity} onChange={set('longevity')} options={['Very long lasting (12h+)', 'Long-lasting (8+ hours)', 'Moderate (4-6 hours)', 'Subtle (2-4 hours)']} />
              <SelectField label="Sillage" name="sillage" value={form.sillage} onChange={set('sillage')} options={['Heavy', 'Moderate', 'Soft', 'Intimate']} />
              <SelectField label="Season" name="season" value={form.season || 'All Seasons'} onChange={set('season')} options={['All Seasons', 'Spring', 'Summer', 'Fall', 'Winter']} />
            </div>
            <div className="admin-form__sizes">
              <span className="form-field__label">Available sizes</span>
              {['30', '50', '60', '75', '90', '100', '125', '150', '200'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={form.size.includes(s) ? 'is-active' : ''}
                  onClick={() => toggleSize(s)}
                >
                  {s} ml
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="admin-form">
            <FormField label="Main image URL" name="image" value={form.image} onChange={set('image')} placeholder="https://images.unsplash.com/…" error={errors.image} />
            <FormField label="Second image URL (hover)" name="image2" value={form.image2} onChange={set('image2')} placeholder="Optional alternate view" />
            <div className="admin-form__preview">
              <span className="form-field__label">Preview</span>
              {form.image ? (
                <img src={form.image} alt="Preview" />
              ) : (
                <span className="admin-form__preview-empty">No image yet</span>
              )}
            </div>
            <TextAreaField label="Tags (comma separated)" name="tags" value={form.tags} onChange={set('tags')} placeholder="woody, fresh, signature" rows={2} />
            <FormField label="SEO slug" name="slug" value={form.slug || ''} onChange={set('slug')} placeholder="Auto-generated from name" />
          </div>
        )}

        {tab === 'inventory' && (
          <div className="admin-form">
            <div className="admin-form__grid">
              <FormField label="Stock quantity" name="stock" type="number" value={form.stock} onChange={set('stock')} />
              <FormField label="Status" name="status" value={form.status} onChange={set('status')} />
            </div>
            <p className="form-field__helper">
              Stock levels drive the storefront "In Stock / Low Stock / Out of Stock" badges automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}