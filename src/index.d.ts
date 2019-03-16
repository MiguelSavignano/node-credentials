export interface Vault {
  credentials: any;
  config({ keyValue, path }: { keyValue?: string; path?: string });
}

export default Vault;
