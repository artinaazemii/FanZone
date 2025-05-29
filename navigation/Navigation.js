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

/* screens */
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

/* NEW ──────────────────────────────────────────────────── */
import { useCoins } from '../context/CoinContext';

/* assets */
const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const logo  = require('../assets/logo.png');
const coin  = require('../assets/coin.png');               // NEW

/* ─────────────────────────  HEADER HELPERS  ───────────────────────── */
function CustomHeader() {
  return <Image source={logo} style={styles.logo} />;
}

/* NEW – live coin badge shown everywhere  */
function CoinBadge() {
  const { coins } = useCoins();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', marginRight: 4 }}>
        {coins ?? 0}
      </Text>
      <Image source={coin} style={{ width: 16, height: 16 }} />
    </View>
  );
}

/* NEW – convenience wrapper so we don’t repeat the same headerRight */
const HeaderRight = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
    <CoinBadge />
    <View style={{ width: 10 }} />
    <ProfileIcon size={30} />
  </View>
);

/* ─────────────────────────  TABS  ───────────────────────── */
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: 'white',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home')           iconName = 'home';
          else if (route.name === 'Chats')     iconName = 'comments';
          else if (route.name === 'Score Board') iconName = 'soccer-ball-o';
          else if (route.name === 'Store')     iconName = 'shopping-cart';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',

        headerTitle: () => <CustomHeader />,
        headerTitleAlign: 'center',
        headerRight: HeaderRight,            // NEW – coin badge + profile
      })}
    >
      <Tab.Screen name="Home"        component={HomeScreen} />
      <Tab.Screen name="Chats"       component={ChatListScreen} />
      <Tab.Screen name="Score Board" component={ScoreBoardScreen} />
      <Tab.Screen name="Store"       component={StoreScreen} />
    </Tab.Navigator>
  );
}

/* ─────────────────────────  STACK  ───────────────────────── */
export default function Navigation() {
  return (
    <Stack.Navigator
      /* NEW – default header with coin badge */
      screenOptions={{ headerRight: HeaderRight }}
    >
      <Stack.Screen
        name="MainTabs"
        component={Tabs}
        options={{ headerShown: false }}
      />

      {/* Games */}
      <Stack.Screen
        name="MatchingPairs"
        component={MatchingPairsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quizzes"
        component={QuizzesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizGame"
        component={QuizGameScreen}
        options={({ route, navigation }) => ({
          headerTitle: route.params?.quiz?.title || 'Quiz Game',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* Chat */}
      <Stack.Screen
        name="TeamChat"
        component={TeamChatScreen}
        options={({ navigation, route }) => ({
          headerTitle: route.params.teamName,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* Store */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({ navigation }) => ({
          headerTitle: 'Cart Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
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
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
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
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Detail' }}
      />

      {/* Profile */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* Scoreboard detail (if needed) */}
      <Stack.Screen
        name="Scoreboard"
        component={ScoreBoardScreen}
        options={({ navigation }) => ({
          headerTitle: 'Scoreboard',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

/* ─────────────────────────  STYLES  ───────────────────────── */
const styles = StyleSheet.create({
  logo: { width: 100, height: 70, resizeMode: 'contain' },
});
