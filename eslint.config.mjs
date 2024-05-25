/**
 * ---
 * References:
 * - https://eslint.org/docs/latest/use/configure/configuration-files-new
 * - https://stackoverflow.com/a/74279098/9185553
 * - https://stackoverflow.com/a/75191830/9185553
 * - https://stackoverflow.com/a/62892482/9185553
 */

import ts from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

import js from '@eslint/js'
import functional from 'eslint-plugin-functional'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const tsconfigRootDir = dirname(__filename)

export default [
  {
    files: [`**/*.+(j|t)s{,x}`],
    ignores: [`**/*.d.ts`],
    languageOptions: {
      sourceType: `module`,
      parser,
      parserOptions: {
        ecmaVersion: `latest`,
        project: [`./tsconfig.json`],
        tsconfigRootDir,
      },
    },
    plugins: { '@typescript-eslint': ts, functional },
    rules: {
      /**
       * vanilla eslint
       */
      ...js.configs.recommended.rules,
      quotes: [`error`, `backtick`],

      /**
       * typescript plugin
       */
      ...ts.configs[`eslint-recommended`]?.overrides?.[0]?.rules,
      ...ts.configs[`strict-type-checked`]?.rules,
      ...ts.configs[`stylistic-type-checked`]?.rules,
      '@typescript-eslint/no-confusing-void-expression': [`error`, {
        ignoreArrowShorthand: true,
      }],
      '@typescript-eslint/consistent-type-definitions': [`error`, `type`],
      '@typescript-eslint/no-non-null-assertion': `off`,
      /***/

      /**
       * functional plugin
       */
      ...functional.configs[`external-typescript-recommended`].rules,
      ...functional.configs.strict.rules,
      ...functional.configs.stylistic.rules,
      'functional/functional-parameters': [`error`, {
        enforceParameterCount: false,
      }],
      'functional/prefer-immutable-types': [`error`, {
        enforcement: `None`,
        ignoreInferredTypes: true,
        parameters: { enforcement: `ReadonlyShallow` },
      }],
      'functional/type-declaration-immutability': [`error`, {
        rules: [{
          identifiers: `^.+`,
          immutability: `ReadonlyShallow`,
          comparator: `AtLeast`,
          fixer: [
            {
              pattern: `^(Array|Map|Set)<(.+)>$`,
              replace: `Readonly$1<$2>`,
            },
            {
              pattern: `^(.+)$`,
              replace: `Readonly<$1>`,
            },
          ],
        }],
      }],
      'functional/no-conditional-statements': [`error`, {
        allowReturningBranches: true,
      }],
      'functional/no-expression-statements': [`error`, {
        ignoreVoid: true,
        ignoreCodePattern: [`^process\\..*?`],
      }],
      'functional/no-return-void': [`error`, { ignoreInferredTypes: true }],
      'functional/prefer-property-signatures': [`error`, {
        ignoreIfReadonlyWrapped: true,
      }],
      /***/
    },
  },
  {
    files: [`**/*.tsx`],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      /**
       * react-hooks plugin
       */
      ...reactHooks.configs.recommended.rules,
      /**
       * react-refresh plugin
       */
      'react-refresh/only-export-components': [`warn`, {
        allowConstantExport: true,
      }],
      /**
       * functional plugin
       */
      'functional/no-return-void': `off`,
    },
  },
  {
    files: [`packages/design-system/src/components/**/*.stories.ts{,x}`],
    rules: {
      /**
       * vanilla eslint
       */
      quotes: [`error`, `single`],

      /**
       * functional plugin
       */
      'functional/no-expression-statements': [`error`, {
        ignoreVoid: true,
        ignoreCodePattern: [`^await `],
      }],
    },
  },
]
