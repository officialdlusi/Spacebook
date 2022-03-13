import React, { Component } from 'react';
import { Button, ScrollView, TextInput, Text } from 'react-native';

class SignupScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            first_nameValidation: false,
            last_nameValidation: false,
            last_name: "",
            emailValidation: false,
            email: "",
            passwordValidation: false,
            password: "",
            error: ""
        }
    }

    signup = () => {
        //Validation here...
        // const {first_name} = this.state
        // if(first_name.length < 1){
        //     console.log("please input a first name")
        // } else {
        //     this.setState({"first_nameValidation": true});
        //     console.log("valid first name") 
        // }

        // const {last_name} = this.state
        // if(last_name.length < 1){
        //     console.log("please input a last name")
        // } else {
        //     this.setState({"last_nameValidation": true});
        //     console.log("valid last name")
        // }

        // const emailRegex = 
        //     /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        // const email = this.state.email;

        // if (emailRegex.test(email)){
        //     console.log("valid email address")
        //     this.setState({"emailValidation": true});

        // } else {
        //     console.log("invalid email address")
        // }

        // const {password} = this.state
        // if (password.length > 5){
        //         this.setState({"passwordValidation": true});
        //         console.log("valid password")
        // } else {
        //     console.log("please input a valid password longer than 5 characters")
        // }

        // if(this.state.emailValidation && this.state.passwordValidation && this.state.first_nameValidation && this.state.last_nameValidation){

        //     let data = {
        //         "firstname": this.state.first_name,
        //         "lastname": this.state.last_name,
        //         "email": this.state.email,
        //         "password": this.state.password
        //     }

        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json()
                } else if (response.status === 400) {
                    throw 'Failed validation';
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                console.log("User created with ID: ", responseJson);
                this.props.navigation.navigate("Login");
            })
            .catch((error) => {
                this.setState({ "error": error })
            })
        // } else {
        //     this.setState({"error": "one or more of the fields is incomplete"})
        // }
    }

    render() {
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your first name..."
                    onChangeText={(first_name) => this.setState({ first_name })}
                    value={this.state.first_name}
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <TextInput
                    placeholder="Enter your last name..."
                    onChangeText={(last_name) => this.setState({ last_name })}
                    value={this.state.last_name}
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                    secureTextEntry
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <Button
                    title="Create an account"
                    color="darkblue"
                    onPress={() => this.signup()}
                />
                <Text>{this.state.error}</Text>
            </ScrollView>
        )
    }
}

export default SignupScreen;