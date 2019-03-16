# Node encrypted secrets

[![CircleCI](https://circleci.com/gh/MiguelSavignano/node-credentials.svg?style=svg)](https://circleci.com/gh/MiguelSavignano/node-credentials)

Manage your secrets with single entrypted file.
Inspired in [Rails encrypted secrets management](https://rubyinrails.com/2018/02/24/rails-5-1-encrypted-secrets-management-feature/)

## Install

```
npm install node-credentials --save
```

## Usage

Create a credentials.json file

```
{
  "my_api_key": "api_key",
  "my_api_secret": "api_secret"
}
```

### Setup

```
npx node-credentials init
```

Your credentials.json it's encrypted, and generate credentials.json.key

Save the key value, and ignore this file in your version control.

```
echo credentias.json.key > .gitignore
```

### Use credentials

- Load credentials in your main.js

```js
const vault = require("node-credentials");
vault.config();
```

- Read credentials

```js
const { credentials } = require("node-credentials");

const databasePassword = credentials.db.password;
```

### Use in production

You cat set a enviroment varible NODE_MASTER_KEY for decrypt secrets.

```
NODE_MASTER_KEY=my-credential-key server.js
```

### Edit credentials

For chage your credentials.json.enc you can decrypt and encrypt using the CLI

- Decrypt

```
npx node-credentials edit
```

- Encrypt

```
npx node-credentials encrypt
```

## CLI

```
npx node-credentials help
```

## API

### config

| Argument | Type   | Description                                   |
| -------- | ------ | --------------------------------------------- |
| keyValue | String | NODE_MASTER_KEY value for decrypt credentials |
| path     | String | file path for credentials.json                |

### credentials

Return the value of credentials

### credentialsEnv

Return the value of credentiasl based on process.env.NODE_ENV
Example:

```js
//credentials.json

{
  "development" : {
    "key": "password"
  },
  "test" : {
    "key": "password_test"
  }
}
```

```js
const vault = require("node-credentials");
vault.config();
console.log(vault.credentials);
// {development: {key: ""password}, test: {key: "password_test"}}
console.log(vault.credentialsEnv);
// {key: "password"}
```
