//! puppeteer-browser-ready v1.4.0 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

import { parse } from 'node-html-parser';
import express from 'express';
import httpTerminator from 'http-terminator';
// Package
const browserReady = {
    log(...args) {
        const indent = typeof globalThis.describe === 'function' ? '  [' : '[';
        console.info(indent + new Date().toISOString() + ']', ...args);
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
            console.info('[SIGINT]');
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
        const defaults = { parseHtml: true, verbose: false };
        const settings = { ...defaults, ...options };
        const output = (label, msg) => settings.verbose &&
            console.info('   ', Date.now() % 100000, label + ':'.padEnd(16 - label.length, ' '), msg);
        const rootInfo = (root) => `${root.constructor.name}/${root.firstChild?.toString().trim()}`;
        const web = async (browser) => {
            try {
                output('[1/8] Connected', browser.connected);
                const page = await browser.newPage();
                output('[2/8] Page', url);
                const response = await page.goto(url);
                output('[3/8] Response', response?.url());
                const status = response && response.status();
                output('[4/8] Status', status);
                const location = await page.evaluate(() => globalThis.location);
                output('[5/8] Host', location.host);
                const title = response && await page.title();
                output('[6/8] Title', title);
                const html = response && await response.text();
                output('[7/8] Bytes', html?.length);
                const root = html && settings.parseHtml ? parse(html) : null;
                output('[8/8] DOM root', root ? rootInfo(root) : null);
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
    async close(web) {
        if (web?.browser)
            await web.browser.close();
        return web;
    },
};
export { browserReady };
