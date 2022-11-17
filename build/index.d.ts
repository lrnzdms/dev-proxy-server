import { IOptions, IProxyRoute } from './options';
import { DevServer } from './server';
declare const CreateServer: (options: IOptions) => DevServer;
export { CreateServer, IOptions, IProxyRoute, DevServer };
