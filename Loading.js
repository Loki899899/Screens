import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, AsyncStorage, ActivityIndicator,ImageBackground } from 'react-native';

import NetworkUtils from "./common/globalfunc"
import Toast from 'react-native-simple-toast';


export default class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      where: { lat: null, lng: null },
      error: null
    }

  }
  InternetConnectionCheck = () => {
    this.check = setInterval(this.checkInternet, 3000)

  }

  checkInternet = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable()
    if (isConnected) {
      let token = await AsyncStorage.getItem('token')
      if (token) {
        this.props.navigation.navigate("DrawerNav")
      }
      else {
        this.props.navigation.navigate("authstack")
      }
      clearInterval(this.check)

    }
    else {
      Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);

    }
  }

  componentDidMount = async () => {
    var date = new Date();
    var offsetInHours = date.getTimezoneOffset() / 60;
    console.log(offsetInHours, "-------------------------------offsethour of utme======================")
    this.InternetConnectionCheck()
  }



  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ImageBackground source={require("./assets/Images/splash_screen.png")} style={{flex:1}} />
      </View>
    )
  }
}
