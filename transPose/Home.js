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

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style = {styles.welcomeText}>transPose</Text>
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
});
