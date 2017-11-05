import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Picker,
  Image
} from 'react-native';

import {Hoshi} from 'react-native-textinput-effects';
import Icon from "react-native-vector-icons/MaterialIcons";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Actions} from 'react-native-router-flux'
import * as firebase from 'firebase';
// import * as admin from "firebase-admin";

const PINK = "#E89DC5"
const BLUE = "#83C9DB"
const screen = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoURI: null,
      userIds: [],
      currIdx: null,
      users: null,
    }
  }

  componentDidMount() {
    this.getUsers();
  }

  async getUsers() {
    var ref = firebase.database().ref('users/');
    var firebaseApp = this.props.firebaseApp;

    await ref.once("value", (snapshot) => {
      var users = {};
      var currUserId = firebaseApp.auth().currentUser.uid;
      var currUser = snapshot.val()[currUserId];
      var userIds = [];
      // console.log('curruser: ', currUser);
      snapshot.forEach((user) => {
        let u = user.val();
        let uid = user.key;
        // console.log(users);
        console.log(u.transitioning_to, currUser.transitioning_to, u.transitioning_to != currUser.transitioning_to && u.location == currUser.location);
        if (u.transitioning_to != currUser.transitioning_to && u.location == currUser.location) {
          // console.log(uid);
          users[uid] = u;
          userIds.push(uid);
        }
      })
      this.setState({users: users, userIds: userIds, currIdx: 0});
      this.downloadImage(0);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  }

  downloadImage = (currIdx) => {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child("users/" + this.state.userIds[currIdx] + '/images/0.png');
    imageRef.getDownloadURL().then((uri) => {this.setState({photoURI: uri})});
  }

  renderImage = () => {
    if (this.state.photoURI != null) {
      return (<Image style = {styles.photo} source = {{uri: this.state.photoURI}}/>)
    }
  }

  nextPic = () => {
    if (this.state.currIdx < this.state.userIds.length - 1) {
      let currIdx = this.state.currIdx + 1;
      this.setState({currIdx});
      this.downloadImage(currIdx);
    }
  }

  prevPic = () => {
    if (this.state.currIdx > 0) {
      let currIdx = this.state.currIdx - 1;
      this.setState({currIdx});
      this.downloadImage(currIdx);
    }
  }

  likePic = () => {
    var likerId = firebase.auth().currentUser.uid;
    var likeeId = this.state.userIds[this.state.currIdx];
    firebase.database().ref('likes/' + likerId + '/' + likeeId).set(true);
    alert('You Liked Them!');
    var theyLikeYouTooRef = firebase.database().ref('likes/' + likeeId + '/' + likerId);
    theyLikeYouTooRef.on('value', function(snapshot) {
      if (snapshot.val() == true) {
        alert('They like you too!');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Text style = {styles.welcomeText}>transPose</Text>
        </View>
        {this.renderImage()}
        <View style = {styles.buttonsContainer}>
          <TouchableOpacity style = {styles.button} onPress = {() => {this.prevPic()}}>
            <Icon name = "arrow-back" size = {25} color = {BLUE}/>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.button} onPress = {() => {this.likePic()}}>
            <CommunityIcon name = "heart" size = {25} color = {BLUE}/>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.button} onPress = {() => {this.nextPic()}}>
            <Icon name = "arrow-forward" size = {25} color = {BLUE}/>
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
  photo: {
    height: 350,
    width: 250,
    position: 'absolute',
    top: 100,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: screen.width
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },

});
