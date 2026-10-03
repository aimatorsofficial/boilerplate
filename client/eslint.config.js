import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  reactHooks.configs.flat.recommended,
  {
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/**/*.tsx'],
    rules: {
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/components/**', 'src/pages/**', 'src/features/**/*.tsx'],
    ignores: ['**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'axios', message: 'Call the API from features/<name>/<name>.api.ts.' }] },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'max-lines-per-function': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
);
