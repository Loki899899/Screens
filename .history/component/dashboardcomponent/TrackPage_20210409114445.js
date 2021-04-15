import React, { Component } from 'react';
import Header from "../../component/DrawerHeader"
import { View, Text, Clipboard, TextInput, Image, TouchableOpacity, FlatList, AsyncStorage, ImageBackground, ActivityIndicator, Alert, BackHandler, RefreshControl, SafeAreaView, Keyboard } from "react-native"
import { Scales } from "@common"
import Modal from "react-native-modal"
import PostFetch from "../../ajax/PostFetch"
import moment from 'moment';
import MyDatePicker from "../TrackCalendar"
import Toast from 'react-native-simple-toast';
import utf8 from 'utf8'
import base64 from 'base-64'
import CalendarPicker from 'react-native-calendar-picker';
import NetworkUtils from "../../common/globalfunc"
import { ScrollView } from 'react-native-gesture-handler';
import { URL } from "../../ajax/PostFetch"
import KeyboardDoneButton from '../KeyBoard'



export default class Track extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jobs_show: false,
            filter_jobs: [],
            seleted_job_id: 0,
            seleted_job_name: "",
            jobs: [],
            limit: 10,
            offset: 0,
            refreshing: false,
            job_refreshing: false,
            fixed_job: [],
            back: false,
            loader: false,
            load: false,
            date_format: "YYYY/MM/DD"
        }


    }
    searchJobFilterFunction = (text) => {

        try{
            if (text.length != 0) {
                this.setState({ jobs_show: true, seleted_job_name: text })
                const newData = this.state.fixed_job.filter(item => {
    
                    let itemData = item.name.toLowerCase()
                    let textData = text.replace("\\","\\\\")
                    textData = text.toLowerCase()
    
    
                    var b = itemData.match(textData)
    
    
                    if (itemData.match(textData)) {
    
    
                        return item;
    
                    }
    
    
                });
    
    
                this.setState({ filter_jobs: newData });
    
            }
            else {
                this.setState({ seleted_job_name: text, filter_jobs: this.state.fixed_job })
    
            }
        }
        catch(err){
            console.log(err)
        }



    };


    Get_jobs = async () => {
        this.setState({ job_refreshing: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        await fetch(URL.api_url + "interview-job-list?active=True", {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((resp) => {
                //   console.log(resp)

                let picker_datas = []
                // console.log(resp.data)
                for (let x of resp.data) {
                    let context = {
                        "id": x.jobma_job_post_id,
                        "name": x.jobma_job_title
                    }

                    picker_datas.push(context)
                }
                if (resp.error == 0) {

                    this.setState({
                        filter_jobs: picker_datas,
                        fixed_job: picker_datas
                    })
                }
                else {
                    alert(resp.message)
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
        this.setState({ job_refreshing: false })


    }

    OnSelecteJob = (job_id) => {
        this.setState({ seleted_job_id: job_id.id, seleted_job_name: job_id.name, jobs_show: false, filter_jobs: this.state.fixed_job })
        this.GetTrackData()
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
                // console.log(respJson.data, "---------date ---------")
                await AsyncStorage.setItem("date_format", date_format)
                this.setState({
                    date_format: date_format
                })
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

    _refresh = async (backfunc = true) => {
        console.log("REfreshing========================")
        if (backfunc == true) {
            this.setState({ limit: 10, offset: 0,  })
        }
        else {
            this.setState({ limit: 10, offset: 0, refreshing: true, })
        }

        this.UpdateEmployerLang()

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let jobs_id = 0
        // if (this.state.seleted_job_id != 0) {
        //     jobs_id = this.state.seleted_job_id
        // }

        const payload = {
            "job_id": jobs_id,

            "offset": 0
        }
        const json = await PostFetch("get-tracking-data", payload, headers)

        if (json != null) {
            // console.log(json)f
            if (json.error == 0) {
                let data = []
                for (let x of json.data.invited_data) {
                    if (x.jobma_interview_status == 4) {
                        continue
                    }
                    data.push(x)
                }
                this.setState({
                    jobs: data, limit: 10, offset: 0, seleted_job_id: 0,
                    seleted_job_name: "",
                })
            }
            else {

                alert(json.message)
            }

        }

        this.setState({ refreshing: false })
    }


    _Get_More_data = async () => {
        if (this.state.load == true) {
            return 0
        }
        this.setState({ load: true })
        // console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let jobs_id = 0
        if (this.state.seleted_job_id != 0) {
            jobs_id = this.state.seleted_job_id
        }

        const payload = {
            "job_id": jobs_id,

            "offset": this.state.offset
        }
        console.log(payload)
        const json = await PostFetch("get-tracking-data", payload, headers)

        if (json != null) {
            let data = []
            for (let x of json.data.invited_data) {
                if (x.jobma_interview_status == 4) {
                    continue
                }
                data.push(x)
            }
            let arr = this.state.jobs.concat(data)
            // console.log(arr, "arrrrrrrrrrrrrrrrrrrrrrrr")

            if (json.error == 0) {
                this.setState({ jobs: arr, offset: this.state.offset + 10, limit: this.state.limit + 10 })
            }
            else {

                alert(json.message)
            }

        }

        this.setState({ load: false })

    }

    GetTrackData = async () => {
        this.setState({ loader: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let jobs_id = 0
        if (this.state.seleted_job_id != 0) {
            jobs_id = this.state.seleted_job_id
        }

        const payload = {
            "job_id": jobs_id,
            "offset": 0
        }
        const json = await PostFetch("get-tracking-data", payload, headers)
        if (json != null) {

            if (json.error == 0) {
                let data = []
                console.log(json.data.invited_data, "-------------------travk data-----------")
                for (let datas of json.data.invited_data) {
                    // console.log(datas)
                    if (datas.jobma_interview_status == 4) {
                        continue
                    }
                    data.push(datas)
                }

                this.setState({ jobs: data, offset: this.state.offset + 11, limit: this.state.limit + 10 })

            }
            else {

                alert(json.message)
            }

        }

        this.setState({ loader: false })

    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    // navigationButtonPressed({ buttonId }) {

    //     this.handleBackPress();
    // }

    handleBackPress = () => {
        //Custom logic

        // this.RestState()
        //    console.log(this.props.navigation.state.params.dash)
        // this.setState({ dash: false })
        // this.props.navigation.goBack()
        return true;
    };

    componentDidMount = async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        let date_format = await AsyncStorage.getItem('date_format')
        if (date_format == null) {
            this.setState({ date_format: "MM/DD/YYYY" })
        }
        else {
            this.setState({ date_format: date_format })
        }
        // console.log(this.props.navigation.state.params, "this.props.navigation.state.params.previous_screen")

        let flag = ""
        if (this.props.navigation.state.params == undefined) {
            flag = undefined
        }
        else {
            flag = this.props.navigation.state.params.previous_screen != undefined
        }
        if (flag != undefined) {
            if (this.props.navigation.state.params.previous_screen == "dash") {
                this.setState({ back: true, seleted_job_id: 0 })
            }
            else {
                this.setState({ back: true, seleted_job_id: this.props.navigation.state.params.job_id, seleted_job_name: this.props.navigation.state.params.job_title })

            }
        }
        this.Get_jobs()
        this.GetTrackData()
        // console.log(this.state.jobs<, "LLLLLLLLL")
    }
    render() {
        let backfunc = [this._refresh,]
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#2c2c39" }} >

                    {this.state.back ?
                        <Header heading="Track" {...this.props} textalign='center' left={Scales.deviceWidth * 0.08} back={true} backfunc={backfunc} /> : <Header heading="Track" {...this.props} textalign='center' left={Scales.deviceWidth * 0.08} backfunc={backfunc} />}
                    <View style={{ width: Scales.deviceWidth * 1.0, }}>
                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08, flexDirection: "row", justifyContent: "center",}}>
                            <View style={{ width: Scales.deviceWidth * 0.8, height: Scales.deviceHeight * 0.06, borderRadius: 5, alignSelf: 'center' }}>
                                <TextInput onChangeText={(text) => this.searchJobFilterFunction(text)} value={this.state.seleted_job_name} style={{ backgroundColor: '#3d3d46', width: Scales.deviceWidth * 0.8, paddingLeft: Scales.deviceWidth * 0.06, fontFamily: "roboto-medium", height: Scales.deviceHeight * 0.0595, borderRadius: 5, borderBottomRightRadius: 0, borderTopRightRadius: 0, borderRightWidth: 0, borderWidth: 0.5, fontSize: Scales.moderateScale(14), color: "white" }} />
                                <View style={{ position: 'absolute', top: '36%', left: '4%' }}>
                                    <Image
                                        source={require('../../assets/JobmaIcons/search-dark-theme.png')}
                                        style={{ width: 12, height: 12, }}
                                    ></Image>
                                </View>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.06, justifyContent: "center", borderRadius: 5, borderWidth: 0.5, alignSelf: 'center', backgroundColor:'#52526c',borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                <TouchableOpacity onPress={() => this.setState({ jobs_show: !this.state.jobs_show })}>
                                    <Image source={require("../../assets/JobmaIcons/drop-down.png")} style={{ alignSelf: 'center', width:16, height:16, }} resizeMode='contain'/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {this.state.jobs_show ? <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.30, backgroundColor: "white", elevation: 9, borderRadius: 10, alignSelf: "center", }}>
                            {/* <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, justifyContent: "center", top: Scales.deviceHeight * 0.15, }}> */}
                            {/* <TextInput style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.04, alignSelf: "center", borderWidth: 0.3, borderTopWidth: 0.8, backgroundColor: "white" ,paddingTop: Scales.deviceHeight * 0.01}} /> */}
                            {this.state.filter_jobs.length != 0 ? <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.30, position: "absolute", }}>
                                <FlatList
                                    data={this.state.filter_jobs}
                                    renderItem={({ item, index }) => <Joblist data={item} OnSelecteJob={this.OnSelecteJob} index={index} SelectData={this.SelectData} />}
                                    keyExtractor={item => item.id}
                                    scrollEnabled={true}
                                    style={{ zIndex: 1000 }}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.Get_jobs}

                                />

                            </View> : <View style={{ justifyContent: "center", width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.30 }}>
                                    <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: "#3c3c3c" }}>No search results found!</Text>
                                </View>}
                        </View> : null}
                        {this.state.jobs.length != 0 ? <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.84, alignSelf: "center", }}>
                            <FlatList
                                data={this.state.jobs}
                                renderItem={({ item }) => <InterviewList date_format={this.state.date_format} data={item} GetTrackData={this.GetTrackData} navigation={this.props.navigation} />}
                                onRefresh={() => this._refresh(backfunc = false)}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={this._Get_More_data}
                                refreshing={this.state.refreshing}
                                onEndReachedThreshold={0.5}

                            />


                        </View> : <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._refresh()} />} ><View style={{ flex: 1, justifyContent: "center" }}><View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.80, justifyContent: 'center' }}><Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: "#3c3c3c" }}>No search results found!</Text></View></View></ScrollView>}

                        {this.state.seleted_job_id != 0 ? <View style={{ width: Scales.deviceWidth * 0.20, left: Scales.deviceWidth * 0.78, height: Scales.deviceHeight * 0.10, backgroundColor: "transparent", position: "absolute", top: Scales.deviceHeight * 0.80 }}>
                            <TouchableOpacity style={{ width: Scales.deviceWidth * 0.20, }} activeOpacity={1} onPress={() => this.props.navigation.navigate("logs", { "job_id": this.state.seleted_job_id })}>
                                <Image source={require("../../assets/Images/invitation_logs.png")} style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.10, alignSelf: "flex-end", resizeMode: "contain", right: 8 }} /></TouchableOpacity>
                        </View> : null}
                    </View>
                    <Modal isVisible={this.state.loader}>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                        </View>

                    </Modal>
                </View>
            </SafeAreaView>
        )
    }
}


