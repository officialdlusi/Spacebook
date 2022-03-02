import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
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

  componentDidMount() {
    this.getProfile();
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

  render() {

    const {profile, isLoading} = this.state;

    if (this.state.isLoading){
      return(<ActivityIndicator/>);
        } else {
      return (
      <View><Text>{profile.first_name + ' '}{profile.last_name}</Text></View>

      )}
    }
  }




export default ProfileScreen;