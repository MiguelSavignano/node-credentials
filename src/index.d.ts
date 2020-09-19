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

  credentials: object;
  credentialsEnv: object;
  config(options?: IConfigOptions): any;
}
declare const vault: Vault;
declare const credentials: object;
declare const credentialsEnv: object;
declare const config: (options?: IConfigOptions) => any;

export { credentials, credentialsEnv, config, Vault };
export default vault;
