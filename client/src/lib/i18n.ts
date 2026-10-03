import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants';
import { translations } from '../locales';
import {
  applyDocumentLanguage,
  isSupportedLanguage,
  pickInitialLanguage,
  saveLanguage,
} from './language';

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((language) => [language, { translation: translations[language] }]),
);

i18n.on('languageChanged', applyDocumentLanguage);

await i18n.use(initReactI18next).init({
  resources,
  lng: pickInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
});

export const switchLanguage = async (language: string) => {
  if (!isSupportedLanguage(language)) return;
  saveLanguage(language);
  await i18n.changeLanguage(language);
};

export { i18n };
