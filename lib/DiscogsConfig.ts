import Constants from 'expo-constants';
import discogsConfig from '../discogs.config.json';
import { OAuth, JSONConfig } from './interfaces';

enum Endpoints {
  identity = 'oauth/identity',
}

export class DiscogsConfig {
  public readonly oauth: OAuth;
  public readonly apiBaseUrl: string;
  public readonly endpoints: Endpoints;
  public readonly appUserAgent: string;
  public readonly storageAppId: string;

  constructor(config: JSONConfig) {
    this.oauth = Object.assign({}, config.oauth, {
      key: Constants.manifest?.extra?.discogsConsumerKey,
      secret: Constants.manifest?.extra?.discogsConsumerSecret,
    });
    this.appUserAgent = config.appUserAgent;
    this.storageAppId = config.storageAppId;
    this.apiBaseUrl = config.apiBaseUrl;
  }
}

export default new DiscogsConfig(discogsConfig as JSONConfig);
