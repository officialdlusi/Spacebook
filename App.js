// import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import MainScreen from './components/main';


const Stack = createStackNavigator();




function App(){
    return(

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Signup" component={SignUpScreen}/>
          <Stack.Screen name="Main" component={MainScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;