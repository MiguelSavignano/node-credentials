# Node encrypted secrets

Manage your secrets with single entrypted file.
Inspired in [Rails encrypted secrets management](https://rubyinrails.com/2018/02/24/rails-5-1-encrypted-secrets-management-feature/)

## Install

```
npm install node-credentials --save
```

## Usage

### Encrypt and decrypt json|yaml files

```yaml
# credentials.yaml
username: user
password': myPassword
```

- Encrypt

```
NODE_MASTER_KEY=$MASTER_KEY npx node-credentials encrypt --path credentials.yaml
```

Only encrypted object values.

```yaml
username: sGPi7jVJFORTBSOOKx5nMw==--eYed5TIh3D+9rjN/usOB0w==
password: +C4M+xFxOQXTyvPJ7QSJuQ==--eYed5TIh3D+9rjN/usOB0w==
```

- Decrypt

```
NODE_MASTER_KEY=$MASTER_KEY npx node-credentials decrypt --path credentials.yaml
```

## Setup for NodeJs projects

Create a credentials.json or credentials.yaml file

Example:

```yaml
publicKey: publicValue # no-encrypt
myApiKey: apiKey
myApiSecret: apiSecret
```

or

```json
{
  "publicKey": "publicValue",
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

Your credentials file it's encrypted, and generate credentials key file

Save the key value, and ignore this file in your version control.

```
echo credentials.yaml.key >> .gitignore
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

The edit command allow to edit the file in a text editor; decrypting before open the file and encrypting after close the file.

```
EDITOR=nano npx node-credentials edit
```

### credentialsEnv

Return the value of credentials based on process.env.NODE_CREDENTIALS_ENV or process.env.NODE_ENV
Example:

```yaml
default: &default
  user: myuser
development:
  <<: *default
  key: password_development
production:
  <<: *default
  key: password_production
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

```yaml
us:
  development:
    key: development password for US country
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

```yaml
production:
  database:
    password: <%= process.env.DATABASE_PASSWORD %>
```

### Custom master key environment variable

Allow set custom environment variable to encrypt/decrypt secrets

Example using `NPM_TOKEN`

```
export NODE_MASTER_KEY_NAME=NPM_TOKEN
NPM_TOKEN=$NPM_TOKEN npx node-credentials init
```

## CLI API

```
Command List

  help      help
  init      encrypt your credentials file and create a credentials key file
  encrypt   encrypt credentials file
  decrypt   decrypt credentials file
  edit      decrypt/encrypt in text editor

Options

  -p, --path   Path for credentials file
```
