// navigation/Navigation.js
import React from 'react';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons }      from '@expo/vector-icons';

import HomeScreen          from '../screens/HomeScreen';
import ScoreBoardScreen    from '../screens/ScoreBoardScreen';
import ProfileScreen       from '../screens/ProfileScreen';
import StoreScreen         from '../screens/StoreScreen';
import TeamProductsScreen  from '../screens/TeamProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen          from '../screens/CartScreen';
import DeliveryDetailsScreen from '../screens/DeliveryDetailsScreen';
import ChatListScreen      from '../screens/ChatListScreen';
import TeamChatScreen      from '../screens/TeamChatScreen';
import GroupInfoScreen     from '../screens/GroupInfoScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const logo  = require('../assets/logo.png');

function CustomHeader() {
  return <Image source={logo} style={styles.logo}/>;
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={({route,navigation})=>({
      tabBarStyle:{height:60,paddingBottom:5,backgroundColor:'white'},
      tabBarIcon:({color,size})=>{
        let icon;
        if(route.name==='Home') icon='home';
        else if(route.name==='Chats') icon='comments';
        else if(route.name==='Score Board') icon='soccer-ball-o';
        else if(route.name==='Store') icon='shopping-cart';
        return <FontAwesome name={icon} size={size} color={color}/>;
      },
      tabBarActiveTintColor:'black',
      tabBarInactiveTintColor:'gray',
      headerTitle:()=> <CustomHeader/>,
      headerTitleAlign:'center',
      headerRight:()=>(
        <TouchableOpacity style={{marginRight:15}} onPress={()=>navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={30} color="black"/>
        </TouchableOpacity>
      )
    })}>
      <Tab.Screen name="Home"        component={HomeScreen}/>
      <Tab.Screen name="Chats"       component={ChatListScreen}/>
      <Tab.Screen name="Score Board" component={ScoreBoardScreen}/>
      <Tab.Screen name="Store"       component={StoreScreen}/>
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{headerShown:false}}/>

      <Stack.Screen
        name="TeamChat"
        component={TeamChatScreen}
        options={({navigation,route})=>({
          headerTitle: route.params.teamName,
          headerTitleAlign:'center',
          headerLeft:()=>(
            <TouchableOpacity style={{marginLeft:15}} onPress={()=>navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black"/>
            </TouchableOpacity>
          ),
          headerRight:()=>(
            <TouchableOpacity style={{marginRight:15}} onPress={()=>navigation.navigate('GroupInfo',{
              teamId:route.params.teamId,teamName:route.params.teamName
            })}>
              <Ionicons name="information-circle-outline" size={24} color="black"/>
            </TouchableOpacity>
          )
        })}
      />

      <Stack.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={({route})=>({
          headerTitle:`${route.params.teamName} Members`,
          headerTitleAlign:'center'
        })}
      />

      {/* … other Stack.Screens … */}

    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logo:{ width:100, height:70, resizeMode:'contain' }
});
