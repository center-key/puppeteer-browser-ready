//! puppeteer-browser-ready v0.4.4 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

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
        const defaults = { addCheerio: true, debugMode: false };
        const settings = { ...defaults, ...options };
        const log = (item, msg) => settings.debugMode &&
            console.log('     ', Date.now() % 100000, item?.constructor?.name, msg ?? typeof item);
        const web = async (browser) => {
            try {
                const page = await browser.newPage();
                log(page);
                const response = await page.goto(url);
                log(response, response.url());
                const status = response && response.status();
                const location = await page.evaluate(() => globalThis.location);
                log(location, location.host);
                const title = response && await page.title();
                log(title, title);
                const html = response && await response.text();
                const $ = html && settings.addCheerio ? cheerio.load(html) : null;
                log($ && $['fn']);
                return { browser, page, response, status, location, title, html, $ };
            }
            catch (error) {
                console.log(settings, browser.isConnected(), error);
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
