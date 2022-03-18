/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SinglePostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      singlePostData: [],

      text: '',
    };
  }

  componentDidMount() {
    this.getSinglePost();
  }

  getSinglePost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@session_id');
    const { post_id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Users Single Posts');
          return response.json();
        } if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          singlePostData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
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
      <View style={styles.postBox}>
        <Text>{this.state.singlePostData.text}</Text>
      </View>
    );
  }
}

export default SinglePostScreen;

const styles = StyleSheet.create({
  postBox: {
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    margin: 5,
    textAlign: 'center',
  },

});
