// Hello, World!

// To run:
//    $ git clone https://github.com/center-key/puppeteer-browser-ready.git
//    $ cd puppeteer-browser-ready
//    $ cd hello-world
//    $ npm install
//    $ node index.js
//    Hello, World!
//    web fields: browser, page, response, status, location, title, html, $
//    The HTML from https://pretty-print-json.js.org/ is 8200 characters
//    long and contains 7 <p> tags.

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
