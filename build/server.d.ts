import { IOptions } from './options';
export declare class DevServer {
    private _identifier;
    private _port;
    private _root;
    private _hot;
    private _clients;
    private _proxy;
    private _notifyPort;
    private _listenToWS;
    constructor(options?: IOptions);
    update: () => void;
    private _start;
    private _handleRequest;
    private _initializationLog;
    private _addClient;
}
