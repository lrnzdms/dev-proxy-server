export interface IReadFileResult {
    content: string;
    encoding: string;
    contentType: string;
    isHtml: boolean;
}
export declare const readFile: (root: string, url: string) => Promise<IReadFileResult>;
