import React, { useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useToast } from '../context/ToastContext';
import { FormField, SelectField, TextAreaField } from '../components/common/FormField';
import { MapPinIcon, MailIcon, UserIcon, CheckIcon } from '../components/common/icons';

const FAQ_DEPARTMENTS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'orders', label: 'Existing order' },
  { value: 'returns', label: 'Returns & refunds' },
  { value: 'gifting', label: 'Gifting' },
  { value: 'brands', label: 'Brand & authenticity' },
];

export default function Contact() {
  const { success } = useToast();
  const [form, setForm] = useState({ name: '', email: '', department: 'general', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.email.includes('@')) errs.email = 'Valid email required';
    if (!form.subject.trim()) errs.subject = 'Subject required';
    if (form.message.trim().length < 10) errs.message = 'Message too short';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSent(true);
    success('Message sent — we\u2019ll reply within 24 hours.');
  };

  return (
    <div>
      <div className="page-hero page-hero--min">
        <div className="container">
          <Breadcrumbs />
          <span className="section__eyebrow">Get in touch</span>
          <h1 className="page-hero__title">Contact SCENTORA</h1>
          <p className="page-hero__subtitle">
            Questions, orders or fragrance advice \u2014 we reply within 24 hours.
          </p>
        </div>
      </div>

      <div className="container container--page">
        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-info__block">
              <span className="contact-info__icon"><UserIcon width={18} height={18} /></span>
              <div>
                <strong>Customer care</strong>
                <p>Mon–Fri, 9am–6pm EST</p>
                <a href="tel:+12125550184">+1 212 555 0184</a>
              </div>
            </div>
            <div className="contact-info__block">
              <span className="contact-info__icon"><MailIcon width={18} height={18} /></span>
              <div>
                <strong>Email</strong>
                <p>hello@scentora.com</p>
                <p>returns@scentora.com</p>
              </div>
            </div>
            <div className="contact-info__block">
              <span className="contact-info__icon"><MapPinIcon width={18} height={18} /></span>
              <div>
                <strong>Atelier</strong>
                <p>112 Madison Avenue</p>
                <p>New York, NY 10016</p>
              </div>
            </div>
            <div className="contact-info__faq">
              <h3>Before you write…</h3>
              <p>Most questions are answered in our FAQ and shipping policy.</p>
              <a href="/faq" className="btn btn--ghost btn--sm">Read the FAQ</a>
            </div>
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div className="auth-page__success">
                <p className="contact-success__icon"><CheckIcon width={22} height={22} /></p>
                <h2>Message received</h2>
                <p>Thanks {form.name.split(' ')[0]}, we\u2019ve got your message and will be in touch within 24 hours.</p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={submit}>
                <h2>Send us a message</h2>
                <div className="checkout-form__row">
                  <FormField label="Your name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required />
                </div>
                <SelectField label="Topic" name="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} options={FAQ_DEPARTMENTS} />
                <FormField label="Subject" name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={errors.subject} required />
                <TextAreaField label="Message" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} error={errors.message} placeholder="How can we help?" />
                <button type="submit" className="btn btn--primary btn--lg">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}