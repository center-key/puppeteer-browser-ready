// Mocha Specification Suite

// Imports
import puppeteer from 'puppeteer';
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { browserReady } from '../dist/puppeteer-browser-ready.js';  //replace with: ...from 'puppeteer-browser-ready';

// Setup
const options = { folder: 'spec/fixtures', verbose: false };
const webPath = 'sample.html';

describe('Start Web Server specification suite', () => {
   let http;  //fields: server, terminator, folder, url, port, verbose
   before(async () => http = await browserReady.startWebServer(options));
   after(async () =>  await browserReady.shutdownWebServer(http));

/////////////////////////////////////////////////////////////////////////////////////
describe('The sample web page', () => {
   let web;  //fields: browser, page, response, status, location, title, html, $
   before(async () => web = await puppeteer.launch().then(browserReady.goto(http.url + webPath)));
   after(async () =>  await browserReady.close(web));

   it('has the correct URL', () => {
      const actual =   { status: web.status, url: web.location.href };
      const expected = { status: 200,        url: http.url + webPath };
      assertDeepStrictEqual(actual, expected);
      });

   it('title is "Sample Web Page"', () => {
      const actual =   { title: web.title };
      const expected = { title: 'Sample Web Page' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has a body with exactly one header, main, and footer -- Cheerio', () => {
      const actual =   web.$('body >*').toArray().map(elem => elem.name);
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   it('has a body with exactly one header, main, and footer -- page.evaluate()', async () => {
      const actual = await web.page.evaluate(() => {
         const elems = globalThis.document.querySelectorAll('body >*');
         return [...elems].map(elem => elem.nodeName.toLowerCase());
         });
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
});
