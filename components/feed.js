import React, { Component } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FeedScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            text: "",
            post_id:'',
            listData: [],
            postData: [{ post_id: "", text: "", timestamp: "", author: [{ user_id: "", first_name: "", last_name: "", email: "" }], numLikes: "" }],
            updatePost: "",
            //postData:[]
        }
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
        const {user_id} = this.props.route.params;
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
            method: 'get',
            headers: {
                'X-Authorization': token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Users Posts")
                    return response.json()
                } else if (response.status === 401) {
                    throw 'Unauthorised'
                } else if (response.status === 403) {
                    throw 'Can only view the posts of yourself or your friends'
                } else if (response.status === 404) {
                    throw 'Not Found'
                } else if (response.status === 500) {
                    throw 'Server error'
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    postData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getAddLike = async (post_id) => {
        const token = await AsyncStorage.getItem('@session_token');
        const {user_id} = this.props.route.params;
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                this.getListofPosts();
                console.log("Post Liked")
            } else if (response.status === 401) {
                throw 'Unauthorised'
            } else if (response.status === 403) {
                throw 'Forbidden - You have already liked this post'
            } else if (response.status === 404) {
                throw 'Not Found'
            } else if (response.status === 500) {
                throw 'Server error'
            }
        })
          .catch((error) => {
            console.log(error);
          })
    }

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
        } else {
            return (
                <FlatList
                    data={this.state.postData}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.text}</Text>
                            <Button title="Like" onPress={() => this.getAddLike(item.post_id)} />
                            <Button title="Dislike" onPress={() => this.getDislike(item.post_id)} />
                        </View>
                    )}
                />
            )
        }
    }
}

export default FeedScreen;