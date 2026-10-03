import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '../constants';
import { i18n } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

const switcher = () => screen.getByRole('combobox', { name: i18n.t('language.label') });

describe('LanguageSwitcher', () => {
  it('lists every language by its own name', () => {
    render(<LanguageSwitcher />);

    const options = screen.getAllByRole('option').map((option) => option.textContent);
    expect(options).toEqual([
      i18n.t('language.name', { lng: 'en' }),
      i18n.t('language.name', { lng: 'hi' }),
    ]);
  });

  it('switches the language, remembers it and updates the page lang', async () => {
    render(<LanguageSwitcher />);

    await userEvent.selectOptions(switcher(), 'hi');

    expect(i18n.language).toBe('hi');
    expect(localStorage.getItem(STORAGE_KEYS.LANGUAGE)).toBe('hi');
    expect(document.documentElement.lang).toBe('hi');
    expect(switcher()).toHaveValue('hi');
  });
});
