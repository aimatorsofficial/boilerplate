import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '../constants';
import { applyDocumentLanguage, pickInitialLanguage, saveLanguage } from './language';

const useBrowserLanguages = (languages: string[]) => {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);
};

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('pickInitialLanguage', () => {
  it('prefers the language the user saved', () => {
    useBrowserLanguages(['en-US']);
    saveLanguage('hi');

    expect(pickInitialLanguage()).toBe('hi');
  });

  it('uses the first supported browser language', () => {
    useBrowserLanguages(['fr-FR', 'hi-IN', 'en']);

    expect(pickInitialLanguage()).toBe('hi');
  });

  it('ignores a saved value that is not supported', () => {
    useBrowserLanguages(['de']);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'xx');

    expect(pickInitialLanguage()).toBe(DEFAULT_LANGUAGE);
  });
});

describe('applyDocumentLanguage', () => {
  it('sets the lang attribute on the page', () => {
    applyDocumentLanguage('hi');

    expect(document.documentElement.lang).toBe('hi');
  });
});
