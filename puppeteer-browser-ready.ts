// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License

import cheerio from 'cheerio';
import { Browser, Page } from 'puppeteer';

type BrowserReadyWeb = {
   browser:  Browser,
   page:     Page,
   response: Response | null,
   title:    string,
   html:     string,
   $:        cheerio.Root | null,
   };

type BrowserReadyOptions = {
   web:        Partial<BrowserReadyWeb>,
   addCheerio: boolean,
   };

const browserReady = {
   goto(url: string, options?: BrowserReadyOptions): (browser: Browser) => Promise<BrowserReadyWeb> {
      const defaults = { web: {}, addCheerio: true };
      const settings = { ...defaults, ...options };
      return async (browser: Browser): Promise<BrowserReadyWeb> => {
         const page =     await browser.newPage();
         const response = await page.goto(url);
         const title =    response && await page.title();
         const html =     response && await response.text();
         const $ =        html && settings.addCheerio ? cheerio.load(html) : null;
         return <BrowserReadyWeb>Object.assign(settings.web,
            { browser, page, response, title, html, $ });
         };
      },
   async close(web: BrowserReadyWeb): Promise<BrowserReadyWeb> {
      if (web && web.browser)
         await web.browser.close();
      return web;
      },
   };

export { browserReady };
