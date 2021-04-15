import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar,ActivityIndicator,Platform,SafeAreaView } from 'react-native';
import Login from "./component/LoginScreen"
import ForgetPassword from './component/ForgetPassword'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import drawer from './component/DrawerNavigation'
import SetupInterview_second from './component/dashboardcomponent/schedule_interview_second'
import SetupInterview_last from './component/dashboardcomponent/schedule_interview_last'
import CreateJob from './component/dashboardcomponent/CreateJob'
import PendingEvaluation from "./component/subcomponent/PendingEvaluation"
import Evaluation from "./component/dashboardcomponent/EvaluationCandidates"
import Evaluated from "./component/subcomponent/Evaluate"
import RateCandidate from "./component/subcomponent/rate_candidate"
import ForwardProfile from "./component/dashboardcomponent/forward"
import SetupInterview from './component/dashboardcomponent/schedule_an_interview'
import Filter from "./component/subcomponent/fliter"
import LiveInterviewStart from "./component/LiveInterviewStart"

import Loading from "./Loading"
import * as Font from 'expo-font';
import Track from "./component/dashboardcomponent/TrackPage"
import EditProfile from "./component/dashboardcomponent/EditProfile"
import InvitationLogs from "./component/invitationLogs"

import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';


const LoadingScreen = createStackNavigator({
  loading:{
    screen:Loading,
    navigationOptions: {
      headerShown: false

    }

  }
})


const DrawerNav = createStackNavigator({
  Home: {
    screen: drawer,
    navigationOptions: {
      headerShown: false

    }
  },
  mid_setup_interview: {
    screen: SetupInterview_second,
    navigationOptions: {
      headerShown: false
    }

  },
  last_setup_interview: {
    screen: SetupInterview_last,
    navigationOptions: {
      headerShown: false
    }

  },
  create_job: {
    screen: CreateJob,
    navigationOptions: {
      headerShown: false
    }

  },
  pending: {
    screen: PendingEvaluation,
    navigationOptions: {
      headerShown: false
    }

  },
  evaluation: {
    screen: Evaluation,
    navigationOptions: {
      headerShown: false
    }

  },
  Evaluate: {
    screen: Evaluated,
    navigationOptions: {
      headerShown: false
    }

  },
  Rate: {
    screen: RateCandidate,
    navigationOptions: {
      headerShown: false
    }

  },
  forward : {
    screen:ForwardProfile,
    navigationOptions:{
        headerShown:false
    }
},
schedule : {
  screen:SetupInterview,
  navigationOptions:{
      headerShown:false
  }
},
filters : {
  screen:Filter,
  navigationOptions:{
      headerShown:false
  }
},
interview : {
  screen:LiveInterviewStart,
  navigationOptions:{
      headerShown:false
  }
},
track: {
  screen: Track,
  navigationOptions: {
    headerShown:false
  }
},
editprofile: {
  screen: EditProfile,
  navigationOptions: {
    headerShown:false
  }
},
logs: {
  screen: InvitationLogs,
  navigationOptions: {
    headerShown:false
  }
},



})


const AuthStack = createStackNavigator({

  loginscreen: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  },
  forgetscreen: {
    screen: ForgetPassword,
    navigationOptions: {
      headerShown: false
    }
  }


},
  { mode: "modal" })

const Apps = createAppContainer(createSwitchNavigator({
  LoadingScreen:LoadingScreen,
  authstack: AuthStack,
  DrawerNav: DrawerNav
},
  {
    initialRouteName: "LoadingScreen",

  }
))




export default class App extends Component{
  constructor(props){
    super(props)
    this.state={
      fontload:false
    }
  }

  GetPermissions=async()=>{
    try {
      let permissions =  ''
      let permision_write = ''
      if(Platform.OS=="ios"){
        permissions = PERMISSIONS.IOS.CAMERA
        permision_write = PERMISSIONS.IOS.PHOTO_LIBRARY
      }
      else{
        permissions = PERMISSIONS.ANDROID.CAMERA
        permision_write = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      }

      requestMultiple([permissions,permision_write])
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.log(error)
      });
    } catch (err) {
      console.log(err);
    }
  }

componentDidMount=async()=>{
  await Font.loadAsync({
    'roboto-medium': require('./assets/font/Roboto-Medium.ttf'),
    'roboto-regular': require('./assets/font/Roboto-Regular.ttf'),
    'roboto-bold': require('./assets/font/Roboto-Bold.ttf'),

});
this.setState({
    fontload: true
})
await this.GetPermissions()

}
  
  render(){
    
  return (
    ////<SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <StatusBar   barStyle={'dark-content'} />
      {this.state.fontload?<Apps {...this.props} />:<ActivityIndicator/>}


    </View>
    ////</SafeAreaView>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }

});
