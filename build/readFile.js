"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mimeTypes_1 = require("./mimeTypes");
const read = (path, encoding) => new Promise((res, rej) => {
    fs_1.default.readFile(path, encoding, (error, content) => {
        if (error) {
            const msg = error.code === "ENOENT" ? 404 : 500;
            rej(msg);
            return;
        }
        res(content);
    });
});
const readFile = async (root, url) => {
    const filePath = `${root}/${url === "/" ? "index.html" : url}`;
    const ext = path_1.default.extname(filePath).toLowerCase().slice(1);
    const contentType = mimeTypes_1.getMimeType(ext);
    const isHtml = contentType == 'text/html';
    const encoding = isHtml ? 'utf8' : null;
    const content = await read(filePath, encoding);
    return { content, isHtml, encoding, contentType };
};
exports.readFile = readFile;
