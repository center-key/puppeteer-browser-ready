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
        define(["require", "exports", "cheerio"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.browserReady = void 0;
    const cheerio_1 = __importDefault(require("cheerio"));
    const browserReady = {
        goto(url, options) {
            const defaults = { web: {}, addCheerio: true };
            const settings = { ...defaults, ...options };
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
