# Node encrypted secrets

Manage your secrets with single entrypted file.
Inspired in [Rails encrypted secrets management](https://rubyinrails.com/2018/02/24/rails-5-1-encrypted-secrets-management-feature/)

## Install

```
npm install node-encrypted-secrets --save
```

## Usage

Create a credentials.json file

### Setup

```
npx node-secrets init
```

Your credentials.json it's encrypted, and generate credentials.json.key

Save the key value, and ignore this file in your version control.

```
echo credentisl.json.key > .gitignore
```

### Use credentials

- Load credentials in your main.js

```js
const vault = require("node-encrypted-secrets");
vault.config();
```

- Read credentials

```js
const credentials = require("node-encrypted-secrets").credentials;

const databasePasswod = credentials.db.password;
```

### Use in production

You cat set a enviroment varible NODE_MASTER_KEY for decrypt secrets.

```
NODE_MASTER_KEY=my-credential-key server.js
```

### Edit credentials

For chage your credentials.json.enc you can decrypt and encrypt using the cli

- Decrypt

```
npx node-secrets edit
```

- Encrypt

```
npx node-secrets encrypt
```
