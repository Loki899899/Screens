//This is an example code to get DatePicker// 
import React, { Component } from 'react';
//import react in our code. 
import {View,AsyncStorage, StyleSheet} from 'react-native';
//import all the components we are going to use.
import DatePicker from 'react-native-datepicker';
//import DatePicker from the package we installed
import {Scales} from "@common"
import moment from "moment"

export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    //set value in state for initial date
    this.state = {date:"15-05-2018",date_format:""}
  }
  componentDidMount=async()=>{
    let date_format =   await AsyncStorage.getItem('date_format')
        console.log(date_format , "=---------date_format----------")
        if(date_format != null){
            this.setState({date_format:date_format})
            
        }
        else{
            this.setState({date_format:"YYYY/MM/DD"})  
        }
      console.log(this.props)
      var today = new Date();
        var dd = String(today.getDate())
        var mm = String(today.getMonth()) //January is 0!
        var yyyy = today.getFullYear();
        
        today = new Date(yyyy, mm, dd)
        today = moment.utc(today).add(2,'day').format("DD-MM-YYYY")
     
        this.setState({date:today})
        
  }

  update_date=(date)=>{
    let update = date
    this.props.OnSelecteDate(update)
  }
  render(){
    let date = moment.utc(this.props.selected_date).format(this.state.date_format)
    // console.log(this.props.selected_date, "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
    return (
      <View style={styles.container}>

        <DatePicker
          style={{width:Scales.deviceWidth*0.62,}}
          showIcon={false}
          date={date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format={this.state.date_format}
          minDate={this.state.date}
          maxDate="01-01-2025"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
        customStyles={{
            dateInput:{borderWidth:0,height:Scales.deviceHeight*0.04,},
            
            dateText: {
                fontSize: Scales.moderateScale(12),
                fontFamily:"roboto-medium",paddingRight:Scales.deviceWidth*0.35
        
            }
        }}
          onDateChange={(date) => this.update_date(date)}
        />

      </View>
    )
  }
}
const styles = StyleSheet.create ({
 container: {

    width:Scales.deviceWidth*0.62, height:Scales.deviceHeight*0.05, borderWidth: 0.8, borderColor: "#5c49e0", fontSize:Scales.moderateScale(12), fontFamily:"roboto-medium", borderRadius:5,borderTopRightRadius:0,borderBottomRightRadius:0, borderRightWidth:0   
}
})