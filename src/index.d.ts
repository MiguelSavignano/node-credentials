export interface Vault {
  credentials: any;
  // credentials by environment
  credentialsEnv: any;
  config({ keyValue, path }: { keyValue?: string; path?: string });
}

export default Vault;
