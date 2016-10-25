# purakujs - a javascript plurk api client library in ES6

[![npm version](https://badge.fury.io/js/purakujs.svg)](https://badge.fury.io/js/purakujs)

A javascript plurk api client library written in ES6.

## Install

```bash
npm install purakujs --save
```

## Usage

```javascript
import Puraku from 'purakujs';

let client = new Puraku({
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET
});

client.getRequestToken().then(({oauthToken, oauthTokenSecret}) => {
  // open this url in Browser and accept the authentication request
  // Plurk then give user a 6-digit pin code
  loadURL(`http://www.plurk.com/OAuth/authorize?oauth_token=${oauthToken}`);

  // get pin code from user input or some injected script
  let oauthVerifier = getPinCode();

  client.getOAuthAccessToken({oauthToken, oauthTokenSecret, oauthVerifier}).then(() => {
    // then api client is ready to call api endpoint
    client.request('GET', '/APP/Users/me').then(({data}) => {
      console.log(data);
    });
  });
});

```

## Development

```bash
npm install
npm run dev
```

## License

MIT
