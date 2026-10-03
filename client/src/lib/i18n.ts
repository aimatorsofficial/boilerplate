import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '../constants';
import en from '../locales/en.json';

await i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

export { i18n };
