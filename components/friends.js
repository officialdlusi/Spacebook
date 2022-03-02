import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getFriendsList();
    });

    this.getFriendsList();
  
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriendsList = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + '/friends/', {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
              console.log("Friends")
              //getfreindrequest
              this.getFriendsList();
            } else if(response.status === 401){
              throw 'Unauthorised';
            } else if(response.status === 403){
              throw 'Can only view the friends of yourself or your friends';
            } else if(response.status === 404){
              throw 'Not found'
            } else if(response.status === 500){
              throw 'Error'
            }
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
                      <Text>this.getFriendsList({item.user_givenname} {item.user_familyname});</Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
    }
    
  }
}


export default FriendsScreen;