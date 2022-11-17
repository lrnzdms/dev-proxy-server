"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServer = exports.CreateServer = void 0;
const server_1 = require("./server");
Object.defineProperty(exports, "DevServer", { enumerable: true, get: function () { return server_1.DevServer; } });
const CreateServer = (options) => {
    const server = new server_1.DevServer(options);
    return server;
};
exports.CreateServer = CreateServer;
