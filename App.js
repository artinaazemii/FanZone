// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { auth, db } from './firebaseConfig';
import { CoinProvider } from './context/CoinContext';

/* Screens */
import LoginScreen from './screens/LogInScreen';
import SignupScreen from './screens/SignupScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import NavigationTabs from './navigation/Navigation'; // ← contains tabs + stack

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasTeams, setHasTeams] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnap;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true);

      if (user) {
        setLoggedIn(true);
        const userDocRef = doc(db, 'users', user.uid);

        unsubSnap = onSnapshot(
          userDocRef,
          (snap) => {
            setHasTeams(!!snap.data()?.mainTeam);
            setLoading(false);
          },
          (error) => {
            console.error("onSnapshot error:", error.message);
            setLoading(false);
          }
        );
      } else {
        if (unsubSnap) unsubSnap();
        setLoggedIn(false);
        setHasTeams(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnap) unsubSnap();
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <CoinProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!loggedIn ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
              </>
            ) : !hasTeams ? (
              <Stack.Screen
                name="TeamSelection"
                component={TeamSelectionScreen}
                options={{ headerShown: true, title: 'Select Teams' }}
              />
            ) : (
              <>
                <Stack.Screen name="Main" component={NavigationTabs} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CoinProvider>
    </SafeAreaProvider>
  );
}
