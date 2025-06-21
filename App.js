import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

import { CoinProvider } from './context/CoinContext';
import { TeamProvider } from './context/TeamContext';

import LoginScreen         from './screens/LogInScreen';
import SignupScreen        from './screens/SignupScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import NavigationTabs      from './navigation/Navigation';
import ProfileScreen       from './screens/ProfileScreen';
import ScoreBoardScreen    from './screens/ScoreBoardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasTeams, setHasTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mainTeam, setMainTeam] = useState(null); // <-- Add this state

  useEffect(() => {
    let unsubSnap;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true);

      if (user) {
        setLoggedIn(true);

        const userDocRef = doc(db, 'users', user.uid);
        unsubSnap = onSnapshot(userDocRef, (snap) => {
          setHasTeams(!!snap.data()?.mainTeam);
          setMainTeam(snap.data()?.mainTeam || null); // <-- Store mainTeam!
          setLoading(false);
        }, (error) => {
          console.error("onSnapshot error:", error.message);
          setLoading(false);
        });

      } else {
        if (unsubSnap) unsubSnap();
        setLoggedIn(false);
        setHasTeams(false);
        setMainTeam(null); // <-- Clear mainTeam on logout
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <TeamProvider>
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
                {/* Pass mainTeam as a prop! */}
                <Stack.Screen name="Main">
                  {() => <NavigationTabs mainTeam={mainTeam} />}
                </Stack.Screen>
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: true, title: 'My Profile' }}
                />
                <Stack.Screen
                  name="Scoreboard"
                  component={ScoreBoardScreen}
                  options={{ headerShown: true, title: 'Scoreboard' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CoinProvider>
    </TeamProvider>
  );
}