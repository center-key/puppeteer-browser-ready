// Mocha Specification Cases

// Imports
import assert from 'assert';
import puppeteer from 'puppeteer';
import { browserReady } from '../puppeteer-browser-ready.js';

// Setup
const pageUrl = 'https://pretty-print-json.js.org/';
const web = {};  //fields: browser, page, response, url, status, statusText, html, $
let $;
const loadWebPage = () => puppeteer.launch()
   .then(browserReady.goto(pageUrl, { web: web }))
   .then(() => $ = web.$)
   .catch(error => console.error(error));
const closeWebPage = () => browserReady.close(web)
   .catch(error => console.error(error));
before(loadWebPage);
after(closeWebPage);

/////////////////////////////////////////////////////////////////////////////////////
describe('The web page', () => {

   it('has the correct URL -> ' + pageUrl, () => {
      const actual =   { url: web.url };
      const expected = { url: pageUrl };
      assert.deepStrictEqual(actual, expected);
      });

   it('has exactly one header, main, and footer', () => {
      const actual =   {
         header: $('body >header').length,
         main:   $('body >main').length,
         footer: $('body >footer').length,
         };
      const expected = { header: 1, main: 1, footer: 1 };
      assert.deepStrictEqual(actual, expected);
      });

   });

/////////////////////////////////////////////////////////////////////////////////////
describe('The document content', () => {

   it('has a 🚀 traveling to 🪐!', () => {
      const actual =   { '🚀': !!web.html.match(/🚀/g), '🪐': !!web.html.match(/🪐/g) };
      const expected = { '🚀': true,                    '🪐': true };
      assert.deepStrictEqual(actual, expected);
      });

   });
