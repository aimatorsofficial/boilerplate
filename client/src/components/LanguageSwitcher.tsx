import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../constants';
import { switchLanguage } from '../lib/i18n';

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {t('language.label')}
      </label>
      <select
        id={id}
        value={i18n.resolvedLanguage}
        onChange={(event) => switchLanguage(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language} lang={language}>
            {t('language.name', { lng: language })}
          </option>
        ))}
      </select>
    </div>
  );
};
