/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-throw-literal */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, TextInput, StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      text: '',
      postData: [{
        post_id: '',
        text: '',
        timestamp: '',
        author: [{
          user_id: '', first_name: '', last_name: '', email: '',
        }],
        numLikes: '',
      }],
      updatePost: '',
    };
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    this.getListofPosts();
  }

  componentWillUnmount() {
    this.getSendPost();
  }

  getSendPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('Post Sent');
          this.getListofPosts();
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getListofPosts = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Users Posts');
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
          postData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getDeletePost = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Post Deleted');
          this.getListofPosts();
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - you can only delete your own posts';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUpdatePost = async (post_id) => {
    let data = {};

    if (this.state.text != this.state.updatePost) {
      data.text = this.state.text;
    }

    console.log(JSON.stringify(data));

    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Users Post Updated');
          this.getListofPosts();
        } else if (response.status === 400) {
          throw 'Bad Request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - you can only update your own posts';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
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
      <ScrollView style={styles.scrollView}>
        <View>
          <TextInput
            placeholder="Write a post here..."
            onChangeText={(text) => this.setState({ text })}
            style={{
              borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
            }}
          />
          <Button title="Post" onPress={() => this.getSendPost()} />
          {/* <Button title = "Delete" onPress={() => this.getDeletePost()}/> */}
          <FlatList
            data={this.state.postData}
            renderItem={({ item }) => (
              <View style={styles.postBox}>
                <View style={styles.postText}>
                  <Text>{item.text}</Text>
                  <View>
                    <TextInput
                      placeholder="Update Post..."
                      onChangeText={(text) => this.setState({ text })}
                      style={{
                        borderRadius: 4, padding: 5, borderWidth: 1, margin: 5,
                      }}
                    />
                    <View style={styles.fixToText}>
                      <Button title="View" onPress={() => this.props.navigation.navigate('SinglePostScreen', { post_id: item.post_id })} />
                      <Button title="Delete" onPress={() => this.getDeletePost(item.post_id)} />
                      <Button title="Update" onPress={() => this.getUpdatePost(item.post_id, this.state.text)} />
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'transparent',
    marginHorizontal: 15,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postText: {
    textAlign: 'center',
  },
  postBox: {
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    margin: 5,
  },

});
