/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedScreen from './feed';
import FriendsScreen from './friends';

const Stack = createNativeStackNavigator();

class FriendsMainScreen extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="FriendsScreen" options={{ headerShown: false }} component={FriendsScreen} />
        <Stack.Screen name="FeedScreen" component={FeedScreen} />
      </Stack.Navigator>
    );
  }
}

export default FriendsMainScreen;
