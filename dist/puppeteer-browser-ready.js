//! puppeteer-browser-ready v0.5.1 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Imports
import cheerio from 'cheerio';
import express from 'express';
import httpTerminator from 'http-terminator';
// Package
const browserReady = {
    log(...args) {
        const indent = typeof globalThis['describe'] === 'function' ? '  [' : '[';
        console.log(indent + new Date().toISOString() + ']', ...args);
    },
    startWebServer(options) {
        const defaults = { folder: '.', port: 0, verbose: true, autoCleanup: true };
        const settings = Object.assign(Object.assign({}, defaults), options);
        const server = express().use(express.static(settings.folder)).listen(settings.port);
        const terminator = httpTerminator.createHttpTerminator({ server });
        const port = () => server.address().port;
        const url = () => 'http://localhost:' + String(port()) + '/';
        const logListening = () => this.log('Web Server - listening:', server.listening, port(), url());
        const logClose = () => this.log('Web Server - shutdown:', !server.listening);
        const http = () => ({
            server: server,
            terminator: terminator,
            folder: settings.folder,
            url: url(),
            port: port(),
            verbose: settings.verbose,
        });
        let done;
        server.on('listening', () => done(http()));
        if (settings.verbose)
            server.on('listening', logListening).on('close', logClose);
        const cleanup = () => {
            console.log('[SIGINT]');
            terminator.terminate();
        };
        if (settings.autoCleanup)
            process.on('SIGINT', cleanup);
        return new Promise(resolve => done = resolve);
    },
    shutdownWebServer(http) {
        return http.terminator.terminate();
    },
    goto(url, options) {
        const defaults = { addCheerio: true, verbose: false };
        const settings = Object.assign(Object.assign({}, defaults), options);
        const log = (label, msg) => settings.verbose &&
            console.log('   ', Date.now() % 100000, label + ':', msg);
        const web = (browser) => __awaiter(this, void 0, void 0, function* () {
            log('Connected', browser.isConnected());
            try {
                const page = yield browser.newPage();
                log('Page....', url);
                const response = yield page.goto(url);
                log('Response', response.url());
                const status = response && response.status();
                log('Status', status);
                const location = yield page.evaluate(() => globalThis.location);
                log('Host', location.host);
                const title = response && (yield page.title());
                log('Title', title);
                const html = response && (yield response.text());
                log('Bytes', html.length);
                const $ = html && settings.addCheerio ? cheerio.load(html) : null;
                log('$', $ && $['fn'].constructor.name);
                return { browser, page, response, status, location, title, html, $ };
            }
            catch (error) {
                const status = browser.isConnected() ? 'connected' : 'not connected';
                console.log('[puppeteer-browser-ready]', settings, status);
                console.log(error);
                throw error;
            }
        });
        return web;
    },
    close(web) {
        return __awaiter(this, void 0, void 0, function* () {
            if (web && web.browser)
                yield web.browser.close();
            return web;
        });
    },
};
export { browserReady };
