//! puppeteer-browser-ready v0.4.4 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

/// <reference types="cheerio" />
import httpTerminator from 'http-terminator';
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { Server } from 'http';
export declare type StartWebServerOptions = {
    folder?: string;
    port?: number;
    verbose?: boolean;
    autoCleanup?: boolean;
};
export declare type Http = {
    server: Server;
    terminator: httpTerminator.HttpTerminator;
    folder: string;
    url: string;
    port: number;
    verbose: boolean;
};
export declare type Web = {
    browser: Browser;
    page: Page;
    response: HTTPResponse | null;
    status: number | null;
    location: Location;
    title: string;
    html: string;
    $: cheerio.Root | null;
};
export declare type BrowserReadyOptions = {
    addCheerio?: boolean;
    debugMode?: boolean;
};
declare const browserReady: {
    log(...args: unknown[]): void;
    startWebServer(options?: StartWebServerOptions | undefined): Promise<Http>;
    shutdownWebServer(http: Http): Promise<void>;
    goto(url: string, options?: BrowserReadyOptions | undefined): (browser: Browser) => Promise<Web>;
    close(web: Web): Promise<Web>;
};
export { browserReady };
