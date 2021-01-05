# puppeteer-browser-ready
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=180 alt=logo>

_Simple utility to go to a URL and wait for the HTTP response_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/puppeteer-browser-ready/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/puppeteer-browser-ready.svg)](https://www.npmjs.com/package/puppeteer-browser-ready)
[![Vulnerabilities](https://snyk.io/test/github/center-key/puppeteer-browser-ready/badge.svg)](https://snyk.io/test/github/center-key/puppeteer-browser-ready)
[![Build](https://travis-ci.org/center-key/puppeteer-browser-ready.svg)](https://travis-ci.org/center-key/puppeteer-browser-ready)

**puppeteer-browser-ready** is a convenient helper utility to reduce the amount of boilerplate
code needed to tell Puppeteer to visit a web page and and retrieve the HTML.&nbsp;
It's primarily intended for use within [Mocha](https://mochajs.org) test cases.&nbsp;
In addition to the raw HTML, you get a [cheerio](https://cheerio.js.org) reference so you can
immediately run queries on the DOM.

## A) Setup
**Install package:**
```shell
$ npm install --save-dev puppeteer-browser-ready
```
**Import package:**
```javascript
import puppeteer from 'puppeteer';
import { browserReady } from 'puppeteer-browser-ready';
```

## B) Usage
Use the `browserReady.goto()` function to tell Puppeteer which page to open.  The **Promise** will
resolve with a **Web** object containing a `html` field.  Pass the **Web** object to the
`browserReady.close()` function to disconnect the page.

**Example:**
```javascript
import puppeteer from 'puppeteer';
import { browserReady } from 'puppeteer-browser-ready';

const handleResponse = (web) => {
   console.log('Hello, World!');
   console.log('web fields:', Object.keys(web).join(', '));
   console.log(`The HTML from ${web.url} is ${web.html.length} characters`,
      `long and contains ${web.$('p').length} <p> tags.`);
   return web;
   };
puppeteer.launch()
   .then(browserReady.goto('https://pretty-print-json.js.org/'))
   .then(handleResponse)
   .then(browserReady.close);
```
**Output:**
```
web fields: browser, page, response, url, status, statusText, html, $
The HTML from https://pretty-print-json.js.org/ is 7556 characters long and contains 6 <p> tags.
```

The `browserReady.goto()` function returns a function that takes a Puppeteer **Browser** object and
returns a JavaScript **Promise** that resolves with a **Web** object:
```typescript
type Web = {
   browser:    Puppeteer.Browser,
   page:       Puppeteer.Page,
   response:   HTTPResponse | null,
   url         string,
   status:     number,
   statusText: string,
   html:       string,
   $:          Cheerio (like JQuery) | null,
   };
```

## C) Mocha and cheerio example
```javascript
// Mocha Specification Cases

// Imports
import assert from 'assert';
import puppeteer from 'puppeteer';
import { browserReady } from 'puppeteer-browser-ready';

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
```

**Output from above Mocha test:**
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
