// Mocha Specification Suite

// Imports
import puppeteer from 'puppeteer';
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { browserReady } from '../dist/puppeteer-browser-ready.js';  //replace with: ...from 'puppeteer-browser-ready';

// Setup
const url = 'https://pretty-print-json.js.org/';
let web;  //fields: browser, page, response, status, location, title, html, root
const loadWebPage =  async () => web = await puppeteer.launch().then(browserReady.goto(url));
const closeWebPage = async () => await browserReady.close(web);

describe('Load Web Page specification suite', () => {

/////////////////////////////////////////////////////////////////////////////////////
describe('The web page', () => {
   before(loadWebPage);
   after(closeWebPage);

   it('has the correct URL -> ' + url, () => {
      const actual =   { status: web.status, url: web.location.href };
      const expected = { status: 200,        url: url };
      assertDeepStrictEqual(actual, expected);
      });

   it('title starts with "Pretty-Print JSON"', () => {
      const actual =   { title: web.title.substring(0, 'Pretty-Print JSON'.length) };
      const expected = { title: 'Pretty-Print JSON' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has a body with exactly one header, main, and footer -- Cheerio', () => {
      const actual =   web.$('body >*').toArray().map(elem => elem.name);
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   it('has a body with exactly one header, main, and footer -- node-html-parsed', () => {
      const getTags = (selector) =>
         [...web.root.querySelectorAll(selector)].map(node => node.tagName.toLowerCase());
      const actual =   getTags('body >*');
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   it('has a body with exactly one header, main, and footer -- page.evaluate()', async () => {
      const getTags = async (selector) =>
         await web.page.evaluate((selector) =>
            [...globalThis.document.querySelectorAll(selector)].map(elem =>
               elem.nodeName.toLowerCase()), selector);
      const actual =   await getTags('body >*');
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   });

/////////////////////////////////////////////////////////////////////////////////////
describe('The document content', () => {
   before(loadWebPage);
   after(closeWebPage);

   it('has a 🚀 traveling to 🪐!', () => {
      const actual =   { '🚀': !!web.html.match(/🚀/g), '🪐': !!web.html.match(/🪐/g) };
      const expected = { '🚀': true,                    '🪐': true };
      assertDeepStrictEqual(actual, expected);
      });

   });

/////////////////////////////////////////////////////////////////////////////////////
});
