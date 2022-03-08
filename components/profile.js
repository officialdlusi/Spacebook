import React, {Component} from 'react';
import {View, Text, FlatList, Button, TextInput, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      profile: {},
      photo: null,
      text: "",
      postData: ""
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
    this.getProfileImage();
    this.getAddPost();
    });

  this.getProfile();
  this.getProfileImage();
  this.getAddPost();
}

  componentWillUnmount(){
    this.getProfile();
    this.getProfileImage();
    this.getAddPost();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };




  getProfile = async () => {
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

  getAddPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    
    const id = await AsyncStorage.getItem('@session_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'post',
      headers : {
        'Content-Type' : 'application/json',
        'X-Authorization' : token
      },
      body: JSON.stringify(this.state)
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

  // getDeletePost = async (id) => {
  //   const value  = await AsyncStorage.getItem('@session_token');
  //   return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + id, {
  //     method: 'delete',
  //     headers: {
  //       'Content-Type' : 'application/json',
  //       'X-Authorization' : value
  //     }
      
  //   })
  // }

  getListofPosts = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    const id = await AsyncStorage.getItem('@session_id');
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'get',
      headers: {
        'Content-Type' : 'application/json',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status === 201){
        console.log("Users Posts")
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
    .catch((error) => {
        console.log(error);
    })
}

  getProfileImage = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    const id  = await AsyncStorage.getItem('@session_id');
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'get',
      headers: {
        'X-Authorization': token
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
      return( 
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
        <View style={styles.container}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 400,
              height: 400,
              borderWidth: 5 
            }}
          />
        <Text>{profile.first_name + ' '}{profile.last_name}</Text>
        <TextInput placeholder="Write a post here..." onChangeText={(text) => this.setState({text})} style={{borderRadius:4, padding:5, borderWidth:1, margin:5}}/>
        <Button title = "Post" onPress={() => this.getAddPost()}/>
        <Button title = "Delete" onPress={() => this.getDeletePost()}/>
        <Button title = "Update Profile Picture" onPress={() => this.props.navigation.navigate("Camera")}/>
        <FlatList
          data = {this.state.postData}
          renderItem = {({item}) => (
          <View>
            <Text>{item.timestamp}</Text>
          </View>
      )}
        />
      </View>
      
      )}
          }
        }

export default ProfileScreen;  

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });