import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants';
import { translations } from '.';

type Messages = Record<string, string>;

const flatten = (tree: object, prefix = ''): Messages =>
  Object.entries(tree).reduce<Messages>((flat, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) return { ...flat, ...flatten(value, path) };
    return { ...flat, [path]: String(value) };
  }, {});

const placeholdersOf = (message: string) =>
  [...message.matchAll(/{{\s*(\w+)\s*}}/g)].map((match) => match[1]).sort();

const reference = flatten(translations[DEFAULT_LANGUAGE]);
const otherLanguages = SUPPORTED_LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE);

describe.each(otherLanguages)('%s locale', (language) => {
  const messages = flatten(translations[language]);

  it('has exactly the same keys as the default locale', () => {
    expect(Object.keys(messages).sort()).toEqual(Object.keys(reference).sort());
  });

  it('keeps the same placeholders in every message', () => {
    Object.entries(reference).forEach(([key, message]) => {
      expect(placeholdersOf(messages[key] ?? ''), key).toEqual(placeholdersOf(message));
    });
  });

  it('has no empty messages', () => {
    expect(Object.entries(messages).filter(([, message]) => !message.trim())).toEqual([]);
  });
});
