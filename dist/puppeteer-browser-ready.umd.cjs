// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "cheerio", "express", "http-terminator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.browserReady = void 0;
    // Imports
    const cheerio_1 = __importDefault(require("cheerio"));
    const express_1 = __importDefault(require("express"));
    const http_terminator_1 = __importDefault(require("http-terminator"));
    // Package
    const browserReady = {
        log(...args) {
            console.log('  [' + new Date().toISOString() + ']', ...args);
        },
        startWebServer(options) {
            const defaults = { folder: '.', port: 0, verbose: true };
            const settings = { ...defaults, ...options };
            const server = express_1.default().use(express_1.default.static(settings.folder)).listen(settings.port);
            const terminator = http_terminator_1.default.createHttpTerminator({ server });
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
            return new Promise(resolve => done = resolve);
        },
        shutdownWebServer(http) {
            return http.terminator.terminate();
        },
        goto(url, options) {
            const defaults = { web: {}, addCheerio: true };
            const settings = { ...defaults, ...options };
            if (options?.web)
                console.log('[DEPRECATED] Remove "web" option and use: .then(browserReady.goto(url)).then(webInst => web = webInst)');
            return async (browser) => {
                const page = await browser.newPage();
                const response = await page.goto(url);
                const title = response && await page.title();
                const html = response && await response.text();
                const $ = html && settings.addCheerio ? cheerio_1.default.load(html) : null;
                return Object.assign(settings.web, { browser, page, response, title, html, $ });
            };
        },
        async close(web) {
            if (web && web.browser)
                await web.browser.close();
            return web;
        },
    };
    exports.browserReady = browserReady;
});
