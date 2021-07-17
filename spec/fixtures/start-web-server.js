// Hello, World!

// To run:
//    $ cd puppeteer-browser-ready
//    $ node spec/fixtures/start-web-server.js

// Imports
import open from 'open';
import { browserReady } from 'puppeteer-browser-ready';

// Setup
const webServerOptions = {
   folder:      '.',
   port:        0,
   verbose:     true,
   autoCleanup: true,
   };
const path = 'spec/fixtures/sample.html';

// Start
console.log('Opening web page at:', path);
browserReady.startWebServer(webServerOptions)
   .then(http => open(http.url + path));
