import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  eslintConfigPrettier,
  {
    ignores: ['dist/**']
  },
  {
    files: ['**/env.ts'],
    rules: {
      'no-restricted-properties': 'off',
      'no-restricted-imports': 'off'
    }
  }
];
