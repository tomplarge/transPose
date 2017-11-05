import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {Hideo} from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase';

const PINK = "#E89DC5"
const BLUE = "#83C9DB"
const screen = Dimensions.get('window');

export default class Login extends Component {
  constructor(props) {
    super(props);
    var firebaseConfig = {
          apiKey: "AIzaSyBXPhiuQU-CkeCwh1ZxQmrw9RJclmVYUAQ",
          authDomain: "transpose-23bc6.firebaseapp.com",
          databaseURL: "https://transpose-23bc6.firebaseio.com",
          projectId: "transpose-23bc6",
          storageBucket: "transpose-23bc6.appspot.com",
          messagingSenderId: "381645366254"
        };
    this.firebaseApp = firebase.initializeApp(firebaseConfig);

    this.state = {
      email: "",
      password: ""
    }
  }

  // A method to passs the username and password to firebase and make a new user account
  signup = () => {
   // Make a call to firebase to create a new user.
   this.firebaseApp.auth().createUserWithEmailAndPassword(
     this.state.email,
     this.state.password).then(() => {
       // then and catch are methods that we call on the Promise returned from
       // createUserWithEmailAndPassword
       alert('Your account was created!');
       this.setState({
         // Clear out the fields when the user logs in and hide the progress indicator.
         email: '',
         password: '',
       });
       Actions.signup({firebaseApp: this.firebaseApp});
   }).catch((error) => {
     alert("Account creation failed: " + error.message );
   });
  }

  login = () => {
    // Log in and display an alert to tell the user what happened.
    this.firebaseApp.auth().signInWithEmailAndPassword("tom@yom.dom", "Passssssss"
    ).then((userData) =>
      {
        Actions.home();
      }
    ).catch((error) =>
      {
        alert('Login Failed. Please try again');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>transPose</Text>
        <View style = {styles.inputContainer}>
          <View style = {{paddingTop: 20}}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'envelope'}
              iconColor={'white'}
              iconBackgroundColor={BLUE}
              placeholder={'Email'}
              borderColor={BLUE}
              borderBottomWidth={1}
              onChangeText={(text) => {this.setState({email: text});}}
            />
          </View>
          <View style = {{paddingTop: 20}}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'key'}
              iconColor={'white'}
              iconBackgroundColor={BLUE}
              placeholder={'Password'}
              borderColor={BLUE}
              borderBottomWidth={1}
              onChangeText={(text) => {this.setState({password: text});}}
            />
          </View>
          <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 30,}}>
            <TouchableOpacity style = {styles.login} onPress = {() => {this.signup()}}>
              <Text style = {{color: 'white', fontWeight: 'bold'}}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.login} onPress = {() => {this.login()}}>
              <Text style = {{color: 'white', fontWeight: 'bold'}}>Login</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style = {{alignSelf: 'center', paddingTop: 20}} onPress = {() => {alert("sucks to suck.")}}>
            <Text style = {{color: PINK, textDecorationLine: 'underline'}}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    top: 150,
    position: 'absolute',
    color: PINK,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: screen.width,
    padding: 40,
    position: 'absolute',
    top: 150,
    justifyContent: 'space-around'
  },
  login: {
    backgroundColor: PINK,
    height: 40,
    width: 80,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
