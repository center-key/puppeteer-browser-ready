// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License

// Imports
import cheerio from 'cheerio';
import express from 'express';
import httpTerminator from 'http-terminator';
import { AddressInfo } from 'net';
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { Server } from 'http';

// TypeScript Declarations
export type StartWebServerOptions = {
   folder?:  string,
   port?:    number,
   verbose?: boolean,
   };
export type Http = {
   server:     Server,
   terminator: httpTerminator.HttpTerminator,
   folder:     string,
   url:        string,
   port:       number,
   verbose:    boolean,
   };
type BrowserReadyWeb = {
   browser:  Browser,
   page:     Page,
   response: HTTPResponse | null,
   location: Location,
   title:    string,
   html:     string,
   $:        cheerio.Root | null,
   };
type BrowserReadyOptions = {
   web:        Partial<BrowserReadyWeb>,
   addCheerio: boolean,
   };

// Package
const browserReady = {
   log(...args: unknown[]): void {
      console.log('  [' + new Date().toISOString() + ']', ...args);
      },
   startWebServer(options?: StartWebServerOptions): Promise<Http> {
      const defaults = { folder: '.', port: 0, verbose: true };
      const settings = { ...defaults, ...options };
      const server = express().use(express.static(settings.folder)).listen(settings.port);
      const terminator = httpTerminator.createHttpTerminator({ server });
      const port =         () => (<AddressInfo>server.address()).port;
      const url =          () => 'http://localhost:' + String(port()) + '/';
      const logListening = () => this.log('Web Server - listening:', server.listening, port(), url());
      const logClose =     () => this.log('Web Server - shutdown:', !server.listening);
      const http = (): Http => ({
         server:     server,
         terminator: terminator,
         folder:     settings.folder,
         url:        url(),
         port:       port(),
         verbose:    settings.verbose,
         });
      let done: (http: Http) => void;
      server.on('listening', () => done(http()));
      if (settings.verbose)
         server.on('listening', logListening).on('close', logClose);
      return new Promise(resolve => done = resolve);
      },
   shutdownWebServer(http: Http): Promise<void> {
      return http.terminator.terminate();
      },
   goto(url: string, options?: BrowserReadyOptions): (browser: Browser) => Promise<BrowserReadyWeb> {
      const defaults = { web: {}, addCheerio: true };
      const settings = { ...defaults, ...options };
      if (options?.web)
         console.log('[DEPRECATED] Remove "web" option and use: async () => web = await puppeteer.launch().then(...');
      return async (browser: Browser): Promise<BrowserReadyWeb> => {
         const page =     await browser.newPage();
         const response = await page.goto(url);
         const location = await page.evaluate(() => globalThis.location);
         const title =    response && await page.title();
         const html =     response && await response.text();
         const $ =        html && settings.addCheerio ? cheerio.load(html) : null;
         // return { browser, page, response, location, title, html, $ };
         return Object.assign(settings.web,  //TODO: remove settings.web
            { browser, page, response, location, title, html, $ });
         };
      },
   async close(web: BrowserReadyWeb): Promise<BrowserReadyWeb> {
      if (web && web.browser)
         await web.browser.close();
      return web;
      },
   };

export { browserReady };
