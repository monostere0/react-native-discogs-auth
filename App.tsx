import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { discogsFetch } from './lib/DiscogsOAuth';

export default function App() {
  const [data, setData] = useState(null);

  const getDiscogsIdentity = async () => {
    const response = await discogsFetch('oauth/identity');
    const json = await response.json();
    console.log(data);
    setData(json);
  };

  return (
    <View style={styles.container}>
      <Button onPress={getDiscogsIdentity} title="Login with Discogs" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
