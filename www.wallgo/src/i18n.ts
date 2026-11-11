import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './assets/json/en.json';
import ar from './assets/json/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (language) => {
  if (typeof document !== 'undefined') {
    const isArabic = language.startsWith('ar');
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }
});

if (typeof document !== 'undefined') {
  const isArabic = i18n.language.startsWith('ar');
  document.documentElement.lang = isArabic ? 'ar' : 'en';
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
}

export default i18n;