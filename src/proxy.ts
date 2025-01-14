import { IncomingMessage, ServerResponse } from 'http';
import httpproxy from "http-proxy";
import { IProxyRoute } from './options';
import { log, wrn } from './utils';

export class Proxy {
  _table: IProxyRoute[];
  _proxy: httpproxy;

  constructor(table: IProxyRoute[]) {
    this._table = table;
    this._proxy = httpproxy.createProxyServer({});
  }

  tryProxy = (req: IncomingMessage, res: ServerResponse): boolean => {
    if (this._table.length === 0) return false;

    const entry = this._table.find(t => req.url.startsWith(t.route));

    if (!entry) return false;

    const { target, headers, urlModifier } = entry;

    if (!target) {
      wrn(`[proxy] Could not proxy url: ${req.url}. Entry is malformed.`);
      return false;
    }

    if (urlModifier) {
      req.url = urlModifier(req.url);
    }

    log(`[proxy] ${target}${req.url}`);

    this._proxy.web(req, res, {
      target,
      secure: false,
      changeOrigin: true,
      headers,
    });

    return true;
  }
}