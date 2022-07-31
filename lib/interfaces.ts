export interface OAuth {
  key: string;
  secret: string;
  requestTokenUrl: string;
  authorizeUrl: string;
  accessTokenUrl: string;
}

export interface JSONConfig {
  oauth: OAuth;
  appUserAgent: string;
  storageAppId: string;
  apiBaseUrl: string;
}

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
