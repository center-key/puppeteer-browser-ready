// puppeteer-browser-ready ~ github.com/center-key/puppeteer-browser-ready ~ MIT License
/// <reference types="node" />
/// <reference types="cheerio" />
import httpTerminator from 'http-terminator';
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { Server } from 'http';
export declare type StartWebServerOptions = {
    folder?: string;
    port?: number;
    verbose?: boolean;
};
export declare type Http = {
    server: Server;
    terminator: httpTerminator.HttpTerminator;
    folder: string;
    url: string;
    port: number;
    verbose: boolean;
};
declare type BrowserReadyWeb = {
    browser: Browser;
    page: Page;
    response: HTTPResponse | null;
    location: Location;
    title: string;
    html: string;
    $: cheerio.Root | null;
};
declare type BrowserReadyOptions = {
    web: Partial<BrowserReadyWeb>;
    addCheerio: boolean;
};
declare const browserReady: {
    log(...args: unknown[]): void;
    startWebServer(options?: StartWebServerOptions | undefined): Promise<Http>;
    shutdownWebServer(http: Http): Promise<void>;
    goto(url: string, options?: BrowserReadyOptions | undefined): (browser: Browser) => Promise<BrowserReadyWeb>;
    close(web: BrowserReadyWeb): Promise<BrowserReadyWeb>;
};
export { browserReady };
