import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc, getFirestore } from 'firebase/firestore';
import { auth } from './firebaseConfig';

// Import your screens
import LoginScreen from './screens/LogInScreen';
import SignupScreen from './screens/SignupScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import NavigationTabs from './navigation/Navigation';
import ProfileScreen from './screens/ProfileScreen';
import ScoreboardScreen from './screens/ScoreBoardScreen';

// Optional performance boost
import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createNativeStackNavigator();
const db = getFirestore();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSelectedTeams, setHasSelectedTeams] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFromSnapshot = null;
    const unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsLoggedIn(true);
        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeFromSnapshot = onSnapshot(userRef, (docSnapshot) => {
          const data = docSnapshot.data();
          setHasSelectedTeams(!!(data && data.mainTeam));
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

  // Show loading spinner while auth state resolves
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
