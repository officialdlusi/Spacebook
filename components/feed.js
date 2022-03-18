/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable padded-blocks */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable lines-between-class-members */
/* eslint-disable key-spacing */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FeedScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      text: '',
      post_id: '',
      listData: [],
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
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // const {friends_id} = this.props.route.params;
      this.getListofPosts();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getListofPosts = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const { user_id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
      method: 'get',
      headers: {
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

  getLike = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const { id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}/like`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getListofPosts();
          console.log('Post Liked');
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - You have already liked this post';
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

  getRemoveLike = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const { id } = this.props.route.params;
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}/like`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getListofPosts();
          console.log('Like Removed');
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - You have already liked this post';
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
                  }}>
                    <Text>Loading..</Text>
                </View>
      );
    }
    return (
            <FlatList
              data={this.state.postData}
              renderItem={({ item }) => (
                <View style={styles.postBox}>
                    <View>
                        <Text style={styles.postText}>
                            {item.author.first_name}
                            {' '}
                            {item.author.last_name}
                            {' '}
                            Posts
                        </Text>
                        <Text style={styles.postText}>{item.text}</Text>
                        <View style={styles.fixToText}>
                        <Button color="#B39CD0" title="Like" onPress={() => this.getLike(item.post_id)} />
                        <Button color="#B39CD0" title="Remove Like" onPress={() => this.getRemoveLike(item.post_id)} />
                        {/* <Button color="#B39CD0" title="View" onPress={() => this.props.navigation.navigate('SinglePostScreen', { friend_id : item.user_id, post_id: item.post_id })} /> */}
                    </View>
                    </View>
                    </View>
              )}
            />

    );
  }
}

export default FeedScreen;

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