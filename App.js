// import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import MainScreen from './components/main';
import FriendsMain from './components/friendsmain'
import CameraScreen from './components/camera';

const Stack = createStackNavigator();




function App(){
    return(

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" options = {{headerShown: false}} component={LoginScreen}/>
          <Stack.Screen name="Signup" options = {{headerShown: false}} component={SignUpScreen}/>
          <Stack.Screen name="Main" options = {{headerShown: false}} component={MainScreen}/>
          <Stack.Screen name="FriendsMain" options = {{headerShown: false}} component={FriendsMain}/>
          <Stack.Screen name="Camera" component={CameraScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;