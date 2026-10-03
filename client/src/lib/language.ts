import { DEFAULT_LANGUAGE, STORAGE_KEYS, SUPPORTED_LANGUAGES, type Language } from '../constants';

export const isSupportedLanguage = (value: unknown): value is Language =>
  SUPPORTED_LANGUAGES.some((language) => language === value);

const readSavedLanguage = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  } catch {
    return null;
  }
};

const readBrowserLanguages = () =>
  navigator.languages.map((tag) => tag.split('-')[0]?.toLowerCase());

export const pickInitialLanguage = (): Language =>
  [readSavedLanguage(), ...readBrowserLanguages()].find(isSupportedLanguage) ?? DEFAULT_LANGUAGE;

export const saveLanguage = (language: Language) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch {
    return;
  }
};

export const applyDocumentLanguage = (language: string) => {
  document.documentElement.lang = language;
};
