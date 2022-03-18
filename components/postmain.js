/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostScreen from './posts';
import SinglePostScreen from './singlepost';

const Stack = createNativeStackNavigator();

class PostMainScreen extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="PostScreen" options={{ headerShown: false }} component={PostScreen} />
        <Stack.Screen name="SinglePostScreen" component={SinglePostScreen} />
      </Stack.Navigator>
    );
  }
}

export default PostMainScreen;