class Joblist extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        // console.log(this.props.data)
        let render_data = ''
        if (this.props.index == 0) {
            render_data = <TouchableOpacity onPress={() => this.props.OnSelecteJob(this.props.data)}><View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                <Text style={{ paddingLeft: 10, fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium" }}>{this.props.data.name}</Text>

            </View></TouchableOpacity>
        }
        else {
            render_data = <TouchableOpacity style={{ zIndex: 1000 }} onPress={() => this.props.OnSelecteJob(this.props.data)}><View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, borderTopWidth: 0.3, justifyContent: "center", zIndex: 100 }}>
                <Text style={{ paddingLeft: 10, fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium" }}>{this.props.data.name}</Text>

            </View></TouchableOpacity>
        }
        return (
            <View >
                {render_data}
            </View>

        )
    }
}

class InterviewList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            send_reminder_modal: false,
            selected_date: this.props.data.jobma_invitation_expire_date,
            message: '',
            show_loader: false,
            date_format: "MM/DD/YYYY",
            calender_modal: false,
            image: this.props.data.pitcher.pitcher_url
        }

    }


    SendReminder = async () => {
        if (this.state.message.length == 0 || this.state.message == '') {
            Toast.showWithGravity("Add a personalized message", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        if (/^[\s/]*$/g.test(this.state.message)) {
            Toast.showWithGravity("Please Enter valid Message", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        this.setState({ show_loader: true })
        let token = await AsyncStorage.getItem('token')
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        };
        let payload = {}
        // console.log(this.state.selected_date, "LLLLLLLLLLLLLLLLLLLLL")
        if (this.props.data.jobma_interview_mode == 1) {
            let date = (moment(this.state.selected_date)).format()

            date = date.slice(0, 10) + " 23:59:00"
            console.log(date, "----------date-------")
            payload = {
                "invite_id": this.props.data.id,
                "new_date": date,
                "pitcher_id": this.props.data.pitcher.pithcer_id,
                "catcher_id": this.props.data.catcher.catcher_id,
                "job_id": this.props.data.job.job_id,
                "message": this.state.message,
                "api_key": token
            }

        }
        else {
            let date = "12-12-2020"
            payload = {
                "invite_id": this.props.data.id,
                "new_date": date,
                "pitcher_id": this.props.data.pitcher.pithcer_id,
                "catcher_id": this.props.data.catcher.catcher_id,
                "job_id": this.props.data.job.job_id,
                "message": this.state.message,
                "api_key": token
            }

        }



        // console.log(payload, "payload")
        const json = await PostFetch("send-track-reminder", payload, headers)
        // console.log(json)
        if (json != null) {

            if (json.error == 0) {

                await this.setState({ send_reminder_modal: false, message: '' })
                Toast.showWithGravity("Reminder sent successfully.", Toast.SHORT, Toast.BOTTOM);
                this.props.GetTrackData()

            }
            else {
                // console.log(json.message)
                this.setState({ message: '' })
                Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
            }

        }

        this.setState({ show_loader: false })

    }

    OnSelecteDate = (date) => {


        this.setState({ selected_date: date, calender_modal: false })
    }
    CopiedInvitationLink = () => {

        var bytes_job_id = utf8.encode(this.props.data.job.job_id.toString());
        var encoded_job_id = base64.encode(bytes_job_id);
        encoded_job_id = utf8.decode(encoded_job_id)
        var bytes_pitcher_id = utf8.encode(this.props.data.pitcher.pithcer_id.toString());
        var encoded_pitcher_id = base64.encode(bytes_pitcher_id);
        let link = URL.base_url + "/interview-mobile/" + encoded_job_id + "/" + encoded_pitcher_id + "/" + this.props.data.id + "/"

        Clipboard.setString(link)

        Toast.showWithGravity('Copied.', Toast.SHORT, Toast.BOTTOM);
    }
    componentDidMount = async () => {
        let date_format = await AsyncStorage.getItem('date_format')
        // console.log(date_format , "=---------date_format----------")
        if (date_format != null) {
            this.setState({ date_format: date_format })

        }
        else {
            this.setState({ date_format: "MM/DD/YYYY" })
        }
        let expired_date = moment(this.props.data.jobma_invitation_expire_date)
        let today = moment()
        if (today > expired_date) {
            let new_today_date = moment().add(1, "days").format("YYYY/MM/DD")
            this.setState({ selected_date: new_today_date })
        }

        console.log(this.props.data, "--------------------data ---------------------------------")

    }

    CreateEvaluateLiveInterviewButton = () => {
        Alert.alert(
            '',
            'To evaluate live interview.Please refer website',
            [

                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: true }
        );
    }
    render() {
        let expired_flag = false
        let today = new Date()
        if (this.props.data.pitcher.pitcher_email == "remember@yopmail.com") {

            // console.log(, "new Date()")
            // console.log())
        }
        if (this.props.data.jobma_invitation_expire_date != null) {
            if (Date.parse(today) > Date.parse(this.props.data.jobma_invitation_expire_date.slice(6, 10) + "-" + this.props.data.jobma_invitation_expire_date.slice(0, 2) + "-" + this.props.data.jobma_invitation_expire_date.slice(3, 5) + "T23:59:00.000Z")) {
                expired_flag = true

            }
        }




        return (
            <View style={{ width: Scales.deviceWidth * 1.0,  justifyContent: "center", alignSelf: "center" }}>
                {/* TO REMOVE SHADOW IF ASKED */}
                <View style={{ width: Scales.deviceWidth * 0.92, alignSelf: "center",  backgroundColor: "green", elevation: 9, borderRadius: 5, padding: 5, paddingTop: 10, flexDirection: "row",shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 1 ,
                                                            paddingLeft:Scales.deviceHeight * 0.02,
                                                            }}>
                    <View style={{ backgroundColor:'grey',width: Scales.deviceWidth * 0.16,  paddingTop: Scales.deviceHeight * 0.01, }}>
                        <View style={{ width: Scales.deviceHeight * 0.08, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: (Scales.deviceHeight * 0.08) / 2, backgroundColor: this.state.image == "" ? "#ffa001" : "transparent", }}>
                            {this.state.image == "" ?
                                <Text style={{ fontSize: Scales.moderateScale(14), textTransform: "capitalize", fontFamily: "roboto-medium", color: "white", alignSelf: "center" }}>{this.props.data.pitcher.pitcher_fname.slice(0, 2)}</Text> :
                                <Image onError={() => { this.setState({ image: "" }) }} source={{ uri: this.props.data.pitcher.pitcher_url }} style={{ width: Scales.deviceHeight * 0.08, height: Scales.deviceHeight * 0.08, borderRadius: (Scales.deviceHeight * 0.07) / 2 }} />}
                        </View>
                        <View style={{
                            
                            width: Scales.deviceHeight * 0.08,
                            backgroundColor: this.props.data.jobma_interview_status == 0 ? "#fff2bc" :
                                                this.props.data.jobma_interview_status == 1 ? "#def3ff" :
                                                    this.props.data.jobma_interview_status == 2 ? "#cdffbc" :
                                                        expired_flag ? "#f9e7eb" :
                                                            this.props.data.jobma_interview_status == 3 ? "#f9e7eb" :
                                                                this.props.data.jobma_interview_status == 4 ? "#f9e7eb" :
                                                                    this.props.data.jobma_interview_status == 5 ? "#cdffbc" : null, }}>
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: Scales.moderateScale(9),
                                    fontFamily: "roboto-medium",
                                    color: this.props.data.jobma_interview_status == 0 ? "#ffa001" :
                                                this.props.data.jobma_interview_status == 1 ? "white" :
                                                    this.props.data.jobma_interview_status == 2 ? "white" :
                                                        expired_flag == 3 ? "#dc3a59" :
                                                            this.props.data.jobma_interview_status == 3 ? "#dc3a59" :
                                                                this.props.data.jobma_interview_status == 4 ? "#dc3a59" :
                                                                    this.props.data.jobma_interview_status == 5 ? "#5eb442" : null,
                                    borderRadius: 10 }}>
                                        { this.props.data.jobma_interview_status == 0 ? "    Invited" : 
                                                this.props.data.jobma_interview_status == 1 ? "    In Process" : 
                                                    this.props.data.jobma_interview_status == 2 ? "   Completed" : 
                                                        expired_flag ? "    Expired  " : 
                                                            this.props.data.jobma_interview_status == 3 ? "    Expired  " : 
                                                                this.props.data.jobma_interview_status == 4 ? "  Rejected  " : 
                                                                    this.props.data.jobma_interview_status == 5 ? "   Rescheduled   " : null}    </Text>
                        </View>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.68,}}>

                        <View style={{ alignItems: "center", flexDirection: "row", }}>
                            {/* <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(14), paddingLeft: 8, color: "#3c3c3c" }}>
                                <Text style={{ fontFamily: "roboto-bold", color: "#3c3c3c" }}>{this.props.data.pitcher.pitcher_fname} {this.props.data.pitcher.pitcher_lname}</Text> Invited for <Text style={{ fontFamily: "roboto-bold" }}>{this.props.data.job.job_title}  </Text>
                                <Text>
                                    <Text style={{ backgroundColor: this.props.data.jobma_interview_status == 0 ? "#fff2bc" : this.props.data.jobma_interview_status == 1 ? "#def3ff" : this.props.data.jobma_interview_status == 2 ? "#cdffbc" : expired_flag ? "#f9e7eb" : this.props.data.jobma_interview_status == 3 ? "#f9e7eb" : this.props.data.jobma_interview_status == 4 ? "#f9e7eb" : this.props.data.jobma_interview_status == 5 ? "#cdffbc" : null, }}>
                                        <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(10), fontFamily: "roboto-medium", color: this.props.data.jobma_interview_status == 0 ? "#ffa001" : this.props.data.jobma_interview_status == 1 ? "#6eaff1" : this.props.data.jobma_interview_status == 2 ? "#5eb442" : expired_flag == 3 ? "#dc3a59" : this.props.data.jobma_interview_status == 3 ? "#dc3a59" : this.props.data.jobma_interview_status == 4 ? "#dc3a59" : this.props.data.jobma_interview_status == 5 ? "#5eb442" : null, borderRadius: 10 }}>{this.props.data.jobma_interview_status == 0 ? "    Invited" : this.props.data.jobma_interview_status == 1 ? "    In Progress" : this.props.data.jobma_interview_status == 2 ? "   Completed" : expired_flag ? "    Expired  " : this.props.data.jobma_interview_status == 3 ? "    Expired  " : this.props.data.jobma_interview_status == 4 ? "  Rejected  " : this.props.data.jobma_interview_status == 5 ? "   Rescheduled   " : null}    </Text>
                                    </Text>
                                </Text>
                            </Text> */}
                            {/* INVITED FOR TEXT COMPONENT */}
                            <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(14), paddingLeft: 8, color: "blue" }}>
                                {/* INVITED PERSON TEXT COMPONENT */}
                                <Text style={{ fontFamily: "roboto-bold", color: "green" }}>{this.props.data.pitcher.pitcher_fname} {this.props.data.pitcher.pitcher_lname}</Text> Invited for <Text style={{ fontFamily: "roboto-bold" }}>{this.props.data.job.job_title}  </Text>
                                {/* <Text>
                                    <Text style={{ backgroundColor: this.props.data.jobma_interview_status == 0 ? "#fff2bc" : this.props.data.jobma_interview_status == 1 ? "#def3ff" : this.props.data.jobma_interview_status == 2 ? "#cdffbc" : expired_flag ? "#f9e7eb" : this.props.data.jobma_interview_status == 3 ? "#f9e7eb" : this.props.data.jobma_interview_status == 4 ? "#f9e7eb" : this.props.data.jobma_interview_status == 5 ? "#cdffbc" : null, }}>
                                        <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(10), fontFamily: "roboto-medium", color: this.props.data.jobma_interview_status == 0 ? "#ffa001" : this.props.data.jobma_interview_status == 1 ? "#6eaff1" : this.props.data.jobma_interview_status == 2 ? "#5eb442" : expired_flag == 3 ? "#dc3a59" : this.props.data.jobma_interview_status == 3 ? "#dc3a59" : this.props.data.jobma_interview_status == 4 ? "#dc3a59" : this.props.data.jobma_interview_status == 5 ? "#5eb442" : null, borderRadius: 10 }}>{this.props.data.jobma_interview_status == 0 ? "    Invited" : this.props.data.jobma_interview_status == 1 ? "    In Progress" : this.props.data.jobma_interview_status == 2 ? "   Completed" : expired_flag ? "    Expired  " : this.props.data.jobma_interview_status == 3 ? "    Expired  " : this.props.data.jobma_interview_status == 4 ? "  Rejected  " : this.props.data.jobma_interview_status == 5 ? "   Rescheduled   " : null}    </Text>
                                    </Text>
                                </Text> */}
                            </Text>




                        </View>
                        <View style={{ backgroundColor:'white', flexDirection: 'row' }}>
                            {/* <View style={{  }}>
                                {/* <View style={{ flexDirection: "row" }}>
                                    <View style={{  alignSelf: "center", width: Scales.deviceWidth * 0.085, justifyContent: "center" }}>
                                        <Image source={require("../../assets/Images/msg.png")} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.018, alignSelf: "center", width: Scales.deviceWidth * 0.04 }} />
                                    </View>
                                    <View style={{  paddingTop: Scales.deviceHeight * 0.005 }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), height: Scales.deviceHeight * 0.04, color: "#3c3c3c" }}>{this.props.data.pitcher.pitcher_email}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ alignSelf: "center", justifyContent: "center" }}>
                                        <Image source={require("../../assets/Images/notification.png")} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.019, alignSelf: "center", width: Scales.deviceWidth * 0.04 }} />
                                    </View>
                                    <View style={{ paddingTop: Scales.deviceHeight * 0.005 }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), height: Scales.deviceHeight * 0.03, color: "#3c3c3c" }}>{this.props.data.jobma_interview_mode == 1 ? "Pre-recorded Interview":this.props.data.jobma_interview_mode == 0?'Offline Interview' : "Live Interview"}</Text>
                                    </View>
                                </View> */}

                                {/* <View style={{ width: Scales.deviceWidth * 0.47, height: Scales.deviceHeight * 0.0325, flexDirection: "row" }}>
                                    <View style={{ height: Scales.deviceHeight * 0.0325, alignSelf: "center", width: Scales.deviceWidth * 0.085, justifyContent: "center" }}>
                                        <Image source={require("../../assets/Images/notification_track.png")} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.018, alignSelf: "center", width: Scales.deviceWidth * 0.04 }} />
                                    </View>
                                    <View style={{ height: Scales.deviceHeight * 0.0325, width: Scales.deviceWidth * 0.385, paddingTop: Scales.deviceHeight * 0.005 }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), height: Scales.deviceHeight * 0.04, }}>{this.props.data.interview_complete_notified_email}</Text>
                                    </View>
                                </View> */}







                                <View style={{ width: Scales.deviceWidth * 0.47, height: Scales.deviceHeight * 0.0325, flexDirection: "row" }}>
                                    <View style={{ height: Scales.deviceHeight * 0.0325, width: Scales.deviceWidth * 0.075, justifyContent: "center" }} >
                                        <Image source={require("../../assets/Images/trackcalend.png")} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.025, width: Scales.deviceWidth * 0.04, alignSelf: "center" }} />
                                    </View>
                                    <View style={{ height: Scales.deviceHeight * 0.0325, width: Scales.deviceWidth * 0.16, justifyContent: "center" }} >
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>{moment(this.props.data.jobma_invitation_date).format(this.props.date_format)}</Text>
                                    </View>

                                    {this.props.data.jobma_interview_mode == 1 || this.props.data.jobma_interview_mode == 2 ? <View style={{ height: Scales.deviceHeight * 0.0325, width: Scales.deviceWidth * 0.235, flexDirection: "row" }}>
                                        <View style={{ height: Scales.deviceHeight * 0.0325, width: Scales.deviceWidth * 0.075, justifyContent: "center" }} >
                                            <Image source={require("../../assets/Images/trackcalstart.png")} style={{ resizeMode: "contain", height: Scales.deviceHeight * 0.025, width: Scales.deviceWidth * 0.04, alignSelf: "center" }} />
                                        </View>
                                        <View style={{ height: Scales.deviceHeight * 0.0325, width: Scales.deviceWidth * 0.18, justifyContent: "center" }} >
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>{moment(this.props.data.jobma_invitation_expire_date).format(this.props.date_format)}</Text>
                                        </View>

                                    </View> : null}
                                </View> 



                            </View> */}
                            {this.props.data.jobma_interview_mode == 1 || this.props.data.jobma_interview_mode == 0 ? <View style={{ width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.13, marginTop: 10 }}>
                                {this.props.data.jobma_interview_status == 0 ? <React.Fragment>
                                    <TouchableOpacity onPress={() => this.setState({ send_reminder_modal: true })}><View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.035, borderRadius: 5, borderWidth: 0.5, borderColor: "#ffa001", justifyContent: "center", alignSelf: "center" }}>
                                        <Text style={{ fontFamily: "roboto-medium", alignSelf: "center", fontSize: Scales.moderateScale(10), color: "#ffa001" }}>Send Reminder</Text>
                                    </View></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.CopiedInvitationLink()}><View style={{ width: Scales.deviceWidth * 0.22, borderColor: "#ff5367", height: Scales.deviceHeight * 0.035, borderRadius: 5, borderWidth: 0.5, marginTop: 5, alignSelf: "center", justifyContent: "center" }}>
                                        <Text style={{ fontFamily: "roboto-medium", alignSelf: "center", fontSize: Scales.moderateScale(10), color: "#ff5367" }}>Invitation Link</Text>

                                    </View></TouchableOpacity>
                                </React.Fragment> : null}

                                {this.props.data.jobma_interview_status == 3 ? <View style={{ width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.13, }}>
                                    <React.Fragment><TouchableOpacity onPress={() => this.setState({ send_reminder_modal: true })}><View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.035, borderRadius: 5, marginTop: Scales.deviceHeight * 0.02, borderWidth: 0.5, borderColor: "#ffa001", justifyContent: "center", alignSelf: "center" }}>
                                        <Text style={{ fontFamily: "roboto-medium", alignSelf: "center", fontSize: Scales.moderateScale(10), color: "#ffa001" }}>Send Reminder</Text>
                                    </View></TouchableOpacity>
                                    </React.Fragment>

                                </View> : null}

                                {this.props.data.jobma_interview_status == 2 ? <React.Fragment><TouchableOpacity onPress={() => this.props.navigation.navigate("Evaluate", { "appiled_id": this.props.data.applied_id, "image": this.props.data.pitcher.pitcher_url })}><View style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.04, borderRadius: 5, marginTop: Scales.deviceHeight * 0.02, borderWidth: 0.5, borderColor: "#ffa001", justifyContent: "center", alignSelf: "center" }}>
                                    <Text style={{ fontFamily: "roboto-medium", alignSelf: "center", fontSize: Scales.moderateScale(10), color: "#ffa001" }}>Evaluate</Text>
                                </View></TouchableOpacity>
                                </React.Fragment> : null}



                            </View> : null}
                            {this.props.data.jobma_interview_mode == 2 ? <View style={{ width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.13, }}>
                                {this.props.data.jobma_interview_status == 2 ? <React.Fragment><TouchableOpacity onPress={() => this.CreateEvaluateLiveInterviewButton()}><View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.035, borderRadius: 5, marginTop: Scales.deviceHeight * 0.02, borderWidth: 0.5, borderColor: "#ffa001", justifyContent: "center", alignSelf: "center" }}>
                                    <Text style={{ fontFamily: "roboto-medium", alignSelf: "center", fontSize: Scales.moderateScale(10), color: "#ffa001" }}>Evaluate</Text>
                                </View></TouchableOpacity>
                                </React.Fragment> : null}

                                {this.props.data.jobma_interview_status == 0 ? <React.Fragment><TouchableOpacity onPress={() => this.setState({ send_reminder_modal: true })}><View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.035, borderRadius: 5, marginTop: Scales.deviceHeight * 0.02, borderWidth: 0.5, borderColor: "#ffa001", justifyContent: "center", alignSelf: "center" }}>
                                    <Text style={{ fontFamily: "roboto-medium", alignSelf: "center", fontSize: Scales.moderateScale(10), color: "#ffa001" }}>Send Reminder</Text>
                                </View></TouchableOpacity>
                                </React.Fragment> : null}

                            </View>

                                : null}


                        </View>

                    </View>

                </View>







                <Modal isVisible={this.state.send_reminder_modal} onBackButtonPress={() => this.setState({ send_reminder_modal: false, selected_date: this.props.data.jobma_invitation_expire_date })}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                <KeyboardDoneButton style={{flex:1}} />

                        <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.40, backgroundColor: "white", alignSelf: "center", borderRadius: 5 }}>
                            <ImageBackground source={require("../../assets/Images/background_img_invite_1.png")} style={{ flex: 1, borderRadius: 5, padding: 10 }}>
                                <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.06, flexDirection: 'row', alignSelf: "center", borderBottomColor: "#5c49e0", borderBottomWidth: 0.8 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.06, justifyContent: "center" }}>
                                        <Text style={{ fontSize: Scales.moderateScale(16), fontFamily: "roboto-medium", paddingLeft: 5, color: "#3c3c3c" }}>Send Reminder</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ send_reminder_modal: false, selected_date: this.props.data.jobma_invitation_expire_date })}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.06, justifyContent: "center" }}>
                                        <Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", alignSelf: "center", width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.02 }} />
                                    </View></TouchableOpacity>
                                </View>

                                {this.props.data.jobma_interview_mode == "1" ? <View><View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.04, alignSelf: "center", justifyContent: "flex-end" }}>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16), paddingLeft: Scales.deviceWidth * 0.01, color: "#3c3c3c" }}>Interview Link Expiration Date</Text>
                                </View>
                                    <TouchableOpacity onPress={() => this.setState({ calender_modal: true })}><View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.07, alignSelf: "center", alignItems: "center", flexDirection: "row" }}>
                                        <View style={{ width: Scales.deviceWidth * 0.62, height: Scales.deviceHeight * 0.05, justifyContent: "center", borderWidth: 0.8, borderColor: "#5c49e0", borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0, }}>
                                            <Text style={{ width: Scales.deviceWidth * 0.62, fontSize: Scales.moderateScale(12), fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth * 0.028, textAlignVertical: "top", color: "#3c3c3c" }} >{String(moment(this.state.selected_date).format(this.props.date_format))}</Text>
                                            {/* <MyDatePicker OnSelecteDate={this.OnSelecteDate} selected_date={moment(this.state.selected_date)} /> */}
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.18, borderWidth: 0.8, borderLeftWidth: 0, justifyContent: "center", height: Scales.deviceHeight * 0.05, borderColor: "#5c49e0", borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                            <Image source={require("../../assets/Images/track_cal.png")} style={{ resizeMode: "contain", alignSelf: "center", }} />
                                        </View>
                                    </View></TouchableOpacity>
                                </View> : null}
                                <View style={{}}>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: this.props.data.jobma_interview_mode == "1" ? Scales.deviceHeight * 0.04 : Scales.deviceHeight * 0.08, alignSelf: "center", justifyContent: "center" }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16), paddingLeft: Scales.deviceWidth * 0.012, color: "#3c3c3c" }}>Message*</Text>
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.80, borderWidth: 0.8, borderColor: "#5c49e0", height: Scales.deviceHeight * 0.08, borderRadius: 10, alignSelf: "center",  }}>
                                        
                                        <TextInput placeholder={"Message"} onSubmitEditing={Keyboard.dismiss} returnKeyLabel={"done"} returnKeyType={"done"} multiline={true} onChangeText={(text) => this.setState({ message: text })} style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.06, fontSize: Scales.moderateScale(12), fontFamily: "roboto-medium", textAlignVertical: 'top', padding:Scales.deviceHeight*0.01 }} numberOfLines={10} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.07, alignSelf: "center", flexDirection: "row", alignItems: "flex-end", justifyContent: "center" }}>
                                        <TouchableOpacity activeOpacity={0.1} onPress={() => this.setState({ send_reminder_modal: false, selected_date: this.props.data.jobma_invitation_expire_date })}><View style={{ width: Scales.deviceWidth * 0.20, borderRadius: 5, height: Scales.deviceHeight * 0.05, borderWidth: 0.5, borderColor: "#3c3c3c3", justifyContent: "center" }}>
                                            <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#3c3c3c" }}>Close</Text>
                                        </View></TouchableOpacity>
                                        <View style={{ paddingLeft: Scales.deviceWidth * 0.01 }}>
                                            <TouchableOpacity activeOpacity={0.1} disabled={this.state.show_loader} onPress={() => this.SendReminder()}>
                                                <View style={{ width: Scales.deviceWidth * 0.20, borderRadius: 5, height: Scales.deviceHeight * 0.05, justifyContent: "center", borderWidth: 0.5, borderColor: "#ff5367" }}>
                                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#ff5367" }}>Send</Text>

                                                </View></TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            </ImageBackground>

                        </View>

                    </View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        isVisible={this.state.calender_modal}
                        onRequestClose={() => this.setState({ calender_modal: false })}

                    >

                        <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.42, borderRadius: 10, alignSelf: "center", backgroundColor: 'white' }}>
                            <View style={{ width: "100%", }}>
                                <View style={{ height: Scales.deviceWidth * 0.10, justifyContent: "center", alignSelf: "flex-end", right: 8 }} >
                                    <TouchableOpacity onPress={() => this.setState({ calender_modal: false })}>
                                        <View style={{ height: Scales.deviceHeight * 0.10,width:Scales.deviceWidth*0.08,alignItems:'center', justifyContent: "center" ,}}>
                                            <Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ minHeight: Scales.deviceWidth * 0.32, }}>
                                    <CalendarPicker
                                        onDateChange={(date) => this.OnSelecteDate(date)}
                                        todayBackgroundColor="blue"
                                        selectedDayColor="#7300e6"
                                        selectedDayTextColor="#FFFFFF"
                                        enableSwipe={true}

                                        initialDate={this.state.selected_date}
                                        minDate={moment().add(1, "days")}
                                        width={Scales.deviceWidth * 0.75}

                                    />
                                </View>
                            </View>
                        </View>


                    </Modal>
                </Modal>

                <Modal isVisible={this.state.show_loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>

            </View>
        )
    }
}
