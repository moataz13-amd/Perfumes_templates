import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

export const LANG_KEY = 'scentora-lang';
export const SUPPORTED_LANGS = ['en', 'ar'];

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch (e) {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('ar')) return 'ar';
  }
  return 'en';
}

export const initialLang = detectInitialLang();

export function applyDir(lang) {
  const isRtl = lang === 'ar';
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  html.style.direction = isRtl ? 'rtl' : 'ltr';
}

export function storeLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    /* ignore */
  }
  applyDir(lang);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnObjects: true,
  react: { useSuspense: false },
});

i18n.on('languageChanged', (lng) => {
  storeLang(lng);
});

if (typeof document !== 'undefined') {
  applyDir(initialLang);
}

export default i18n;
