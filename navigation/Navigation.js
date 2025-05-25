// Navigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ScoreBoardScreen from "../screens/ScoreBoardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoreScreen from "../screens/StoreScreen";
import TeamProductsScreen from "../screens/TeamProductsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import DeliveryDetailsScreen from "../screens/DeliveryDetailsScreen";
import ChatListScreen from "../screens/ChatListScreen";
import TeamChatScreen from "../screens/TeamChatScreen";
import ProfileIcon from "../screens/ProfileIcon";    // ← new

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const logo = require("../assets/logo.png");

function CustomHeader() {
  return <Image source={logo} style={styles.logo} />;
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: "white",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Chats") iconName = "comments";
          else if (route.name === "Score Board") iconName = "soccer-ball-o";
          else if (route.name === "Store") iconName = "shopping-cart";
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",

        headerTitle: () => <CustomHeader />,
        headerTitleAlign: "center",

        // ← replace the generic icon with your ProfileIcon
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            <ProfileIcon size={30} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Score Board" component={ScoreBoardScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={Tabs}
        options={{ headerShown: false }}
      />

      {/* Team Chat */}
      <Stack.Screen
        name="TeamChat"
        component={TeamChatScreen}
        options={({ navigation, route }) => ({
          headerTitle: route.params.teamName,
          headerTitleAlign: "center",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      {/* Cart & Store */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({ navigation }) => ({
          headerTitle: "Cart Details",
          headerTitleAlign: "center",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="TeamProducts"
        component={TeamProductsScreen}
        options={({ route, navigation }) => ({
          headerTitle: route.params.teamName.toUpperCase(),
          headerTitleAlign: "center",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={({ navigation }) => ({
          headerTitle: "Add Delivery Details",
          headerTitleAlign: "center",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Product Detail" }}
      />

      {/* Profile */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      {/* Extra Scoreboard route if needed */}
      <Stack.Screen
        name="Scoreboard"
        component={ScoreBoardScreen}
        options={({ navigation }) => ({
          headerTitle: "Scoreboard",
          headerTitleAlign: "center",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 70,
    resizeMode: "contain",
  },
});
