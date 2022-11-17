import { IncomingMessage, ServerResponse } from 'http';
import httpproxy from "http-proxy";
import { IProxyRoute } from './options';
export declare class Proxy {
    _table: IProxyRoute[];
    _proxy: httpproxy;
    constructor(table: IProxyRoute[]);
    tryProxy: (req: IncomingMessage, res: ServerResponse) => boolean;
}
