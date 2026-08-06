// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'node:fs';

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
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const version =  browserReady.version;
      const semVer =   /\d+[.]\d+[.]\d+/;
      const actual =   { version: version, valid: semVer.test(version) };
      const expected = { version: version, valid: true };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   const module = browserReady;

   it('is exported as an object', () => {
      const actual =   { type: typeof module };
      const expected = { type: 'object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has the correct properties', () => {
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['assertOk',          'function'],
         ['close',             'function'],
         ['goto',              'function'],
         ['log',               'function'],
         ['shutdownWebServer', 'function'],
         ['startWebServer',    'function'],
         ['version',           'string'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
