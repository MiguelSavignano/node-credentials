const ENCRYPTED_CREDENTIALS_BY_COUNTRY = {
  es: {
    development: {
      myKey: 'FDeejskyJNoZmRmQTPREHA==--SlFF0O9iHgKpcds+/6nbEg==',
    },
    test: {
      myKey: 'QWSC50SjwkuJPKd4ai28/SDMwnBFQk65NtGULitfdpE=--SlFF0O9iHgKpcds+/6nbEg==',
    },
    production: {
      myKey: 'Ij51M8OJbccvCuQXpspk6ElWDE7lcKZlbOibkbYyOe4Zwos+g023c8gqLGkdQslA--SlFF0O9iHgKpcds+/6nbEg==',
    },
  },
  en: {
    development: {
      myKey: 'kFfqQ4FhBmaRKELWa8oI3g==--SlFF0O9iHgKpcds+/6nbEg==',
    },
    test: {
      myKey: 'rQBESsoUIctZrvPFAp+NZNHiSXwz4qP4fdMmslS4tHY=--SlFF0O9iHgKpcds+/6nbEg==',
    },
    production: {
      myKey: 'Ij51M8OJbccvCuQXpspk6ElWDE7lcKZlbOibkbYyOe4Zwos+g023c8gqLGkdQslA--SlFF0O9iHgKpcds+/6nbEg==',
    },
  },
};
const ENCRYPTED_CREDENTIALS = {
  myKey: 'Gum+XHqHtKmFG5kojUpAZg==--gxV2qVVHRWNn9AqrSQ6MTA==',
  myKeyEnv: 'yTwUP5dm9regseZ4KSiIeqp2fgLhSmW0FmzsFNpWvcQk6jmMyStKkDknXm0WxsO2--gxV2qVVHRWNn9AqrSQ6MTA==',
};

const DECRYPTED_CREDENTIALS = {
  myKey: 'password',
  myKeyEnv: '<%= process.env.ENV_CREDENTIAL %>',
};

module.exports = {
  ENCRYPTED_CREDENTIALS_BY_COUNTRY,
  ENCRYPTED_CREDENTIALS,
  DECRYPTED_CREDENTIALS,
};
