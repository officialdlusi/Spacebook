/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-throw-literal */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import {
  ScrollView, Button, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      update_first_name: '',
      update_last_name: '',
      update_email: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  updateProfile = async () => {
    const data = {};

    if (this.state.first_name != this.state.update_first_name) {
      data.first_name = this.state.first_name;
    }

    if (this.state.last_name != this.state.update_last_name) {
      data.last_name = this.state.last_name;
    }

    if (this.state.email != this.state.update_email) {
      data.email = this.state.email;
    }

    console.log(JSON.stringify(data));

    const id = await AsyncStorage.getItem('@session_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify(data),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('Updated information successfully');
          this.props.navigation.navigate('Login');
        } else if (response.status === 400) {
          throw 'Bad Request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.staus === 500) {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  logout = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView>
        <TextInput
          placeholder="Change your first name"
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={{
            borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
          }}
        />
        <TextInput
          placeholder="Change your last name"
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={{
            borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
          }}
        />
        <TextInput
          placeholder="Change your email"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{
            borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
          }}
        />
        <Button
          title="Update Details"
          color="#B39CD0"
          onPress={() => this.updateProfile()}
        />
        <Button
          title="Logout"
          color="#B39CD0"
          onPress={() => this.logout()}
        />
        <Button
          title="Back to Profile"
          color="#B39CD0"
          onPress={() => this.props.navigation.navigate('Profile')}
        />

      </ScrollView>
    );
  }
}

export default LogoutScreen;
