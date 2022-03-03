import React, {Component} from 'react';
import {View, Text, FlatList, TextInput, Button, CheckBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Searchbar} from 'react-native-paper';


class SearchScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      query: "",
      checked: false
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
    });
  
    this.getFindUsers();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFindUsers = async () => {
    const value = await AsyncStorage.getItem('@session_token');

    let url = "http://localhost:3333/api/1.0.0/search?q=" + this.state.query;

    if(this.state.checked){
      url += "&search_in=friends&"
    }

    return fetch(url, {
          headers: {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
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
  
  getSendFriendRequest = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      }
    })
    .then((response) => {
        if(response.status === 200){
          console.log("Friend Request Sent")
        } else if(response.status === 401){
          throw 'Unauthorised'
        } else if(response.status === 403){
          throw 'User is already added as a friend'
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
          <TextInput
            onChangeText={(val) => {this.setState({query: val})}}
            value={this.state.query}
          />
          <Button title="Search" onPress={() => this.getFindUsers()} />
          <CheckBox
           onValueChange={() => this.setState({checked:!this.state.checked})}
           value={this.state.checked}
           />
           <Text>Search in friends only</Text>
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname}</Text>
                      {/* <Button title="View Profile" onPress={() => {navigation.navigate()}}/> */}
                      <Button title="Add Friend" onPress={() => this.getSendFriendRequest(item.user_id)}/>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
    
  }
}

export default SearchScreen;