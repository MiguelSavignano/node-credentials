interface IConfigOptions {
  masterKey?: string;
  path?: string;
  nodeEnv?: string;
}

declare class Vault {
  constructor(options: {
    encryptFnc?: (encKey: string, text: string, ivBase64?: string) => string;
    decryptFnc?: (encKey: string, text: string) => [string, string];
    credentialsFilePath?: string;
    nodeEnv?: string;
    masterKey?: string;
  });

  credentials: any;
  credentialsEnv: any;
  config(options?: IConfigOptions): any;
}
declare const vault: Vault;
declare const credentials: any;
declare const credentialsEnv: any;
declare const config: (options?: IConfigOptions) => any;

export { credentials, credentialsEnv, config, Vault };
export default vault;
