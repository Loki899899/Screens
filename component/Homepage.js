import React, { Component } from 'react';
import { View, Text, StatusBar, Image, AsyncStorage, TouchableOpacity,SafeAreaView } from 'react-native';
import Overview from '../component/OverView';
import Activies from '../component/recentactivities'
import PostFetch from "../ajax/PostFetch"

import Header from "./DrawerHeader";
import { Scales } from "@common"

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
import NetworkUtils from "../common/globalfunc"
import Toast from 'react-native-simple-toast';

import {URL} from "../ajax/PostFetch"

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wallet_credit: null,

    }
  }




  Get_wallet_credit = async () => {
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Key': await AsyncStorage.getItem('token')
    };

    await fetch(URL.api_url+"wallet-amount", {
      method: 'GET',
      headers: header
    })
      .then(response => response.json())
      .then(respJson => {
        if (respJson != null) {

          if (respJson.error == 0) {

            let amt = respJson.data.amount
            if(amt<0){
              amt = 0
            }
            this.setState({
              wallet_credit: amt
            })

          }
          else {
            alert(respJson.message)
          }


        }
        else {
          // alert("Something Went Wrong !!!")
        }
      })
      .catch(async (err) => {

        let check_connection = await NetworkUtils.isNetworkAvailable()
        if (check_connection) {
          
          Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

        }
        else {
          Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
        }
      })
  }
  componentDidMount = () => {
    
    this.Get_wallet_credit()

    console.log(this.props, "HOME PAGE")


  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
      <View style={{ flex: 1, backgroundColor: "#faf9fd", }}>
        <Header heading="Dashboard" {...this.props} textalign="center" left={Scales.deviceWidth * 0.08} credit={true} credit_amount={this.state.wallet_credit} />
        <View style={{height:Scales.deviceHeight*0.012}}></View>

        <NavigationContainer  >
          <Tab.Navigator {...this.props} tabBar={props => <MyTabBar {...props} />}  >
            <Tab.Screen   name="Overview" >{() => <Overview nav={this.props.navigation} Get_wallet_credit={this.Get_wallet_credit} />}</Tab.Screen>
            <Tab.Screen name="Recent Activites"  >{() => <Activies nav={this.props.navigation} />}</Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>

    )
  }
}


export default HomePage


function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', width: "100%", height: Scales.deviceHeight*0.07, backgroundColor: "#faf9fd" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, backgroundColor: "#faf9fd" }}
          ><View style={{ backgroundColor: isFocused ? '#7f8c97' : '#faf9fd', width: Scales.deviceWidth*0.45, justifyContent: "center", alignSelf: 'center', height: Scales.deviceHeight*0.058, borderRadius: 10 }}>
              <Text style={{ textAlign: "center",fontSize:Scales.moderateScale(14), fontFamily: "roboto-medium", color: isFocused ? "white" : 'black' }}>
                {label}
              </Text></View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}