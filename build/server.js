"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServer = void 0;
const http_1 = __importDefault(require("http"));
const os_1 = require("os");
const injectListener_1 = require("./injectListener");
const proxy_1 = require("./proxy");
const readFile_1 = require("./readFile");
const utils_1 = require("./utils");
const ws_1 = require("ws");
class DevServer {
    constructor(options) {
        this._identifier = `/proxy_${Date.now()}`;
        this._port = 3000;
        this._root = ".";
        this._hot = true;
        this._notifyPort = undefined;
        this._listenToWS = false;
        this.update = () => {
            if (this._notifyPort) {
                const ws = new ws_1.WebSocket(`ws://localhost:${this._notifyPort.toString()}`);
                ws.on('open', () => {
                    console.log('WebSocket connection established.');
                    ws.send('serverReloaded', (err) => console.log(err));
                    console.log('message sent');
                });
                ws.on('error', (error) => {
                    console.error('WebSocket Error:', error);
                });
            }
            this._clients.forEach(response => response.write('data: update\n\n'));
            this._clients.length = 0;
        };
        this._start = () => {
            const server = http_1.default.createServer(this._handleRequest);
            server.listen(this._port, () => this._initializationLog(server));
            if (this._listenToWS) {
                const wss = new ws_1.WebSocketServer({ noServer: true });
                server.on('upgrade', (request, socket, head) => {
                    wss.handleUpgrade(request, socket, head, (ws) => {
                        wss.emit('connection', ws, request);
                        ws.on('message', (message) => {
                            this.update();
                        });
                    });
                });
            }
            server.once('error', () => {
                console.error("Encountered error. Trying to restart ...");
                server.removeAllListeners('listening');
                this._start();
            });
        };
        this._handleRequest = async (req, res) => {
            if (this._proxy.tryProxy(req, res)) {
                return;
            }
            if (this._hot && req.url === this._identifier) {
                this._addClient(res);
                return;
            }
            let result;
            try {
                const url = new URL(req.url, `http://${req.headers.host}`);
                result = await readFile_1.readFile(this._root, url.pathname);
            }
            catch (error) {
                utils_1.err(error);
                return;
            }
            const { isHtml, encoding, contentType } = result;
            let content = result.content;
            if (this._hot && isHtml) {
                // Injecting an event source into the html
                // - Creates a request to "source" which will be handled by our listener
                // - our listener will keep this request connection alive with the client
                // - when it is time to update we fullfill the request and trigger a page reload
                content = injectListener_1.injectListener(content, this._identifier);
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, encoding);
        };
        this._initializationLog = (server) => {
            const info = server.address();
            const ip = Object.values(os_1.networkInterfaces()).flat()
                .find(ip => ip.family == 'IPv4' && !ip.internal).address;
            if (info.port != this._port) {
                utils_1.err(`Port ${this._port} was in use.\n`);
            }
            utils_1.wrn(`[ Dev Proxy Server (http://localhost:${info.port}) ]`);
        };
        this._addClient = (response) => {
            response.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive'
            });
            this._clients.push(response);
        };
        this._port = (options === null || options === void 0 ? void 0 : options.port) || this._port;
        this._root = (options === null || options === void 0 ? void 0 : options.root) || this._root;
        this._hot = (options === null || options === void 0 ? void 0 : options.hot) || this._hot;
        this._listenToWS = options.listenToWS || this._listenToWS;
        this._notifyPort = options.notifyPort || this._notifyPort;
        this._clients = [];
        this._proxy = new proxy_1.Proxy((options === null || options === void 0 ? void 0 : options.proxies) || []);
        this._start();
    }
}
exports.DevServer = DevServer;
