// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License

// type Web = {
//    browser:    any,
//    page:       any,
//    response:   any,
//    url         string,
//    status:     number,
//    statusText: string,
//    html:       string,
//    };

const puppeteerBrowserReady = {
   goto(pageUrl, web) {
      return async (browser) => {
         const page =       await browser.newPage();
         const response =   await page.goto(pageUrl);
         const url =        await response.url();
         const status =     await response.status();
         const statusText = await response.statusText();
         const html =       await response.text();
         return Object.assign(web || {}, { browser, page, response, url, status, statusText, html });
         };
      },
   async close(web) {
      if (web && web.browser)
         await web.browser.close();
      return web;
      },
   };

module.exports = puppeteerBrowserReady;  //node module loading system (CommonJS)
