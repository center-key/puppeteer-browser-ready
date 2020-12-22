// Hello, World!

// To run:
//    $ cd hello-world
//    $ npm install
//    $ node index
//    Hello, World!
//    web fields: browser, page, response, url, status, statusText, html
//    The HTML from https://pretty-print-json.js.org/ is 7556 characters long.

const puppeteer =    require('puppeteer');
const browserReady = require('puppeteer-browser-ready');

const handleResponse = (web) => {
   console.log('Hello, World!');
   console.log('web fields:', Object.keys(web).join(', '));
   console.log('The HTML from', web.url, 'is', web.html.length, 'characters long.');
   web.browser.close();
   };
puppeteer.launch()
   .then(browserReady('https://pretty-print-json.js.org/'))
   .then(handleResponse);
