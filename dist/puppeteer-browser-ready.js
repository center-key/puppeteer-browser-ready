// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License
import cheerio from 'cheerio';
const browserReady = {
    goto(url, options) {
        const defaults = { web: {}, addCheerio: true };
        const settings = { ...defaults, ...options };
        return async (browser) => {
            const page = await browser.newPage();
            const response = await page.goto(url);
            const title = response && await page.title();
            const html = response && await response.text();
            const $ = html && settings.addCheerio ? cheerio.load(html) : null;
            return Object.assign(settings.web, { browser, page, response, title, html, $ });
        };
    },
    async close(web) {
        if (web && web.browser)
            await web.browser.close();
        return web;
    },
};
export { browserReady };
