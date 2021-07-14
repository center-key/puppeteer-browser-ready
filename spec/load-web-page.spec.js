// Mocha Specification Cases

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import puppeteer from 'puppeteer';
import { browserReady } from '../dist/puppeteer-browser-ready.js';  //replace with: ...from 'puppeteer-browser-ready';

// Setup
const url = 'https://pretty-print-json.js.org/';
describe('Load Web Page specification', () => {
   let web;  //fields: browser, page, response, title, html, $
   const loadWebPage = () => puppeteer.launch()
      .then(browserReady.goto(url))
      .then(webInst => web = webInst);
   const closeWebPage = () => browserReady.close(web);
   before(loadWebPage);
   after(closeWebPage);

/////////////////////////////////////////////////////////////////////////////////////
describe('The web page', () => {

   it('has the correct URL -> ' + url, () => {
      const actual =   { url: web.response.url() };
      const expected = { url: url };
      assertDeepStrictEqual(actual, expected);
      });

   it('title starts with "Pretty-Print JSON"', () => {
      const actual =   { title: web.title.substring(0, 'Pretty-Print JSON'.length) };
      const expected = { title: 'Pretty-Print JSON' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has exactly one header, main, and footer', () => {
      const actual = {
         header: web.$('body >header').length,
         main:   web.$('body >main').length,
         footer: web.$('body >footer').length,
         };
      const expected = { header: 1, main: 1, footer: 1 };
      assertDeepStrictEqual(actual, expected);
      });

   });

/////////////////////////////////////////////////////////////////////////////////////
describe('The document content', () => {

   it('has a 🚀 traveling to 🪐!', () => {
      const actual =   { '🚀': !!web.html.match(/🚀/g), '🪐': !!web.html.match(/🪐/g) };
      const expected = { '🚀': true,                    '🪐': true };
      assertDeepStrictEqual(actual, expected);
      });

   });

/////////////////////////////////////////////////////////////////////////////////////
});
