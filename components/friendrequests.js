import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendRequestsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getData();
    });
  
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      }
    })
    .then ((response) => {
      if(response.status === 200){
        return response.json();
      } else if(response.status === 401){
        throw 'Unauthorise'
      } else if(response.status === 404) {
        throw 'Not found'
      } else if(response.status === 500) {
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  getAcceptFriendRequests = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      }
    })
    .then ((response) => {
      if(response.status === 200){
        //success message to user
        console.log("Friend Added")
        //getfreindrequest
        this.getData();
      } else if(response.status === 401){
        throw 'Unauthorise'
      } else if(response.status === 404) {
        throw 'Not found'
      } else if(response.status === 500) {
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

  getDeclineFriendRequests = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id,{
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      }
    })
    .then ((response) => {
      if(response.status === 200){
        console.log("Friend request rejected")
        this.getData();
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
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>{item.first_name} {item.last_name}</Text>
                      <Button title="Accept Request" onPress={() => this.getAcceptFriendRequests(item.user_id)}/>
                      <Button title="Decline Request" onPress={() => this.getDeclineFriendRequests(item.user_id)}/>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
    
  }
}



export default FriendRequestsScreen;