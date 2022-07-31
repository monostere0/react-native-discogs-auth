import { DiscogsOAuthUtils } from './DiscogsOAuthUtils';

jest.mock('./DiscogsConfig');
jest.mock('expo-constants', () => ({
  manifest: {
    extra: {
      discogsConsumerKey: 'discogsConsumerKey',
      discogsConsumerSecret: 'discogsConsumerSecret',
    },
  },
}));
jest.mock('expo-linking', () => ({
  createURL: () => 'inapp://url',
}));

const mockDiscogsConfig = {
  oauth: {
    key: 'discogsConsumerKey',
    secret: 'discogsConsumerSecret',
    requestTokenUrl: 'https://test/requestToken',
    authorizeUrl: 'https://test/authorize',
    accessTokenUrl: 'https://test/accessToken',
  },
  appUserAgent: 'appUserAgent',
  storageAppId: 'storageAppId',
  apiBaseUrl: 'apiBaseUrl',
};

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date('2022-08-01'));
  Math.random = jest.fn(() => 0.5);
});

describe('DiscogsOAuthUtils', () => {
  const discogsOAuthUtils = new DiscogsOAuthUtils(mockDiscogsConfig as any);

  it('getAuthorizationHeaders()', () => {
    const headers = discogsOAuthUtils.getAuthorizationHeaders(
      'requestToken',
      'verifierToken',
      'storedToken'
    );

    expect(headers).toEqual(
      'OAuth oauth_consumer_key="discogsConsumerKey", oauth_nonce="c12b59e600", oauth_token=requestToken, oauth_signature="discogsConsumerSecret%26storedToken", oauth_signature_method="PLAINTEXT", oauth_timestamp="1659312000000", oauth_verifier="verifierToken"'
    );
  });

  it('getAppHeaders()', () => {
    const headers = discogsOAuthUtils.getAppHeaders('Basic foobar');

    expect(headers).toEqual({
      Accept: 'application/vnd.discogs.v2.plaintext+json',
      Authorization: 'Basic foobar',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'appUserAgent',
    });
  });

  it('getSecureHeaders()', () => {
    const headers = discogsOAuthUtils.getSecureHeaders({
      oauth_token: 'accessToken',
      oauth_token_secret: 'accessTokenSecret',
    });

    expect(headers).toEqual(
      'OAuth oauth_consumer_key="discogsConsumerKey", oauth_nonce="c12b59e600", oauth_signature="discogsConsumerSecret%26accessTokenSecret", oauth_signature_method="PLAINTEXT", oauth_timestamp="1659312000000", oauth_token="accessToken"'
    );
  });

  it('getInitialHeaders()', () => {
    const headers = discogsOAuthUtils.getInitialHeaders();

    expect(headers).toEqual(
      'OAuth oauth_consumer_key="discogsConsumerKey", oauth_nonce="c12b59e600", oauth_signature="discogsConsumerSecret&", oauth_signature_method="PLAINTEXT", oauth_timestamp="1659312000000", oauth_callback="inapp://url"'
    );
  });
});
