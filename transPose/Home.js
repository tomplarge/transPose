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
      users: {},
      likes: {},
    }
  }

  componentDidMount() {
    this.getUsers();
  }

  async getUsers() {
    var ref = firebase.database().ref('users/');
    var firebaseApp = this.props.firebaseApp;
    var currUserId = firebaseApp.auth().currentUser.uid;

    await ref.once("value", (snapshot) => {
      var users = {};
      var currUser = snapshot.val()[currUserId];
      var userIds = [];
      var likes = {}

      snapshot.forEach((user) => {
        let u = user.val();
        let uid = user.key;
        likes[uid] = false;

        if (u.transitioning_to != currUser.transitioning_to && u.location == currUser.location) {
          users[uid] = u;
          userIds.push(uid);
        }
      })

      this.setState({users: users, userIds: userIds, currIdx: 0, likes: likes});
      this.downloadImage(0);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })

    var likesRef = firebase.database().ref('likes/' + currUserId);

    await likesRef.once("value", (snapshot) => {
      if (snapshot.val()) {
        var uids = Object.keys(snapshot.val());
        var likes = {}

        for (var idx = 0; idx < uids.length; idx++) {
          console.log('val: ', snapshot.val()[uids[idx]])
          if (snapshot.val()[uids[idx]]) {
            likes[uids[idx]] = true;
          }
        }
        console.log('likes:', likes)
        this.setState({likes: likes});
      }
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
      return (
        <View style = {styles.photoContainer}>
          <Text style = {styles.photoText}>{this.state.users[this.state.userIds[this.state.currIdx]].name}</Text>
          <Image style = {styles.photo} source = {{uri: this.state.photoURI}}/>
        </View>
      )
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

  likeUnlikePic = () => {
    var likerId = firebase.auth().currentUser.uid;
    var likeeId = this.state.userIds[this.state.currIdx];
    var likes = this.state.likes;
    var likeState = true
    if (likes[likeeId]) {
      likeState = false
    }
    likes[likeeId] = likeState;
    this.setState({likes: likes});
    firebase.database().ref('likes/' + likerId + '/' + likeeId).set(likeState);

    var theyLikeYouTooRef = firebase.database().ref('likes/' + likeeId + '/' + likerId);
    if (likeState) {
      theyLikeYouTooRef.on('value', function(snapshot) {
        if (snapshot.val() == true) {
          alert('They like you too!');
        }
      });
    }
    else {
      theyLikeYouTooRef.off();
    }
  }



  render() {
    console.log(this.state);
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
          <TouchableOpacity style = {styles.button} onPress = {() => {this.likeUnlikePic()}}>
            <CommunityIcon name = "heart" size = {25} color = {this.state.likes[this.state.userIds[this.state.currIdx]] ? PINK : BLUE}/>
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
  photoContainer: {
    position: 'absolute',
    top: 80,
    height: 400,
    alignItems: 'center'
  },
  photoText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: BLUE,
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
  },
  photo: {
    height: 350,
    width: 250,
    bottom: 0,
    position: 'absolute'
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
