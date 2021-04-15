import React, { Component } from 'react';
import Header from '../DrawerHeader';
import { View, TextInput, Text, TouchableOpacity, AsyncStorage, Image, ActivityIndicator, ImageBackground, FlatList,BackHandler,SafeAreaView,Keyboard } from 'react-native';
import PostFetch from '../../ajax/PostFetch'
import moment from 'moment';
import { Scales } from "@common"
import Modal from "react-native-modal"
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';
import NetworkUtils from "../../common/globalfunc"
import AntI from "react-native-vector-icons/AntDesign"
import {URL} from "../../ajax/PostFetch"
import KeyboardDoneButton from '../KeyBoard'


export default class SetupInterview_second extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Interviewkit_list: [],
            select_interviewkit: null,
            select_interviewkit_detail: null,
            message: '',
            offset: 0,
            limit: 20,
            loading: false,
            alert_modal: false,
            show_loader: false,
            is_unlimited: "false",
            wallet_credit: 0,
            interivew_kit: false,
            fixed_interview_kit: [],
            disbale_invite:true
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
                console.log(respJson)
                if (respJson != null) {

                    if (respJson.error == 0) {


                        this.setState({
                            wallet_credit: respJson.data.amount,
                            disbale_invite:false
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
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })
    }

    Schedule_interview = async () => {


        if (this.state.message == '') {
            Toast.showWithGravity("Please Enter Message", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        if (this.state.message.length > 200) {
            Toast.showWithGravity("Maximum 200 characters allowed.", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        if (this.props.navigation.state.params.interview_type == 1) {
            if (this.state.select_interviewkit_detail == null) {
                Toast.showWithGravity("Please Select Kit", Toast.SHORT, Toast.BOTTOM);
                return 0
            }
        }
        if(this.state.show_loader==true){return 0}
        this.setState({ show_loader: true,alert_modal:true })
        let date = (this.props.navigation.state.params.date)
        date = moment.utc(date).format("YYYY-MM-DD")



        
        let email = this.props.navigation.state.params.email
        let name = this.props.navigation.state.params.name
        let phone = this.props.navigation.state.params.phone
        if (phone == null) {
            phone = ''
        }
        let interview_type = null
        if (this.props.navigation.state.params.interview_type == 1) {
            interview_type = 1
        }
        else {
            interview_type = 2
        }

        let select_job = (this.props.navigation.state.params.select_job)
        // console.log(this.props.navigation.state.params, "this.props.navigation.state.params.interview_type")
        let payload = null
        if (this.props.navigation.state.params.interview_type == 1) {
            payload = {
                "name": name,
                'phone': String(phone),
                'email': email,
                'mode': interview_type,
                'job_id': select_job.id,
                'kit_id': this.state.select_interviewkit_detail.id,
                'message': this.state.message,
                'expiry_date': date,
                "confirmation": 0,
                "sms_notification": this.props.navigation.state.params.sms_notification,
                "country_code": String(this.props.navigation.state.params.country_code)
            }

        }
        else {

            if (this.state.is_unlimited == "false") {
                // console.log("wan")
                if (this.state.wallet_credit <= 0) {
                    alert("You dont have enough credits to invite live interview")
                    this.setState({ show_loader: false })
                    return 0
                }
            }
            let startime = this.props.navigation.state.params.start_time.name

            // startime = String(startime)
            // console.log(startime)
            let start_time_zone = startime.slice(6, 8)
            // console.log(start_time_zone, "start_time_zonestart_time_zone")

            startime = startime.slice(0, 5)
            if (start_time_zone == "PM") {
                if (parseInt(startime.slice(0, 2) < 12 && startime.slice(0, 2)) >= 1) {
                    let startime_time = parseInt(startime.slice(0, 2)) + 12
                    startime = startime_time.toString() + ":" + startime.slice(3, 6)
                    // console.log(startime, "starttime")

                }

            }


            let endtime = String(this.props.navigation.state.params.endtime.name)
            let endtime_time_zone = endtime.slice(6, 8)

            endtime = endtime.slice(0, 5)
            console.log(endtime, "-------------")
            if (endtime_time_zone == "PM") {
                if (parseInt(endtime.slice(0, 2) < 12 && endtime.slice(0, 2)) >= 1) {
                    let end_time = parseInt(endtime.slice(0, 2)) + 12
                    console.log(end_time, ":::::::::::")
                    endtime = end_time.toString() + ":" + endtime.slice(3, 6)
                    // console.log(startime, "starttime")

                }

            }



            payload = {
                "name": this.props.navigation.state.params.name,
                "email": this.props.navigation.state.params.email,
                "phone": String(phone),
                "mode": this.props.navigation.state.params.interview_type,
                "job_id": select_job.id,
                "message": this.state.message,
                "start_time": startime,
                "end_time": endtime,
                "timezone": this.props.navigation.state.params.timezone.key,
                "invite_date": date,
                "sms_notification": this.props.navigation.state.params.sms_notification,
                "country_code": String(this.props.navigation.state.params.country_code)
            }
        }


        // console.log(payload, "payload")

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        const json = await PostFetch("schedule-interview", payload, headers)
        // console.log(json)
        if (json != null) {
            // console.log(json, "RESPONS"
            if (json.error == 0) {
                this.setState({ alert_modal: true })

            }
            else {
                this.setState({ alert_modal: true })
                alert(json.message)
            }


        }

        this.setState({ show_loader: false })


    }
    onok = () => {
        this.setState({ alert_modal: false })
        this.props.navigation.navigate('fourthscreen')
    }

    Get_Kit = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "offset": 0,
            "limit": 150,

        }
        console.log("fjfj")
        const json = await PostFetch("kit-list", payload, headers)
        // console.log(json.data.kit_list)

        if (json != null) {

            console.log(json)
            if (json.error == 0) {
                let picker_datas = []
                for (let kit of json.data.kit_list) {
                    let context = {}
                    if (kit.is_active == 1) {
                        context = {
                            "id": kit.id,
                            "name": kit.title,
                            "interview_type": kit.interview_type,
                            "answer_duration":kit.answer_duration
                        }
                    }
                    else {
                        continue
                    }


                    picker_datas.push(context)
                }
                picker_datas = picker_datas.reverse()
                this.setState({
                    Interviewkit_list: picker_datas,
                    fixed_interview_kit: picker_datas,
                    offset: this.state.offset + 10,
                    limit: this.state.limit + 10

                })
            }
            else {
                Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
            }

        }
        else {
            // alert("Something Went Wrong !!!")
        }
        console.log(this.state.Interviewkit_list)
    }
    searchFilterFunction = (text) => {
        try{
        if (text.length != 0) {

            let newData = this.state.fixed_interview_kit.filter(item => {

                const itemData = String(item.name).toUpperCase()
                const textData = String(text).toUpperCase()

                // console.log(item.name, "LKKKK0", text)

                var b = itemData.match(textData)


                if (itemData.match(textData)) {

                    return item;

                }


            });

            this.setState({ Interviewkit_list: newData });

        }
        else {
            this.setState({ Interviewkit_list: this.state.fixed_interview_kit })
        }
    }
    catch(err){
        console.log(err)
    }


    };

    select_kit = (item) => {
        this.setState({ select_interviewkit_detail: item, interivew_kit: false })
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    navigationButtonPressed({ buttonId }) {
        this.handleBackPress();
    }

    handleBackPress = () => {
        //Custom logic

        // this.RestState()
        //    console.log(this.props.navigation.state.params.dash)
        // this.setState({ dash: false })
        this.props.navigation.goBack()
        return true;
    };

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        console.log(this.props.navigation.state.params, "-------------------")
        if (this.props.navigation.state.params.interview_type == 1) {
            console.log("21212")
            this.Get_Kit()
        }

        let is_unlimited = await AsyncStorage.getItem('unlimited')
        this.setState({ is_unlimited: is_unlimited })
        this.Get_wallet_credit()

    }

    enter_comment = (text) => {
        if (text.length > 200) {
            Toast.showWithGravity("Maximum 200 characters allowed.", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        this.setState({ message: text })
    }
    render() {
        
        return (
            
            <SafeAreaView style={{flex:1}}>
                              
            <View style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}>
                <Header heading="Invite" {...this.props} textalign='left' left={Scales.deviceWidth * 0.25} back={true} />
                <KeyboardDoneButton style={{flex:1}} />  
                <View style={{width:Scales.deviceWidth*1.0,height:Scales.deviceHeight*0.80, flexDirection: "column", }}>
                    {this.props.navigation.state.params.interview_type == 1 ? <View><View style={{ height: Scales.deviceHeight * 0.10,  paddingTop: Scales.deviceHeight*0.012, justifyContent: "center" }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ interivew_kit: !this.state.interivew_kit })}><View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                         
                            <View style={{ width: Scales.deviceWidth * 0.75, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, height: Scales.deviceHeight * 0.05, justifyContent: "center", backgroundColor: "#faf9fd", borderColor: "#c7c7c7", borderWidth: 0.5, alignSelf: "center" }}>
                                <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), paddingLeft: 5,color:"#3c3c3c" }}>{this.state.select_interviewkit_detail == null ? "Select interview kit" : this.state.select_interviewkit_detail.name}</Text>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.05, justifyContent: "center", borderTopRightRadius: 5, borderBottomRightRadius: 5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7", borderWidth: 0.5, alignSelf: "center" }}>
                                <Image source={require("../../assets/Images/drop-down.png")} style={{ resizeMode: "contain", alignSelf: "center", aspectRatio: 2 }} />
                            </View>

                        </View></TouchableOpacity>


                    </View>
                    
                    </View>
                        : null}

                    <View style={{ width: "90%", height: Scales.deviceHeight*0.13, marginTop: this.props.navigation.state.params.interview_type == 2 ? 20 : 0, alignSelf: "center", }}>
                   
                        <TextInput placeholderTextColor = {"#c7c7c7"}  placeholder={"Enter Message*"}multiline={true}  value={this.state.message} onChangeText={(text) => this.enter_comment(text)} style={{ backgroundColor: "#faf9fd",width:"100%" ,height:"100%",  fontSize: Scales.moderateScale(16), fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth*0.028, borderRadius: 10, borderWidth: 0.3, borderColor: "#c7c7c7", }} />
                    </View>
                </View>
               

                {this.props.navigation.state.params.interview_type == 1 ? <TouchableOpacity disabled={this.state.disbale_invite} onPress={this.Schedule_interview}>
                    <View style={{ width: "88%", height:  Scales.deviceHeight*0.065, backgroundColor: "#4c41ab",  alignSelf: "center", borderRadius: 10, justifyContent: "center" }}>
                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold",fontSize:Scales.moderateScale(20), color: "white",  }}>
                        Send
                    </Text>
                </View>
                </TouchableOpacity> : <TouchableOpacity disabled={this.state.disbale_invite } onPress={this.Schedule_interview}>
                    <View style={{ width: "88%", height: Scales.deviceHeight*0.065, backgroundColor: "#4c41ab",  alignSelf: "center", borderRadius: 10, justifyContent: "center" }}>
                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold", fontSize:Scales.moderateScale(20), color: "white", }}>
                        Send
                    </Text>
                </View>
                    </TouchableOpacity>}
                <Modal isVisible={this.state.alert_modal} style={{width:Scales.deviceWidth*1.0, height:Scales.deviceHeight*1.0, alignSelf:"center",alignItems:"center",justifyContent:"center"}} >
                    {this.state.show_loader==true?<View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={Scales.moderateScale(20)} style={{ alignSelf: "center" }} />
                    </View>:
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", backgroundColor: "transparent" }}>

                        <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.35, borderRadius: 10, opacity: 1, alignSelf: "center", }}>
                            <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.25, paddingTop: Scales.deviceHeight*0.008 }}>
                                <Image source={require("../../assets/Images/setup_interview_icon.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.18, alignSelf: 'center', paddingTop: 15 }} />
                                <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textAlign: "center", }}>Invited {"\n"} Successfully</Text>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, }}>
                                <ImageBackground source={require("../../assets/Images/big_bg.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, paddingTop: Scales.deviceHeight*0.008 }}>
                                        <TouchableOpacity onPress={() => this.onok()}><LinearGradient style={{ width: Scales.deviceWidth * 0.20, height: Scales.deviceHeight * 0.05, borderRadius: Scales.deviceHeight * 0.01, alignSelf: "center" }} colors={["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"]}><View style={{ width: Scales.deviceWidth * 0.20, justifyContent: "center", height: Scales.deviceHeight * 0.05, borderRadius: Scales.deviceHeight * 0.01, alignSelf: "center" }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textAlign: "center", color: "white" }}>Ok</Text>
                                        </View></LinearGradient></TouchableOpacity>

                                    </View>
                                </ImageBackground>

                            </View>
                        </View>



                    </View>}

                </Modal>
                {/* <Modal isVisible={this.state.show_loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={Scales.moderateScale(20)} style={{ alignSelf: "center" }} />
                    </View>

                </Modal> */}

                <Modal style={{justifyContent:"center", flex:1}} onBackButtonPress={() => this.setState({ interivew_kit: false })} isVisible={this.state.interivew_kit}>

                    <ScrollView>
                        <View style={{flex:1, justifyContent:"center"}}>
                            <View style={{ justifyContent: "center",marginTop:Scales.deviceHeight*0.05, width: Scales.deviceWidth * 0.85,alignSelf:"center", height: Scales.deviceHeight * 0.78, backgroundColor: 'white', borderRadius: 10 }}>
                        <View style={{ width: Scales.deviceWidth * 0.80,flexDirection:"row", height: Scales.deviceHeight * 0.05, alignSelf: "center", marginTop: Scales.deviceHeight*0.012 }}>
                            
                       
                            <TextInput placeholderTextColor = {"#c7c7c7"}  style={{ borderWidth: 0.5,width: Scales.deviceWidth * 0.70, borderRadius: 5, borderColor: "#c7c7c7",fontSize:Scales.moderateScale(14) }} placeholder={"Search kit"} onChangeText={(text) => this.searchFilterFunction(text)} />
                            <View style={{justifyContent:"center", width:Scales.deviceWidth*0.10}}>
                            <TouchableOpacity onPress={()=>this.setState({ interivew_kit: false })}><AntI  name={"close"} style={{alignSelf:"center"}} size={Scales.moderateScale(24)}/></TouchableOpacity>
                            </View>
                        </View>
                        {this.state.Interviewkit_list.length!=0?<View style={{width:Scales.deviceWidth*0.85,justifyContent:"center"}}><FlatList
                            data={this.state.Interviewkit_list}
                            renderItem={({ item, index }) => <Interview_kit_list data={item} index={index} select_kit={this.select_kit} />}
                            keyExtractor={item => item.id}
                            style={{ marginTop: Scales.deviceHeight*0.012, height: Scales.deviceHeight * 0.70, borderRadius: 10 }}
                        /></View>:
                        <View style={{flex:1,justifyContent:"center"}}>
                            <Text style={{alignSelf:"center",fontFamily:"roboto-medium",fontSize:Scales.moderateScale(14)}}>No kit found</Text>
                        </View>}
                    </View></View>
                    </ScrollView>

                </Modal>

            </View>
           
        </SafeAreaView>
        
        )

    }
}

class Interview_kit_list extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount = () => {
        // console.log(this.props.data)
    }
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.select_kit(this.props.data)}>
                <View style={{flexDirection:"row",width:Scales.deviceWidth*0.85,justifyContent:"space-between",borderTopWidth: this.props.index == 0 ? 0 : 0.5,minHeight:Scales.deviceHeight*0.06}}>
                    <View style={{ flexDirection:"row", alignItems: "center",    }}>
                        <Text style={{ fontFamily: "roboto-medium", paddingLeft:Scales.deviceWidth*0.028, textTransform: "capitalize",color:"#3c3c3c",fontSize:Scales.moderateScale(14)}}>{this.props.data.name}</Text>
                    </View>
                    <View style={{maxWidth:Scales.deviceWidth*0.43,justifyContent:"center",paddingRight:Scales.deviceWidth*0.08}}>
                        <Text style={{textAlign:"center",color:"#3c3c3c",fontSize:Scales.moderateScale(14)}}>{this.props.data.interview_type==1?"Default":this.props.data.interview_type==2?"Switch":this.props.data.interview_type==3?"Overall timer":null}</Text>
                    </View>
                </View>
                
                </TouchableOpacity>
        )
    }
}