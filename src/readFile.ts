import fs from 'fs';
import path from 'path';
import { getMimeType } from './mimeTypes';

const read = (path: string, encoding?: string) => new Promise<string>((res, rej) => {

  fs.readFile(path, encoding, (error, content) => {

    if (error) {
      const msg = error.code === "ENOENT" ? 404 : 500;
      rej(msg);
      return;
    }

    res(content);
  })
})


export interface IReadFileResult {
  content: string,
  encoding: string,
  contentType: string,
  isHtml: boolean
}

export const readFile = async (root: string, url: string): Promise<IReadFileResult> => {

  const filePath = `${root}/${url === "/" ? "index.html" : url}`;
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const contentType = getMimeType(ext);
  const isHtml = contentType == 'text/html';
  const encoding = isHtml ? 'utf8' : null;

  const content = await read(filePath, encoding);

  return { content, isHtml, encoding, contentType }
}
