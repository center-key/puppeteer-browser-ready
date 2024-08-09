// @ts-check

import eslint   from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
   eslint.configs.recommended,
   ...tseslint.configs.strictTypeChecked,
   { ignores: ['**/*.js'] },
   {
      languageOptions: { parserOptions: { projectService: true } },
      rules: {
         '@typescript-eslint/no-confusing-void-expression':  'off',  //prefer clean arrow functions
         '@typescript-eslint/no-floating-promises':          'off',  //annimations may be fire-and-forget
         '@typescript-eslint/no-non-null-assertion':         'off',  //ts cannot always discern if value exists
         '@typescript-eslint/restrict-template-expressions': 'off',  //numbers in templates are natural
         '@typescript-eslint/unbound-method':                'off',  //do not use 'this'
         },
      },
   ];
