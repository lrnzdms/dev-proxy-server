"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proxy = void 0;
const http_proxy_1 = __importDefault(require("http-proxy"));
const utils_1 = require("./utils");
class Proxy {
    constructor(table) {
        this.tryProxy = (req, res) => {
            if (this._table.length === 0)
                return false;
            const entry = this._table.find(t => req.url.includes(t.route));
            if (!entry)
                return false;
            const { target, headers, urlModifier } = entry;
            if (!target) {
                utils_1.wrn(`[proxy] Could not proxy url: ${req.url}. Entry is malformed.`);
                return false;
            }
            if (urlModifier) {
                req.url = urlModifier(req.url);
            }
            utils_1.log(`[proxy] ${target}${req.url}`);
            this._proxy.web(req, res, {
                target,
                secure: false,
                changeOrigin: true,
                headers,
            });
            return true;
        };
        this._table = table;
        this._proxy = http_proxy_1.default.createProxyServer({});
    }
}
exports.Proxy = Proxy;
