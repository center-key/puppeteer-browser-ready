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

   it('body has exactly one header, main, and footer -- node-html-parsed', () => {
      const getTags =  (elems) => [...elems].map(elem => elem.tagName.toLowerCase());
      const actual =   getTags(web.root.querySelectorAll('body >*'));
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   it('body has exactly one header, main, and footer -- page.$$eval()', async () => {
      const getTags =  (elems) => elems.map(elem => elem.nodeName.toLowerCase());
      const actual =   await web.page.$$eval('body >*', getTags);
      const expected = ['header', 'main', 'footer'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
});
