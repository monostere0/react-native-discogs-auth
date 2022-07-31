import { DiscogsConfig } from './DiscogsConfig';

jest.mock('expo-constants', () => ({
  manifest: {
    extra: {
      discogsConsumerKey: 'discogsConsumerKey',
      discogsConsumerSecret: 'discogsConsumerSecret',
    },
  },
}));

describe('DiscogsConfig', () => {
  it('should return the correct values', () => {
    const config = {
      oauth: {
        key: 'consumerKey',
        secret: 'consumerSecret',
        requestTokenUrl: 'https://test/requestToken',
        authorizeUrl: 'https://test/authorize',
        accessTokenUrl: 'https://test/accessToken',
      },
      appUserAgent: 'appUserAgent',
      storageAppId: 'storageAppId',
      apiBaseUrl: 'apiBaseUrl',
    };

    const discogsConfig = new DiscogsConfig(config);

    expect(discogsConfig.oauth).toEqual({
      key: 'discogsConsumerKey',
      secret: 'discogsConsumerSecret',
      requestTokenUrl: 'https://test/requestToken',
      authorizeUrl: 'https://test/authorize',
      accessTokenUrl: 'https://test/accessToken',
    });
    expect(discogsConfig.appUserAgent).toEqual('appUserAgent');
    expect(discogsConfig.storageAppId).toEqual('storageAppId');
    expect(discogsConfig.apiBaseUrl).toEqual('apiBaseUrl');
  });
});
