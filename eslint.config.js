import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig(
  [globalIgnores(['**/generated/'])],
  {
    ignores: ['**/*.js'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  perfectionist.configs['recommended-natural'],
  eslintConfigPrettier,
  {
    rules: {
      'no-unused-vars': 'warn',
      'perfectionist/sort-objects': 'off',
      'typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^(err|req|res|next)$' },
      ],
    },
  }
);
