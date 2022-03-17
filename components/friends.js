import React, { Component } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      const id = await AsyncStorage.getItem('@session_id');
      this.checkLoggedIn();
      this.getFriendsList(id);
    });

    const id = await AsyncStorage.getItem('@session_id');
    this.getFriendsList(id);

  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getFriendsList = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + '/friends/', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Can only view the friends of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not found'
        } else if (response.status === 500) {
          throw 'Error'
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
        <View>
          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <View>
                {/* <Text>{JSON.stringify(item)}</Text> */}
                <Text>{item.user_givenname} {item.user_familyname}</Text>
              <Button title="View Friends Posts" onPress={() => this.props.navigation.navigate('FeedScreen',  {user_id: item.user_id}   )} />
              
                {/* <Button title="View Friends Posts" onPress={() => this.props.navigation.navigate("FriendsMain", { screen: 'FeedScreen', "id" : item.user_id})} /> */}
                {/* ("Feed", { "friend_id": item.user_id }) */}
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />
        </View>
      );
    }

  }
}


export default FriendsScreen;