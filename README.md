# puppeteer-browser-ready
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=180 alt=logo>

_Simple utility to go to a URL and wait for the HTTP response_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/puppeteer-browser-ready/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/puppeteer-browser-ready.svg)](https://www.npmjs.com/package/puppeteer-browser-ready)
[![Vulnerabilities](https://snyk.io/test/github/center-key/puppeteer-browser-ready/badge.svg)](https://snyk.io/test/github/center-key/puppeteer-browser-ready)
[![Build](https://github.com/center-key/puppeteer-browser-ready/workflows/build/badge.svg)](https://github.com/center-key/puppeteer-browser-ready/actions/workflows/run-spec-on-push.yaml)

**puppeteer-browser-ready** is a convenient helper utility to reduce the amount of boilerplate
code needed to tell Puppeteer to visit a web page and and retrieve the HTML.&nbsp;
It's primarily intended for use within [Mocha](https://mochajs.org) test cases.&nbsp;
In addition to the raw HTML, you get a [cheerio](https://cheerio.js.org) reference so you can
immediately run queries on the DOM.

## A) Setup
**Install packages:**
```shell
$ npm install --save-dev puppeteer puppeteer-browser-ready
```
**Import packages:**
```javascript
import puppeteer from 'puppeteer';
import { browserReady } from 'puppeteer-browser-ready';
```

## B) Usage
Use the `browserReady.goto()` function to tell Puppeteer which page to open.  The **Promise** will
resolve with a **Web** object containing a `title` field and a `html` field.  Pass the **Web**
object to the `browserReady.close()` function to disconnect the page.
```javascript
const url = 'https://pretty-print-json.js.org/';
let web;  //fields: browser, page, response, status, location, title, html, $
before(async () => web = await puppeteer.launch().then(browserReady.goto(url));
after(async () =>  await browserReady.close(web));
```

## C) TypeScript Declarations
The **TypeScript Declaration File** file is
[puppeteer-browser-ready.d.ts](dist/puppeteer-browser-ready.d.ts) in the **dist** folder.

The `browserReady.goto()` function returns a function that takes a Puppeteer **Browser** object and
returns a **Promise** that resolves with a **Web** object:
```typescript
type Web = {
   browser:  Puppeteer.Browser,
   page:     Puppeteer.Page,
   response: HTTPResponse | null,
   location: Location,
   title:    string,
   html:     string,
   $:        cheerio.Root | null,  //like jQuery
   };
```

The optional `browserReady.startWebServer()` function starts a static web server and returns a
**Promise** for when the [server](spec/start-web-server.spec.js) is ready:
```typescript
export type Http = {
   server:     Server,
   terminator: httpTerminator.HttpTerminator,
   folder:     string,
   url:        string,
   port:       number,
   verbose:    boolean,
   };
```

## D) Examples

### Example: Node.js program
**Code:**
```javascript
import puppeteer from 'puppeteer';
import { browserReady } from 'puppeteer-browser-ready';

const handleResponse = (web) => {
   console.log('Hello, World!');
   console.log('web fields:', Object.keys(web).join(', '));
   console.log(`The HTML from ${web.location.href} is ${web.html.length} characters`,
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
Hello, World!
web fields: browser, page, response, title, html, $
The HTML from https://pretty-print-json.js.org/ is 8200 characters
long and contains 7 <p> tags.
```

### Example: Mocha specification suite
**Code:**
```javascript
// Mocha Specification Suite

// Imports
import puppeteer from 'puppeteer';
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { browserReady } from 'puppeteer-browser-ready';

// Setup
const url = 'https://pretty-print-json.js.org/';
let web;  //fields: browser, page, response, status, location, title, html, $
const loadWebPage = async () =>
   web = await puppeteer.launch().then(browserReady.goto(url));
const closeWebPage = async () =>  
   await browserReady.close(web);

/////////////////////////////////////////////////////////////////////////////////////
describe('The web page', () => {
   before(loadWebPage);
   after(closeWebPage);

   it('has the correct URL -> ' + url, () => {
      const actual =   { status: web.status, url: web.location.href };
      const expected = { status: 200,        url: url };
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
   before(loadWebPage);
   after(closeWebPage);

   it('has a 🚀 traveling to 🪐!', () => {
      const actual =   { '🚀': !!web.html.match(/🚀/g), '🪐': !!web.html.match(/🪐/g) };
      const expected = { '🚀': true,                    '🪐': true };
      assertDeepStrictEqual(actual, expected);
      });

   });
```
**Output:**
```
  The web page
    ✓ has the correct URL -> https://pretty-print-json.js.org/
    ✓ has exactly one header, main, and footer

  The document content
    ✓ has a 🚀 traveling to 🪐!
```

### Example: Start and shutdown a static web server
The [startWebServer() and shutdownWebServer()](spec/start-web-server.spec.js) functions can be used
in global fixtures to start and shutdown a static web server.

For example, the **spec/fixtures/setup-teardown.js** file below starts a web server on port `7123`
with the web root pointed to the project's **docs** folder.

**Code:**
```javascript
// Specification Fixtures
import { browserReady } from 'puppeteer-browser-ready';
let http;  //fields: server, terminator, folder, url, port, verbose

// Setup
const mochaGlobalSetup = async () => {
   http = await browserReady.startWebServer({ folder: 'docs', port: 7123 });
   };

// Teardown
const mochaGlobalTeardown = async () => {
   await browserReady.shutdownWebServer(http);
   };

export { mochaGlobalSetup, mochaGlobalTeardown };
```
Run specification suites with global fixtures:<br>
`$ npx mocha spec/*.spec.js --require spec/fixtures/setup-teardown.js`

**Output:**
```
  [2021-07-14T11:38:22.892Z] Web Server - listening: true 7123 http://localhost:7123/
  ...Output of Mocha specification suites here...
  [2021-07-14T11:38:26.704Z] Web Server - shutdown: true
```

<br>

---
[MIT License](LICENSE.txt)
