export interface IProxyRoute {
    route: string;
    target: string;
    urlModifier?: (url: string) => string;
    headers?: {
        [header: string]: string;
    };
}
export interface IOptions {
    port?: number;
    root?: string;
    live?: boolean;
    proxies?: IProxyRoute[];
}
