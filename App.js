import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Text, View } from 'react-native';

// Temporary screens

function HomeScreen() { return <View><Text>Home</Text></View> }

function ChatScreen() { return <View><Text>Chats</Text></View> }

function ScoreBoardScreen() { return <View><Text>Score Board</Text></View> }

function ShopScreen() { return <View><Text>Shop</Text></View> }

const Tab = createBottomTabNavigator();

export default function App() {

  return (

    <NavigationContainer>

      <Tab.Navigator>

        <Tab.Screen name="Home" component={HomeScreen} />

        <Tab.Screen name="Chats" component={ChatScreen} />

        <Tab.Screen name="Score Board" component={ScoreBoardScreen} />

        <Tab.Screen name="Shop" component={ShopScreen} />

      </Tab.Navigator>

    </NavigationContainer>

  );

}
