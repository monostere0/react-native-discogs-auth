import { DiscogsOAuth } from './DiscogsOAuth';
import { DiscogsOAuthUtils } from './DiscogsOAuthUtils';

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
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  openURL: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve('{"oauth_token": "oauth_token"}')),
}));

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date('2022-08-01'));
  (global.fetch as any) = jest.fn(() =>
    Promise.resolve({
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/vnd.discogs.v2.plaintext+json',
      },
      body: '{"foo":"bar"}',
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
  Math.random = jest.fn(() => 0.5);
});

afterAll(() => {
  jest.useRealTimers();
});

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

describe('DiscogsOAuth', () => {
  it('fetch()', async () => {
    const discogsOAuth = new DiscogsOAuth(
      mockDiscogsConfig as any,
      new DiscogsOAuthUtils(mockDiscogsConfig as any)
    );

    const response = await discogsOAuth.fetch('https://test/url', {
      method: 'GET',
      headers: {
        Authorization: 'Basic foobar',
      },
    });

    expect(global.fetch).toHaveBeenCalledWith('apiBaseUrlhttps://test/url', {
      headers: {
        Accept: 'application/vnd.discogs.v2.plaintext+json',
        Authorization:
          'OAuth oauth_consumer_key="discogsConsumerKey", oauth_nonce="c12b59e600", oauth_signature="discogsConsumerSecret%26undefined", oauth_signature_method="PLAINTEXT", oauth_timestamp="1659312000000", oauth_token="oauth_token"',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'appUserAgent',
      },
      method: 'GET',
    });

    expect(response).toEqual(
      expect.objectContaining({
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.discogs.v2.plaintext+json',
        },
        body: '{"foo":"bar"}',
      })
    );
  });
});
