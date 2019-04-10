export interface IVault {
  credentials: any;
  credentialsEnv: any;
  config({ keyValue, path }: { keyValue?: string; path?: string }): any;
}
declare const Vault: any;
declare const vault: IVault;
declare const credentials: any;
declare const credentialsEnv: any;

export { Vault };
export { credentials };
export { credentialsEnv };
export default vault;
