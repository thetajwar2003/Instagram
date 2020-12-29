import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from 'react-native'
import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBACmOEyKEZVl9WSjABXe3a3P1yoVM4Ozg",
  authDomain: "instagram-dev-b1e35.firebaseapp.com",
  projectId: "instagram-dev-b1e35",
  storageBucket: "instagram-dev-b1e35.appspot.com",
  messagingSenderId: "495982200519",
  appId: "1:495982200519:web:82af082759c42d3b1520e2",
  measurementId: "G-SSM48LDT69"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './components/auth/Register'
import Landing from './components/auth/Landing';


const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>User is logged in</Text>
      </View>
    )
  }
}

export default App