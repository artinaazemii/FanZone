import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc, getFirestore } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './screens/LogInScreen';
import SignupScreen from './screens/SignupScreen';
import NavigationTabs from './navigation/Navigation';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScoreboardScreen from './screens/ScoreBoardScreen'; // ✅ import scoreboard
import { enableScreens } from 'react-native-screens';

enableScreens(); // Performance boost for navigation

const Stack = createNativeStackNavigator();
const db = getFirestore();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSelectedTeams, setHasSelectedTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeFromSnapshot;
    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        const userRef = doc(db, 'users', user.uid);
        unsubscribeFromSnapshot = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists() && docSnapshot.data().mainTeam) {
            setHasSelectedTeams(true);
          } else {
            setHasSelectedTeams(false);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setHasSelectedTeams(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromSnapshot) unsubscribeFromSnapshot();
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : !hasSelectedTeams ? (
          <Stack.Screen name="TeamSelection" component={TeamSelectionScreen} />
        ) : (
          <>
            <Stack.Screen name="MainApp" component={NavigationTabs} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: 'My Profile',
              }}
            />
            <Stack.Screen
              name="Scoreboard"
              component={ScoreboardScreen}
              options={{
                headerShown: true,
                title: 'Scoreboard',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
