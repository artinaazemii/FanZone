
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './screens/LogInScreen';
import SignupScreen from './screens/SignupScreen';
import NavigationTabs from './navigation/Navigation'; // Import your tab navigation
import TeamSelectionScreen from './screens/TeamSelectionScreen'; // Import the team selection screen
import ProfileScreen from './screens/ProfileScreen'; // Import the profile screen

const Stack = createNativeStackNavigator();
const db = getFirestore(); // Initialize Firestore

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSelectedTeams, setHasSelectedTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        
        // Check if user has selected teams
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().mainTeam) {
            setHasSelectedTeams(true);
          } else {
            setHasSelectedTeams(false);
          }
        } catch (error) {
          console.error('Error checking user data:', error);
          setHasSelectedTeams(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setHasSelectedTeams(false);
      }
      
      setLoading(false);
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
          // User is logged in
          !hasSelectedTeams ? (
            // Show team selection screen if user hasn't selected teams
            <Stack.Screen 
              name="TeamSelection" 
              component={TeamSelectionScreen} 
              options={{ headerShown: false }}
            />
          ) : (
            // Show the main app navigation if user has selected teams
            <>
              <Stack.Screen name="MainApp" component={NavigationTabs} />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ 
                  headerShown: true,
                  title: 'My Profile'
                }}
              />
            </>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}