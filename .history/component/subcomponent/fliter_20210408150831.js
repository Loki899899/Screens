import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StatusBar, TextInput, AsyncStorage, BackHandler, ActivityIndicator, SafeAreaView } from 'react-native'
import PostFetch from "../../ajax/PostFetch"
import CalendarPicker from 'react-native-calendar-picker';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Modal from "react-native-modal"
import NetworkUtils from "../../common/globalfunc"
import { CheckBox } from "react-native-elements"
import { URL } from '../../ajax/PostFetch'
import { Scales } from "@common"
import AntI from 'react-native-vector-icons/AntDesign'

export default class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: 1,
            apporve: 0,
            status: 0,
            post_btw: 0,
            account: 0,
            approved_status: false,
            disapproved_status: false,
            modalvisible: false,
            selectedStartDate: null,
            modalvisible_1: false,
            selectedEndDate: null,
            job_title: null,
            status_select: null,
            activate: false,
            deactivate: false,
            expired: false,
            subuser_list: [],
            limit: 10,
            offset: 0,
            account_ids: [],
            loader: false,
            date_format: "YYYY/MM/DD"
        }
    }

    resetPostedDate = () => {
        this.setState({
            selectedStartDate: null,
            selectedEndDate: null
        })
    }

    onDateChange = (date) => {
        // console.log(date, "---------------date--------------------")
        if (this.state.selectedEndDate == null) {
            this.setState({
                selectedStartDate: date,
                modalvisible: false

            });

        }
        else {
            let start_date = moment(this.state.selectedEndDate)
            let end_date = moment(date)
            if (start_date < end_date) {
                Toast.showWithGravity("Please select date less than end date", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            this.setState({
                selectedStartDate: date,
                modalvisible: false

            });
        }



        // console.log(this.state.selectedStartDate)
    }

    onDateChangeEnd = (date) => {
        if (this.state.selectedStartDate == null) {
            this.setState({
                selectedEndDate: date,
                modalvisible_1: false

            });

        }
        else {
            let start_date = moment(this.state.selectedStartDate)
            let end_date = moment(date)
            if (start_date > end_date) {
                Toast.showWithGravity("Please select date greater than start date", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            this.setState({
                selectedEndDate: date,
                modalvisible_1: false

            });
        }



        // console.log(this.state.selectedEndDate)


    }

    _refresh = async () => {
        this.setState({ loader: true })
        let payload = null
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };



        // console.log(payload, "payload")
        let filtr = true
        // if (payload == null) {
        if (this.state.selectedStartDate == null && this.state.selectedEndDate != null) {

            Toast.showWithGravity("Select Start Date", Toast.SHORT, Toast.BOTTOM);
            this.setState({ loader: false })
            return 0

        }
        if (this.state.selectedEndDate == null && this.state.selectedStartDate != null) {
            Toast.showWithGravity("Select End Date", Toast.SHORT, Toast.BOTTOM);
            this.setState({ loader: false })
            return 0
        }
        //     filtr = false
        // }

        payload = {
            "offset": 0
        }

        if (this.state.job_title != null) {
            payload.title = this.state.job_title.toLowerCase()

        }
        if (this.state.approved_status == false && this.state.disapproved_status == true) {
            payload.approval = 2
        }
        if (this.state.approved_status == true && this.state.disapproved_status == false) {
            payload.approval = 1
        }
        if (this.state.account_ids.length != 0) {
            let id = this.state.account_ids.join(",")
            payload.employer_id = id
        }
        if (this.state.selectedStartDate != null && this.state.selectedEndDate != null) {
            let startdate = moment.utc(this.state.selectedStartDate).format("MM-DD-YYYY")
            let startend = moment.utc(this.state.selectedEndDate).format("MM-DD-YYYY")
            payload.start_date = startdate,
                payload.end_date = startend
        }
        if (this.state.status_select != null) {
            payload.status = this.state.status_select
        }
        console.log(payload, "---payload----")

        // if (payload == null) {
        //     payload = {

        //         "offset": 10,
        //         "approval": 1
        //     }
        // }
        // const json = await PostFetch("filter-job", payload, headers)
        let state_value = {
            keyword: this.state.keyword,
            apporve: this.state.apporve,
            status: this.state.status,
            post_btw: this.state.post_btw,
            account: this.state.account,
            account_ids: this.state.account_ids,
            approved_status: this.state.approved_status,
            disapproved_status: this.state.disapproved_status,
            modalvisible: this.state.modalvisible,
            selectedStartDate: this.state.selectedStartDate,
            modalvisible_1: this.state.modalvisible_1,
            selectedEndDate: this.state.selectedEndDate,
            job_title: this.state.job_title,
            status_select: this.state.status_select,
            activate: this.state.activate,
            deactivate: this.state.deactivate,
            expired: this.state.expired,
            loader: false

        }
        // console.log(state_value)
        await AsyncStorage.setItem("filter_data", JSON.stringify(state_value))
        // console.log(...this.state, "34535 34534534534 fiter ------------------------")
        this.props.navigation.state.params.filter_data(payload, filtr)
        this.setState({ loader: false })

        this.props.navigation.navigate("joblisting")


    }



    GetSubUser = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        let uri = URL.api_url + "employer-list"

        await fetch(uri, {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ subuser_list: responseJSON.data })
            }).catch(async (err) => {

                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            });


    }

    AddAccountid = (id) => {

        let arr = this.state.account_ids
        arr.push(id)
        this.setState({ account_ids: arr })
    }

    DeleteAccountIds = (id) => {
        let arr = this.state.account_ids
        // console.log(this.state.account_ids)
        const index = arr.indexOf(id);
        if (index > -1) {
            arr.splice(index, 1);
        }
        console.log(arr)
        this.setState({ account_ids: arr })
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        let date_format = await AsyncStorage.getItem('date_format')
        if (date_format == null) {
            this.setState({ date_format: "YYYY/MM/DD" })
        }
        else {
            this.setState({ date_format: date_format })
        }
        this.GetSubUser()
        let value = await AsyncStorage.getItem("filter_data")
        value = JSON.parse(value)
        // console.log((value), ":::::::::::::::::::::::::::")
        if (value != null) {

            this.setState({
                keyword: value.keyword,
                apporve: value.apporve,
                status: value.status,
                post_btw: value.post_btw,
                account: value.account,
                approved_status: value.approved_status,
                disapproved_status: value.disapproved_status,
                modalvisible: false,
                selectedStartDate: value.selectedStartDate,
                modalvisible_1: false,
                selectedEndDate: value.selectedEndDate,
                job_title: value.job_title,
                status_select: value.status_select,
                activate: value.activate,
                deactivate: value.deactivate,
                expired: value.expired,
                loader: false,
                account_ids: value.account_ids
            })
        }

    }

    ClearAll = () => {
        // console.log("-----ser-------")
        this.setState({
            approved_status: false,
            disapproved_status: false,
            modalvisible: false,
            selectedStartDate: null,
            modalvisible_1: false,
            selectedEndDate: null,
            job_title: null,
            status_select: null,
            activate: false,
            deactivate: false,
            expired: false,
            account_ids: []
        })
    }

    HeaderBack = async () => {
        let value = this.state
        let values = {
            keyword: value.keyword,
            apporve: value.apporve,
            status: value.status,
            post_btw: value.post_btw,
            account: value.account,
            approved_status: value.approved_status,
            disapproved_status: value.disapproved_status,
            modalvisible: false,
            selectedStartDate: value.selectedStartDate,
            modalvisible_1: false,
            selectedEndDate: value.selectedEndDate,
            job_title: value.job_title,
            status_select: value.status_select,
            activate: value.activate,
            deactivate: value.deactivate,
            expired: value.expired,
            loader: false,
            account_ids: value.account_ids
        }


        this.setState({
            keyword: value.keyword,
            apporve: value.apporve,
            status: value.status,
            post_btw: value.post_btw,
            account: value.account,
            approved_status: value.approved_status,
            disapproved_status: value.disapproved_status,
            modalvisible: false,
            selectedStartDate: value.selectedStartDate,
            modalvisible_1: false,
            selectedEndDate: value.selectedEndDate,
            job_title: value.job_title,
            status_select: value.status_select,
            activate: value.activate,
            deactivate: value.deactivate,
            expired: value.expired,
            loader: false,
            account_ids: value.account_ids
        })
        await AsyncStorage.setItem("filter_data", JSON.stringify(values))
        this.props.navigation.goBack()
    }


    render() {
        const header = <View style={{ flexDirection: "row", width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.07, backgroundColor: '#2c2c39', }}>

            <TouchableOpacity onPress={() => this.HeaderBack()}><View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.07, justifyContent: 'center', alignItems: "center", }}>
                <Image source={require('./../../assets/JobmaIcons/back.png')} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.035, aspectRatio: 0.6 }} />
            </View></TouchableOpacity>

            {/* ADD FUNCTIONALITY FOR CLEAR ALL */}
            <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.07, alignItems: 'center', flexDirection: 'row',}}>
                <View style={{ width: "55%", height: Scales.deviceHeight * 0.07, justifyContent: "center", paddingLeft: 3, alignItems:'flex-end' }}>
                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(20), textAlign: "left", color: 'white', }}>Filters</Text>
                </View>
                <View style={{ width: "45%", height: Scales.deviceHeight * 0.07, justifyContent: "center", alignItems:'flex-end', paddingLeft: 3, }}>
                    <TouchableOpacity onPress={() => this.ClearAll()}
                        style={{width:'40%'}}
                    >
                        <View style={{flexDirection:'row', alignItems:'center',justifyContent:'flex-end',}}>
                        <Image
                            source={require('./../../assets/JobmaIcons/close.png')}
                            style={{width:10, height:10, marginRight:3}}
                        ></Image>
                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), textAlign: "right", color: 'white',  }}>Clear all</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#2c2c39" }}>
                    <StatusBar backgroundColor="#2c2c39" barStyle="light-content" />
                    {header}
                    <View style={{height: Scales.deviceHeight * 0.915,}}>
                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.915, flexDirection: 'row',}}>

                            <View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.915, backgroundColor:'grey' }}>
                                <TouchableOpacity onPress={() => this.setState({ account: 0, keyword: 1, post_btw: 0, apporve: 0, status: 0 })}>
                                    <View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "center", alignItems:'flex-start', paddingLeft:Scales.deviceWidth * 0.03,backgroundColor:this.state.keyword===1?'#2c2c39':'transparent' }}>
                                        {/* <View style={{ width: Scales.deviceWidth * 0.32, height: Scales.deviceHeight * 0.05, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', backgroundColor: this.state.keyword == 1 ? '#4539a6' : '#f9f9f9', borderWidth: 0.3, borderColor: "#bdbdbd" }}> */}
                                            <Text style={{ textAlign: "center", color:"white", fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium" }}>Keywords</Text>

                                        {/* </View> */}
                                    </View></TouchableOpacity>


                                <TouchableOpacity onPress={() => this.setState({ account: 0, keyword: 0, post_btw: 0, apporve: 1, status: 0 })}><View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "flex-end" }}>
                                    {/* <View style={{ width: Scales.deviceWidth * 0.32, height: Scales.deviceHeight * 0.05, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', backgroundColor: this.state.apporve == 1 ? '#4539a6' : '#f9f9f9', borderWidth: 0.3, borderColor: "#bdbdbd" }}> */}
                                    <View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "center", alignItems:'flex-start',paddingLeft:Scales.deviceWidth * 0.03, backgroundColor:this.state.apporve===1?'#2c2c39':'transparent' }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color:"white", fontSize: Scales.moderateScale(14) }}>Approval</Text>
                                    </View>
                                    {/* </View> */}
                                </View></TouchableOpacity>


                                <TouchableOpacity onPress={() => this.setState({ account: 0, keyword: 0, post_btw: 0, apporve: 0, status: 1 })}><View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "flex-end" }}>
                                    {/* <View style={{ width: Scales.deviceWidth * 0.32, height: Scales.deviceHeight * 0.05, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', backgroundColor: this.state.status == 1 ? '#4539a6' : '#f9f9f9', borderWidth: 0.3, borderColor: "#bdbdbd" }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: this.state.status == 1 ? "white" : "black", fontSize: Scales.moderateScale(14) }}>Status</Text>

                                    </View> */}
                                    <View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "center", alignItems:'flex-start',paddingLeft:Scales.deviceWidth * 0.03, backgroundColor:this.state.status===1?'#2c2c39':'transparent' }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color:"white", fontSize: Scales.moderateScale(14) }}>Status</Text>
                                    </View>
                                </View></TouchableOpacity>

                                <TouchableOpacity onPress={() => this.setState({ account: 0, keyword: 0, post_btw: 1, apporve: 0, status: 0 })}><View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "flex-end" }}>
                                    {/* <View style={{ width: Scales.deviceWidth * 0.32, height: Scales.deviceHeight * 0.05, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', backgroundColor: this.state.post_btw == 1 ? '#4539a6' : '#f9f9f9', borderWidth: 0.3, borderColor: "#bdbdbd" }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: this.state.post_btw == 1 ? "white" : "black", fontSize: Scales.moderateScale(14) }}>Posted Between</Text>

                                    </View> */}
                                    <View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "center", alignItems:'flex-start',paddingLeft:Scales.deviceWidth * 0.03, backgroundColor:this.state.post_btw===1?'#2c2c39':'transparent' }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color:"white", fontSize: Scales.moderateScale(14) }}>Posted Between</Text>
                                    </View>
                                </View></TouchableOpacity>

                                <TouchableOpacity onPress={() => this.setState({ account: 1, keyword: 0, post_btw: 0, apporve: 0, status: 0 })}><View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, }}>
                                    {/* <View style={{ width: Scales.deviceWidth * 0.32, height: Scales.deviceHeight * 0.05, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', backgroundColor: this.state.account == 1 ? '#4539a6' : '#f9f9f9', borderWidth: 0.3, borderColor: "#bdbdbd" }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: this.state.account == 1 ? "white" : "black", fontSize: Scales.moderateScale(14) }}>Accounts</Text>

                                    </View> */}
                                    <View style={{ width: Scales.deviceWidth * 0.43, height: Scales.deviceHeight * 0.07, justifyContent: "center", alignItems:'flex-start',paddingLeft:Scales.deviceWidth * 0.03, backgroundColor:this.state.account===1?'#2c2c39':'transparent' }}>
                                        <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color:"white", fontSize: Scales.moderateScale(14) }}>Accounts</Text>
                                    </View>
                                </View></TouchableOpacity>



                            </View>



                            {this.state.keyword == 1 ? <View style={{ width: Scales.deviceWidth * 0.57, height: Scales.deviceHeight * 0.85, }}>
                                <View style={{ width: Scales.deviceWidth * 0.57, minHeight: Scales.deviceHeight * 0.10, justifyContent: 'center', }}>
                                    <TextInput placeholderTextColor = {"#c7c7c7"}  placeholder="Enter for job title" placeholderTextColor={"#c7c7c7"} onChangeText={(text) => this.setState({ job_title: text })} value={this.state.job_title} style={{ borderWidth: 0.3, fontFamily: "roboto-regular", borderRadius: 5, width: Scales.deviceWidth * 0.55, paddingLeft: Scales.deviceWidth * 0.025, fontSize: Scales.moderateScale(10), backgroundColor: "#fafafa", minHeight: Scales.deviceHeight * 0.045, color: "#3c3c3c" }} />

                                </View>
                            </View> : null}

                            {this.state.apporve == 1 ?
                                <View style={{ width: Scales.deviceWidth * 0.57, opacity: this.state.disapproved_status == false && this.state.approved_status == false ? 0.5 : 1, height: Scales.deviceHeight * 0.15, justifyContent: 'center', }}>
                                    <View style={{ width: Scales.deviceWidth * 0.57, paddingLeft: Scales.deviceWidth * 0.03, opacity: this.state.disapproved_status == true && this.state.approved_status == false ? 0.5 : 1, height: Scales.deviceHeight * 0.06, alignItems: "center", flexDirection: "row" }}>
                                        <CheckBox wrapperStyle={{ height: Scales.deviceHeight * 0.05 }} size={Scales.moderateScale(20)} containerStyle={{ height: Scales.deviceHeight * 0.05, justifyContent: "center", alignSelf: "flex-start" }} checked={this.state.approved_status} onPress={() => this.setState({ approved_status: !this.state.approved_status, disapproved_status: false })} />
                                        <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth * 0.015, color: "white", }}>Approved</Text>

                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.57, paddingLeft: Scales.deviceWidth * 0.03, opacity: this.state.disapproved_status == false && this.state.approved_status == true ? 0.5 : 1, height: Scales.deviceHeight * 0.06, alignItems: "center", flexDirection: "row" }}>
                                        <CheckBox containerStyle={{ height: "100%", justifyContent: "center" }} size={Scales.moderateScale(20)} checked={this.state.disapproved_status} onPress={() => this.setState({ disapproved_status: !this.state.disapproved_status, approved_status: false })} />
                                        <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth * 0.015, color: "white" }}>Disapproved</Text>

                                    </View>

                                </View> : null}

                            {this.state.status == 1 ? <View style={{ width: Scales.deviceWidth * 0.57, height: Scales.deviceHeight * 0.20, justifyContent: 'center', }}>
                                <View style={{ width: Scales.deviceWidth * 0.57, paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.06, alignItems: "center", flexDirection: "row" }}>
                                    <CheckBox containerStyle={{ height: "100%", justifyContent: "center" }} size={Scales.moderateScale(20)} checked={this.state.activate} onPress={() => this.setState({ activate: !this.state.activate, deactivate: false, expired: false, status_select: this.state.activate?null:String(1) })} />
                                    <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", paddingLeft: 5, color: "white" }}>Activated</Text>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.57, paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.06, alignItems: "center", flexDirection: "row" }}>
                                    <CheckBox containerStyle={{ height: "100%", justifyContent: "center" }} size={Scales.moderateScale(20)} checked={this.state.deactivate} onPress={() => this.setState({ activate: false, deactivate: !this.state.deactivate, expired: false, status_select:this.state.deactivate?null: String(0) })} />
                                    <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", paddingLeft: 5, color: "white" }}>Deactivated</Text>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.57, paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.06, alignItems: "center", flexDirection: "row" }}>
                                    <CheckBox containerStyle={{ height: "100%", justifyContent: "center" }} size={Scales.moderateScale(20)} checked={this.state.expired} onPress={() => this.setState({ activate: false, deactivate: false, expired: !this.state.expired, status_select:this.state.expired?null: String(2) })} />
                                    <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", paddingLeft: 5, color: "white" }}>Expired Jobs</Text>

                                </View>


                            </View> : null}

                            {this.state.post_btw == 1 ? <View style={{ width: Scales.deviceWidth * 0.57, height: Scales.deviceHeight * 0.20, justifyContent: 'center', }}>
                                <TouchableOpacity onPress={() => this.setState({ modalvisible: !this.state.modalvisible })}><View style={{ width: Scales.deviceWidth * 0.55, borderRadius: 5, borderWidth: 0.3, height: Scales.deviceHeight * 0.05, alignItems: "center", flexDirection: "row", backgroundColor: this.state.selectedStartDate != null ? "green" : null }}>
                                    <View style={{ width: Scales.deviceWidth * 0.10, paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                                        <Image source={require("../../assets/Images/filter_cal.png")} style={{ resizeMode: "contain" }} />

                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.40, justifyContent: "center", paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.05, }}>

                                        <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', color: this.state.selectedStartDate != null ? "white" : "#3c3c3c" }}>{this.state.selectedStartDate != null ? (String(moment(String(this.state.selectedStartDate)).format(this.state.date_format))) : "Select Start Date"}</Text>
                                    </View>

                                </View></TouchableOpacity>

                                <TouchableOpacity onPress={() => this.setState({ modalvisible_1: true })}>
                                    <View style={{ width: Scales.deviceWidth * 0.55, borderRadius: 5, borderWidth: 0.3, marginTop: Scales.deviceHeight * 0.015, height: Scales.deviceHeight * 0.05, alignItems: "center", flexDirection: "row", backgroundColor: this.state.selectedEndDate != null ? "green" : null }}>
                                        <View style={{ width: Scales.deviceWidth * 0.10, paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>

                                            <Image source={require("../../assets/Images/filter_cal.png")} style={{ resizeMode: "contain" }} />
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.40, justifyContent: "center", paddingLeft: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.05, }}>

                                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', color: this.state.selectedEndDate != null ? "white" : "#3c3c3c" }}>{this.state.selectedEndDate != null ? (String(moment(String(this.state.selectedEndDate)).format(this.state.date_format))) : "Select End Date"}</Text>
                                        </View>

                                    </View></TouchableOpacity>

                                <View style={{ width: Scales.deviceWidth * 0.54, justifyContent: "flex-end", height: Scales.deviceHeight * 0.05, }}>
                                    <TouchableOpacity onPress={() => this.resetPostedDate()}><View style={{ width: Scales.deviceWidth * 0.20, justifyContent: "center", borderRadius: 5, alignSelf: "flex-end", height: Scales.deviceHeight * 0.04, backgroundColor: '#483da8' }}>
                                        <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(12), color: "#ffffff" }}>Clear</Text>
                                    </View></TouchableOpacity>
                                </View>

                            </View> : null}

                            {this.state.account == 1 ?
                                <View style={{ width: Scales.deviceWidth * 0.57, height: Scales.deviceHeight * 0.80, justifyContent: 'center', }}>

                                    <FlatList
                                        data={this.state.subuser_list}
                                        renderItem={({ item }) => <SubUser DeleteAccountIds={this.DeleteAccountIds} ids={this.state.account_ids} AddAccountid={this.AddAccountid} data={item} />}
                                        keyExtractor={item => item.id}
                                    />
                                </View> : null}





                        </View>

                        {/* <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.065, }}>
                            <TouchableOpacity disabled={this.state.loader} onPress={() => this._refresh()}>
                                <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.06, alignSelf: "center", backgroundColor: "#13d7a6", justifyContent: "center", borderRadius: 10 }}>
                                    <Text style={{ fontFamily: "roboto-medium", color: "white", fontSize: Scales.moderateScale(18), textAlign: "center" }}>Apply</Text>

                                </View></TouchableOpacity>
                        </View> */}
                        
                    </View>
                    {/* ADD FUNCTIONALITY TO FETCH NO. OF AVAILABLE JOBS */}
                    <View style={{flexDirection:'row', alignItems:'flex-end', backgroundColor:'#2c2c39', paddingBottom:Scales.deviceHeight*0.01, height: Scales.deviceHeight * 0.085, justifyContent:'space-around', borderTopColor:'grey', borderTopWidth:0.5}}>
                        <Text style={{color:'white', }}>{20} Jobs Found</Text>
                        <TouchableOpacity disabled={this.state.loader} onPress={() => this._refresh()}>
                            <View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.06, backgroundColor: "#13d7a6", justifyContent: "center", borderRadius: 10 }}>
                                <Text style={{ fontFamily: "roboto-medium", color: "white", fontSize: Scales.moderateScale(18), textAlign: "center" }}>Apply</Text>

                            </View></TouchableOpacity>
                    </View>
                    <Modal
                    animationType="slide"
                    transparent={true}
                    isVisible={this.state.modalvisible}
                    onRequestClose={() => {
                        this.setState({ modalvisible: !this.state.modalvisible })
                    }}>
                    <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.40, borderRadius: 10, alignSelf: "center",backgroundColor: 'white' }}>

                            <View style={{ height: Scales.deviceHeight * 0.05,  alignSelf: "flex-end", right: Scales.deviceWidth*0.02 }} >
                                
                                <TouchableOpacity onPress={() => this.setState({ modalvisible: !this.state.modalvisible })}>
                                <View style={{height:Scales.deviceHeight*0.05, justifyContent:"center"}}>
                                    <Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8)}} />
                                  
                                </View>  
                                </TouchableOpacity>
                            </View>
                            <View style={{ minHeight: Scales.deviceWidth * 0.30, }}>
                                <CalendarPicker
                                    onDateChange={(date) => this.onDateChange(date)}
                                    todayBackgroundColor="blue"
                                    selectedDayColor="#7300e6"
                                    selectedDayTextColor="#FFFFFF"
                                    enableSwipe={true}
                                    maxDate={moment()}
                                    width={Scales.deviceWidth * 0.75}

                                />
                            </View>
                   

                    </View>
                  


                </Modal>
                <Modal isVisible={this.state.loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    isVisible={this.state.modalvisible_1}
                    onRequestClose={() => {
                        this.setState({ modalvisible_1: !this.state.modalvisible_1 })
                    }}>
                  

                    <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.40, borderRadius: 10, alignSelf: "center",  backgroundColor: 'white' }}>
                 
                            <View style={{  height: Scales.deviceHeight * 0.05, alignSelf: "flex-end", right: Scales.deviceWidth*0.02 }} >
                                <TouchableOpacity onPress={() => this.setState({ modalvisible_1: !this.state.modalvisible_1  })}>
                                    <View style={{height:Scales.deviceHeight*0.05, justifyContent:"center"}}>
                                    <Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }} />
                                    </View>
                                    </TouchableOpacity>

                            </View>
                            <View style={{ minHeight: Scales.deviceWidth * 0.30, }}>
                                <CalendarPicker
                                    onDateChange={(date) => this.onDateChangeEnd(date)}
                                    todayBackgroundColor="blue"
                                    selectedDayColor="#7300e6"
                                    selectedDayTextColor="#FFFFFF"
                                    enableSwipe={true}
                                    maxDate={moment()}
                                    width={Scales.deviceWidth * 0.75}

                                />
                            </View>
                                          
                    </View>


                </Modal>
                </View>
            </SafeAreaView>
        )
    }
}

class SubUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            check: false
        }
    }
    componentDidMount = () => {
        let exists = this.props.ids.includes(this.props.data.id)
        if (exists == true) {
            this.setState({ check: true })
        }
    }


    AddAccount = (id) => {
        if (this.state.check == false) {
            this.setState({ check: true })
            this.props.AddAccountid(id)
        }
        else {

            this.props.DeleteAccountIds(id)
            this.setState({ check: false })
        }
    }


    render() {
        return (
            <View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.06, alignItems: 'center', flexDirection: "row" }}>
                <CheckBox containerStyle={{ height: "100%", justifyContent: "center" }} size={Scales.moderateScale(20)} checked={this.state.check} onPress={() => this.AddAccount(this.props.data.id)} />
                <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textTransform: "capitalize", color: this.state.check?"white":"#3c3c3c" }}>
                    {this.props.data.fname}
                </Text>

            </View>
        )
    }
}