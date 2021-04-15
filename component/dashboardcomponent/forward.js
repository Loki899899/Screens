// /*Example of Collapsible - Accordion - Expandable View in React Native*/
import React, { Component } from 'react';

// //import react in our project
import {
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView, Keyboard

} from 'react-native';
// //import basic react native components
// import * as Animatable from 'react-native-animatable';
// //import for the animation of Collapse and Expand
import Collapsible from 'react-native-collapsible';
// import for the collapsible/Expandable view

// //import for the Accordion view
import PostFetch from "../../ajax/PostFetch"
import { CheckBox } from "react-native-elements"
import Header from "../DrawerHeader"
import { Scales } from "@common"
import Stars from 'react-native-stars';
import Modal from "react-native-modal"
import FeatherI from "react-native-vector-icons/Feather"
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment"
import Toast from "react-native-simple-toast"
import KeyboardDoneButton from '../KeyBoard'
import Tags from "react-native-tags";
import TagInput from 'react-native-tag-input';


const inputProps = {
  keyboardType: 'default',
  placeholder: '',
  style: {
    fontSize: 14,
    marginVertical: Platform.OS == 'ios' ? 10 : -2,
  },
};




class ForwardProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed_1: true,
      collapsed: true,
      mcq_coll: true,
      audio_coll: true,
      essay_coll: true,
      mcq_check: false,
      essay_check: false,
      audio_check: false,
      video_check: false,
      video_question: [],
      audio_question: [],
      mcq_question: [],
      essay_question: [],
      question: [],
      selected: [],
      send_to: [],
      reply_to: [],
      message: null, share_check: false, share: 0, alert_modal: false, show_toast: false, toast_message: '',
      show_toast_reply_to: false, toast_message_reply_to: '', loader: false, scroll: true,
      expired_date: "",
      modalvisible: false,
      date_format: "DD/MM/YYYY",
      tags: [],
      text: "",
      text_rply:''

    }
  }

  // "1" => 'Video',
  // "2" => 'MCQ',
  // "3" => 'Essay',
  // '4' => 'Audio',


  onSubmit = async () => {
    // this.setState({ loader: true })

    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Key': await AsyncStorage.getItem('token')
    };
    if (this.state.send_to.length == 0) {
      if (String(this.state.text).length != 0) {
        
        let arr = [this.state.text]
        await this.setState({ send_to: arr,text:"" })
      }
      else {
        Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM)

        return 0
      }
      //this.setState({ show_toast: true, toast_message: "Enter Email Address", loader: false })

    }
    if(this.state.send_to.length>0){
      if (String(this.state.text).length != 0) {
        let arr = this.state.send_to 
        arr.push(this.state.text)
        this.setState({send_to:arr, text:""})
      }
    }
    
    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const email_test = re.test(String(this.state.send_to).toLowerCase());
    // if(email_test==false){
    //   this.setState({show_toast:true,toast_message:"Enter Valid Email Address"})
    //   return 0
    // }

    console.log("this.state.send_to", this.state.send_to)

    if(this.state.reply_to.length==0){
      if(this.state.text_rply.length!=0){
        let arr = [this.state.text_rply]
       await this.setState({reply_to:arr,text_rply:"" })
      }
    }
    if(this.state.reply_to.length>0){
      if (String(this.state.text_rply).length != 0) {
        let arr = this.state.reply_to 
        arr.push(this.state.text_rply)
        this.setState({reply_to:arr, text_rply:""})
      }
    }

    if (this.state.message == null || /^[\s/]*$/g.test(this.state.message) || this.state.message == "") {
      Toast.showWithGravity("Enter Message", Toast.SHORT, Toast.BOTTOM)
      // this.setState({ show_toast_message: true, toast_message_msg: "Enter Message", loader: false })
      return 0
    }


    for (let x of this.state.send_to) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const email_test = re.test(String(x).toLowerCase());
      if (email_test == false) {
        this.setState({ loader: false })
        Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
        //  this.setState({ show_toast: true, toast_message: "Enter valid Email Address" });
        return 0;
      }
    }


    if (this.state.reply_to.length != 0) {
      console.log(this.state.reply_to, "----rply to---")
      for (let x of this.state.reply_to) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email_test = re.test(String(x).toLowerCase());
        if (email_test == false) {
          this.setState({ loader: false })
          Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
          //  this.setState({ show_toast: true, toast_message: "Enter valid Email Address" });
          return 0;
        }
      }
    }

    this.setState({ alert_modal: true, loader: true })
    let ques_id = this.state.selected

    if (this.state.selected.length == 0) {
      ques_id = null
    }
    let expired_date = moment(this.state.expired_date).toISOString()
    console.log(this.state.reply_to)
    let payload = {
      "email": this.state.send_to.join(),
      "applied_id": this.props.navigation.state.params.pitcher_data.evalution_list.applied_id,
      "message": this.state.message,
      "shareProfile": this.state.share,
      "reply_email": this.state.reply_to.join(),
      "ques_id": this.state.selected,
    }
    if (this.state.reply_to.length == 0) {
      payload = {
        "email": this.state.send_to.join(),
        "applied_id": this.props.navigation.state.params.pitcher_data.evalution_list.applied_id,
        "message": this.state.message,
        "shareProfile": this.state.share,
        "ques_id": this.state.selected,
      }
    }
    if (this.state.expired_date != "") {
      payload = {
        "email": this.state.send_to.join(),
        "applied_id": this.props.navigation.state.params.pitcher_data.evalution_list.applied_id,
        "message": this.state.message,
        "shareProfile": this.state.share,

        "ques_id": this.state.selected,
        "expired_date": expired_date.slice(0, 10)
      }
      if (this.state.reply_to.length != 0) {
        payload.reply_to = this.state.reply_to.join()
      }
    }
    console.log(payload)

    console.log(payload, "LLLLLLLLLLLLLLsLLLLLLLLLLLLLLLLLLLLLLLLLLL")
    const json = await PostFetch("forward", payload, headers)
    console.log(json)
    if (json != null) {
      if (json.error == 0) {
        // console.log(json.data.job_status, ":::::")
        // this.setState({ alert_modal: true })

      }
      else {
        alert(json.message)
      }
    }


    this.setState({ loader: false })

  }

  onok = () => {
    this.setState({ alert_modal: false })
    this.props.navigation.goBack()
  }

  OnSelectedQuestion = (id) => {

    let ids = this.state.selected

    ids.push(id)
    this.setState({ selected: ids })
    // console.log(this.state.selected)

  }

  OnRemoveQuestion = (id) => {
    this.state.selected.pop(id)
    // console.log(this.state.selected)

  }

  expire_date = async (date) => {
    let today = moment().format("YYYY-MM-DD")
    let select_dates = moment.utc(date).format("YYYY-MM-DD")
    // let next_date_from_today = moment(today).add(1, "day")
    if (today > select_dates) {
      Toast.showWithGravity("Select valid date", Toast.SHORT, Toast.BOTTOM);
      return 0
    }
    let dates = date
    await this.setState({ expired_date: dates, modalvisible: false })

  }

  change = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed_1: !this.state.collapsed_1 });
  };

  open = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
    return true;
  }






  componentDidMount = async () => {
    let date_format = await AsyncStorage.getItem('date_format')
    if (date_format == null) {
      this.setState({ date_format: "YYYY/MM/DD" })
    }
    else {
      this.setState({ date_format: date_format })
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    console.log(this.props)
    this.setState({
      video_question: this.props.navigation.state.params.video_interview_question,
      audio_question: this.props.navigation.state.params.audio_interview_question,
      mcq_question: this.props.navigation.state.params.mcq_interview_question,
      essay_question: this.props.navigation.state.params.essay_interview_question
    })


  }

  onChangeTags = (tags) => {
    console.log("on change text", this.state.text,)
    this.setState({ send_to : tags });
  }

  onChangeText = async(text) => {
    this.setState({ text:text });

    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];

    if (parseWhen.indexOf(lastTyped) > -1) {
      
     await this.setState({
        send_to: [...this.state.send_to, this.state.text],
        text: "",
      });
      console.log("console.log()",this.state.send_to)
    }
   
 
  }

  onChangeTagsRply = (tags) => {
    this.setState({ reply_to:tags });
  }

  onChangeTextRply = (text) => {
    this.setState({ text_rply:text });

    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];

    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        reply_to: [...this.state.reply_to, this.state.text_rply],
        text_rply: "",
      });
    }
   
  }

  labelExtractor = (tag) => tag;
  labelExtractorRply = (tag) => tag;
  render() {

    let pitcher_data = this.props.navigation.state.params.pitcher_data
    this.img = this.props.navigation.state.params.image
    console.log("tags", this.state.send_to, "text", this.state.text)
    return (

      <SafeAreaView style={{ flex: 1 }}>
        {/* <KeyboardDoneButton style={{ flex: 1 }} /> */}
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Header heading="Forward Profile" {...this.props} textalign='center' left={Scales.deviceWidth * 0.08} back={true} />
          {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"}> */}
          <ScrollView style={{ flex: 1 }}  >


            <View style={{ flex: 1 }}>
              <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.27, }}>
                <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.14, justifyContent: "flex-end" }}>
                  {this.img == null ? <View style={{ width: Scales.deviceHeight * 0.12, height: Scales.deviceHeight * 0.12, justifyContent: "center", alignSelf: 'center', borderRadius: (Scales.deviceHeight * 0.12) / 2, borderWidth: 2, borderColor: "#483da8" }}>
                    <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(28), color: "#483da8", fontFamily: 'roboto-medium' }}>{pitcher_data.evalution_list.pitcher_data.jobma_pitcher_fname.slice(0, 1)}{pitcher_data.evalution_list.pitcher_data.jobma_pitcher_lname.slice(0, 1)}</Text>
                  </View> :
                    <View style={{ width: Scales.deviceHeight * 0.12, height: Scales.deviceHeight * 0.12, justifyContent: "center", alignSelf: 'center', borderRadius: (Scales.deviceHeight * 0.12) / 2, borderWidth: 2, borderColor: "#483da8" }}>
                      <Image source={{ uri: this.props.navigation.state.params.image }} onError={this.img = null} style={{ width: Scales.deviceHeight * 0.12, height: Scales.deviceHeight * 0.12, alignSelf: "center", borderRadius: (Scales.deviceHeight * 0.12) / 2 }} />
                    </View>}

                </View>

                <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.14, paddingTop: Scales.deviceHeight * 0.012 }}>
                  <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{pitcher_data.evalution_list.pitcher_data.jobma_pitcher_fname}  {pitcher_data.evalution_list.pitcher_data.jobma_pitcher_lname}</Text>
                  <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{pitcher_data.evalution_list.pitcher_data.jobma_pitcher_email}</Text>
                  <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.06, paddingTop: Scales.deviceHeight * 0.012, }}>
                    <Stars
                      half={true}
                      default={parseFloat(pitcher_data.avg_rating)}
                      update={(val) => { this.setState({ stars: val }) }}
                      spacing={4}
                      starSize={16}
                      disabled={true}
                      count={5}
                      fullStar={pitcher_data.avg_rating > 0 && pitcher_data.avg_rating < 1.5 ? require('../../assets/Images/red_star.png') : pitcher_data.avg_rating > 1 && pitcher_data.avg_rating < 3.5 ? require('../../assets/Images/star.png') : pitcher_data.avg_rating > 3 && pitcher_data.avg_rating < 5.5 ? require('../../assets/Images/green_star.png') : null}
                      emptyStar={require('../../assets/Images/empty-star.png')}
                      halfStar={pitcher_data.avg_rating > 0.0 && pitcher_data.avg_rating <= 1.0 ? require('../../assets/Images/half_red_star.png') : pitcher_data.avg_rating > 1.0 && pitcher_data.avg_rating <= 3.0 ? require('../../assets/Images/half-filled-star.png') : pitcher_data.avg_rating > 3.0 && pitcher_data.avg_rating <= 5.0 ? require('../../assets/Images/half_green_star.png') : null} />

                  </View>
                </View>

              </View>



              <View style={{ width: Scales.deviceWidth * 1.0, paddingLeft: Scales.deviceWidth * 0.04, paddingRight: Scales.deviceWidth * 0.04 }}>
                <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center', }}>
                  <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#3c3c3c" }}>SEND TO*</Text>
                  <Text style={{ textAlign: 'left', fontFamily: "roboto-regular", fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>(Commas can be used to make tags or separate multiple message recipients)</Text>

                </View>
                <View style={{ width: Scales.deviceWidth * 0.92, minHeight: Scales.deviceHeight * 0.05, justifyContent: 'flex-end' }}>
                  {/* <Tags

                      textInputProps={{


                      }}
                      style={{ borderWidth: 0.5, paddingLeft: Scales.deviceWidth * 0.005, borderColor: "#c7c7c7", borderRadius: Scales.moderateScale(5) }}

                      onChangeTags={tags => this.setState({ send_to: tags })}
                      onTagPress={(index, tagLabel, event, deleted) =>
                        console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                      }
                      containerStyle={{ justifyContent: "center", backgroundColor: '#faf9fd', justifyContent: "center", minHeight: Scales.deviceHeight * 0.05, }}
                      inputStyle={{ backgroundColor: "#faf9fd", fontSize: Scales.moderateScale(14) }}
                      renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                        <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                          <View style={{padding:5}}>
                          <Text style={{ color: '#3c3c3c', backgroundColor: '#c7c7c7' ,fontSize: Scales.moderateScale(14), height: Scales.deviceHeight * 0.03, paddingLeft: Scales.moderateScale(10), paddingRight: Scales.moderateScale(10), textAlignVertical: "center", borderRadius: Scales.moderateScale(12) }}>{tag}</Text>

                          </View>
                          
                        </TouchableOpacity>
                      )}
                    />
                     */}


                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf9fd', borderColor: "#c7c7c7", borderRadius: Scales.moderateScale(5), borderWidth: 0.5, paddingLeft: 5 }}>

                    <TagInput
                      value={this.state.send_to}
                      onChange={this.onChangeTags}
                      labelExtractor={this.labelExtractor}
                      text={this.state.text}
                      onChangeText={this.onChangeText}
                      tagColor="#c7c7c7"
                      tagTextColor="white"
                      inputProps={inputProps}

                    />
                  </View>



                  {/* <TextInput placeholderTextColor = {"#c7c7c7"}  placeholderTextColor={"#3c3c3c"} onChangeText={(text) => this.setState({ send_to: text })} style={{ width: Scales.deviceWidth * 0.915, alignSelf: "center", height: Scales.deviceHeight * 0.055, borderRadius: 5, paddingLeft: Scales.deviceWidth * 0.04, borderWidth: 0.5, backgroundColor: '#faf9fd', color: "black", borderColor: "#bdbdbd", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(14) }} placeholder="Enter Email ID" /> */}
                </View>
                {this.state.show_toast ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-start", }}>
                  <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                    <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                  </View>

                  <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: "white" }}>{this.state.toast_message}</Text>
                  </View>

                  <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                  <TouchableOpacity onPress={() => this.setState({ show_toast: false })}>
                    <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                      <Image source={require("../../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                    </View></TouchableOpacity>
                </View> : null}

                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.065, justifyContent: 'flex-end' }}>
                  <View style={{ width: Scales.deviceWidth * 0.25, minHeight: Scales.deviceHeight * 0.03, justifyContent: 'center', }}>
                    <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#3c3c3c" }}>REPLY TO</Text>
                  </View>
                  <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>(You can set email id to use for receiving replies)</Text>
                </View>

                <View style={{ width: Scales.deviceWidth * 0.92, minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center' }}>

                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf9fd', borderColor: "#c7c7c7", borderRadius: Scales.moderateScale(5), borderWidth: 0.5, paddingLeft: 5 }}>

                    <TagInput
                      value={this.state.reply_to}
                      onChange={this.onChangeTagsRply}
                      labelExtractor={this.labelExtractorRply}
                      text={this.state.text_rply}
                      onChangeText={this.onChangeTextRply}
                      tagColor="#c7c7c7"
                      tagTextColor="white"
                      inputProps={inputProps}

                    />
                  </View>

                  {/* <Tags


                      style={{ borderWidth: 0.5, paddingLeft: Scales.deviceWidth * 0.005, borderColor: "#c7c7c7", borderRadius: Scales.moderateScale(5) }}

                      onChangeTags={tags => this.setState({ reply_to: tags })}
                      onTagPress={(index, tagLabel, event, deleted) =>
                        console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                      }

                      containerStyle={{ justifyContent: "center", backgroundColor: '#faf9fd', minHeight: Scales.deviceHeight * 0.05, }}
                      inputStyle={{ backgroundColor: "#faf9fd", fontSize: Scales.moderateScale(14) }}
                      renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                        <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                          <View style={{ padding: 5 }}>
                            <Text style={{ color: '#3c3c3c', backgroundColor: '#c7c7c7', fontSize: Scales.moderateScale(14), height: Scales.deviceHeight * 0.03, paddingLeft: Scales.moderateScale(10), paddingRight: Scales.moderateScale(10), textAlignVertical: "center", borderRadius: Scales.moderateScale(12) }}>{tag}</Text>

                          </View>
                        </TouchableOpacity>
                      )}
                    /> */}
                  {/* <TextInput placeholderTextColor = {"#c7c7c7"}   placeholderTextColor={"#3c3c3c"} onChangeText={(text) => this.setState({ reply_to: text })} style={{ width: Scales.deviceWidth * 0.915, alignSelf: "center", fontSize: Scales.moderateScale(14), height: Scales.deviceHeight * 0.05, borderRadius: 5, paddingLeft: Scales.deviceWidth * 0.04, borderWidth: 0.5, backgroundColor: '#faf9fd', color: "black", borderColor: "#bdbdbd", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(14) }} placeholder="Reply to Email" /> */}
                </View>



                {this.state.show_toast_reply_to ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-start", }}>
                  <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                    <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                  </View>

                  <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: "white" }}>{this.state.toast_message_reply_to}</Text>
                  </View>

                  <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                  <TouchableOpacity onPress={() => this.setState({ show_toast_reply_to: false })}>
                    <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                      <Image source={require("../../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                    </View></TouchableOpacity>
                </View> : null}



                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.05, justifyContent: 'flex-end' }}>
                  <View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.03, justifyContent: 'center', }}>
                    <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#3c3c3c" }}>SELECT QUESTION</Text>
                  </View>

                </View>


                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end', }}>
                  <View style={{ width: Scales.deviceWidth * 0.915, alignSelf: "center", height: Scales.deviceHeight * 0.05, backgroundColor: "#faf9fd", flexDirection: "row", borderWidth: 0.5, borderColor: "#bdbdbd", borderRadius: 5 }}>
                    <View style={{ width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.05, justifyContent: "center", paddingLeft: Scales.deviceWidth * 0.05 }}>
                      <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: "roboto-medium", }}>QUESTION</Text>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.20, height: Scales.deviceHeight * 0.05, justifyContent: "center", paddingLeft: Scales.deviceWidth * 0.05 }}>
                      <TouchableOpacity style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center" }} onPress={this.change}>{this.state.collapsed_1 == false ? <Image source={require("../../assets/Images/minusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "cover", aspectRatio: Scales.moderateScale(5) }} /> : <Image source={require("../../assets/Images/plusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }} />}</TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/*Content of Single Collapsible*/}
                <Collapsible collapsed={this.state.collapsed_1} align="center">
                  <View style={{ width: Scales.deviceWidth * 0.92, backgroundColor: 'white', elevation: 5, borderRadius: 5, borderWidth: 0.3, elevation: 5 }}>
                    {/* Video Question */}


                    <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.05, alignItems: "center", borderBottomWidth: 0.3, flexDirection: "row" }}>
                      {/* <CheckBox value={this.state.video_check} onChange={() => this.setState({ video_check: !this.state.video_check })} /> */}
                      <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <Text style={{ fontFamily: "roboto-regular", paddingLeft: Scales.deviceWidth * 0.04, color: "#7f7f7f", paddingTop: Scales.deviceHeight * 0.01, width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.05, fontSize: Scales.moderateScale(14) }}>Video Question</Text>
                      </View>
                      <View style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <TouchableOpacity style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center" }} onPress={() => this.setState({ collapsed: !this.state.collapsed, scroll: !this.state.scroll })}>{this.state.collapsed == false ? <Image source={require("../../assets/Images/minusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "cover", aspectRatio: Scales.moderateScale(5) }} /> : <Image source={require("../../assets/Images/plusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }} />}</TouchableOpacity>
                      </View>

                    </View>
                    <Collapsible collapsed={this.state.collapsed} align="center">
                      <View style={{ width: Scales.deviceWidth * 0.92, borderBottomWidth: 0.3, maxHeight: Scales.deviceHeight * 0.10 }}>
                        <ScrollView nestedScrollEnabled={true}>
                          <FlatList
                            data={this.state.video_question}
                            renderItem={({ item }) => <CollapseQuestion data={item} OnSelectedQuestion={this.OnSelectedQuestion} OnRemoveQuestion={this.OnRemoveQuestion} />}
                            style={{ width: Scales.deviceWidth * 0.92 }}
                            keyExtractor={(item, index) => String(index)}
                            scrollEnabled={true}

                          />
                        </ScrollView>
                      </View>

                    </Collapsible>


                    {/* video question end */}

                    {/* MCQ Question */}


                    <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.05, alignItems: "center", borderBottomWidth: 0.3, flexDirection: "row" }}>
                      {/* <CheckBox value={this.state.mcq_check} onChange={() => this.setState({ mcq_check: !this.state.mcq_check })} /> */}
                      <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <Text style={{ fontFamily: "roboto-regular", paddingLeft: Scales.deviceWidth * 0.04, fontSize: Scales.moderateScale(14), color: "#7f7f7f", paddingTop: Scales.deviceHeight * 0.01, width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.05, }}>MCQ Question</Text>
                      </View>
                      <View style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>

                        <TouchableOpacity style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center" }} onPress={() => this.setState({ mcq_coll: !this.state.mcq_coll, scroll: !this.state.scroll })}>{this.state.mcq_coll == false ? <Image source={require("../../assets/Images/minusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "cover", aspectRatio: Scales.moderateScale(5) }} /> : <Image source={require("../../assets/Images/plusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }} />}</TouchableOpacity>
                      </View>
                    </View>

                    <Collapsible collapsed={this.state.mcq_coll} align="center">

                      <View style={{ width: Scales.deviceWidth * 0.92, borderBottomWidth: 0.3, maxHeight: Scales.deviceHeight * 0.10 }}>
                        <ScrollView nestedScrollEnabled={true}>
                          <FlatList
                            data={this.state.mcq_question}
                            renderItem={({ item }) => <CollapseQuestion data={item} OnSelectedQuestion={this.OnSelectedQuestion} OnRemoveQuestion={this.OnRemoveQuestion} />}
                            style={{ width: Scales.deviceWidth * 0.92, }}
                            keyExtractor={(item, index) => String(index)}
                            scrollEnabled={true}


                          />
                        </ScrollView>
                      </View>


                    </Collapsible>


                    {/* MCQ question end */}


                    {/* Audio Question */}


                    <View style={{ width: Scales.deviceWidth * 0.92, alignItems: "center", borderBottomWidth: 0.3, flexDirection: "row" }}>
                      {/* <CheckBox value={this.state.audio_check} onChange={() => this.setState({ audio_check: !this.state.audio_check })} /> */}
                      <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <Text style={{ fontFamily: "roboto-regular", paddingLeft: Scales.deviceWidth * 0.04, fontSize: Scales.moderateScale(14), color: "#7f7f7f", paddingTop: Scales.deviceHeight * 0.01, width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.05, }}>Audio Question</Text>
                      </View>
                      <View style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <TouchableOpacity style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center" }} onPress={() => this.setState({ audio_coll: !this.state.audio_coll, scroll: !this.state.scroll })}>{this.state.audio_coll == false ? <Image source={require("../../assets/Images/minusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "cover", aspectRatio: Scales.moderateScale(5) }} /> : <Image source={require("../../assets/Images/plusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }} />}</TouchableOpacity>
                      </View>
                    </View>


                    <Collapsible collapsed={this.state.audio_coll} align="center">
                      <View style={{ width: Scales.deviceWidth * 0.92, borderBottomWidth: 0.3, maxHeight: Scales.deviceHeight * 0.10 }}>
                        <ScrollView nestedScrollEnabled={true}>
                          <FlatList
                            data={this.state.audio_question}
                            renderItem={({ item }) => <CollapseQuestion data={item} OnSelectedQuestion={this.OnSelectedQuestion} OnRemoveQuestion={this.OnRemoveQuestion} />}
                            style={{ width: Scales.deviceWidth * 0.92 }}
                            keyExtractor={(item, index) => String(index)}
                            scrollEnabled={true}


                          />
                        </ScrollView>

                      </View>
                    </Collapsible>


                    {/* Audio question end */}

                    {/* essay Question */}


                    <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.05, alignItems: "center", flexDirection: "row" }}>
                      {/* <CheckBox value={this.state.essay_check} onChange={() => this.setState({ essay_check: !this.state.essay_check })} /> */}
                      <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <Text style={{ fontFamily: "roboto-regular", paddingLeft: Scales.deviceWidth * 0.04, fontSize: Scales.moderateScale(14), color: "#7f7f7f", paddingTop: Scales.deviceHeight * 0.01, width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.05, }}>Essay Question</Text>
                      </View>
                      <View style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                        <TouchableOpacity style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.05, justifyContent: "center" }} onPress={() => this.setState({ essay_coll: !this.state.essay_coll, scroll: !this.state.scroll })}>{this.state.essay_coll == false ? <Image source={require("../../assets/Images/minusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "cover", aspectRatio: Scales.moderateScale(5) }} /> : <Image source={require("../../assets/Images/plusblack.png")} style={{ alignSelf: "flex-end", resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }} />}</TouchableOpacity>
                      </View>
                    </View>


                    <Collapsible collapsed={this.state.essay_coll} align="center">
                      <View style={{ width: Scales.deviceWidth * 0.92, borderBottomWidth: 0.3, maxHeight: Scales.deviceHeight * 0.10 }}>
                        <ScrollView nestedScrollEnabled={true}>
                          <FlatList
                            data={this.state.essay_question}
                            renderItem={({ item }) => <CollapseQuestion data={item} OnSelectedQuestion={this.OnSelectedQuestion} OnRemoveQuestion={this.OnRemoveQuestion} />}
                            style={{ width: Scales.deviceWidth * 0.92, }}
                            keyExtractor={(item, index) => String(index)}
                            scrollEnabled={true}


                          />
                        </ScrollView>
                      </View>
                    </Collapsible>


                    {/* essay question end */}




                  </View>
                </Collapsible>

                <View style={{ width: Scales.deviceWidth * 0.92, minHeight: Scales.deviceHeight * 0.07, justifyContent: 'flex-end' }}>
                  <View style={{ minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center', }}>
                    <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#3c3c3c" }}>EVALUATION LINK EXPIRY DATE</Text>
                    <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(10), fontFamily: "roboto-medium", color: "#c7c7c7" }}>(7 days by default)</Text>
                  </View>

                </View>
                <TouchableOpacity onPress={() => this.setState({ modalvisible: true })}>
                  <View style={{ width: Scales.deviceWidth * 0.915, alignSelf: "center", height: Scales.deviceHeight * 0.06, flexDirection: "row", backgroundColor: '#faf9fd', borderRadius: 10, borderWidth: 0.5, borderColor: "#bdbdbd" }}>
                    <View style={{ width: Scales.deviceWidth * 0.74, height: Scales.deviceHeight * 0.06, justifyContent: "center" }}>
                      <Text style={{ paddingLeft: Scales.deviceWidth * 0.05, fontSize: Scales.moderateScale(14) }}>{this.state.expired_date == "" ? "Date" : moment(String(this.state.expired_date).slice(0, 15)).format(this.state.date_format)}</Text>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.15, justifyContent: "center", alignItems: "center", height: Scales.deviceHeight * 0.06, }}>
                      <FeatherI name={"calendar"} size={24} style={{ alignSelf: "center" }} />
                    </View>
                  </View></TouchableOpacity>

                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.05, justifyContent: 'flex-end' }}>
                  <View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.04, justifyContent: 'center', }}>
                    <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#3c3c3c" }}>MESSAGE*</Text>
                  </View>


                </View>


                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.12, justifyContent: 'flex-end' }}>
                  <TextInput placeholderTextColor={"#c7c7c7"} placeholderTextColor={"#3c3c3c"} multiline={true} onChangeText={(text) => this.setState({ message: text })} style={{ width: Scales.deviceWidth * 0.915, alignSelf: "center", textAlign: "auto", textAlignVertical: "top", height: Scales.deviceHeight * 0.12, borderRadius: 5, paddingLeft: Scales.deviceWidth * 0.04, borderWidth: 0.5, backgroundColor: '#faf9fd', color: "black", borderColor: "#bdbdbd", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(14) }} placeholder="Message" />
                </View>

                {this.state.show_toast_message ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-start", }}>
                  <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                    <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                  </View>

                  <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: "white" }}>{this.state.toast_message_msg}</Text>
                  </View>

                  <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                  <TouchableOpacity onPress={() => this.setState({ show_toast_message: false })}>
                    <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                      <Image source={require("../../assets/Images/rejected.png")} stycheckedle={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                    </View></TouchableOpacity>
                </View> : null}



                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.08, alignItems: "center", flexDirection: "row" }}>
                  <CheckBox checked={this.state.share_check} size={Scales.moderateScale(22)} containerStyle={{ right: 5 }} onPress={() => this.setState({ share: this.state.share == 0 ? 1 : 0, share_check: !this.state.share_check })} />
                  <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(12), color: "#3c3c3c", right: Scales.deviceWidth * 0.025 }}>Share candidate profile</Text>
                </View>


                <View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.08, borderRadius: 5 }}>
                  <TouchableOpacity disabled={this.state.loader} onPress={() => this.onSubmit()}><View style={{ width: Scales.deviceWidth * 0.92, height: Scales.deviceHeight * 0.055, borderRadius: 10, backgroundColor: 'blue', justifyContent: "center" }}>
                    <Text style={{ width: Scales.deviceWidth * 0.92, textAlign: "center", color: 'white', fontSize: Scales.moderateScale(18), fontFamily: "roboto-medium", }}>Send</Text>
                  </View></TouchableOpacity>
                </View>

              </View>

            </View>

            <Modal isVisible={this.state.alert_modal} transparent={true} >
              {this.state.loader == true ?
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                </View> :
                <View style={{flex:1}}>
                  <View style={{  width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 1.0, justifyContent: "center", }}>
                  <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.16, borderRadius: 10, opacity: 1, alignSelf: "center" }}>


                    <View style={{}}>
                      <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', paddingTop: Scales.deviceHeight * 0.02, fontSize: Scales.moderateScale(16) }}>Email sent successfully.</Text>


                      <View style={{ width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.onok()}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, backgroundColor: 'blue', alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>

                          <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                        </View></TouchableOpacity>
                      </View>
                    </View>


                  </View>


                </View>
                </View>
                }
            </Modal>

            <Modal
              animationType="fade"
              transparent={true}
              isVisible={this.state.modalvisible}
              onRequestClose={() => this.setState({ modalvisible: false })}

            >



              <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.42, borderRadius: 10, alignSelf: "center", backgroundColor: 'white' }}>

                <View style={{ height: Scales.deviceWidth * 0.10, justifyContent: "center", alignSelf: "flex-end", right: Scales.deviceWidth * 0.02 }} >
                  <TouchableOpacity onPress={() => this.setState({ modalvisible: !this.state.modalvisible })}><Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }} /></TouchableOpacity>
                </View>
                <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.30 }}>

                  <CalendarPicker
                    onDateChange={(date) => this.expire_date(date)}
                    todayBackgroundColor="blue"
                    selectedDayColor="#7300e6"
                    selectedDayTextColor="#FFFFFF"
                    enableSwipe={true}
                    //minDate={moment()}
                    width={Scales.deviceWidth * 0.75}

                  />
                </View>



              </View>



            </Modal>



          </ScrollView>
          {/* </KeyboardAvoidingView> */}



          {/* <Modal isVisible={this.state.loader}>

            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
            </View>

          </Modal> */}
        </View>

      </SafeAreaView>
    )
  }
}

