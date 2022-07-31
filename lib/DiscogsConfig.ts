import discogsConfig from '../discogs.config.json';
import Constants from 'expo-constants';

interface OAuth {
  key: string;
  secret: string;
  requestTokenUrl: string;
  authorizeUrl: string;
  accessTokenUrl: string;
  callbackUrl: string;
}

enum Endpoints {
  identity = 'oauth/identity',
}

export class DiscogsConfig {
  public readonly oauth: OAuth;
  public readonly baseUrl = 'https://api.discogs.com';
  public readonly endpoints: Endpoints;
  public readonly appUserAgent: string;
  public readonly storageAppId: string;

  constructor() {
    this.oauth = Object.assign({}, discogsConfig.oauth, {
      key: Constants.manifest?.extra?.discogsConsumerKey,
      secret: Constants.manifest?.extra?.discogsConsumerSecret,
    });
    this.appUserAgent = discogsConfig.appUserAgent;
    this.storageAppId = discogsConfig.storageAppId;
  }
}

export default new DiscogsConfig();
