import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nextI18NextConfig from '../../next-i18next.config.js';

import ko from '../../public/locales/ko/common.json';
import en from '../../public/locales/en/common.json';

const resources = {
  ko: { common: ko },
  en: { common: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: nextI18NextConfig.i18n.defaultLocale,
    fallbackLng: nextI18NextConfig.i18n.defaultLocale,
    interpolation: { escapeValue: false },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n; 