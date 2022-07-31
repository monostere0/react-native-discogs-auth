import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { discogsFetch } from './lib/DiscogsOAuth';

export default function App() {
  const [data, setData] = useState('');

  const getDiscogsIdentity = async () => {
    const response = await discogsFetch('oauth/identity');
    const json = await response.json();
    setData(json);
  };

  const clearLocalStorage = () => {
    setData('');
    AsyncStorage.clear();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={getDiscogsIdentity} style={styles.button}>
        <Text>Retrieve Identity Data</Text>
      </TouchableOpacity>
      <Text />
      <TouchableOpacity onPress={clearLocalStorage} style={styles.button}>
        <Text>Clear local oauth token</Text>
      </TouchableOpacity>
      <Text />
      <Text>Identity data:</Text>
      <Text />
      <Text style={{ marginHorizontal: 50 }}>
        {data ? JSON.stringify(data) : 'Not retrieved yet.'}
      </Text>
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
  button: {
    padding: 10,
    borderWidth: 1,
  },
});
