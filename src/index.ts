import { IOptions, IProxyRoute } from './options';
import { DevServer } from './server';

const CreateServer = (options: IOptions) => {
  const server = new DevServer(options);
  return server;
}

export { CreateServer, IOptions, IProxyRoute, DevServer }
