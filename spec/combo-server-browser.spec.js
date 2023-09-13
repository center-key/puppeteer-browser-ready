// Mocha Specification Suite

// Imports
import puppeteer from 'puppeteer';
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { browserReady } from '../dist/puppeteer-browser-ready.js';  //replace with: ...from 'puppeteer-browser-ready';

// Setup
const options = { folder: 'spec/fixtures', verbose: false };
const webPath = 'sample.html';

describe('Combo Server/Browser specification suite', () => {

/////////////////////////////////////////////////////////////////////////////////////
describe('The sample web page', () => {
   let http;  //fields: server, terminator, folder, url, port, verbose
   let web;   //fields: browser, page, response, status, location, title, html, root
   before(async () => {
      http = await browserReady.startWebServer(options);
      web =  await puppeteer.launch().then(browserReady.goto(http.url + webPath, { verbose: true }));
      });
   after(async () => {
      await browserReady.close(web);
      await browserReady.shutdownWebServer(http);
      });

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

////////////////////////////////////////////////////////////////////////////////
});
