import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import HomeScreen from './screens/HomeScreen';

const Tab = createBottomTabNavigator();

const logo = require('./assets/logo.png');


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

export default function App() {
  return (
    <NavigationContainer>
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
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: 'center',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chats" component={ChatScreen} />
        <Tab.Screen name="Score Board" component={ScoreBoardScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
      </Tab.Navigator>
    </NavigationContainer>
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
});