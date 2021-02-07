// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License
/// <reference types="cheerio" />
import { Browser } from 'puppeteer/lib/cjs/puppeteer/common/Browser';
import { Page } from 'puppeteer/lib/cjs/puppeteer/common/Page';
declare type BrowserReadyWeb = {
    browser: Browser;
    page: Page;
    response: Response | null;
    title: string;
    html: string;
    $: cheerio.Root | null;
};
declare type BrowserReadyOptions = {
    web: Partial<BrowserReadyWeb>;
    addCheerio: boolean;
};
declare const browserReady: {
    goto(url: string, options?: BrowserReadyOptions | undefined): (browser: Browser) => Promise<BrowserReadyWeb>;
    close(web: BrowserReadyWeb): Promise<BrowserReadyWeb>;
};
export { browserReady };
