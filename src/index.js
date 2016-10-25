import { OAuth } from 'oauth';

export default class Puraku {
	constructor(opts = {}) {
		const {
			consumerKey,
			consumerSecret
		} = opts;

		this.consumerKey = consumerKey;
		this.consumerSecret = consumerSecret;

		this.oauthClient = new OAuth(
			'http://www.plurk.com/OAuth/request_token',
			'http://www.plurk.com/OAuth/access_token',
			consumerKey,
			consumerSecret,
			'1.0A',
			null,
			'HMAC-SHA1'
		);
	}

	getRequestToken(callback) {
		this.oauthClient.getOAuthRequestToken(callback);
	}

	getOAuthAccessToken({oauthToken, oauthTokenSecret, oauthVerifier}, callback) {
		this.oauthClient.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, (error, accessToken, accessTokenSecret) => {
			this.accessToken = accessToken;
			this.accessTokenSecret = accessTokenSecret;
			callback({accessToken, accessTokenSecret});
		});
	}
}
