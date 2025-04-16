import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ScoreBoardScreen from "../screens/ScoreBoardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { auth } from "../firebaseConfig";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const logo = require("../assets/logo.png");

function CustomHeader() {
  return <Image source={logo} style={styles.logo} />;
}

function ChatScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Chats</Text>
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

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: "white",
          flexDirection: "row",
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          flexGrow: 1,
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Chats") iconName = "comments";
          else if (route.name === "Score Board") iconName = "soccer-ball-o";
          else if (route.name === "Shop") iconName = "shopping-cart";
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        headerTitle: () => <CustomHeader />,
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-circle-outline" size={30} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chats" component={ChatScreen} />
      <Tab.Screen name="Score Board" component={ScoreBoardScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: () => <CustomHeader />,
          headerTitleAlign: "center",
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

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  logo: {
    width: 100,
    height: 70,
    resizeMode: "contain",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
