import React, { Component } from 'react';
import { Text, ScrollView, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            token: '',
            user_id: 0,
            username: "",
            password: "",
            name: "",
            email: ""
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            
        });        
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    updateProfile = async () => {
        let id = await AsyncStorage.getItem('@session_id');

        let token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.user_id, {
            given_name: this.state.username,
            family_name: this.state.name,
            email: this.state.email,
            password: this.state.password
            }, {
                method: 'patch',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": this.state.token
                }
            })
            .then((response) => {
                if(response.status === 200){
                    console.log("Updated information successfully")
                    this.props.navigation.navigate("Home")
                }else if(response.status === 400){
                  throw 'Bad Request'
                }else if(response.status === 401){
                    throw 'Unauthorised'
                }else if(response.status === 403){
                    throw 'Forbidden'
                }else if (response.status === 404){
                    throw 'Not Found';
                } else if (response.staus === 500){
                  throw 'Server Error';
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <ScrollView>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Username"
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username}
                />
                <TextInput
                    placeholder="Name"
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                />
                <Button
                    title="Update Details"
                    onPress={() => this.updateProfile()}
                />
                <Button
                    title="Logout"
                    onPress={() => this.logout()}
                />
                <Button
                    title="Back to Profile"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Profile")}
                />
                
            </ScrollView>
        )
    }
}

export default LogoutScreen;