import http, { RequestListener, ServerResponse, request } from 'http';
import { AddressInfo } from 'net';
import { networkInterfaces } from 'os';
import { injectListener } from './injectListener';
import { IOptions } from './options';
import { Proxy } from './proxy';
import { IReadFileResult, readFile } from './readFile';
import { err, wrn } from './utils';
import { WebSocketServer, WebSocket } from 'ws';

export class DevServer {
  private _identifier = `/proxy_${Date.now()}`;
  private _port: number = 3000;
  private _root: string = ".";
  private _hot: boolean = true;
  private _clients: ServerResponse[];
  private _proxy: Proxy;
  private _notifyPort: number = undefined;
  private _listenToWS: boolean = false;

  constructor(options?: IOptions) {
    this._port = options?.port || this._port;
    this._root = options?.root || this._root;
    this._hot = options?.hot || this._hot;
    this._listenToWS = options.listenToWS || this._listenToWS;
    this._notifyPort = options.notifyPort || this._notifyPort;
    this._clients = [];
    this._proxy = new Proxy(options?.proxies || []);

    this._start();
  }

  
  update = () => {
    if(this._notifyPort) {
      const ws = new WebSocket(`ws://localhost:${this._notifyPort.toString()}`);
      ws.on('open', () => {
          ws.send('serverReloaded', (err) => {
            if(err) {
              console.log(err);
            } else {
              console.log(`Server on port ${this._notifyPort.toString()} has been notified`);
            }
          });
      });
      ws.on('error', (error) => {
          console.error('WebSocket Error:', error);
      });
      
    }
    this._clients.forEach(response => response.write('data: update\n\n'));
    this._clients.length = 0;

  }

  private _start = () => {
    
    const server = http.createServer(this._handleRequest);
    server.listen(this._port, () => this._initializationLog(server))

    if(this._listenToWS) {
      const wss = new WebSocketServer({ noServer: true });
      server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
             ws.on('message', (message) => {
              this.update();
            });
        });
      })
    }

    server.once('error', () => {
      console.error("Encountered error. Trying to restart ...");
      server.removeAllListeners('listening');
      this._start();
    });
  }

  private _handleRequest: RequestListener = async (req, res) => {

    if (this._proxy.tryProxy(req, res)) {
      return;
    }

    if (this._hot && req.url === this._identifier) {
      this._addClient(res);
      return;
    }

    let result: IReadFileResult;

    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      result = await readFile(this._root, url.pathname);
    } catch (error) {
      err(error);
      res.writeHead(404);
      res.end("", "");
      return;
    }

    const { isHtml, encoding, contentType } = result;

    let content = result.content;

    if (this._hot && isHtml) {

      // Injecting an event source into the html
      // - Creates a request to "source" which will be handled by our listener
      // - our listener will keep this request connection alive with the client
      // - when it is time to update we fullfill the request and trigger a page reload

      content = injectListener(content, this._identifier);
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, encoding);
  }

  private _initializationLog = (server: http.Server) => {
    const info = server.address() as AddressInfo;
    const ip = Object.values(networkInterfaces()).flat()
      .find(ip => ip.family == 'IPv4' && !ip.internal).address;

    if (info.port != this._port) {
      err(`Port ${this._port} was in use.\n`);
    }

    wrn(`[ Dev Proxy Server (http://localhost:${info.port}) ]`);
  }

  private _addClient = (response: ServerResponse) => {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    this._clients.push(response);
  }
}
