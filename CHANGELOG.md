### v1.1.0

- Allow use credentials file with yaml sintax

### v1.0.0

- Remove credentials.json.enc use the same credentials.json file to encrypt or decrypt.
- Allow edit credentials in a text editor can decrypt before opening the file and encrypt after closing the file.

```
EDITOR=nano npx node-credentials edit
```

Breaking change:

Should decrypt the credentials.json.enc before update node-credentials version.

### v0.6.1

- Remove unused npm packages

### v0.6.0

- Allow decrypt or encrypt with edit command [#22](https://github.com/MiguelSavignano/node-credentials/pull/22)

### v0.5.0

- Encrypt with any key length #20
- Add more typescripts definitions

### v0.4.0

- Encrypt json values with he same iv.
- credentialsEnv with multiple environments #19.
- Auto configure when call credentials #18.

### v0.3.0

- Encrypt only json values not keys.

### v0.2.1

- manage customs environment with NODE_CREDENTIALS_ENV

### v0.2.0

- credentialsEnv read credentials based on the Node environment varaible.

### v0.1.4

- Fixed CLI bugs

### v0.1.3

- Fixed default path in CLI

### v0.1.2

- Use diferent credentials path

### v0.1.1

- Encrypt, decrypt, config and read credentials.
