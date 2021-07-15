// Mocha Specification Suite

// Imports
import puppeteer from 'puppeteer';
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { browserReady } from '../dist/puppeteer-browser-ready.js';  //replace with: ...from 'puppeteer-browser-ready';

// Setup
const options = { folder: 'spec/fixtures', verbose: false };
const webPath = 'sample.html';
describe('Single Chained specification suite', () => {

/////////////////////////////////////////////////////////////////////////////////////
describe('The sample web page', () => {
   let http;  //fields: server, terminator, folder, url, port, verbose
   let web;  //fields: browser, page, response, title, html, $
   before(() => browserReady.startWebServer(options)
      .then(httpInst => http = httpInst)
      .then(() => puppeteer.launch())
      .then((browser) => browserReady.goto(http.url + webPath)(browser))
      .then(webInst => web = webInst)
      );
   after(() => browserReady.close(web)
      .then(() => browserReady.shutdownWebServer(http))
      );

   it('has the correct URL', () => {
      const actual =   { url: web.response.url() };
      const expected = { url: http.url + webPath };
      assertDeepStrictEqual(actual, expected);
      });

   it('title is "Sample Web Page"', () => {
      const actual =   { title: web.title };
      const expected = { title: 'Sample Web Page' };
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

////////////////////////////////////////////////////////////////////////////////////////////////////
});
