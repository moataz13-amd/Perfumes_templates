import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';

function LegalPage({ title, updated = 'September 15, 2026', children }) {
  return (
    <div>
      <div className="page-hero page-hero--min">
        <div className="container">
          <Breadcrumbs />
          <span className="section__eyebrow">Legal</span>
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__subtitle">Last updated: {updated}</p>
        </div>
      </div>
      <div className="container container--page">
        <div className="legal">{children}</div>
      </div>
    </div>
  );
}

const H = ({ children }) => <h2>{children}</h2>;
const P = ({ children }) => <p>{children}</p>;
const LI = ({ children }) => <li>{children}</li>;

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <P>
        SCENTORA ("we", "us", "our") respects your privacy. This policy explains what
        we collect, why, and the choices you have.
      </P>
      <H>1. Information we collect</H>
      <P>
        We collect information you provide directly: name, email, phone, delivery
        address and payment details. We also collect browsing data such as pages
        viewed and products added to cart to improve your experience.
      </P>
      <H>2. How we use it</H>
      <ul>
        <LI>Processing and delivering your orders.</LI>
        <LI>Sending order updates and service messages.</LI>
        <LI>Recommending fragrances you may love (with consent).</LI>
        <LI>Fraud prevention and legal obligations.</LI>
      </ul>
      <H>3. Sharing</H>
      <P>
        We never sell your data. We share it only with service providers (payment
        processors, couriers) who act under our instructions, and where required by
        law.
      </P>
      <H>4. Your choices</H>
      <P>
        You may access, correct or delete your personal data at any time via your
        account or by emailing privacy@scentora.com.
      </P>
      <H>5. Cookies</H>
      <P>
        We use essential cookies to keep your cart and session working, plus
        analytics cookies to improve our store. You can manage preferences in your
        browser at any time.
      </P>
      <P>
        Questions? Contact <a href="mailto:privacy@scentora.com">privacy@scentora.com</a>.
      </P>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <P>
        These terms govern your use of the SCENTORA website and purchases made
        through it. By using our store you agree to these terms.
      </P>
      <H>1. Products &amp; pricing</H>
      <P>
        All products are genuine and sourced from the brand or authorised
        distributors. Prices are in USD, include VAT as applicable, and may change
        without notice. a product is displayed at an incorrect price we reserve the
        right to correct it.
      </P>
      <H>2. Orders</H>
      <P>
        Placing an order is an offer we may accept or decline. We always confirm by
        email. If an item is unavailable you will be notified and refunded.
      </P>
      <H>3. Intellectual property</H>
      <P>
        The SCENTORA name, visual identity and editorial content are our property.
        Featured brand names and trademarks belong to their respective owners and
        are used solely to describe genuine products. SCENTORA is an independent
        retailer and not affiliated with those brands.
      </P>
      <H>4. Liability</H>
      <P>
        Fragrances are personal-care products. Always test on skin and discontinue
        use if irritation occurs. To the extent permitted by law we are not liable
        for indirect or consequential losses.
      </P>
      <H>5. Governing law</H>
      <P>These terms are governed by the laws of the State of New York, USA.</P>
      <P>
        Questions? Contact <a href="mailto:legal@scentora.com">legal@scentora.com</a>.
      </P>
    </LegalPage>
  );
}

export { H as Heading, P as Paragraph, LI as ListItem };