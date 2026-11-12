import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
// @ts-ignore Moment locale modules do not include their own type declarations.
import 'moment/locale/ar';
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
  moment.locale(language.toLowerCase().startsWith('ar') ? 'ar' : 'en');
  if (typeof document !== 'undefined') {
    const isArabic = language.startsWith('ar');
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }
});

moment.locale((i18n.resolvedLanguage || i18n.language || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en');

if (typeof document !== 'undefined') {
  const isArabic = i18n.language.startsWith('ar');
  document.documentElement.lang = isArabic ? 'ar' : 'en';
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
}

export default i18n;