import React, { Component } from 'react';
import {Scales} from "@common"
import {
  View,

  AsyncStorage,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import moment from 'moment';



import CalendarStrip from 'react-native-calendar-strip';
// import { Image } from 'native-base';


export default class Calendars extends Component {
  state = {
    datesWhitelist: [
      {
        start: moment(),
        end: moment().add(365, 'days'), // total 4 days enabled
      },
    ],
    todoList: [],
    markedDate: [],
    currentDate: this.props.currnetDate,
    isModalVisible: false,
    selectedTask: null,
    isDateTimePickerVisible: false,
  };

  constructor(props) {
    super(props)
    // console.log(this.props, "caleder")
    // this._handleDeletePreviousDayTask();
    // console.log(Scales.deviceHeight*0.20)
  }
  

 

  render() {

    const {
      state: {
        datesWhitelist,
        markedDate,

      },

    } = this;
    let calender_date = moment(this.props.currnetDate).subtract(1,'day').format("YYYY-MM-DD")
    //   console.log('calender props',this.props.currnetDate)
    return (
      
      <View style={{flex:1, justifyContent:"center"}}>
        
      <View
        style={{
            // backgroundColor:'red',
          // paddingTop: Constants.statusBarHeight,
          // backgroundColor: 'blue',
          // borderRadius: 20,
          // marginTop: 30, 
          // alignSelf:'center',
          height:Scales.deviceHeight*0.23
          

        }}
      >
        
        <ImageBackground source={require("../assets/Images/cal_background.png")}   style={{width: Scales.deviceWidth*0.95 ,alignSelf:"center",height: Scales.deviceHeight*0.21,}}>

        
        <CalendarStrip
          
          ref={ref => {
            this.calenderRef = ref;
          }}
          
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            // highlightColor: 'blue',
          }}
          style={{
            height: Scales.deviceHeight*0.18,
            width: "100%",
            // position: "absolute"
            backgroundColor:'transparent',
            // overflow:"hidden, "
            // paddingTop: 20,
            // paddingBottom: 50,
          }}
         
          
          calendarHeaderStyle={{ color: 'white', alignSelf: 'center', fontFamily: "roboto-regular", paddingTop: Scales.deviceHeight*0.03 }}
          dateNumberStyle={{ color: 'white', paddingTop: Scales.deviceHeight*0.01, }}
          dateNameStyle={{ color: 'white', fontFamily: "roboto-regular" }}
          highlightDateNumberStyle={{
            color: 'white',
            
            // backgroundColor: '#2E66E7',

            fontFamily: "roboto-regular",
            // marginTop: 10,
            height: Scales.deviceHeight*0.05,
            width: Scales.deviceHeight*0.05,
            textAlign: 'center',
            borderRadius: Scales.deviceHeight*0.025,
            borderColor: "white",
            borderWidth: 1.5,
            overflow: 'hidden',
            paddingTop: Scales.deviceHeight*0.01,
            fontWeight: '400',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          iconRightStyle={{
            marginBottom:Scales.deviceHeight*0.07,marginRight:Scales.deviceHeight*0.01
          }}
          iconLeftStyle={{
            marginBottom:Scales.deviceHeight*0.07,marginLeft:Scales.deviceHeight*0.01
          }}

          highlightDateNameStyle={{ color: 'white', }}
          disabledDateNameStyle={{ color: 'white' }}
          disabledDateNumberStyle={{ color: 'white',  fontFamily: "roboto-regular" }}
        
          iconLeft={require('../assets/left-arrow.png')}
          iconRight={require('../assets/right-arrow.png')}
          iconContainer={{ flex: 0.1 }}
          markedDates={markedDate}
          onDateSelected={date => {
            date = moment(date).add(1,'days')
            this.props.list_schedule_interview(date)
          }}
          selectedDate={calender_date}
        /></ImageBackground>


      </View>
      
      </View>
      
    );
  }
}
