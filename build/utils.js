"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrn = exports.err = exports.log = void 0;
const log = (...a) => console.log(...a);
exports.log = log;
const err = (...a) => console.error(...a);
exports.err = err;
const wrn = (...a) => console.warn(...a);
exports.wrn = wrn;
