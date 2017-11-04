import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';

import {Scene, Router} from 'react-native-router-flux';
export default class App extends React.Component {
  cons
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={Login} {...this.props} title="Login" hideNavBar initial/>
          <Scene key="signup" component={SignUp} {...this.props} title="SignUp" hideNavBar/>
          <Scene key="home" component={Home} {...this.props} title="Home" hideNavBar/>
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
