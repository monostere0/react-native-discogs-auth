import { DiscogsOAuthData, DiscogsAppHeaders } from './interfaces';
import discogsConfig, { DiscogsConfig } from './DiscogsConfig';
import * as Linking from 'expo-linking';

export class DiscogsOAuthUtils {
  constructor(private config: DiscogsConfig) {}

  public getAuthorizationHeaders(
    token: string,
    verifier: string,
    storedTokenSecret: string
  ): string {
    const date = new Date();

    return [
      `OAuth oauth_consumer_key="${this.config.oauth.key}"`,
      `oauth_nonce="${this.getNonce(date)}"`,
      `oauth_token=${token}`,
      `oauth_signature="${this.percentEncode(
        `${this.config.oauth.secret}&${storedTokenSecret}`
      )}"`,
      'oauth_signature_method="PLAINTEXT"',
      `oauth_timestamp="${date.getTime()}"`,
      `oauth_verifier="${verifier}"`,
    ].join(', ');
  }

  public getAppHeaders(oauthHeaders: string): HeadersInit {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/vnd.discogs.v2.plaintext+json',
      Authorization: oauthHeaders,
      'User-Agent': this.config.appUserAgent,
    };
  }

  public getSecureHeaders(oAuthObject: DiscogsOAuthData): string {
    const date = new Date();

    return [
      `OAuth oauth_consumer_key="${this.config.oauth.key}"`,
      `oauth_nonce="${this.getNonce(date)}"`,
      `oauth_signature="${this.percentEncode(
        `${this.config.oauth.secret}&${oAuthObject.oauth_token_secret}`
      )}"`,
      'oauth_signature_method="PLAINTEXT"',
      `oauth_timestamp="${date.getTime()}"`,
      `oauth_token="${oAuthObject.oauth_token}"`,
    ].join(', ');
  }

  public getInitialHeaders(): string {
    const date = new Date();

    return [
      `OAuth oauth_consumer_key="${this.config.oauth.key}"`,
      `oauth_nonce="${this.getNonce(date)}"`,
      `oauth_signature="${this.percentEncode(this.config.oauth.secret)}&"`,
      'oauth_signature_method="PLAINTEXT"',
      `oauth_timestamp="${date.getTime()}"`,
      `oauth_callback="${Linking.createURL('')}"`,
    ].join(', ');
  }

  private getNonce(date: Date): string {
    return Math.round(date.getTime() * Math.random()).toString(16);
  }

  private percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/\*/g, '%2A')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
  }
}

export default new DiscogsOAuthUtils(discogsConfig);
