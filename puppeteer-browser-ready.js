// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License

const cheerio = require('cheerio');

// type Web = {
//    browser:    Puppeteer.Browser,
//    page:       Puppeteer.Page,
//    response:   Puppeteer.Response | null,
//    url         string,
//    status:     number,
//    statusText: string,
//    html:       string,
//    $:          Cheerio (like JQuery) | null,
//    };

const puppeteerBrowserReady = {
   goto(pageUrl, options) {
      const defaults = { web: {}, addCheerio: true };
      const settings = { ...defaults, ...options };
      return async (browser) => {
         const page =       await browser.newPage();
         const response =   await page.goto(pageUrl);
         const url =        await response.url();
         const status =     await response.status();
         const statusText = await response.statusText();
         const html =       await response.text();
         const $ =          settings.addCheerio ? cheerio.load(html) : null;
         return Object.assign(settings.web, { browser, page, response, url, status, statusText, html, $ });
         };
      },
   async close(web) {
      if (web && web.browser)
         await web.browser.close();
      return web;
      },
   };

module.exports = puppeteerBrowserReady;  //node module loading system (CommonJS)
