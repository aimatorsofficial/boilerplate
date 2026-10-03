import type { Language } from '../constants';
import en from './en.json';
import hi from './hi.json';

export const translations = { en, hi } satisfies Record<Language, unknown>;
