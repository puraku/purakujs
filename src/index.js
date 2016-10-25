import { OAuth } from 'oauth';
import qs from 'qs';

export default class Puraku {
	constructor(opts = {}) {
		const {
			consumerKey,
			consumerSecret,
			accessToken,
			accessTokenSecret
		} = opts;

		this.consumerKey       = consumerKey;
		this.consumerSecret    = consumerSecret;
		this.accessToken       = accessToken;
		this.accessTokenSecret = accessTokenSecret;

		this.baseURL = 'https://www.plurk.com';

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
					params ? `${this.baseURL}${endpoint}?${qs.stringify(params)}` : `${this.baseURL}${endpoint}`,
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
					`${this.baseURL}${endpoint}`,
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
}
