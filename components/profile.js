import React, {Component} from 'react';
import {View, Text, FlatList, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';


class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      profile: {}
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
    this.getProfile();
    this.get_profile_image();
    });

  this.getProfile();
  this.get_profile_image();
}

  // checkLoggedIn = async () => {
  //   const value = await AsyncStorage.getItem('@session_token');
  //   if (value == null) {
  //       this.props.navigation.navigate('Login');
  //   }
  // };




  getProfile = async () => {
    // let id = null;
    
    let id = await AsyncStorage.getItem('@session_id');

    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: 'get',
      headers: {
        'X-Authorization': token
      }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              throw 'Unauthorise'
            }else if (response.status === 404){
                throw 'Not Found';
            } else if (response.staus === 500){
              throw 'Server Error'
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            profile: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getAddPost = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'post',
      headers : {
        'Content-Type' : 'appliaction/json',
        'X_authorization' : value
      }
    })
      .then((response) => {
        if(response.status === 201){
          console.log("Post Sent")
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

  getDeletePost = async (id) => {
    const value  = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + id, {
      method: 'delete',

    })
  }

  get_profile_image = async (id) => {
    const valuetoke = await AsyncStorage.getItem('@session_token');

    const valueid  = await AsyncStorage.getItem('@session_id');
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'get',
      headers: {
        'X-Authorization': valuetoke
      }
    })
    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
  }

  render() {

    const {profile, isLoading} = this.state;

    if (this.state.isLoading){
      return(<ActivityIndicator/>);
        } else {
      return (
      <View>
        <Text>{profile.first_name + ' '}{profile.last_name}</Text>
        <TextInput placeholder="Write a post here..."/>
        <Button title = "Post" onPress={() => this.getAddPost()}/>
        <Button title = "Delete" onPress={() => this.getDeletePost}/>
        <Button title = "Update Profile Picture" onPress={() => this.props.navigation.navigate("Camera")}/>
      </View>

      )}
    }
  }




export default ProfileScreen;