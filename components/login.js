/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-console */
/* eslint-disable semi-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-throw-literal */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  Button, ScrollView, TextInput, Text, StyleSheet, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailValdiation: false,
      password: '',
      passwordValdation: false,
      error: '',
    };
  }

  login = async () =>

  // const emailRegex =
  // eslint-disable-next-line max-len
  //     /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  // const email = this.state.email;

  // if (emailRegex.test(email)){
  //     this.setState({"emailValdiation":true});
  //     console.log("valid email address")
  // } else {
  //     console.log("invalid email address")
  // }

  // const {password} = this.state
  // if(password.length > 5){
  //     console.log("valid password")
  //     this.setState({"passwordValdation":true})
  // } else {
  //     console.log("invalid password")
  // }

  // if(this.state.emailValdiation && this.state.passwordValdation){

  //     let data = {
  //         "email": this.state.email,
  //         "password": this.state.password
  //     }

    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'Invalid email or password';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem('@session_id', responseJson.id);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        this.props.navigation.navigate('Main');
      })
      .catch((error) => {
        this.setState({ error });
      })
    // }else{
    //     this.setState({"error": "Email or password not valid"})
    // }

    ;

  render() {
    return (
      <ScrollView>
        <View style={styles.login}>
          <Text>Welcome to Spacebook</Text>
        </View>
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{
            borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
          }}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={{
            borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
          }}
        />
        <Button
          title="Login"
          color="darkblue"
          onPress={() => this.login('Main')}
        />
        <Button
          title="Don't have an account?"
          color="darkblue"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
        <Text>{this.state.error}</Text>
      </ScrollView>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  login: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
