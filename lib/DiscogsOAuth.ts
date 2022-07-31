import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import qs from 'query-string';

import discogsConfig, { DiscogsConfig } from './DiscogsConfig';
import discogsOAuthUtils, { DiscogsOAuthUtils } from './DiscogsOAuthUtils';
import { DiscogsOAuthData } from './interfaces';

class DiscogsOAuth {
  private oAuthData: DiscogsOAuthData;
  private oAuthTokenSecret: string;

  constructor(
    private config: DiscogsConfig,
    private utils: DiscogsOAuthUtils
  ) {}

  public async fetch(
    url: string,
    config: Record<string, any>
  ): Promise<Response> {
    const itemData = await AsyncStorage.getItem(
      `${this.config.storageAppId}oauthToken`
    );
    const oAuthToken = JSON.parse(itemData!);

    if (oAuthToken && oAuthToken.oauth_token) {
      this.oAuthData = oAuthToken;
      return this.oAuthEnabledFetch(url, config);
    }

    await this.startOAuthFlow();
    return this.oAuthEnabledFetch(url, config);
  }

  private async oAuthEnabledFetch(
    url: string,
    config: Record<string, any> = {}
  ): Promise<Response> {
    console.log('OAD', this.oAuthData);
    const secureConfig = Object.assign(config, {
      headers: this.utils.getAppHeaders(
        this.utils.getSecureHeaders(this.oAuthData)
      ),
    });

    return fetch(url, secureConfig as Record<string, any>);
  }

  private async startOAuthFlow(): Promise<void> {
    const oAuthResponse = await this.initialize();
    await this.redirectToLogin(
      `${this.config.oauth.authorizeUrl}${oAuthResponse.oauth_token}`
    );
  }

  private async initialize() {
    const response = await fetch(this.config.oauth.requestTokenUrl, {
      method: 'GET',
      headers: this.utils.getAppHeaders(this.utils.getInitialHeaders()),
    });
    const parsedQs = await this.getResolveAndParsedQs(response);
    this.oAuthTokenSecret = parsedQs.oauth_token_secret;

    return parsedQs;
  }

  private redirectToLogin(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const urlListener = (event: any) => {
        console.log('urlEvent', event);
        const urlQueryString = event.url.match(/(\w*=\w*)+/g).join('&');
        const { oauth_token, oauth_verifier } = qs.parse(urlQueryString);
        this.authorizeAndStoreToken(oauth_token, oauth_verifier).then(
          resolve,
          reject
        );
        Linking.removeEventListener('url', urlListener);
      };

      Linking.addEventListener('url', urlListener);
      this.openURL(url).catch(reject);
    });
  }

  private async authorizeAndStoreToken(token: string, verifier: string) {
    await this.authorize(token, verifier);
    const response = await this.getAccessToken(token, verifier);
    this.oAuthData = response as any;
    console.log('oAuthData', response);
    await AsyncStorage.setItem(
      `${this.config.storageAppId}oauthToken`,
      JSON.stringify(response)
    );
  }

  private async authorize(token: string, verifier: string) {
    const response = await fetch(this.config.oauth.requestTokenUrl, {
      method: 'GET',
      headers: this.utils.getAppHeaders(
        this.utils.getAuthorizationHeaders(
          token,
          verifier,
          this.oAuthTokenSecret
        )
      ),
    });
    const parsedQs = await this.getResolveAndParsedQs(response);

    return parsedQs;
  }

  private async getAccessToken(token: string, verifier: string) {
    const response = await fetch(this.config.oauth.accessTokenUrl, {
      method: 'GET',
      headers: this.utils.getAppHeaders(
        this.utils.getAuthorizationHeaders(
          token,
          verifier,
          this.oAuthTokenSecret
        )
      ),
    });
    const parsedQs = await this.getResolveAndParsedQs(response);

    return parsedQs;
  }

  private async openURL(url: string) {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      throw new Error('DiscogsOAuth.openURL is not openable');
    }
  }

  private async getResolveAndParsedQs(
    response: Response
  ): Promise<Record<string, any>> {
    const text = await response.text();
    return qs.parse(text);
  }
}

export const discogsFetch = (url: string, config: Record<any, string> = {}) =>
  new DiscogsOAuth(discogsConfig, discogsOAuthUtils).fetch(url, config);
