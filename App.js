import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import LoginScreen from './screens/LogInScreen';
import SignupScreen from './screens/SignupScreen';
import NavigationTabs from './navigation/Navigation'; // Import your tab navigation

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update login state
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Show Login and Signup screens if not logged in
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // Show the main app navigation (tab navigation) if logged in
          <Stack.Screen name="MainApp" component={NavigationTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}