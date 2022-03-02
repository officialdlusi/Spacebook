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
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

            if (route.name === 'HomeScreen'){
              iconName = focused ? 'home' : 'planet-outline';
            } else if(route.name === 'ProfileScreen') {
              iconName = focused ? 'profile' : 'person-outline';
            } else if(route.name === 'SearchScreen') {
              iconName = focused ? 'profile' : 'search-outline';
            } else if(route.name === 'FriendsScreen'){
              iconName = focused ? 'friends' : 'people-outline';
            } else if(route.name === 'FriendRequestScreen'){
              iconName = focused ? 'Requests' : 'person-add-outline';
            }

            return <Ionicons name = {iconName} size = {size} color = {color} />;
            },
          })}
          tabBarOptions = {{
            activeTintColor: 'black',
            inactiveTintColor: 'grey',
          }}
        >
          <Tab.Screen name = "Profile" component = {ProfileScreen} />
          <Tab.Screen name = "Search" component = {SearchScreen}/>
          <Tab.Screen name = "Friends" component = {FriendsScreen}/>
          <Tab.Screen name = "FriendRequests" component = {FriendRequestsScreen}/>
          <Tab.Screen name = "Logout" component = {LogoutScreen}/>
        </Tab.Navigator>
    )
  }
}
export default Main;