//! puppeteer-browser-ready v1.1.0 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    const cheerio_1 = __importDefault(require("cheerio"));
    const express_1 = __importDefault(require("express"));
    const http_terminator_1 = __importDefault(require("http-terminator"));
    // Package
    const browserReady = {
        log(...args) {
            const indent = typeof globalThis.describe === 'function' ? '  [' : '[';
            console.log(indent + new Date().toISOString() + ']', ...args);
        },
        startWebServer(options) {
            const defaults = { folder: '.', port: 0, verbose: true, autoCleanup: true };
            const settings = Object.assign(Object.assign({}, defaults), options);
            const server = (0, express_1.default)().use(express_1.default.static(settings.folder)).listen(settings.port);
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
                    log('Response', response === null || response === void 0 ? void 0 : response.url());
                    const status = response && response.status();
                    log('Status', status);
                    const location = yield page.evaluate(() => globalThis.location);
                    log('Host', location.host);
                    const title = response && (yield page.title());
                    log('Title', title);
                    const html = response && (yield response.text());
                    log('Bytes', html === null || html === void 0 ? void 0 : html.length);
                    const $ = html && settings.addCheerio ? cheerio_1.default.load(html) : null;
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
    exports.browserReady = browserReady;
});
