/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-throw-literal */
/* eslint-disable no-dupe-class-members */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      profile: {},
      photo: null,
      text: '',
      profileData: '',
      postData: [{
        post_id: '',
        text: '',
        timestamp: '',
        author: [{
          user_id: '', first_name: '', last_name: '', email: '',
        }],
        numLikes: '',
      }],
    };
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getProfile();
      this.getProfileImage();
    });

    this.getProfile();
    this.getProfileImage();
  }

  componentWillUnmount() {
    this.getProfile();
    this.getProfileImage();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getProfile = async () => {
    const id = await AsyncStorage.getItem('@session_id');

    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw 'Unauthorise';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.staus === 500) {
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          profile: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getProfileImage = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  render() {
    const { profile } = this.state;

    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    }
    return (
      <View style={stylescamera.container}>
        <Image
          source={{
            uri: this.state.photo,
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
          }}
        />
        <Text>
          {`${profile.first_name} `}
          {profile.last_name}
        </Text>
        <Button color="#B39CD0" title="Update Profile Picture" onPress={() => this.props.navigation.navigate('Camera')} />
        <FlatList
          data={this.state.profileData}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: 'black' }}>
              <Text>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
        />
        <FlatList
          data={this.state.postData}
          renderItem={({ item }) => (
            <View style={{ Color: 'black' }}>
              <Text>{item.text}</Text>
              {/* <Button title="Like" onPress={() => this.getLikePost(item.post_id)}/>
                <Button title="Dislike" onPress={() => this.getDislikePost(item.post_id)} /> */}
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
        />
      </View>

    );
  }
}

export default ProfileScreen;

const stylescamera = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