export default ForwardProfile



class CollapseQuestion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      select_question: [],
      check: false, count: 0
    }
  }
  open = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };

  add_question() {

    if (this.state.check == false) {
      this.setState({ check: !this.state.check, count: this.state.count + 1, check: true })
      this.props.OnSelectedQuestion(this.props.data.ques)

    }
    else {
      this.setState({ check: !this.state.check })
      if (this.state.count == 0) {
        this.setState({ check: false })
      }
      this.setState({ count: this.state.count - 1 })
      this.props.OnRemoveQuestion(this.props.data.ques)

    }

  }
  componentDidMount() {
    // console.log(this.props, "forward")

  }
  render() {


    return (
      <React.Fragment>
        <View style={{ width: Scales.deviceWidth * 1.0, flexDirection: "row", backgroundColor: '#ededed', borderBottomWidth: 0.3, alignItems: 'center', }}>
          <CheckBox
            style={{ left: Scales.deviceWidth * 0.025, alignSelf: 'flex-start' }}
            checked={this.state.check}
            containerStyle={{ height: Scales.deviceHeight * 0.035, width: Scales.deviceWidth * 0.08, justifyContent: "center" }}
            wrapperStyle={{ height: Scales.deviceHeight * 0.035, width: Scales.deviceWidth * 0.05, alignSelf: "center" }}
            onPress={() => this.add_question()}


          />
          <Text style={{ paddingLeft: Scales.deviceWidth * 0.025, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), width: Scales.deviceWidth * 0.85 }}>{this.props.data.ques_title}</Text>

        </View>

      </React.Fragment>
    )
  }
}




