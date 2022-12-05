# Local Server

A light local http server with proxy capabilities.

``` js
import { DevServer } from '@lrnzdms/local-server';
  
const options = {
  
  // Port on localhost. Optional. Default 3000
  port: 3000,
  
  // The directory to serve. Optional. Default "."
  root: ".",
  
  // Hot reload. Optional. Default true
  hot: true,

  // Routes to proxy. Order matters: 
  // The first matched route will be followed
  proxies: [
    {
      // The relative route to catch.
      route: "/foo",

      // The url to proxy the route to.
      target: "http://example.com",

      // Optional. A modifier function to change the route of the target.
      urlModifier: (url: string) => url.replace("foo", "bar"),
      
      // Optional. Set of headers to inject into the request
      headers: { 
        ["header-key"]: "header-value" 
      }
    }
  ]
}

// Creates and starts the server on http://localhost:port
const server = new DevServer(options);

// Triggers the hot reload
server.update();

// E.g. usage with esbuild:
esbuild.build({
  [...]
  watch: {
    onRebuild(err) {
      server.update();
    },
  }
})
```
