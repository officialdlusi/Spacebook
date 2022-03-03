import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfileScreen from './profile';
import SearchScreen from './search';
import FriendsScreen from './friends';
import FriendRequestsScreen from './friendrequests';
import LogoutScreen from './logout';

const Tab = createBottomTabNavigator();

class Main extends Component{
  render(){
    return (
        <Tab.Navigator
          screenOptions = {({route}) => ({
            tabBarLabel: "",
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

            if(route.name === 'ProfileScreen') {
              iconName = focused ? 'person-outline' : 'person-outline';
            } else if(route.name === 'SearchScreen') {
              iconName = focused ? 'search-outline' : 'search-outline';
            } else if(route.name === 'FriendsScreen'){
              iconName = focused ? 'people-outline' : 'people-outline';
            } else if(route.name === 'FriendRequestsScreen'){
              iconName = focused ? 'person-add-outline' : 'person-add-outline';
            } else if(route.name === 'LogoutScreen') {
              iconName = focused ? 'log-out-outline' : 'log-out-outline';
            }
            return <Ionicons name = {iconName} size = {size} color = {color} />;
            },
          })}
          tabBarOptions = {{
            activeTintColor: 'black',
            inactiveTintColor: 'grey',
          }}
        >
          <Tab.Screen name = "ProfileScreen" component = {ProfileScreen} />
          <Tab.Screen name = "SearchScreen" component = {SearchScreen}/>
          <Tab.Screen name = "FriendsScreen" component = {FriendsScreen}/>
          <Tab.Screen name = "FriendRequestsScreen" component = {FriendRequestsScreen}/>
          <Tab.Screen name = "LogoutScreen" component = {LogoutScreen}/>
        </Tab.Navigator>
    )
  }
}
export default Main;