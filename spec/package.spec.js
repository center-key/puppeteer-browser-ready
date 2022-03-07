// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { readdirSync } from 'fs';

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = readdirSync('dist').sort();
      const expected = [
         'puppeteer-browser-ready.d.ts',
         'puppeteer-browser-ready.js',
         'puppeteer-browser-ready.umd.cjs',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
