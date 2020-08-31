# Node encrypted secrets

Manage your secrets with single entrypted file.
Inspired in [Rails encrypted secrets management](https://rubyinrails.com/2018/02/24/rails-5-1-encrypted-secrets-management-feature/)

## Install

```
npm install node-credentials --save
```

## Usage

### Encrypt and decrypt json files

```json
// credentials.json
{
  "username": "user",
  "password": "myPassword"
}
```

- Encrypt

```
NODE_MASTER_KEY=$MASTER_KEY npx node-credentials encrypt --path credentials.json
```

Only encrypted json values.

```json
{
  "username": "sGPi7jVJFORTBSOOKx5nMw==--eYed5TIh3D+9rjN/usOB0w==",
  "password": "+C4M+xFxOQXTyvPJ7QSJuQ==--eYed5TIh3D+9rjN/usOB0w=="
}
```

- Decrypt

```
NODE_MASTER_KEY=$MASTER_KEY npx node-credentials decrypt --path credentials.json

```

## CLI

```
npx node-credentials help
```

## API

### config

| Argument | Type   | Description          | Default          |
| -------- | ------ | -------------------- | ---------------- |
| path     | String | file path to encrypt | credentials.json |

## Setup for NodeJs projects

Create a credentials.json file

```json
{
  "myApiKey": "apiKey",
  "myApiSecret": "apiSecret"
}
```

```
npx node-credentials init
```

OR use your own key

```
NODE_MASTER_KEY=$MASTER_KEY npx node-credentials init
```

Your credentials.json it's encrypted, and generate credentials.json.key

Save the key value, and ignore this file in your version control.

```
echo credentials.json.key >> .gitignore
```

### Read credentials in runtime

```js
const { credentials } = require('node-credentials');

const apiKey = credentials.apiKey;
```

### Use in production

You can set a environment varible NODE_MASTER_KEY for decrypt secrets.

```
NODE_MASTER_KEY=my-credential-key server.js
```

### Edit credentials

For chage your credentials.json.enc you can decrypt and encrypt using the CLI

- Decrypt

```
npx node-credentials decrypt
# or
npx node-credentials edit
```

- Encrypt

```
npx node-credentials encrypt
```

### credentialsEnv

Return the value of credentials based on process.env.NODE_CREDENTIALS_ENV or process.env.NODE_ENV
Example:

```json
// credentials.json
{
  "development": {
    "key": "password_development"
  },
  "production": {
    "key": "password_production"
  }
}
```

- By default use development key

```js
const vault = require('node-credentials');

vault.credentials;
// { development: { key: "password_development" }, production: { key: "password_production" } }
vault.credentialsEnv;
// { key: "password_development" }
```

- Set custom environment

```json
// credentials.json
{
  "us": {
    "development": {
      "key": "development password for US country"
    }
  }
}
```

```
NODE_CREDENTIALS_ENV=us.development node main.js
```

```javascript
const vault = require('node-credentials');
vault.credentialsEnv;
// { key: "development password for US country" }
```

### Environment variable in credentials file

Some credentials it's not recomend set in credentials file, like production database password.

credentials file accept template variables for process env object

```json
// credentials.json
{
  "production": {
    "database": {
      "password": "<%= process.env.DATABASE_PASSWORD %>"
    }
  }
}
```
