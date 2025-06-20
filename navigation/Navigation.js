// navigation/Navigation.js
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';

/* screens (imports unchanged) */
import HomeScreen            from '../screens/HomeScreen';
import ScoreBoardScreen      from '../screens/ScoreBoardScreen';
import ProfileScreen         from '../screens/ProfileScreen';
import StoreScreen           from '../screens/StoreScreen';
import TeamProductsScreen    from '../screens/TeamProductsScreen';
import ProductDetailScreen   from '../screens/ProductDetailScreen';
import CartScreen            from '../screens/CartScreen';
import DeliveryDetailsScreen from '../screens/DeliveryDetailsScreen';
import ChatListScreen        from '../screens/ChatListScreen';
import TeamChatScreen        from '../screens/TeamChatScreen';
import MatchingPairsScreen   from '../screens/MatchingPairsScreen';
import QuizzesScreen         from '../screens/QuizzesScreen';
import QuizGameScreen        from '../screens/QuizGameScreen';
import ProfileIcon           from '../screens/ProfileIcon';

import { useCoins } from '../context/CoinContext';

/* assets */
const logo = require('../assets/logo.png');
const coin = require('../assets/coin.png');

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ─────── HEADER HELPERS ─────── */
function CustomHeader() {
  return <Image source={logo} style={styles.logo} />;
}
function CoinBadge() {
  const { coins } = useCoins();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', marginRight: 4, color: '#fff' }}>
        {coins ?? 0}
      </Text>
      <Image source={coin} style={{ width: 16, height: 16 }} />
    </View>
  );
}
const HeaderRight = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
    <CoinBadge />
    <View style={{ width: 10 }} />
    <ProfileIcon size={30} />
  </View>
);

/* ─────── TABS (blur footer) ─────── */
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        /* glass footer */
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.25)',
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#c0c0c0',

        /* icons */
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          if (route.name === 'Home')           icon = 'home';
          else if (route.name === 'Chats')     icon = 'comments';
          else if (route.name === 'Score Board') icon = 'soccer-ball-o';
          else if (route.name === 'Store')     icon = 'shopping-cart';
          return <FontAwesome name={icon} size={size} color={color} />;
        },

        /* glass header (non-transparent) */
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: 'rgba(0,0,0,0.25)' },
        headerBlurEffect: 'dark',                // iOS
        headerTitle: () => <CustomHeader />,
        headerTitleAlign: 'center',
        headerRight: HeaderRight,
      })}
    >
      <Tab.Screen name="Home"        component={HomeScreen} />
      <Tab.Screen name="Chats"       component={ChatListScreen} />
      <Tab.Screen name="Score Board" component={ScoreBoardScreen} />
      <Tab.Screen name="Store"       component={StoreScreen} />
    </Tab.Navigator>
  );
}

/* ─────── STACK ─────── */
export default function Navigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        /* glass header for every pushed screen */
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: 'rgba(0,0,0,0.25)' },
        headerBlurEffect: 'dark',
        headerRight: HeaderRight,
      }}
    >
      <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />

      {/* —— Games —— */}
      <Stack.Screen name="MatchingPairs" component={MatchingPairsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quizzes"       component={QuizzesScreen}       options={{ headerShown: false }} />
      <Stack.Screen
        name="QuizGame"
        component={QuizGameScreen}
        options={({ route, navigation }) => ({
          headerTitle: route.params?.quiz?.title ?? 'Quiz Game',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* —— Chat —— */}
      <Stack.Screen
        name="TeamChat"
        component={TeamChatScreen}
        options={({ navigation, route }) => ({
          headerTitle: route.params.teamName,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* —— Store —— */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({ navigation }) => ({
          headerTitle: 'Cart Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TeamProducts"
        component={TeamProductsScreen}
        options={({ route, navigation }) => ({
          headerTitle: route.params.teamName.toUpperCase(),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Add Delivery Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Detail' }} />

      {/* —— Profile —— */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* —— Scoreboard detail —— */}
      <Stack.Screen
        name="Scoreboard"
        component={ScoreBoardScreen}
        options={({ navigation }) => ({
          headerTitle: 'Scoreboard',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: { width: 100, height: 70, resizeMode: 'contain' },
});
