export interface IProxyRoute {
  // The relative route to catch. E.g. "/foo"
  route: string,
  // The url to proxy the route to. E.g. "http://example.com/foo"
  target: string,
  // An optional modifier function to change the route of the target. E.g. change "/foo" to "/bar"
  urlModifier?: (url: string) => string,
  // An optional set of headers to inject into the request
  headers?: { [header: string]: string }
}

export interface IOptions {
  // Port on localhost. Default 3000
  port?: number,
  // The directory to serve. Default "."
  root?: string,
  // Hot reload. Default true
  hot?: boolean,
  // Routes to proxy. Order matters: The first matched route will be followed
  proxies?: IProxyRoute[],
  notifyPort?: number,
  listenToWS?: boolean
}