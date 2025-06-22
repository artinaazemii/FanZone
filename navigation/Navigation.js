import React, { useEffect } from 'react';
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
import { useTeam }  from '../context/TeamContext';
import Logo         from '../screens/Logo';

const coin = require('../assets/coin.png');

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CoinBadge() {
  const { coins } = useCoins();
  return (
    <View style={styles.coinBadge}>
      <Text style={styles.coinText}>
        {coins ?? 0}
      </Text>
      <Image source={coin} style={styles.coinImage} />
    </View>
  );
}

const CoinsAndTeam = () => {
  const { mainTeam } = useTeam();
  return (
    <View style={styles.headerRightContainer}>
      <CoinBadge />
      {mainTeam && (
        <Logo id={mainTeam.id} size={24} style={styles.teamLogo} />
      )}
    </View>
  );
};

const HeaderRight = () => (
  <View style={styles.headerRightContainer}>
    <CoinBadge />
    <View style={styles.spacer} />
    <ProfileIcon size={30} />
  </View>
);

const StoreHeaderTitle = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <ProfileIcon size={28} style={{ marginRight: 10 }} />
    <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
      Store
    </Text>
  </View>
);

const StoreHeaderRight = () => (
  <View style={{ marginRight: 16 }}>
    <CoinBadge />
  </View>
);

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#888888',
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          if (route.name === 'Home')           icon = 'home';
          else if (route.name === 'Chats')     icon = 'comments';
          else if (route.name === 'Score Board') icon = 'soccer-ball-o';
          else if (route.name === 'Store')     icon = 'shopping-cart';
          return <FontAwesome name={icon} size={size} color={color} />;
        },
        headerTintColor: '#ffffff',
        headerStyle: styles.headerStyle,
        headerBlurEffect: 'dark',
        headerTitleAlign: 'center',
        headerRight: HeaderRight,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <View style={styles.homeTitleContainer}>
              <ProfileIcon size={28} style={styles.homeProfileIcon} />
              <Text style={styles.homeTitleText}>
                Home
              </Text>
            </View>
          ),
          headerTitleAlign: 'left',
          headerRight: CoinsAndTeam,
          headerLeft: () => null,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatListScreen}
        options={{
          headerTitle: 'Chats',
          headerRight: undefined,
        }}
      />
      <Tab.Screen
        name="Score Board"
        component={ScoreBoardScreen}
        options={{
          headerTitle: 'Score Board',
          headerRight: undefined,
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          headerTitle: StoreHeaderTitle,
          headerRight: StoreHeaderRight, 
          headerTitleAlign: 'left',
          headerLeft: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export default function NavigationTabs({ mainTeam }) {
  const { setMainTeam } = useTeam();
  useEffect(() => {
    if (mainTeam) setMainTeam(mainTeam);
  }, [mainTeam, setMainTeam]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#ffffff',
        headerStyle: styles.headerStyle,
        headerBlurEffect: 'dark',
        headerRight: HeaderRight,
      }}
    >
      <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />

      <Stack.Screen name="MatchingPairs" component={MatchingPairsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quizzes"       component={QuizzesScreen}       options={{ headerShown: false }} />
      <Stack.Screen
        name="QuizGame"
        component={QuizGameScreen}
        options={({ route, navigation }) => ({
          headerTitle: route.params?.quiz?.title ?? 'Quiz Game',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TeamChat"
        component={TeamChatScreen}
        options={({ navigation, route }) => ({
          headerTitle: route.params.teamName,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({ navigation }) => ({
          headerTitle: 'Cart Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
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
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
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
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Detail' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: 'Profile',
          headerTitleAlign: 'center',
          headerRight: undefined,
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Scoreboard"
        component={ScoreBoardScreen}
        options={({ navigation }) => ({
          headerTitle: 'Scoreboard',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
 
  headerStyle: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  

  tabBarStyle: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  coinText: {
    fontWeight: 'bold',
    marginRight: 4,
    color: '#ffffff',
    fontSize: 14,
  },
  coinImage: {
    width: 16,
    height: 16,
  },
  
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  
  homeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeProfileIcon: {
    marginRight: 10,
  },
  homeTitleText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  teamLogo: {
    marginLeft: 12,
  },
  spacer: {
    width: 10,
  },
  backButton: {
    marginLeft: 15,
    padding: 4,
  },
});
