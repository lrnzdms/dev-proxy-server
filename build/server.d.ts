/// <reference types="node" />
import http from 'http';
import { IOptions } from './options';
export declare class DevServer {
    private _identifier;
    private _port;
    private _root;
    private _hot;
    private _clients;
    private _proxy;
    private _server;
    constructor(options?: IOptions);
    get server(): http.Server;
    update: () => void;
    private _start;
    private _handleRequest;
    private _initializationLog;
    private _addClient;
}
