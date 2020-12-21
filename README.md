# puppeteer-browser-ready
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=180 alt=logo>

_Simple utility to go to a URL and wait for the HTTP response_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/puppeteer-browser-ready/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/puppeteer-browser-ready.svg)](https://www.npmjs.com/package/puppeteer-browser-ready)
[![Vulnerabilities](https://snyk.io/test/github/center-key/puppeteer-browser-ready/badge.svg)](https://snyk.io/test/github/center-key/puppeteer-browser-ready)
[![Build](https://travis-ci.org/center-key/puppeteer-browser-ready.svg)](https://travis-ci.org/center-key/puppeteer-browser-ready)

**puppeteer-browser-ready** is just a little helper function to reduce the amount of boilerplate
code needed tell Puppeteer to visit a web page and and retrieve the HTML.&nbsp;
It's primarily intended for use within [Mocha](https://mochajs.org) tests and is especially handy
for passing HTML to [cheerio](https://cheerio.js.org).

## A) Setup
Install package:
```shell
$ npm install --save-dev puppeteer-browser-ready
```
Import package:
```javascript
const browserReady = require('puppeteer-browser-ready');
```

## B) Usage
```javascript
// Imports
const assert =       require('assert');
const browserReady = require('puppeteer-browser-ready');
const cheerio =      require('cheerio');
const puppeteer =    require('puppeteer');

// Setup
const pageUrl = 'https://pretty-print-json.js.org/';
const web = {};  //fields: browser, page, response, url, status, statusText, html
let $;
const loadWebPage = () => puppeteer.launch()
   .then(browserReady(pageUrl, web))
   .then(() => $ = cheerio.load(web.html));
const closeWebPage = () => Promise.resolve(web.browser.close());

/////////////////////////////////////////////////////////////////////////////////////
describe('The web page', () => {
   before(loadWebPage);
   after(closeWebPage);

   it('has the correct URL -> ' + url, () => {
      const actual =   { url: dom.window.location.href };
      const expected = { url: url };
      assert.deepStrictEqual(actual, expected);
      });

   it('has exactly one header, main, and footer', () => {
      const $ = dom.window.$;
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
   before(loadWebPage);
   after(closeWebPage);

   it('has a 🚀 traveling to 🪐!', () => {
      const html = dom.window.document.documentElement.outerHTML;
      const actual =   { '🚀': !!html.match(/🚀/g), '🪐': !!html.match(/🪐/g) };
      const expected = { '🚀': true,                '🪐': true };
      assert.deepStrictEqual(actual, expected);
      });

   });
```
Above mocha test will output:
```
  The web page
    ✓ has the correct URL -> https://pretty-print-json.js.org/
    ✓ has exactly one header, main, and footer

  The document content
    ✓ has a 🚀 traveling to 🪐!
```

<br>

---
[MIT License](LICENSE.txt)
