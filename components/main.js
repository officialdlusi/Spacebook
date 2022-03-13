import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfileScreen from './profile';
import SearchScreen from './search';
import FriendsScreen from './friends';
import FriendRequestsScreen from './friendrequests';
import LogoutScreen from './logout';
import PostScreen from './posts';

const Tab = createBottomTabNavigator();

class Main extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'ProfileScreen') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'PostScreen') {
              iconName = focused ? 'chatbox' : 'chatbox-outline'
            } else if (route.name === 'SearchScreen') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'FriendsScreen') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'FriendRequestsScreen') {
              iconName = focused ? 'person-add' : 'person-add-outline';
            } else if (route.name === 'LogoutScreen') {
              iconName = focused ? 'log-out' : 'log-out-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'black',
          inactiveTintColor: 'grey',
        }}
      >
        <Tab.Screen name="ProfileScreen" options={{ headerShown: false }} component={ProfileScreen} />
        <Tab.Screen name="PostScreen" options={{ headerShown: false }} component={PostScreen} />
        <Tab.Screen name="SearchScreen" options={{ headerShown: false }} component={SearchScreen} />
        <Tab.Screen name="FriendsScreen" options={{ headerShown: false }} component={FriendsScreen} />
        <Tab.Screen name="FriendRequestsScreen" options={{ headerShown: false }} component={FriendRequestsScreen} />
        <Tab.Screen name="LogoutScreen" options={{ headerShown: false }} component={LogoutScreen} />
      </Tab.Navigator>
    )
  }
}
export default Main;