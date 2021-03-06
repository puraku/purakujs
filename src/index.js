import { OAuth } from 'oauth';
import qs from 'qs';

const BASE_URL = 'https://www.plurk.com';

export default class Puraku {
	constructor({consumerKey, consumerSecret, accessToken, accessTokenSecret}) {
		this.consumerKey       = consumerKey;
		this.consumerSecret    = consumerSecret;
		this.accessToken       = accessToken;
		this.accessTokenSecret = accessTokenSecret;

		this.oauthClient = new OAuth(
			'https://www.plurk.com/OAuth/request_token',
			'https://www.plurk.com/OAuth/access_token',
			consumerKey,
			consumerSecret,
			'1.0A',
			null,
			'HMAC-SHA1'
		);
	}

	getRequestToken() {
		return new Promise((resolve, reject) => {
			const callback = (error, oauthToken, oauthTokenSecret, results) => {
				if (error) {
					reject(error);
				} else {
					resolve({oauthToken, oauthTokenSecret, results});
				}
			};

			this.oauthClient.getOAuthRequestToken(callback);
		});
	}

	getOAuthAccessToken({oauthToken, oauthTokenSecret, oauthVerifier}) {
		return new Promise((resolve, reject) => {
			const callback = (error, accessToken, accessTokenSecret) => {
				if (error) {
					reject(error);
				} else {
					this.accessToken = accessToken;
					this.accessTokenSecret = accessTokenSecret;

					resolve({accessToken, accessTokenSecret});
				}
			};

			this.oauthClient.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, callback);
		});
	}

	request(method='GET', endpoint, params=null) {
		return new Promise((resolve, reject) => {
			const callback = (error, data, response) => {
				if (error) {
					reject(error);
				} else {
					resolve({data, response});
				}
			};

			switch(method) {
			case 'GET':
			case 'DELETE':
				this.oauthClient._performSecureRequest(
					this.accessToken,
					this.accessTokenSecret,
					method,
					params ? `${BASE_URL}${endpoint}?${qs.stringify(params)}` : `${BASE_URL}${endpoint}`,
					null,
					'',
					null,
					callback
				);
				break;

			case 'PUT':
			case 'POST':
				this.oauthClient._putOrPost(
					method,
					`${BASE_URL}${endpoint}`,
					this.accessToken,
					this.accessTokenSecret,
					params,
					'application/json',
					callback
				);
				break;
			default:
				throw('Unsupported HTTP verb');
			}
		});
	}

	static authorizationEndpoint({oauthToken: oauth_token, deviceID: deviceid, model}) {
		let params = {
			oauth_token,
			deviceid,
			model
		};

		return `${BASE_URL}/OAuth/authorize?${qs.stringify(params)}`;
	}
}
