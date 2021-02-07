// Mocha Specification Cases

// Imports
import assert from 'assert';
import puppeteer from 'puppeteer';
import { browserReady } from '../dist/puppeteer-browser-ready.js';

// Setup
const url = 'https://pretty-print-json.js.org/';
const web = {};  //fields: browser, page, response, title, html, $
let $;
const loadWebPage = () => puppeteer.launch()
   .then(browserReady.goto(url, { web: web }))
   .then(() => $ = web.$)
   .catch(error => console.error(error));
const closeWebPage = () => browserReady.close(web)
   .catch(error => console.error(error));
before(loadWebPage);
after(closeWebPage);

/////////////////////////////////////////////////////////////////////////////////////
describe('The web page', () => {

   it('has the correct URL -> ' + url, () => {
      const actual =   { url: web.response.url() };
      const expected = { url: url };
      assert.deepStrictEqual(actual, expected);
      });

   it('title starts with "Pretty-Print JSON"', () => {
      const actual =   { title: web.title.substring(0, 'Pretty-Print JSON'.length) };
      const expected = { title: 'Pretty-Print JSON' };
      assert.deepStrictEqual(actual, expected);
      });

   it('has exactly one header, main, and footer', () => {
      const actual = {
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
