// App.js
import React, { useEffect, useState }      from 'react';
import { View, ActivityIndicator }         from 'react-native';
import { NavigationContainer }             from '@react-navigation/native';
import { createNativeStackNavigator }      from '@react-navigation/native-stack';
import { onAuthStateChanged }              from 'firebase/auth';
import { onSnapshot, doc }                 from 'firebase/firestore';
import { auth, db }                        from './firebaseConfig';

import LoginScreen         from './screens/LogInScreen';
import SignupScreen        from './screens/SignupScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import NavigationTabs      from './navigation/Navigation';
import ProfileScreen       from './screens/ProfileScreen';
import ScoreBoardScreen    from './screens/ScoreBoardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [hasTeams, setHasTeams]   = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let unsubSnap;
    const unsubAuth = onAuthStateChanged(auth, user => {
      setLoading(true);
      if (user) {
        setLoggedIn(true);
        unsubSnap = onSnapshot(doc(db,'users',user.uid), snap => {
          setHasTeams(!!snap.data()?.mainTeam);
          setLoading(false);
        });
      } else {
        setLoggedIn(false);
        setHasTeams(false);
        setLoading(false);
      }
    });
    return () => {
      unsubAuth();
      unsubSnap && unsubSnap();
    };
  }, []);

  if (loading) {
    return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color="#3498db"/></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {!loggedIn ? (
          <>
            <Stack.Screen name="Login"  component={LoginScreen}/>
            <Stack.Screen name="Signup" component={SignupScreen}/>
          </>
        ) : !hasTeams ? (
          <Stack.Screen name="TeamSelection" component={TeamSelectionScreen} options={{headerShown:true,title:'Select Teams'}}/>
        ) : (
          <>
            <Stack.Screen name="Main" component={NavigationTabs}/>
            <Stack.Screen name="Profile"    component={ProfileScreen} options={{headerShown:true,title:'My Profile'}}/>
            <Stack.Screen name="Scoreboard" component={ScoreBoardScreen} options={{headerShown:true,title:'Scoreboard'}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
