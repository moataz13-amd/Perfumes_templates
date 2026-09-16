import React from 'react';
import { useTranslation } from 'react-i18next';
import { applyDir, storeLang, LANG_KEY, SUPPORTED_LANGS } from '../../i18n';

const LABELS = { en: 'EN', ar: 'العربية' };

export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation();

  const switchLang = (lng) => {
    if (!SUPPORTED_LANGS.includes(lng)) return;
    i18n.changeLanguage(lng);
    storeLang(lng);
    applyDir(lng);
  };

  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('language.switch')}>
      {SUPPORTED_LANGS.map((lng) => (
        <button
          key={lng}
          type="button"
          className={`lang-switch__btn${i18n.language === lng ? ' is-active' : ''}`}
          onClick={() => switchLang(lng)}
          aria-pressed={i18n.language === lng}
        >
          {LABELS[lng]}
        </button>
      ))}
    </div>
  );
}
