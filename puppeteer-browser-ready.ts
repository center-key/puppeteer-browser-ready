// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License

import cheerio from 'cheerio';
import { Browser, Page } from 'puppeteer';

type BrowserReadyWeb = {
   browser:  Browser,
   page:     Page,
   response: Response | null,
   html:     string,
   $:        cheerio.Root | null,
   };

type BrowserReadyOptions = {
   web:        Partial<BrowserReadyWeb>,
   addCheerio: boolean,
   };

const browserReady = {
   goto(url: string, options?: BrowserReadyOptions) {
      const defaults = { web: {}, addCheerio: true };
      const settings = { ...defaults, ...options };
      return async (browser: Browser) => {
         const page =       await browser.newPage();
         const response =   await page.goto(url);
         const html =       response && await response.text();
         const $ =          html && settings.addCheerio ? cheerio.load(html) : null;
         return <BrowserReadyWeb>Object.assign(settings.web, { browser, page, response, html, $ });
         };
      },
   async close(web: BrowserReadyWeb): Promise<BrowserReadyWeb> {
      if (web && web.browser)
         await web.browser.close();
      return web;
      },
   };

export { browserReady };
