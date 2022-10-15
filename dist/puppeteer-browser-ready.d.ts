//! puppeteer-browser-ready v0.5.7 ~~ https://github.com/center-key/puppeteer-browser-ready ~~ MIT License

/// <reference types="cheerio" />
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { Server } from 'http';
import httpTerminator from 'http-terminator';
export declare type StartWebServerSettings = {
    folder: string;
    port: number;
    verbose: boolean;
    autoCleanup: boolean;
};
export declare type StartWebServerOptions = Partial<StartWebServerSettings>;
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
    title: string | null;
    html: string | null;
    $: cheerio.Root | null;
};
export declare type BrowserReadySettings = {
    addCheerio: boolean;
    verbose: boolean;
};
export declare type BrowserReadyOptions = Partial<BrowserReadySettings>;
declare const browserReady: {
    log(...args: unknown[]): void;
    startWebServer(options?: StartWebServerOptions): Promise<Http>;
    shutdownWebServer(http: Http): Promise<void>;
    goto(url: string, options?: BrowserReadyOptions): (browser: Browser) => Promise<Web>;
    close(web: Web): Promise<Web>;
};
export { browserReady };
