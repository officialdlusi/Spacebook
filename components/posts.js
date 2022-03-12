import React, {Component} from 'react';
import {View, Text, FlatList, Button, TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class PostScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userpost: "",
            listData: []
            // postData: [{post_id: "", text: "", timestamp: "", author:[{user_id: "", first_name: "", last_name: "", email: ""}], numLikes: ""}]
        }
    }
    
    checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getListofPosts();
    });
}

  componentWillUnmount(){
    this.unsubscribe();
  }

    getSendPost = async (userpost) => {
        const token = await AsyncStorage.getItem('@session_token');
    
        const id = await AsyncStorage.getItem('@session_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
            method: 'post',
            headers : {
        'Content-Type' : 'application/json',
        'X-Authorization' : token
        },
        body: JSON.stringify({text:userpost})
        })
            .then((response) => {
                if(response.status === 201){
                console.log("Post Sent")
                this.getListofPosts();
            } else if(response.status === 401){
                throw 'Unauthorised'
            } else if(response.status === 404){
                throw 'Not found'
            } else if(response.status === 500){
                throw 'Server error'
            }
            })
            .catch((error) => {
                console.log(error);
            })
    }

  getListofPosts = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'get',
      headers: {
        'Content-Type' : 'application/json',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status === 200){
        console.log("Users Posts")
        return response.json()
      } else if(response.status === 401){
        throw 'Unauthorised'
      } else if(response.status === 403){
        throw 'Can only view the posts of yourself or your friends'
      } else if(response.status === 404){
        throw 'Not Found'
      } else if(response.status === 500){
        throw 'Server error'
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        listData: responseJson
      })
    })
    .catch((error) => {
        console.log(error);
    })
}

render() {
    if (this.state.isLoading){
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
      }else{
        return (
        <View>
            <TextInput placeholder="Write a post here..." onChangeText={(userpost) => this.setState({userpost})} style={{borderRadius:4, padding:5, borderWidth:1, margin:5}}/>
            <Button title = "Post" onPress={() => this.getSendPost(this.state.userpost)}/>
            {/* <Button title = "Delete" onPress={() => this.getDeletePost()}/> */}
            <FlatList
                data = {this.state.listData}
                renderItem = {({item}) => (
            <View>
                <Text>{item.text}</Text>
            </View>
                )}
            />
        </View>
        )}
}
}

export default PostScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });