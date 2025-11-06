// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'fs';

// Setup
import { browserReady } from '../dist/puppeteer-browser-ready.js';

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'puppeteer-browser-ready.d.ts',
         'puppeteer-browser-ready.js'
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: browserReady.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has the correct functions', () => {
      const module = browserReady;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['assert',            'function'],
         ['close',             'function'],
         ['goto',              'function'],
         ['log',               'function'],
         ['shutdownWebServer', 'function'],
         ['startWebServer',    'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
