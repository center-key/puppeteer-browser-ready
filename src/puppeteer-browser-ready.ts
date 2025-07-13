// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License

// Imports
import { AddressInfo } from 'net';
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { HTMLElement, parse } from 'node-html-parser';
import { Server } from 'http';
import { SuiteFunction } from 'mocha';
import express        from 'express';
import httpTerminator from 'http-terminator';

// TypeScript Declarations
export type StartWebServerSettings = {
   folder:      string,   //document root for the static web server
   port:        number,   //port number for server (`0` find open port)
   verbose:     boolean,  //output informational messages
   autoCleanup: boolean,  //terminate connection on interruption (`SIGINT`)
   };
export type StartWebServerOptions = Partial<StartWebServerSettings>;
export type Http = {
   server:     Server,
   terminator: httpTerminator.HttpTerminator,
   folder:     string,
   url:        string,
   port:       number,
   verbose:    boolean,
   };
export type Web = {
   browser:  Browser,
   page:     Page,
   response: HTTPResponse | null,
   status:   number | null,
   location: Location,
   title:    string | null,
   html:     string | null,
   root:     HTMLElement | null,
   };
export type BrowserReadySettings = {
   parseHtml:  boolean,  //return the DOM root as an HTMLElement (node-html-parsed)
   verbose:    boolean,  //output HTTP connection debug messages
   };
export type BrowserReadyOptions = Partial<BrowserReadySettings>;
declare global { var describe: SuiteFunction }

// Package
const browserReady = {
   log(...args: unknown[]): void {
      const indent = typeof globalThis.describe === 'function' ? '  [' : '[';
      console.info(indent + new Date().toISOString() + ']', ...args);
      },
   startWebServer(options?: StartWebServerOptions): Promise<Http> {
      const defaults = { folder: '.', port: 0, verbose: true, autoCleanup: true };
      const settings = { ...defaults, ...options };
      const server =       express().use(express.static(settings.folder)).listen(settings.port);
      const terminator =   httpTerminator.createHttpTerminator({ server });
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
      const cleanup = () => {
         console.info('[SIGINT]');
         terminator.terminate();
         };
      if (settings.autoCleanup)
         process.on('SIGINT', cleanup);
      return new Promise(resolve => done = resolve);
      },
   shutdownWebServer(http: Http): Promise<void> {
      return http.terminator.terminate();
      },
   goto(url: string, options?: BrowserReadyOptions): (browser: Browser) => Promise<Web> {
      const defaults = { parseHtml: true, verbose: false };
      const settings = { ...defaults, ...options };
      const log = (label: string, msg?: string | number | boolean | null) => settings.verbose &&
         console.info('   ', Date.now() % 100000, label + ':', msg);
      const rootInfo = (root: HTMLElement) =>
         `${root.constructor.name}/${root.firstChild?.toString().trim()}`;
      const web = async (browser: Browser): Promise<Web> => {
         log('Connected', browser.connected);
         try {
            const page =     await browser.newPage();                                  log('Page....', url);
            const response = await page.goto(url);                                     log('Response', response?.url());
            const status =   response && response.status();                            log('Status',   status);
            const location = await page.evaluate(() => globalThis.location);           log('Host',     location.host);
            const title =    response && await page.title();                           log('Title',    title);
            const html =     response && await response.text();                        log('Bytes',    html?.length);
            const root =     html && settings.parseHtml ? parse(html) : null;          log('DOM root', root ? rootInfo(root) : null);
            return { browser, page, response, status, location, title, html, root };
            }
         catch (error) {
            const status = browser.connected ? 'connected' : 'not connected';
            console.info('[puppeteer-browser-ready]', settings, status);
            console.info(error);
            throw error;
            }
         };
      return web;
      },
   async close(web: Web | null): Promise<Web | null> {
      if (web?.browser)
         await web.browser.close();
      return web;
      },
   };

export { browserReady };
