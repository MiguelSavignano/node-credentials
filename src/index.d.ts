interface IConfigOptions {
  keyValue?: string;
  path?: string;
}
export interface IVault {
  credentials: any;
  credentialsEnv: any;
  config(options?: IConfigOptions): any;
}
declare const Vault: any;
declare const vault: IVault;
declare const credentials: any;
declare const credentialsEnv: any;

export { Vault };
export { credentials };
export { credentialsEnv };
export default vault;
