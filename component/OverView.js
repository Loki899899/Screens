import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl, AsyncStorage, TextInput, FlatList, ImageBackground, Clipboard, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import Calendars from "./Calender"
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

import PostFetch from "../ajax/PostFetch"
import Toast from 'react-native-simple-toast';
import { Scales } from '@common';
import NetworkUtils from "../common/globalfunc"
import * as RNLocalize from "react-native-localize"

import { URL } from "../ajax/PostFetch"
import Modal from "react-native-modal"



export default class Overview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applicants: 0,
            selected: 0,
            rejected: 0,
            pending: 0,
            status_counts: [],
            modal_link_visible: false,
            modal_share_visible: false,
            refreshing: false,
            modal_type: 0,
            modal_link_data: {
                "acceptation": "1",
                "id": 15740,
                "interview_mode": "Live Video Interview",
                "interview_status": "In progress",
                "invitation_timezone": "Asia/Kolkata",
                "job_name": "searchjobapply",
                "jobma_interview_mode": "2",
                "jobma_interview_status": "1",
                "jobma_interview_token": "JjLNIznAEWRe5L7",
                "jobma_invitation_date": "04/16/2020 10:00 AM",
                "jobma_post": 24564,
                "pitcher_name": "Dxrtfcygvuhbkjn ",
                "pitcher_photo": "https://dev.jobma.com/storage/jobseeker_pics/",
            },

            schedule_index_start: 0,
            schedule_index_end: 3,

            pending_counter_last: 3,
            pending_counter_first: 0,
            wallet_credit: null,
            modal_3: [{}],
            schedule_interview: [],
            pending_evaluation: [],
            loadingSchedule:false,
            date_format: "DD/MM/YYYY",
            calenderCurrentDate:moment().add(1,'days').format('YYYY-MM-DD')

        }


    }

    GetUserPermission = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        let payload = {

            "sub_user_id": await AsyncStorage.getItem('user_id')

        }

        const json = await PostFetch("get-permission", payload, headers)
        if (json != null) {
            console.log(json, "----json")
            if (json.error == 0) {
                let permission = json.data.split(",")
                await AsyncStorage.setItem("permission", JSON.stringify(permission))
            }
            else {
                Toast.showWithGravity(json.message, Toast.LONG, Toast.BOTTOM);
            }
        }
    }




    GetScheduleInterView = async (date, first=false,) => {
        // console.log(date, "DD")
        let currentDates = moment(date).format('YYYY-MM-DD')
        this.setState({loadingSchedule:true})
        let dates = moment.utc(date).format("YYYY-MM-DD")
        console.log("date interivew===>>",dates)
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let payload = {
            "date": dates
        }
        if(first==true){
            
            currentDates = moment(date).add(1,'days').format("YYYY-MM-DD")
            console.log("this si tje first fate", currentDates)
        }
        console.log("====SVAINF DATE++++>>>>>", currentDates)
        let json = await PostFetch("interview-date", payload, header)
        if (json != null) {
            let data = json.data
            // console.log(data)
            data = data.reverse()
            if (json.error == 0) {
                this.setState({
                    schedule_interview: json.data,
                    schedule_index_start: 0,
                    schedule_index_end: 3,
                    calenderCurrentDate:currentDates,
                    loadingSchedule:false
                })
            }

        }
        console.log("calenderCurrentDate==>>", this.state.calenderCurrentDate)

        this.setState({loadingSchedule:false})

    }

    GetSubscriptionDetails = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        await fetch(URL.api_url + "subscription-detail", {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(async (respJson) => {
                console.log(respJson.data.paused, "-==-------------------respJson.data.paused-----------++")

                await AsyncStorage.setItem("subscription_status", JSON.stringify(respJson.data.paused))
                await AsyncStorage.setItem("StopByAdmin", JSON.stringify(respJson.data.StatusByAdmin))
            })
            .catch(async (err) => {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (!check_connection) {
                    Toast.showWithGravity("Check your internet connection", Toast.SHORT, Toast.BOTTOM);
                    return 0
                }
                else {
                    Toast.showWithGravity("Something Went Wrong!!!", Toast.LONG, Toast.BOTTOM)
                }
            })

    }


    GetPendingEvaulations = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        await fetch(URL.api_url + "pending-evaluation-list?offset=0&limit=10", {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(respJson => {
                for(let i= 0 ; i<3;i++){
                    console.log("respJson.data[i]==>>",respJson.data[i])
                }
                this.setState({
                    pending_evaluation: respJson.data
                })
            })
            .catch(async (err) => {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (!check_connection) {
                    Toast.showWithGravity("Check your internet connection", Toast.SHORT, Toast.BOTTOM);
                    return 0
                }
                else {
                    Toast.showWithGravity("Something Went Wrong!!!", Toast.LONG, Toast.BOTTOM)
                }
            })
    }

    GetStatusCount = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        await fetch(URL.api_url + "interview-count", {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(respJson => {
                if (respJson.error == 0) {

                    // console.log(respJson, "LLLLLLLLLLLLLLLLLLLLL")
                    this.setState({
                        status_counts: respJson.data
                    })
                }
                else {
                    alert(respJson.message)
                }

            })
            .catch(async (err) => {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (!check_connection) {
                    Toast.showWithGravity("Check your internet connection", Toast.SHORT, Toast.BOTTOM);
                    return 0
                }
                else {
                    Toast.showWithGravity("Something Went Wrong!!!", Toast.LONG, Toast.BOTTOM)
                }


            })

    }



    componentDidMount = async () => {
        let dd = await AsyncStorage.getItem('token')

        this.GetUserPermission()
        // console.log(dd, "token")
        let date_format = await AsyncStorage.getItem('date_format')
        if (date_format == null) {
            this.setState({ date_format: "YYYY/MM/DD" })
        }
        else {
            this.setState({ date_format: date_format })
        }



        var date = moment().format('YYYY-MM-DD')

        this.GetScheduleInterView(date, first=true)
        this.GetStatusCount()
        this.GetPendingEvaulations()
        this.GetSubscriptionDetails()


    }

    GetNextPendingEvaulations = () => {
        if (this.state.pending_evaluation.length == 0) {
            return 0
        }
        if (this.state.pending_evaluation.length < this.state.pending_counter_last + 3) {
            var dif = this.state.pending_evaluation.length - this.state.pending_counter_last
            if (this.state.pending_evaluation.length == this.state.pending_counter_last) {
                return
            }
            this.setState({
                pending_counter_first: this.state.pending_counter_first + 3,
                pending_counter_last: this.state.pending_counter_last + dif
            })
            return true
        }
        if (this.state.pending_evaluation.length - this.state.pending_counter_last < 3) {

            this.setState({
                pending_counter_first: this.state.pending_counter_first + 3,
                pending_counter_last: this.state.pending_counter_last + (this.state.pending_counter_last - this.state.pending_evaluation.length)

            })
            return true
        }
        this.setState({
            pending_counter_first: this.state.pending_counter_first + 3,
            pending_counter_last: this.state.pending_counter_last + 3
        })

    }

    GetNextScheduledInterview = () => {
        // console.warn(this.state.schedule_index_end-this.state.schedule_interview.length)
        if ((this.state.schedule_interview.length - this.state.schedule_index_end) == 1) {
            this.setState({
                schedule_index_start: this.state.schedule_index_start + 3,
                schedule_index_end: this.state.schedule_index_end + 1
            })
        }
        else if ((this.state.schedule_interview.length - this.state.schedule_index_end) == 2) {
            this.setState({
                schedule_index_start: this.state.schedule_index_start + 3,
                schedule_index_end: this.state.schedule_index_end + 2
            })
        }
        else if ((this.state.schedule_interview.length - this.state.schedule_index_end) == 3) {
            this.setState({
                schedule_index_start: this.state.schedule_index_start + 3,
                schedule_index_end: this.state.schedule_index_end + 3
            })
        }
        // else {
        //     this.setState({
        //         schedule_index_start: this.state.schedule_index_start + 3,
        //         schedule_index_end: this.state.schedule_index_end + 3
        //     })

        // }


        // console.warn("LLLLLLL")
        // if (this.state.schedule_interview.length < this.state.schedule_index_end + 3) {
        //     // console.warn("ppppp")
        //     var dif = this.state.schedule_interview.length - this.state.schedule_index_end
        //     // console.warn(dif, "((((((((((((((((((((((((((((diff)))))))))))))))))))))))))))))")
        //     if (this.state.schedule_interview.length == this.state.schedule_index_end) {
        //         return
        //     }
        //     this.setState({
        //         schedule_index_start: this.state.schedule_index_start + 3,
        //         schedule_index_end: this.state.schedule_index_end + dif
        //     })
        //     console.log(this.state.schedule_index_start)
        //     console.log(this.state.schedule_index_end)
        //     return true
        // }
        // if (this.state.schedule_interview.length - this.state.schedule_index_end < 3) {
        //     // console.warn("vvvvv")
        //     this.setState({
        //         schedule_index_start: this.state.schedule_index_start + 3,
        //         schedule_index_end: this.state.schedule_index_end + (this.state.schedule_index_end - this.state.schedule_interview.length)

        //     })
        //     return true
        // }
        // // console.warn(";;;;;;")
        // this.setState({
        //     schedule_index_start: this.state.schedule_index_start + 3,
        //     schedule_index_end: this.state.schedule_index_end + 3
        // })
        // console.log(this.state.schedule_index_start)
        // console.log(this.state.schedule_index_end)

    }


    GetPreviousPendingEvaulations = () => {
        if (this.state.pending_counter_first == 0) {
            return
        }
        if (this.state.pending_evaluation.length == this.state.pending_counter_last) {

            if (this.state.pending_counter_last % 2 == 0) {
                if (this.state.pending_counter_last - this.state.pending_counter_first == 1) {
                    // console.log("jsdngsdnkgnk")
                    this.setState({
                        pending_counter_last: this.state.pending_counter_last - 1,
                        pending_counter_first: this.state.pending_counter_first - 3


                    })
                    return 0
                }
                if (this.state.pending_counter_last - this.state.schedule_index_start == 2) {

                    this.setState({
                        pending_counter_last: this.state.pending_counter_last - 2,
                        pending_counter_first: this.state.pending_counter_first - 3


                    })
                    return 0
                }
                else {
                    this.setState({
                        pending_counter_last: this.state.pending_counter_last - (this.state.pending_counter_first),
                        pending_counter_first: this.state.pending_counter_first - 3


                    })
                    return 0
                }



            }
            else {
                if (this.state.pending_counter_last - this.state.pending_counter_first == 1) {
                    // console.log("222222222222222222")
                    this.setState({
                        pending_counter_last: this.state.pending_counter_last - 1,
                        pending_counter_first: this.state.pending_counter_first - 3


                    })
                    return 0
                }
                if (this.state.pending_counter_last - this.state.pending_counter_first == 2) {
                    // console.log("222222222222222222")
                    this.setState({
                        pending_counter_last: this.state.pending_counter_last - 2,
                        pending_counter_first: this.state.pending_counter_first - 3


                    })
                    return 0
                }
                else {
                    // console.log("333333333333333")
                    this.setState({
                        pending_counter_last: this.state.pending_counter_last - (this.state.pending_counter_first - 1),
                        pending_counter_first: this.state.pending_counter_first - 3


                    })
                    return 0
                }

            }

        }
        else {
            this.setState({
                pending_counter_first: this.state.pending_counter_first - 3,
                pending_counter_last: this.state.pending_counter_last - 3


            })

        }



    }

    GetPreviousScheduledInterview = () => {
        // console.log('ppppppppppppppppppppp')
        if (this.state.schedule_index_start == 0) {
            return
        }
        // console.warn(this.state.schedule_index_end-this.state.schedule_index_start,"this.state.schedule_interview.length-this.state.schedule_index_end")
        if ((this.state.schedule_index_end - this.state.schedule_index_start) == 1) {
            this.setState({
                schedule_index_start: this.state.schedule_index_start - 3,
                schedule_index_end: this.state.schedule_index_end - 1
            })
        }
        else if ((this.state.schedule_index_end - this.state.schedule_index_start) == 2) {

            this.setState({
                schedule_index_start: this.state.schedule_index_start - 3,
                schedule_index_end: this.state.schedule_index_end - 2
            })
        }
        else if ((this.state.schedule_index_end - this.state.schedule_index_start) == 3) {
            this.setState({
                schedule_index_start: this.state.schedule_index_start - 3,
                schedule_index_end: this.state.schedule_index_end - 3
            })
        }
        else {
            this.setState({
                schedule_index_start: this.state.schedule_index_start - 3,
                schedule_index_end: this.state.schedule_index_end - 1
            })

        }




    }

    UpdateEmployerLang = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        await fetch(URL.api_url + "emp-lang", {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(async (respJson) => {
                console.log(respJson)
                let date_format = "MM/DD/YYYY"
                if (respJson.data.date_format == "d/m/Y") {
                    date_format = "DD/MM/YYYY"
                }
                else if (respJson.data.date_format == "m/d/Y") {
                    date_format = "MM/DD/YYYY"
                }
                else if (respJson.data.date_format == "Y/m/d") {
                    date_format = "YYYY/MM/DD"
                }
                console.log(respJson.data, date_format, "---------date ---------")
                await AsyncStorage.setItem("date_format", date_format)
                this.setState({
                    date_format: date_format
                })
            })
            .catch(async (err) => {
                console.log("[[][][]]]")
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (!check_connection) {
                    Toast.showWithGravity("Check your internet connection", Toast.SHORT, Toast.BOTTOM);
                    return 0
                }
                else {
                    Toast.showWithGravity("Something Went Wrong!!!", Toast.LONG, Toast.BOTTOM)
                }

            })

    }

    GetEmployerDetails = async () => {
        let email = await AsyncStorage.getItem("email")
        let pass = await AsyncStorage.getItem("emp_pass")
        const payload = {
            email: email,
            password: pass
        }


        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const json = await PostFetch('employer-login', payload, header);
        // console.log(json)

        if (json != null) {
            // console.log(json)
            if (json.error == 0) {
                console.log(json)
                console.log(json.data.subscription_status)
                if (parseInt(json.data.subscription_status) == 0) {
                    Toast.showWithGravity("Yours subscription plan has been expired.    Please renew your subscription from website and continue the service", Toast.SHORT, Toast.BOTTOM)

                }
                else if (parseInt(json.data.subscription_status) == 2) {
                    Toast.showWithGravity("Yours subscription plan is stop from adminstration. Please contact to adminstration", Toast.SHORT, Toast.BOTTOM)

                }
                await AsyncStorage.setItem("emp_pass", this.state.password)
                await AsyncStorage.setItem("token", json.data.api_key)
                await AsyncStorage.setItem("email", json.data.email)
                await AsyncStorage.setItem("lname", json.data.jobma_catcher_lname)
                await AsyncStorage.setItem("fname", json.data.jobma_catcher_fname)
                await AsyncStorage.setItem("user_id", JSON.stringify(json.data.id))

                await AsyncStorage.setItem("unlimited", String(json.data.is_unlimited))

                // console.log(json)



            }

        }
        else {

            let check_connection = await NetworkUtils.isNetworkAvailable()
            if (!check_connection) {
                Toast.showWithGravity("Check your internet connection", Toast.SHORT, Toast.BOTTOM);
                return 0
            }
            else {
                Toast.showWithGravity("Something Went Wrong!!!", Toast.LONG, Toast.BOTTOM)
            }
        }
    }

    go_to_schedule = () => {
        this.props.nav.navigate("schedule", { "dash": true })
    }

    _OnRefresh = async () => {
        // this.GetEmployerDetails()
        this.GetUserPermission()
        this.setState({ refreshing: true})
          var date = moment(this.state.calenderCurrentDate).subtract(1,'days').format('YYYY-MM-DD')
        console.log("------tegrest",date)
          this.GetScheduleInterView(date,first=true)
        this.props.Get_wallet_credit()
        this.GetStatusCount()
        await this.GetPendingEvaulations()
        // await this.GetScheduleInterView(date)
        await this.UpdateEmployerLang()
      
        this.setState({ refreshing: false, schedule_index_end: 3, schedule_index_start: 0, pending_counter_first: 0, pending_counter_last: 3 })
    }


    SetDefault = () => {
        console.log("set default")
        this.setState({
            pending_counter_last: 3,
            pending_counter_first: 0,
        })
    }

    render() {

        //  Schedule interview Code       



        let schedule_index_start = this.state.schedule_index_start
        let schedule_index_end = this.state.schedule_index_end


        return (
            //<SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, backgroundColor: "white", }}>

                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._OnRefresh()} />}>

                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.076, borderRadius: 8, backgroundColor: "white", elevation: 9 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ height: Scales.deviceHeight * 0.077 }}>
                            {/* <View style={{ backgroundColor: "red", elevation: 5,width:Scales.deviceWidth*1.0, height: Scales.deviceHeight * 0.12 }}> */}
                            <View style={{ flexDirection: "row", elevation: 8, height: Scales.deviceHeight * 0.077, alignItems: "center" }}>
                                <View style={{ width: Scales.deviceWidth * 0.28, flexDirection: 'column', height: Scales.deviceHeight * 0.077, backgroundColor: "#eeeeee", borderRadius: 8, justifyContent: "center", }}>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontWeight: "500", color: "#3c3c3c", fontSize: Scales.moderateScale(16), }}>Applicants</Text>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>{this.state.status_counts.Application}</Text>
                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.26, height: Scales.deviceHeight * 0.077, justifyContent: "center", flexDirection: 'column', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(16), }}>Selected</Text>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>{this.state.status_counts.Selected}</Text>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.26, height: Scales.deviceHeight * 0.077, backgroundColor: "#eeeeee", justifyContent: "center", borderRadius: 10, flexDirection: 'column', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(16), }}>Rejected</Text>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>{this.state.status_counts.Rejected}</Text>

                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.26, height: Scales.deviceHeight * 0.077, justifyContent: "center", flexDirection: 'column', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(16), }}>Pending</Text>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>{this.state.status_counts.Pending}</Text>

                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.26, height: Scales.deviceHeight * 0.077, backgroundColor: "#eeeeee", borderRadius: 10, justifyContent: "center", }}>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(16), }}>On Hold</Text>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-bold", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>{this.state.status_counts.On_Hold}</Text>
                                </View>
                                {/* </View> */}
                            </View>
                        </ScrollView>
                    </View>



                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.27, justifyContent: "center", backgroundColor: "#faf9fd" }}>

                        <Calendars currnetDate={this.state.calenderCurrentDate} schedule={this.go_to_schedule} list_schedule_interview={this.GetScheduleInterView} />

                    </View>

                    {/*                   schedule interview               */}

                    <View style={{ width: Scales.deviceWidth * 1.00, backgroundColor: '#faf9fd', flexDirection: 'column', }}>
                        <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.04, flexDirection: 'row', backgroundColor: "#ebebeb", elevation: 5, alignSelf: "center", borderRadius: 5 }}>
                            <View style={{ paddingLeft: Scales.deviceWidth * 0.03, justifyContent: "center", height: Scales.deviceHeight * 0.04,flexDirection:"row" }}>
                                <Text style={{ fontSize: Scales.moderateScale(16), fontFamily: 'roboto-medium', color: "#3c3c3c",textAlignVertical:"center" }}>Scheduled Interviews</Text>
                               {this.state.loadingSchedule?<View style={{paddingLeft:5, justifyContent:"center"}}>
                                <ActivityIndicator size={10} />
                               </View>:false}
                            </View>
                            <View style={{ alignItems: "center", width: Scales.deviceWidth * 0.50, flexDirection: 'row', height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                            {this.state.schedule_interview.length == 0 ?null:<Text style={{ fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>Showing  </Text>}
                                {this.state.schedule_interview.length == 0 ? null : <Text style={{ fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>{this.state.schedule_index_start == 0 ? this.state.schedule_index_start + 1 : this.state.schedule_index_start + 1} - {this.state.schedule_interview.length > 3 ? this.state.schedule_index_end : this.state.schedule_interview.length} of {this.state.schedule_interview.length}</Text>}
                                {this.state.schedule_interview.length > 3 ? <View style={{ borderRadius: 5, backgroundColor: '#493da9', width: Scales.deviceWidth * 0.05, justifyContent: "center", height: Scales.deviceHeight * 0.025, marginLeft: Scales.deviceWidth * 0.02 }}>
                                    <TouchableOpacity onPress={() => this.GetPreviousScheduledInterview()} ><Image source={require("../assets/Images/left.png")} style={{ resizeMode: 'contain', aspectRatio: 0.4, resizeMode: 'contain', alignSelf: "center" }} /></TouchableOpacity>
                                </View> : null}
                                {this.state.schedule_interview.length > 3 ? <View style={{ borderRadius: 5, backgroundColor: '#493da9', justifyContent: "center", width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.025, marginLeft: 5 }}>
                                    <TouchableOpacity onPress={() => this.GetNextScheduledInterview()} ><Image source={require("../assets/Images/right.png")} style={{ resizeMode: 'contain', aspectRatio: 0.4, alignSelf: "center" }} /></TouchableOpacity>
                                </View> : null}
                            </View>
                        </View>


                        {this.state.schedule_interview.length != 0 ?
                            <View style={{ width: Scales.deviceWidth * 1.00, }}><FlatList
                                data={this.state.schedule_interview.slice(schedule_index_start, schedule_index_end)}

                                style={{ marginTop: Scales.deviceHeight * 0.01, alignSelf: "center" }}
                                renderItem={({ item, index }) => <Schedule_Interview date_format={this.state.date_format} index={index} nav={this.props.nav} index={index} interview={item} />}
                                keyExtractor={(item, index) => String(index)}

                            // onRefresh = {()=>this._refresh}
                            // refreshing={this.state.refreshing}
                            // onEndReached = {this._get_more_data}
                            // onEndReachedThreshold={1}
                            />
                            </View> : <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', paddingTop: Scales.deviceHeight * 0.028, fontSize: Scales.moderateScale(12) }}>No Scheduled Interview Today</Text>}


                        {/* {this.state.schedule_interview.length == 0 ? null : <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.03, alignItems: 'flex-end', top: 8 }}>
                            <LinearGradient colors={['#6059bb', '#5e57b9', "#534ab1", '#483ca8']} style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.025, borderRadius: 5, }}>
                                <TouchableOpacity onPress={() => { this.props.nav.navigate("track", { "previous_screen": "dash" }) }}><View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.025, borderRadius: 5, }}>
                                    <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: "roboto-regular", textAlign: "center", color: 'white' }}>View More</Text>
                                </View></TouchableOpacity>
                            </LinearGradient>
                        </View>} */}

                    </View>
                    {/*                    Pending Evaulations               */}

                    <View style={{ width: Scales.deviceWidth * 1.00, backgroundColor: '#faf9fd', flexDirection: 'column', paddingLeft: Scales.deviceWidth * 0.025, }}>
                        <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.04, flexDirection: 'row', backgroundColor: '#ebebeb', borderRadius: 5, elevation: 5, marginTop: 5 }}>
                            <View style={{ paddingLeft: 10, width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                <Text style={{ fontSize: Scales.moderateScale(16), color: "#3c3c3c", fontFamily: 'roboto-medium' }}>Awaiting Decision</Text>
                            </View>
                            <View style={{ justifyContent: 'center', width: Scales.deviceWidth * 0.47, alignItems: "center", height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>
                                <Text style={{ fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>Showing  </Text>
                                {this.state.pending_evaluation.length == undefined ? null : this.state.pending_evaluation.length == 0 ?
                                    <Text style={{ fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>0 - 0</Text> :
                                    <Text style={{ fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>{this.state.pending_counter_first == 0 ? this.state.pending_counter_first + 1 : this.state.pending_counter_first + 1} - {this.state.pending_counter_last} of {this.state.pending_evaluation.length}</Text>}
                                <View style={{ borderRadius: 5, backgroundColor: '#493da9', width: Scales.deviceWidth * 0.052, height: Scales.deviceHeight * 0.026, marginLeft: 8, justifyContent: "center" }}>
                                    <TouchableOpacity onPress={this.GetPreviousPendingEvaulations}><Image source={require("../assets/Images/left.png")} style={{ resizeMode: 'contain', aspectRatio: 0.4, alignSelf: "center" }} /></TouchableOpacity>
                                </View>


                                <TouchableOpacity onPress={this.GetNextPendingEvaulations}><View style={{ borderRadius: 5, justifyContent: "center", backgroundColor: '#493da9', width: Scales.deviceWidth * 0.052, height: Scales.deviceHeight * 0.026, marginLeft: 5 }}>
                                    <Image source={require("../assets/Images/right.png")} style={{ resizeMode: 'contain', aspectRatio: 0.4, alignSelf: "center" }} />
                                </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ width: Scales.deviceWidth * 0.96, alignItems: 'center', }}>
                            {this.state.pending_evaluation.length != 0 ?
                                <FlatList
                                    data={this.state.pending_evaluation.slice(this.state.pending_counter_first, this.state.pending_counter_last)}
                                    keyExtractor={(item, index) => String(index)}
                                    style={{ backgroundColor: "#faf9fd", marginTop: Scales.deviceHeight * 0.008, }}
                                    renderItem={({ item, index }) => <DashPending index={index} nav={this.props.nav} data={item} setDefault={this.SetDefault} />}
                                /> : <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(12), fontFamily: 'roboto-regular', paddingTop: Scales.deviceHeight * 0.05 }}>No Pending Evaluation Today</Text>}
                        </View>

                        {this.state.pending_evaluation.length != 0 ? <View style={{ width: Scales.deviceWidth * 0.955, height: Scales.deviceHeight * 0.04, alignItems: 'flex-end', }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.props.nav.navigate("pending", { "pending": this.GetPendingEvaulations, "interview": this.GetScheduleInterView })}>
                                <LinearGradient colors={['#6059bb', '#5e57b9', "#534ab1", '#483ca8']} style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.025, borderRadius: 5, right: 5 }} >
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.025, borderRadius: 5, justifyContent: "center" }}>
                                        <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: "roboto-regular", textAlign: "center", color: 'white' }}>View More</Text>
                                    </View></LinearGradient></TouchableOpacity>
                        </View> : null}

                    </View>

                    <View style={{ position: "absolute", right: Scales.deviceWidth * 0.03, top: Scales.deviceHeight * 0.065 }}>
                        <TouchableOpacity onPress={() => this.go_to_schedule()} ><Image source={require('../assets/Images/calendar_plus.png')} style={{ alignSelf: "center", aspectRatio: Scales.moderateScale(0.6), resizeMode: 'contain' }} /></TouchableOpacity>
                    </View>

                </ScrollView>





            </View>
            //</SafeAreaView>
        )
    }
}







class Schedule_Interview extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props, "sjdbgjbjbgje")
        this.state = { modal_share_visible: false, date_format: "YYYY/MM/DD", modal_link_visible: false, employer_email: null, share_email: "", invite_email: "", modal_3: [{}], modal_type: 0, call: false, loader: false, email_1: '', email_2: "", loader: false }
        this.invite = React.createRef();
    }


    componentDidMount = async () => {

        let email = await AsyncStorage.getItem('email')
        this.setState({ employer_email: email })
        // console.log(this.props.interview, "--------------------------------- this.props.interview.jobma_invitation_date==================================")
    }

    Get_link_Pop = (data, type) => {
        if (type == 1) {
            this.setState({
                modal_link_visible: true,
                modal_link_data: data
            })
        }
        if (type == 2) {
            this.setState({
                modal_share_visible: true,
                modal_link_data: data,
                modal_type: type
            })
        }
        if (type == 3) {
            this.setState({
                modal_share_visible: true,
                modal_link_data: data,
                modal_type: type
            })
        }

    }

    ChangeCall = () => {
        this.setState({ call: false })
    }

    add_invite_field = () => {
        let data = this.state.modal_3
        let push_data = {}
        data.push(push_data)
        this.setState({ modal_3: data })
    }
    remove_invite_field = () => {
        let data = this.state.modal_3
        if (data.length <= 1) {
            return 0
        }

        data.pop()

        this.setState({ modal_3: data, email_2: "" })
    }

    go_to_interview() {
        this.setState({ modal_link_visible: false })
        this.props.nav.navigate("interview")
    }
    CopyToken = (token) => {
        Clipboard.setString(token)
        Toast.showWithGravity("Token Copied", Toast.SHORT, Toast.BOTTOM);
    }

    callInvites = () => {
        let email_1 = this.state.email_1
        let email_2 = this.state.email_2

        let email_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let test_1 = email_reg.test(String(email_1))
        let test_2 = email_reg.test(String(email_2))
        if (this.state.modal_3.length == 1) {
            if (email_1.length == 0) {
                Toast.showWithGravity("Enter email address", Toast.SHORT, Toast.BOTTOM);

                return 0
            }
            if (test_1 == false) {
                Toast.showWithGravity("Enter valid email address", Toast.SHORT, Toast.BOTTOM);

                return 0
            }
            this.InviteMail_1()
            Toast.showWithGravity("Email sent successfully", Toast.SHORT, Toast.BOTTOM);

        }
        else if (this.state.modal_3.length == 2) {
            if (email_1.length == 0) {
                Toast.showWithGravity("Enter email address", Toast.SHORT, Toast.BOTTOM);

                return 0
            }
            if (email_2.length == 0) {
                Toast.showWithGravity("Enter email address", Toast.SHORT, Toast.BOTTOM);

                return 0
            }
            if (test_1 == false) {
                Toast.showWithGravity("Enter valid email address", Toast.SHORT, Toast.BOTTOM);

                return 0
            }
            if (test_2 == false) {
                Toast.showWithGravity("Enter valid email address", Toast.SHORT, Toast.BOTTOM);

                return 0
            }
            if (email_1 == email_2) {
                Toast.showWithGravity("Email id cannot be same.", Toast.SHORT, Toast.BOTTOM);
                return 0
            }

            this.InviteMail_1()
            this.InviteMail_2()
            Toast.showWithGravity("Emails sent successfully", Toast.SHORT, Toast.BOTTOM);
        }




    }


    ShareInviteMail = async (mode) => {
        if (this.state.share_email == "") {
            Toast.showWithGravity("Please enter email", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email_test = re.test(String(this.state.share_email).toLowerCase());
        if (email_test == false) {
            Toast.showWithGravity("Enter valid email", Toast.SHORT, Toast.BOTTOM);

            return 0
        }
        // let send_email = this.state.invite_email
        // send_email = send_email.split(",")
        // let new_emails = ''
        // for(x in send_email){
        //     let split_email = send_email[x].split(".")
        //     split_email = split_email.pop()
        //     split_email = split_email.join(".")
        //     let split_next_email = send_email[x+1].split(".")
        //     split_next_email = split_email.pop()
        //     split_next_email = split_email.join(".")
        //     if(split_email==split_next_email){

        //     }

        // }



        this.setState({ loader: true })
        let token = await AsyncStorage.getItem('token')
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': token
        };
        let payload = {
            "invite_id": this.props.interview.id,
            "receiver_emails": this.state.share_email,
            "pitcher_id": this.props.interview.jobma_pitcher,
            "catcher_id": this.props.interview.jobma_catcher,
            "invite_guest": mode
        }
        // console.log(payload)
        let json = await PostFetch("share-live-interview-mail", payload, header)
        if (json != null) {
            if (json.error == 0) {
                Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
                this.setState({ modal_share_visible: false })
            }
            else {
                alert(json.message)
            }
        }

        this.setState({ loader: false, share_email: '' })

    }


    SaveInviteEmails = (email) => {
        let emails = email
        if (this.state.invite_email == "") {
            emails = email
        }
        else {
            emails = this.state.invite_email + "," + email
        }


        this.setState({ invite_email: emails })
        // console.log(emails, "SaveInviteEmailsSaveInviteEmailsSaveInviteEmailsSaveInviteEmailsSaveInviteEmails")
    }
    InviteMail_1 = async () => {
        if (this.state.email_1 == "") {
            Toast.showWithGravity("Please enter email", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email_test = re.test(String(this.state.email_1).toLowerCase());
        if (email_test == false) {
            Toast.showWithGravity("Enter valid email", Toast.SHORT, Toast.BOTTOM);

            return 0
        }


        this.setState({ loader: true })
        let token = await AsyncStorage.getItem('token')
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': token
        };
        let payload = {
            "invite_id": this.props.interview.id,
            "receiver_emails": this.state.email_1,
            "pitcher_id": this.props.interview.jobma_pitcher,
            "catcher_id": this.props.interview.jobma_catcher,
            "invite_guest": 1
        }
        // console.log(payload, "payload")
        let json = await PostFetch("share-live-interview-mail", payload, header)
        if (json != null) {
            if (json.error == 0) {
                // Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
                this.setState({ modal_share_visible: false, email_1: "" })
            }
            else {
                alert(json.message)
            }
        }

        this.setState({ loader: false })

    }

    InviteMail_2 = async () => {
        if (this.state.email_2 == "") {
            Toast.showWithGravity("Please enter email", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email_test = re.test(String(this.state.email_2).toLowerCase());
        if (email_test == false) {
            Toast.showWithGravity("Enter valid email", Toast.SHORT, Toast.BOTTOM);

            return 0
        }

        if (this.state.loader == true) { return 0 }
        this.setState({ loader: true })
        let token = await AsyncStorage.getItem('token')
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': token
        };
        let payload = {
            "invite_id": this.props.interview.id,
            "receiver_emails": this.state.email_2,
            "pitcher_id": this.props.interview.jobma_pitcher,
            "catcher_id": this.props.interview.jobma_catcher,
            "invite_guest": 1
        }
        // console.log(payload, "payload")
        let json = await PostFetch("share-live-interview-mail", payload, header)
        if (json != null) {
            if (json.error == 0) {
                // Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
                this.setState({ modal_share_visible: false, email_2: "" })
            }
            else {
                alert(json.message)
            }
        }

        this.setState({ loader: false })

    }

    tConv24 = (time24) => {
        var ts = time24;
        var H = +ts.substr(0, 2);
        var h = (H % 12) || 12;
        h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
        var ampm = H < 12 ? " AM" : " PM";
        ts = h + ts.substr(2, 3) + ampm;
        return ts;
    }


    render() {

        let expired_flag = false
        if (new Date() > Date.parse(this.props.interview.jobma_invitation_date)) {
            expired_flag = false
        }
        let startTime = String(this.props.interview.jobma_invitation_date).slice(11, 19)
        startTime = this.tConv24(startTime)

        const interview = this.props.interview;
        let name = interview.pitcher_name
        let modal_3_height = this.state.modal_type == 3 ? 270 : 230
        let modal_3_height_bg_image = this.state.modal_type == 3 ? this.state.modal_3.length * 10 + Scales.deviceWidth * 0.19 : Scales.deviceHeight * 0.12
        let invite_hieght = this.state.modal_type == 3 ? 85 : 90

        name = name.split(/(\s+)/);
        // console.log(name)
        var button = <Text></Text>
        if (interview.jobma_interview_status == "1") {
            button = <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(11), textAlign: "center", height: Scales.deviceHeight * 0.03, color: "#ffa727", borderRadius: 5, backgroundColor: '#fff8e2', paddingTop: 3, width: Scales.deviceWidth * 0.28 }}>{expired_flag == false ? "Interview Progress" : "Exipred"}</Text>
        }
        if (interview.jobma_interview_status == "0") {
            button = <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(11), textAlign: "center", height: Scales.deviceHeight * 0.03, color: "#ffa727", borderRadius: 5, backgroundColor: '#fff8e2', paddingTop: 3, width: Scales.deviceWidth * 0.28 }}>{expired_flag == false ? "Interview Progress" : "Exipred"}</Text>


        }
        // var datas = <View key={interview.job_post_id} style={{ width: "98%", flexDirection: 'row', height: 90, backgroundColor: 'white', elevation: 9, borderRadius: 10, marginTop: 10, }}>


        return (
            <View style={{ minHeight: Scales.deviceHeight * 0.115, width: Scales.deviceWidth * 1.0, alignItems: 'center', padding: 5 }}>

                <View style={{ width: Scales.deviceWidth * 0.95, minHeight: Scales.deviceHeight * 0.10, paddingLeft: 3, flexDirection: "row", borderRadius: 10, backgroundColor: 'white', shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.1,
   shadowRadius: 1,
   elevation: 1, }}>
                    <View style={{ width: Scales.deviceWidth * 0.15, }}>
                        <View style={{ width: Scales.deviceWidth * 0.14, minHeight: Scales.deviceHeight * 0.07, borderRadius: 30, paddingTop: Scales.deviceHeight * 0.01 }}>
                            {/* <Image source={{ uri: interview.pitcher_photo }} style={{ resizeMode: "contain", width: 50, height: 50, alignSelf: "center", borderRadius: 100 }} /> */}
                            <View style={{ width: Scales.deviceHeight * 0.06, height: Scales.deviceHeight * 0.06, backgroundColor: this.props.index % 2 != 0 ? "#ffa001" : "#ff5367", alignSelf: "center", justifyContent: "center", borderRadius: Scales.deviceHeight * 0.06 / 2 }}>
                                <Text style={{ fontFamily: 'roboto-bold', fontSize: Scales.moderateScale(14), color: "white", textAlign: "center", textTransform: "uppercase" }}>{String(name[0].slice(0, 2))}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.46, minHeight: Scales.deviceHeight * 0.10, paddingTop: Scales.deviceHeight * 0.005, paddingRight: Scales.deviceWidth * 0.02 }}>

                        <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}><Text style={{ fontFamily: 'roboto-bold', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{interview.pitcher_name}</Text>invited for <Text style={{ fontFamily: 'roboto-bold', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{interview.job_name}</Text></Text>
                        <View style={{ flexDirection: 'row', alignItems: "center", alignItems: 'center', paddingTop: 5 }}>
                            <View>
                                <Image source={require('../assets/Images/pending_clock.png')} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.03, aspectRatio: 0.6, }} />
                            </View>
                            <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: 5, color: "#3c3c3c" }}>{moment(String(interview.jobma_invitation_date).slice(0, 10)).format(this.props.date_format)}</Text>
                            {/* <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: 5, color: "#3c3c3c" }}>10:30 am to 12:00 pm</Text> */}

                        </View>
                        <Text style={{ fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(12), paddingLeft: 20, textAlignVertical: "top" }}>{interview.invitation_timezone}</Text>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.32, flexDirection: "column", }}>
                        <View style={{ width: Scales.deviceWidth * 0.28, minHeight: Scales.deviceHeight * 0.035, paddingTop: 3, alignSelf: 'center', borderRadius: 10, marginTop: 5, }}>
                            {button}
                        </View>
                        <View style={{ flexDirection: 'row', width: Scales.deviceWidth * 0.28, minHeight: Scales.deviceHeight * 0.05, alignSelf: "center", justifyContent: "space-around", alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.Get_link_Pop(interview, 1)}><View style={{ width: Scales.deviceWidth * 0.07, minHeight: Scales.deviceHeight * 0.035, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: "#ff5468" }}>
                                <Image source={require('../assets/Images/linkbutton.png')} style={{ resizeMode: 'contain', width: Scales.deviceHeight * 0.02, minHeight: Scales.deviceHeight * 0.02, }}></Image>
                            </View></TouchableOpacity>

                            {expired_flag == false ? <TouchableOpacity onPress={() => this.Get_link_Pop(interview, 2)}><View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.035, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: "#ffa001" }}>
                                <Image source={require('../assets/Images/share.png')} style={{ resizeMode: 'contain', width: Scales.deviceHeight * 0.02, height: Scales.deviceHeight * 0.02, }}></Image>
                            </View></TouchableOpacity> : null}
                            {expired_flag == false ? <TouchableOpacity onPress={() => this.Get_link_Pop(interview, 3)}><View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.035, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: "#ff5468" }}>
                                <Image source={require('../assets/Images/invite.png')} style={{ resizeMode: 'contain', width: Scales.deviceHeight * 0.07, height: Scales.deviceHeight * 0.02, }}></Image>
                            </View></TouchableOpacity> : null}
                        </View>

                    </View>

                </View>

                <Modal
                    animationType="fade"
                    isVisible={this.state.modal_link_visible}
                    // visible={true}
                    transparent={true}
                    onRequestClose={() => this.setState({ modal_link_data: {}, modal_link_visible: false })}

                >

                    <View style={{ flex: 1, justifyContent: 'center', }}>

                        <ImageBackground source={require('../assets/Images/background_img_invite.png')} style={{ padding: 30, width: Scales.deviceWidth * 0.85, alignSelf: "center", }} >
                            <View style={{ width: Scales.deviceWidth * 0.80, alignSelf: 'center', borderRadius: 5, paddingLeft: 10, paddingRight: 10 }}>
                                <View style={{ minHeight: Scales.deviceHeight * 0.34, }}>
                                    <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", alignItems: "center", }}>
                                        <View style={{ width: Scales.deviceWidth * 0.60, minHeight: Scales.deviceHeight * 0.04, }}>
                                            <Text style={{ fontFamily: "roboto-bold", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>Invited for {this.props.interview.job_name}</Text>

                                        </View>
                                        <View style={{ width: Scales.deviceHeight * 0.08, minHeight: Scales.deviceHeight * 0.04 }}>
                                            <TouchableOpacity onPress={() => this.setState({ modal_link_visible: !this.state.modal_link_visible })}><Image source={require("../assets/Images/no.png")} style={{ resizeMode: "contain", alignSelf: 'flex-end', resizeMode: "contain", width: "25%", }} /></TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.75, minHeight: Scales.deviceHeight * 0.06 }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{this.props.interview.pitcher_name}</Text>
                                        <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), paddingTop: Scales.deviceHeight * 0.005, color: "#3c3c3c" }}>Invited by : {this.state.employer_email}</Text>

                                    </View>


                                    <View style={{ width: Scales.deviceWidth * 0.75, minHeight: Scales.deviceHeight * 0.18, paddingTop: Scales.deviceHeight * 0.015, }}>
                                        <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>
                                            <View style={{ width: Scales.deviceWidth * 0.338, height: Scales.deviceHeight * 0.04, borderWidth: 0.8, borderTopLeftRadius: 10, borderColor: "#5c49e0", justifyContent: 'center' }} >
                                                <Text style={{ fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>Interview Mode</Text>
                                            </View>
                                            <View style={{ width: Scales.deviceWidth * 0.415, height: Scales.deviceHeight * 0.04, borderTopWidth: 1, borderEndWidth: 0.8, borderTopRightRadius: 10, borderRightWidth: 1, borderColor: "#5c49e0", borderBottomWidth: 1, justifyContent: "center" }}>
                                                <Text style={{ fontFamily: 'roboto-regular', textAlign: 'center', fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{this.props.interview.interview_mode}</Text>


                                            </View>
                                        </View>

                                        <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>
                                            <View style={{ width: Scales.deviceWidth * 0.338, height: Scales.deviceHeight * 0.04, borderLeftWidth: 1, borderEndWidth: 1, borderRightWidth: 1, borderColor: "#5c49e0", borderBottomWidth: 1, justifyContent: 'center' }} >
                                                <Text style={{ fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>Interview Date</Text>

                                            </View>
                                            <View style={{ width: Scales.deviceWidth * 0.415, height: Scales.deviceHeight * 0.04, borderEndWidth: 1, borderRightWidth: 1, borderColor: "#5c49e0", borderBottomWidth: 1, justifyContent: "center" }}>
                                                <Text style={{ fontFamily: 'roboto-regular', textAlign: 'center', fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{moment(String(this.props.interview.jobma_invitation_date).slice(0, 10)).format(this.props.date_format)} {startTime}</Text>

                                            </View>
                                        </View>

                                        <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>
                                            <View style={{ width: Scales.deviceWidth * 0.338, height: Scales.deviceHeight * 0.04, borderLeftWidth: 1, borderEndWidth: 1, borderColor: "#5c49e0", borderRightWidth: 1, justifyContent: 'center', borderBottomWidth: 1 }} >
                                                <Text style={{ fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>Timezone</Text>

                                            </View>
                                            <View style={{ width: Scales.deviceWidth * 0.415, height: Scales.deviceHeight * 0.04, borderEndWidth: 1, borderRightWidth: 1, borderColor: "#5c49e0", borderBottomWidth: 1, justifyContent: "center" }}>
                                                <Text style={{ fontFamily: 'roboto-regular', textAlign: 'center', fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{this.props.interview.invitation_timezone}</Text>

                                            </View>
                                        </View>

                                        <View style={{ width: Scales.deviceWidth * 0.75, height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>
                                            <View style={{ width: Scales.deviceWidth * 0.338, height: Scales.deviceHeight * 0.04, borderLeftWidth: 0.8, borderBottomLeftRadius: 10, borderColor: "#5c49e0", borderEndWidth: 1, borderRightWidth: 1, justifyContent: 'center', borderBottomWidth: 1 }} >
                                                <Text style={{ fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>Interview Token</Text>

                                            </View>
                                            <View style={{ width: Scales.deviceWidth * 0.415, height: Scales.deviceHeight * 0.04, borderEndWidth: 1, borderRightWidth: 0.8, borderBottomRightRadius: 10, borderColor: "#5c49e0", borderBottomWidth: 1, justifyContent: "center" }}>
                                                <TouchableOpacity onPress={() => this.CopyToken(this.props.interview.jobma_interview_token)}><Text style={{ fontFamily: 'roboto-regular', textAlign: 'center', color: "#3c3c3c", fontSize: Scales.moderateScale(12) }}>{this.props.interview.jobma_interview_token}</Text></TouchableOpacity>

                                            </View>
                                        </View>

                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.75, minHeight: Scales.deviceHeight * 0.085, justifyContent: 'center', }}>
                                        <View style={{ flexDirection: "row", justifyContent: "center", minHeight: Scales.deviceHeight * 0.07 }}>
                                            <TouchableOpacity onPress={() => this.setState({ modal_link_visible: false })}>
                                                <View style={{ width: Scales.deviceWidth * 0.20, zIndex: 100, height: Scales.deviceHeight * 0.048, justifyContent: 'center', borderRadius: 10, borderColor: 'black', borderWidth: 1 }}>
                                                    <Text style={{ textAlign: 'center', color: "#565656", fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', color: "#3c3c3c" }}>Close</Text>
                                                </View></TouchableOpacity>
                                            {/* 
            <TouchableOpacity onPress={() => this.go_to_interview()}><View style={{ width: 100, zIndex: 100, height: 33, justifyContent: 'center', borderRadius: 10, left: 15, borderColor: '#ff5386', borderWidth: 1 }}>
                <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: 'roboto-medium', color: "#ff5386" }}>Start Interview</Text>

            </View></TouchableOpacity> */}
                                        </View>


                                    </View>

                                </View>




                            </View>
                        </ImageBackground>

                    </View>


                </Modal>

                <Modal isVisible={this.state.loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>



                <Modal
                    animationType="fade"
                    isVisible={this.state.modal_share_visible}

                    // visible={true} 
                    transparent={true}
                    onRequestClose={() => this.setState({ modal_share_visible: false })}

                >

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {/* <View style={{ width: Scales.deviceWidth*0.80, backgroundColor: 'white', height: modal_3_height, alignSelf: 'center', borderRadius: 5, elevation: 5, }}>
                            <View style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "80%", height: 50, borderBottomWidth: 1, justifyContent: "center", borderBottomColor: "#5c49e0" }}>
                                        {this.state.modal_type == 3 ? <Text style={{ fontFamily: "roboto-medium", fontSize: 16, color: "#3c3c3c" }}>Invite Live Interview Detail</Text> : <Text style={{ fontFamily: "roboto-medium", fontSize: 16, color: "#3c3c3c" }}>Share Live Interview Detail</Text>}
                                    </View>
                                    <View style={{ width: "20%", height: 50, justifyContent: "center", borderBottomColor: "#5c49e0", borderBottomWidth: 1 }}>
                                        <TouchableOpacity onPress={() => this.setState({ modal_share_visible: !this.state.modal_share_visible })} ><Image source={require("../assets/Images/no.png")} style={{ alignSelf: "flex-end", width: "20%", resizeMode: "contain", }} /></TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ width: "98%", height: 50, justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "roboto-medium", fontSize: 16, }}>Send To*</Text>
                                </View>
                                {this.state.modal_type != 3 ? <View style={{ width: "98%", justifyContent: "center" }}>
                                    <TextInput placeholder="please enter the email address" onChangeText={(text) => this.setState({ share_email: text })} style={{ fontFamily: "roboto-medium",height:35, borderColor: "#5c49e0", fontSize: 10, borderWidth: 0.5, borderRadius: 5, paddingLeft: 15 }} />
                                </View> : null}
                                {this.state.modal_type == 3 ?
                                 <FlatList
                                    data={this.state.modal_3}
                                    renderItem={({ item }) => <ModalAddField ChangeCall = {this.ChangeCall} call = {this.state.call}  SaveInviteEmails={this.SaveInviteEmails} interview = {this.props.interview} />}
                                    keyExtractor={(item, index) => index}
                                /> 
                               
                                : null}
                                {this.state.modal_type == 3 ? <TouchableOpacity onPress={() => this.add_invite_field()}><View style={{ width: 100, height: 30, bottom: 5, alignSelf: "flex-end", right: 5, borderBottomWidth: 1, justifyContent: "flex-end" }}>
                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: 12 }}>Add Another Email</Text>

                                </View></TouchableOpacity> : null}
                            </View>



                            <ImageBackground source={require("../assets/Images/big_bg.png")} style={{ width: Scales.deviceWidth * 0.80,aspectRatio:1,top:1, height:invite_hieght ,backgroundColor:'blue'  }} >
                            <View style={{ width: Scales.deviceWidth * 0.70, backgroundColor:"red", flexDirection: "row",justifyContent:"center"  }}>
                                
                                    
                                    <View style={{ width: Scales.deviceWidth * 0.38, height: Scales.deviceHeight * 0.06, paddingTop:5}}>
                                        <TouchableOpacity onPress={() => this.setState({ modal_share_visible: !this.state.modal_share_visible })}>
                                            <View style={{ width: Scales.deviceWidth * 0.20, borderWidth: 0.8,marginTop:this.state.modal_type==3?0:5, height: Scales.deviceHeight * 0.04, borderRadius: 10,alignSelf:"flex-end", justifyContent: 'center' }}>
                                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center' }}>Close</Text>
                                        </View></TouchableOpacity>
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.32,left:5, height: Scales.deviceHeight * 0.06,paddingTop:5 }}>
                                        {this.state.modal_type == 3 ? <TouchableOpacity onPress={() => this.setState({call:true})}>
                                            <View style={{ width: Scales.deviceWidth * 0.20, borderWidth: 0.8, borderColor: "#ff5e71", height: Scales.deviceHeight * 0.04, borderRadius: 10, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ff5e71" }}>Send</Text>
                                        </View></TouchableOpacity> :
                                            <TouchableOpacity onPress={() => this.ShareInviteMail(0)}>
                                                <View style={{ width: Scales.deviceWidth * 0.20,marginTop:5, borderWidth: 0.8, borderColor: "#ff5e71", height: Scales.deviceHeight * 0.04, borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ff5e71" }}>Send</Text>
                                            </View></TouchableOpacity>
                                        }
                                    </View>
                                
                            </View>
                            </ImageBackground>


                        </View> */}

                        <ImageBackground source={require("../assets/Images/background_img_invite.png")} style={{ width: Scales.deviceWidth * 0.85, minHeight: Scales.deviceHeight * 0.30, alignSelf: 'center', }} >
                            <View style={{ width: Scales.deviceWidth * 0.80, alignSelf: 'center' }}>
                                <View style={{ width: Scales.deviceWidth * 0.80, height: modal_3_height, alignSelf: 'center', borderRadius: 5, }}>
                                    <View style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, }}>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ width: Scales.deviceWidth * 0.61, height: Scales.deviceHeight * 0.065, borderBottomWidth: 1, justifyContent: "center", borderBottomColor: "#5c49e0", }}>
                                                {this.state.modal_type == 3 ? <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>Invite Live Interview Detail</Text> : <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>Share Live Interview Detail</Text>}
                                            </View>
                                            <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.065, justifyContent: "center", borderBottomColor: "#5c49e0", borderBottomWidth: 1 }}>
                                                <TouchableOpacity onPress={() => this.setState({ modal_share_visible: !this.state.modal_share_visible })} >
                                                    <Image source={require("../assets/Images/no.png")} style={{ alignSelf: "flex-end", }} /></TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>Send To*</Text>
                                            {this.state.modal_type == 3 ? this.state.modal_3.length > 1 ? <View style={{ width: Scales.deviceWidth * 0.55, }}>
                                                <TouchableOpacity onPress={() => this.remove_invite_field()}><Image source={require("../assets/Images/delete.png")} style={{ alignSelf: "flex-end", width: Scales.deviceWidth * 0.05, resizeMode: "contain", height: Scales.deviceHeight * 0.032, aspectRatio: Scales.moderateScale(0.6) }} /></TouchableOpacity></View> : null : null}
                                        </View>
                                        {this.state.modal_type != 3 ? <View style={{ width: Scales.deviceWidth * 0.73, justifyContent: "center" }}>
                                            <TextInput placeholderTextColor={"#c7c7c7"} placeholder="please enter the email address" onChangeText={(text) => this.setState({ share_email: text })} value={this.state.share_email} style={{ fontFamily: "roboto-medium", height: Scales.deviceHeight * 0.045, color: 'black', borderColor: "#5c49e0", fontSize: Scales.moderateScale(10), borderWidth: 0.5, borderRadius: 5, paddingLeft: Scales.deviceHeight * 0.02 }} />
                                        </View> : null}
                                        {this.state.modal_type == 3 ?

                                            this.state.modal_3.length >= 1 ? <View style={{ width: Scales.deviceWidth * 0.73, justifyContent: "center" }}>
                                                <TextInput placeholderTextColor={"#c7c7c7"} placeholder="please enter the email address" onChangeText={(text) => this.setState({ email_1: text })} value={this.state.email_1} style={{ fontFamily: "roboto-medium", borderColor: "#5c49e0", color: '#3c3c3c', fontSize: Scales.moderateScale(10), height: Scales.deviceHeight * 0.045, borderWidth: 0.5, borderRadius: 5, paddingLeft: Scales.deviceHeight * 0.02 }} />
                                                {this.state.modal_3.length >= 2 ? <TextInput placeholderTextColor={"#c7c7c7"} placeholder="please enter the email address" value={this.state.email_2} onChangeText={(text) => this.setState({ email_2: text })} style={{ marginTop: 5, fontFamily: "roboto-medium", borderColor: "#5c49e0", fontSize: Scales.moderateScale(10), height: Scales.deviceHeight * 0.045, borderWidth: 0.5, borderRadius: 5, paddingLeft: 15, color: 'black' }} /> : null}
                                            </View> : null


                                            : null}
                                        {this.state.modal_type == 3 ? this.state.modal_3.length > 1 ? null : <TouchableOpacity onPress={() => this.add_invite_field()}>
                                            <View style={{ minWidth: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.025, marginTop: Scales.deviceHeight * 0.01, alignSelf: "flex-end", right: Scales.deviceWidth * 0.03, borderBottomWidth: 1, justifyContent: "flex-end" }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>Add Another Email</Text>

                                            </View></TouchableOpacity> : null}
                                    </View>



                                    {/* <ImageBackground source={require("../assets/Images/big_bg.png")} style={{ width: Scales.deviceWidth * 0.80,aspectRatio:0.1,top:1, maxHeight:280 ,backgroundColor:'blue'  }} > */}
                                    <View style={{ width: Scales.deviceWidth * 0.70, flexDirection: "row", marginTop: Scales.deviceHeight * 0.025, justifyContent: "center" }}>


                                        <View style={{ width: Scales.deviceWidth * 0.38, height: Scales.deviceHeight * 0.06, paddingTop: 5 }}>
                                            <TouchableOpacity onPress={() => this.setState({ modal_share_visible: !this.state.modal_share_visible })}>
                                                <View style={{ width: Scales.deviceWidth * 0.20, borderWidth: 0.8, marginTop: this.state.modal_type == 3 ? 0 : 5, height: Scales.deviceHeight * 0.04, borderRadius: 10, alignSelf: "flex-end", justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center' }}>Close</Text>
                                                </View></TouchableOpacity>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.32, left: 5, height: Scales.deviceHeight * 0.06, paddingTop: 5 }}>
                                            {this.state.modal_type == 3 ? <TouchableOpacity onPress={() => this.callInvites()}>
                                                <View style={{ width: Scales.deviceWidth * 0.20, borderWidth: 0.8, borderColor: "#ff5e71", height: Scales.deviceHeight * 0.04, borderRadius: 10, justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ff5e71" }}>Send</Text>
                                                </View></TouchableOpacity> :
                                                <TouchableOpacity onPress={() => this.ShareInviteMail(0)}>
                                                    <View style={{ width: Scales.deviceWidth * 0.20, marginTop: 5, borderWidth: 0.8, borderColor: "#ff5e71", height: Scales.deviceHeight * 0.04, borderRadius: 10, justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ff5e71" }}>Send</Text>
                                                    </View></TouchableOpacity>
                                            }
                                        </View>

                                    </View>
                                    {/* </ImageBackground> */}


                                </View>

                            </View>

                        </ImageBackground>


                        <Modal isVisible={this.state.loader}>

                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                            </View>

                        </Modal>


                    </View>

                </Modal>
            </View>

        )
    }
}



class DashPending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            img_height: 0, img: ""
        }

    }
    componentDidMount = () => {
        let ext = this.props.data.jobma_pitcher_url.split(".")
        ext = ext[ext.length - 1]

        if (ext == "jpg") {
            this.setState({ img: this.props.data.jobma_pitcher_url })
        }
        else {
            this.setState({ img: "" })
        }

        console.log(this.props, "---compoent---------did mount")


    }


    render() {


        var today = moment().format("YYYY-MM-DDTHH:mm:ssZ")



        var applied_date = moment(this.props.data.applied_date)

        const deviceTimeZone = RNLocalize.getTimeZone();

        applied_date = moment(applied_date).tz("America/New_York")
        const currentTimeZoneOffsetInHours = moment(applied_date).utcOffset() / 60;

        let server_time_zone_time = ""
        if (Math.sign(currentTimeZoneOffsetInHours) == -1) {
            server_time_zone_time = moment(applied_date).subtract(currentTimeZoneOffsetInHours, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        else {
            server_time_zone_time = moment(applied_date).add(currentTimeZoneOffsetInHours, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        // console.log((server_time_zone_time), "-------server_time_zone_time------")
        // console.log(today, "9999999999999999999today )))))))))))))))))))))))))))))")
        let india_server = moment(server_time_zone_time).tz(deviceTimeZone)
        const currentTimeZoneOffsetIn = moment(india_server).utcOffset() / 60;
        if (Math.sign(currentTimeZoneOffsetIn) == -1) {
            applied_date = moment(india_server).subtract(currentTimeZoneOffsetIn, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        else {
            applied_date = moment(india_server).add(currentTimeZoneOffsetIn, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }

        let colr = '#ff5367'
        if (this.props.index % 2 == 0) {
            colr = "#ffa001"
        }
        var dates = null

        if (today > applied_date) {
            var diff = moment.duration(moment(today).diff(moment(applied_date)))


            diff = Math.round(((diff / 60000)))

            var days = null


            // diff = Math.round(diff / 3600000)
            var days = null



            if (diff < 60) {
                if (diff >= 1) {
                    days = diff + " minutes ago"
                }
                else if (diff == 0) {
                    days = "Just an moment"
                }

            }

            else if (diff > 60 && diff <= 1440) {

                diff = Math.round(diff / 60)

                days = diff + " hours ago"
            }
            else if (diff > 1440 && diff <= 10080) {
                diff = Math.round((diff / 60) / 24)

                days = diff + " days ago"

            }
            else if (diff >= 10080) {

                diff = Math.round(((diff / 60) / 24) / 7)
                days = diff + " weeks ago"
            }


        }
        else {

        }



        // console.log(this.state.img_height, "====================url-----------------------")
        this.img = this.props.data.jobma_pitcher_url
        let ext = this.props.data.jobma_pitcher_url.split(".")
        ext = ext[ext.length - 1]

        if (ext != "jpg") {
            this.img = ""
        }




        return (
            <View style={{ width: Scales.deviceWidth * 0.96, minHeight: Scales.deviceHeight * 0.102, backgroundColor: "#faf9fd", justifyContent: "center", padding: 5 }}>
                <View style={{
                    width: Scales.deviceWidth * 0.95, flexDirection: 'row', alignSelf: "center", minHeight: Scales.deviceHeight * 0.09, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1,
                }}>
                    <View key={this.props.index} style={{ width: Scales.deviceWidth * 0.15, minHeight: Scales.deviceHeight * 0.08, justifyContent: 'center', }}>
                        {this.img == "" ?
                            <View style={{ width: Scales.deviceHeight * 0.06, justifyContent: "center", alignSelf: 'center', backgroundColor: "#ff5367", borderRadius: Scales.deviceHeight * 0.06 / 2, height: Scales.deviceHeight * 0.06 }}>
                                <Text style={{ textAlign: "center", fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "white", textTransform: "uppercase" }}>{this.props.data.pitcher_fname.slice(0, 2)}</Text>
                            </View> : null}
                        {this.img != "" ?
                            <View style={{ height: Scales.deviceHeight * 0.07, alignSelf: "center", justifyContent: "center", borderRadius: Scales.deviceHeight * 0.07 / 2, width: Scales.deviceWidth * 0.13, }} >
                                <Image source={{ uri: this.img }} onError={() => this.img = ""} style={{ width: Scales.deviceHeight * 0.06, height: Scales.deviceHeight * 0.06, borderRadius: Scales.deviceHeight * 0.03, alignSelf: 'center' }} /></View> : null}
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.56, minHeight: Scales.deviceHeight * 0.08, paddingTop: 5, paddingLeft: 5 }}>
                        <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-regular', color: "#3c3c3c", }}><Text style={{ fontFamily: 'roboto-medium', }}>{this.props.data.pitcher_fname}{this.props.data.pitcher_lname}</Text> applied for <Text style={{ fontFamily: 'roboto-medium' }}>{this.props.data.job_title}</Text></Text>
                        {/* <Text style={{fontSize:12, fontFamily: 'roboto-regular' }}>{this.state.pending_evaluation[i].applied_date}</Text> */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../assets/Images/pending_clock.png")} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.035, width: Scales.deviceWidth * 0.035, aspectRatio: Scales.moderateScale(0.6) }} />
                            <Text style={{ fontSize: Scales.moderateScale(12), color: "#3c3c3c", fontFamily: 'roboto-regular', left: 5, }}>Interviewed on {days}  </Text>
                        </View>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.23, height: Scales.deviceHeight * 0.08, flexDirection: "column", justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => { this.props.setDefault(); this.props.nav.navigate("Evaluate", { "appiled_id": this.props.data.applied_id, "image": ext == "jpg" ? this.props.data.jobma_pitcher_url : null }) }}><View style={{ width: Scales.deviceWidth * 0.175, height: Scales.deviceHeight * 0.035, alignSelf: 'center', borderRadius: 7, borderWidth: 1, borderColor: "#ffa001", justifyContent: "center", }}>
                            <Text style={{ color: "#ffa001", fontFamily: 'roboto-medium', textAlign: 'center', fontSize: Scales.moderateScale(12) }}>Evaluate</Text>
                        </View></TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
}