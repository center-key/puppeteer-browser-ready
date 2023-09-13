//! puppeteer-browser-ready v1.2.2 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

import { parse } from 'node-html-parser';
import cheerio from 'cheerio';
import express from 'express';
import httpTerminator from 'http-terminator';
// Package
const browserReady = {
    log(...args) {
        const indent = typeof globalThis.describe === 'function' ? '  [' : '[';
        console.log(indent + new Date().toISOString() + ']', ...args);
    },
    startWebServer(options) {
        const defaults = { folder: '.', port: 0, verbose: true, autoCleanup: true };
        const settings = { ...defaults, ...options };
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
        const defaults = { addCheerio: true, parseHtml: true, verbose: false };
        const settings = { ...defaults, ...options };
        if (options?.addCheerio)
            console.log('puppeteer-browser-ready: Option "addCheerio" is deprecated, use "parseHtml" instead.');
        const log = (label, msg) => settings.verbose &&
            console.log('   ', Date.now() % 100000, label + ':', msg);
        const rootInfo = (root) => root.constructor.name + '/' + root.firstChild.toString();
        const web = async (browser) => {
            log('Connected', browser.isConnected());
            try {
                const page = await browser.newPage();
                log('Page....', url);
                const response = await page.goto(url);
                log('Response', response?.url());
                const status = response && response.status();
                log('Status', status);
                const location = await page.evaluate(() => globalThis.location);
                log('Host', location.host);
                const title = response && await page.title();
                log('Title', title);
                const html = response && await response.text();
                log('Bytes', html?.length);
                const $ = html && settings.addCheerio ? cheerio.load(html) : null; //deprecated
                const root = html && settings.parseHtml ? parse(html) : null;
                log('DOM root', root ? rootInfo(root) : null);
                return { browser, page, response, status, location, title, html, $, root };
            }
            catch (error) {
                const status = browser.isConnected() ? 'connected' : 'not connected';
                console.log('[puppeteer-browser-ready]', settings, status);
                console.log(error);
                throw error;
            }
        };
        return web;
    },
    async close(web) {
        if (web && web.browser)
            await web.browser.close();
        return web;
    },
};
export { browserReady };
