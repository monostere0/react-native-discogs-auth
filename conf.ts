import Constants from 'expo-constants';

export default {
  discogs: {
    oauth: {
      key: Constants.manifest?.extra?.discogsConsumerKey,
      secret: Constants.manifest?.extra?.discogsConsumerSecret,
      requestTokenUrl: 'https://api.discogs.com/oauth/request_token',
      authorizeUrl: 'https://discogs.com/oauth/authorize?oauth_token=',
      accessTokenUrl: 'https://api.discogs.com/oauth/access_token',
      callbackUrl: 'doauthex://',
    },
    apiUrl: 'https://api.discogs.com/',
    endpoints: {
      identity: 'oauth/identity',
    },
    records_per_page: 20,
  },
  app_user_agent: 'Discogs-Auth-Example/1.0',
  storage_app_id: '@DiscogsAuthExample:',
};
