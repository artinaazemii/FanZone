// screens/ChatScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ScoreBoard() {
  return (
    <View style={styles.container}>
      <Text>Chat Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ScoreBoard;
