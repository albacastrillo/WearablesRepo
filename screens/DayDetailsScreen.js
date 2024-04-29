// DayDetailsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DayDetailsScreen({ route }) {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data for selected day:</Text>
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});