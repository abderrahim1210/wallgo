import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      settings: "Settings",
      account: "Account",
      notifications: "Notifications",
      security: "Security",
      appearance: "Appearance",
      language: "Language",
      saveChanges: "Save Changes",
      logout: "Logout",
      home: "Home",
      profile: "Profile",
      
    }
  },
  ar: {
    translation: {
      settings: "الإعدادات",
      account: "الحساب",
      notifications: "الإشعارات",
      security: "الأمان",
      appearance: "المظهر",
      language: "اللغة",
      saveChanges: "حفظ التغييرات",
      logout: "تسجيل الخروج",
      home: "الرئيسية",
      profile: "الملف الشخصي"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;