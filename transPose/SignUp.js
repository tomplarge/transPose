import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Picker
} from 'react-native';

import {Hoshi} from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase';

const PINK = "#E89DC5"
const BLUE = "#83C9DB"
const screen = Dimensions.get('window');

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transitioning_to: "m",
      location: "",
      name: "",
    }
  }

  updateInfo = () => {
    var user = this.props.firebaseApp.auth().currentUser;
    var uid = user.uid;

    if (this.state.name == "" || this.state.location == "") {
      alert("Please enter all info");
    }

    else {
      firebase.database().ref('users/' + uid).set({
        email: user.email,
        transitioning_to: this.state.transitioning_to,
        location: this.state.location,
        images: ['0'],
        name: this.state.name,
      });
      Actions.home({firebaseApp: this.props.firebaseApp});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style = {styles.welcomeText}>transPose</Text>
        </View>
        <View style = {styles.inputContainer}>
          <Hoshi
            iconClass={FontAwesomeIcon}
            label={'Name'}
            color={BLUE}
            borderColor={BLUE}
            onChangeText={(text) => {this.setState({name: text});}}
          />
          <Hoshi
            iconClass={FontAwesomeIcon}
            label={'Location'}
            color={BLUE}
            borderColor={BLUE}
            onChangeText={(text) => {this.setState({location: text});}}
          />
          <View style = {{height: 50, borderColor: BLUE, borderBottomWidth: 1, justifyContent: 'center', padding: 10,}}>
            <Text>Transitioning To</Text>
            <TouchableOpacity
              onPress = {() => {this.setState({transitioning_to: 'm'})}}
              style = {[styles.pickerStyle, {right: 60, backgroundColor: this.state.transitioning_to == 'm' ? BLUE : 'white'}]}>
              <Text>M</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress = {() => {this.setState({transitioning_to: 'f'})}}
              style = {[styles.pickerStyle, {right: 10, backgroundColor: this.state.transitioning_to == 'f' ? BLUE : 'white'}]}>
              <Text>F</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style = {styles.nextButton} onPress = {this.updateInfo}>
          <Text style = {styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
    width: screen.width,
    top: 30,
    position: 'absolute',
    borderBottomWidth: 1,
    borderColor: PINK,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: PINK,
  },
  inputContainer: {
    width: screen.width,
    top: 70,
    justifyContent: 'space-around'
  },
  pickerStyle: {
    position: 'absolute',
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: BLUE,
    borderWidth: 2,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  nextButton: {
    height: 50,
    width: 80,
    borderRadius: 25,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    backgroundColor: BLUE,
    justifyContent: 'center'
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
