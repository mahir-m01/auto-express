// ESLint v9 flat config (ESM)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: { 
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_', // Ignore function arguments that start with '_'
          'varsIgnorePattern': '^_', // Ignore local variables that start with '_'
        },
      ],
    },
  },
  {
    files: ['**/*.test.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
