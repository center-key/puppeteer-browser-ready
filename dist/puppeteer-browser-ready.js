//! puppeteer-browser-ready v0.4.0 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

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
        const defaults = { web: {}, addCheerio: true };
        const settings = { ...defaults, ...options };
        if (options?.web)
            console.log('[DEPRECATED] Remove "web" option and use: async () => web = await puppeteer.launch().then(...');
        return async (browser) => {
            const page = await browser.newPage();
            const response = await page.goto(url);
            const status = response && response.status();
            const location = await page.evaluate(() => globalThis.location);
            const title = response && await page.title();
            const html = response && await response.text();
            const $ = html && settings.addCheerio ? cheerio.load(html) : null;
            // return { browser, page, response, status, location, title, html, $ };
            return Object.assign(settings.web, //TODO: remove settings.web
            { browser, page, response, status, location, title, html, $ });
        };
    },
    async close(web) {
        if (web && web.browser)
            await web.browser.close();
        return web;
    },
};
export { browserReady };
