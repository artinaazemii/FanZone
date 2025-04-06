import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const logo = require('../assets/logo.png');

const handleLogout = () => {
  signOut(auth).catch((error) => {
    console.error("Error signing out: ", error);
  });
};

function CustomHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
}

function ChatScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Chats</Text>
    </View>
  );
}

function ScoreBoardScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Score Board</Text>
    </View>
  );
}

function ShopScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Shop</Text>
    </View>
  );
}

export default function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chats') {
            iconName = 'comments';
          } else if (route.name === 'Score Board') {
            iconName = 'soccer-ball-o';
          } else if (route.name === 'Shop') {
            iconName = 'shopping-cart';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="Chats" component={ChatScreen} />
      <Tab.Screen name="Score Board" component={ScoreBoardScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 70,
    resizeMode: 'contain',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: 'green', // Green background
    borderWidth: 0.5,      // Adds a border
    borderColor: 'black',    // Black border color
    borderRadius: 5,         // Rounds the button corners slightly
    paddingVertical: 5,      // Padding for top and bottom
    paddingHorizontal: 10,   // Padding for sides
  },
  
  signOutButtonText: {
    color: 'black',          // Black text color
    fontSize: 12,          // Text size
    textAlign: 'center',     // Centers the text inside the button
  },
  
});
