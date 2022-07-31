export interface DiscogsOAuthData {
  oauth_token: string;
  oauth_token_secret: string;
}

export interface DiscogsAppHeaders {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
  'User-Agent': string;
}
