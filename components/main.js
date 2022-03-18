/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfileScreen from './profile';
import SearchScreen from './search';
import FriendsMainScreen from './friendsmain';
import FriendRequestsScreen from './friendrequests';
import LogoutScreen from './logout';
import PostMainScreen from './postmain';

const Tab = createBottomTabNavigator();

class Main extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: '',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'ProfileScreen') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'PostMainScreen') {
              iconName = focused ? 'chatbox' : 'chatbox-outline';
            } else if (route.name === 'SearchScreen') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'FriendsMainScreen') {
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
        <Tab.Screen name="PostMainScreen" options={{ headerShown: false }} component={PostMainScreen} />
        <Tab.Screen name="SearchScreen" options={{ headerShown: false }} component={SearchScreen} />
        <Tab.Screen name="FriendsMainScreen" options={{ headerShown: false }} component={FriendsMainScreen} />
        <Tab.Screen name="FriendRequestsScreen" options={{ headerShown: false }} component={FriendRequestsScreen} />
        <Tab.Screen name="LogoutScreen" options={{ headerShown: false }} component={LogoutScreen} />
      </Tab.Navigator>
    );
  }
}
export default Main;
