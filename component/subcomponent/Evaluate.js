import React, { Component } from 'react';
import { View, Text, ScrollView, Image, FlatList, AsyncStorage, TouchableOpacity, CheckBox, ImageBackground, ActivityIndicator, Alert, BackHandler, SafeAreaView } from "react-native"
import Header from "../DrawerHeader"
import { Scales } from "@common"
import Stars from 'react-native-stars';
import PostFetch from "../../ajax/PostFetch"
import Modal from "react-native-modal"
import Video from 'react-native-video';
import Sound from "react-native-sound"
import { LinearGradient } from 'expo-linear-gradient';

import ProgressCircle from 'react-native-progress-circle'
import Toast from 'react-native-simple-toast';
import Collapsible from 'react-native-collapsible';
// import WaveForm from 'react-native-audiowaveform';
import EntypoI from "react-native-vector-icons/Entypo"

import MatI from "react-native-vector-icons/MaterialCommunityIcons"


export default class Evaluated extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            loading: false,
            pitcher_data: {
                "avg_rating": "0.0",
                "evalution_list": {
                    "applied_id": "",
                    "apply_mode": "0",
                    "avg_rating": 0,
                    "current_status": "",
                    "interview_mode": "",
                    "job_id": "",
                    "jobma_applied_date": "",
                    "jobma_job_title": "",
                    "live_interview_payment_status": "",
                    "pitcher_data": {
                        "jobma_current_deg": "",
                        "jobma_pitcher_email": "",
                        "jobma_pitcher_fname": "",
                        "jobma_pitcher_id": "",
                        "jobma_pitcher_lname": "",
                        "jobma_pitcher_phone": "",
                        "jobma_pitcher_photo": "",
                        "jobma_pitcher_url": "",
                    },
                    "pre_recorded_payment_status": "",
                    "status": "0",
                },
                "job_name": {
                    "jobma_job_title": "",
                },
                "total_rated_person_count": "",
            },
            video_interview_question: [],
            audio_interview_question: [],
            essay_interview_question: [],
            mcq_interview_question: [],

            rating_summary: {
                "rating_data": {},
                "avg_rating": "",
                "recommended_yes": "",
                "recommended_no": ""
            },
            rating_fedd: [],
            Hide_fedback: true,
            current_status: 0,
            hire: null,
            question_show: 1,
            summary_collaps: false,
            applied_user_evaluate: [],
            avg_rating: 0,
            collapsed: true,
            collapsed_video: true,
            collapsed_audio: true,
            collapsed_essay: true,
            collapsed_mcq: true,
            image: this.props.navigation.state.params.image == undefined || this.props.navigation.state.params.image == "" ? null : this.props.navigation.state.params.image,
            mcq_question_detail: { "total_question": 0, "incorrect_anwer": 0, "correct_answer": 0, "total_score": 0 },
            go_to_rate: true,
            rate_datas: [],
            showRate: false,
            RateParms: {
                "rating_data": {},
                "avg_rating": "",
                "recommended_yes": "",
                "recommended_no": ""
            },
            feedback_avg_rating: 0

        }

        console.log(this.props.navigation.state.params.image, "this.props.navigation.state.params.image")
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    Get_interview_question = async () => {
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let pitcher_id = this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_id

        const payload = {
            "job_id": this.state.pitcher_data.evalution_list.job_id, "pitcher_id": pitcher_id
        }
        console.log(payload, "payload")


        const json = await PostFetch("interview-question", payload, header)

        console.log(json, "interview-questioninterview-questioninterview-questioninterview-question")
        if (json != null) {

            if (json.error == 0) {
                let video_question_list = []
                let mcq_question_list = []
                let essay_question_list = []
                let audio_question_list = []

                for (let i of json.data.jobma_answers.question) {
                    if (i.qtype == 6 || i.qtype == 7 || i.qtype == 5) {
                        continue
                    }
                    else if (i.qtype == 1) {
                        video_question_list.push(i)
                    }
                    else if (i.qtype == 2) {
                        mcq_question_list.push(i)
                    }
                    else if (i.qtype == 3) {
                        essay_question_list.push(i)
                    }
                    else if (i.qtype == 4) {
                        audio_question_list.push(i)
                    }

                }
                let correct_answer = 0
                let incorrect_answer = 0
                let total_question = 0
                for (let i of mcq_question_list) {
                    console.log(i)
                    if (i.correct == i.answer) {
                        correct_answer = correct_answer + 1
                    }
                    else {
                        incorrect_answer = incorrect_answer + 1
                    }
                    total_question = total_question + 1
                }
                let mcq_detail = { "total_question": total_question, "incorrect_anwer": incorrect_answer, "correct_answer": correct_answer, "total_score": parseFloat((correct_answer / total_question) * 100).toFixed(2) }
                console.log(correct_answer, "-----------------------correct_answer-----------------")
                console.log(essay_question_list, "-----------------------correct_answer-----------------")
                console.log(audio_question_list, "-----------------------correct_answer-----------------")

                console.log(mcq_detail, "-------------------------total score----------------------------")
                this.setState({
                    video_interview_question: video_question_list,
                    audio_interview_question: audio_question_list,
                    mcq_interview_question: mcq_question_list,
                    essay_interview_question: essay_question_list,
                    mcq_question_detail: mcq_detail,
                    go_to_rate: false
                })

            }
            else {

            }

        }
        else {
            // // alert("Something Went Wrong !!!")
        }

    }

    User_Evaluate = async () => {
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let pitcher_id = this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_id

        const payload = {
            "applied_id": this.props.navigation.state.params.appiled_id
        }


        const json = await PostFetch("get-rating", payload, header)

        let catcher_email = await AsyncStorage.getItem('email')
        if (json != null) {

            if (json.error == 0) {
                let rate_data = []
                for (let i of json.data) {

                    if (String(i.rated_by).toLowerCase() == String(catcher_email).toLowerCase()) {
                        rate_data.push(i)
                    }
                }
                console.log("------------------->>>>Rate_data", rate_data[0])
                let avg_rating = 0
                let rating_summary = {
                    "rating_data": {},
                    "avg_rating": "",
                    "recommended_yes": "",
                    "recommended_no": ""
                }
                if (rate_data.length != 0) {
                    for (let i of rate_data[0].feedback_params) {
                        avg_rating = avg_rating + Number(i.value)
                    }
                    avg_rating = avg_rating / rate_data[0].feedback_params.length
                    let avg_val = parseFloat(avg_rating)


                    console.log((avg_val))
                    let intValue = parseInt(avg_val)

                    intValue = intValue + 0.5
                    if (avg_val > intValue) {
                        intValue = parseInt(avg_val) + 1
                        console.log(avg_val, "ooo")
                    }
                    else if (intValue == avg_val) {
                        console.log("ll")
                        intValue = avg_val
                    }
                    else {
                        console.log("p")
                        intValue = intValue
                    }
                    avg_val = intValue
                    avg_rating = avg_val



                    if (Number(rate_data[0].recommended) == 1) {
                        rating_summary.recommended_yes = 1
                        rating_summary.recommended_no = 0
                    }
                    else if (Number(rate_data[0].recommended) == 0) {
                        rating_summary.recommended_yes = 0
                        rating_summary.recommended_no = 1
                    }
                }




                this.setState({
                    applied_user_evaluate: json.data,
                    rate_datas: rate_data,
                    showRate: true,
                    feedback_avg_rating: avg_rating,
                    RateParms: rating_summary

                })
            }
            else {

            }

        }
        else {
            // alert("Something Went Wrong !!!")
        }

    }

    Get_ratings = async () => {

        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let pitcher_id = this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_id

        const payload = {
            "applied_id": this.props.navigation.state.params.appiled_id
        }


        const json = await PostFetch("rating-summary", payload, header)


        if (json != null) {

            if (json.error == 0) {
                console.log(json.data, "summart 555555")
                let avg_val = parseFloat(json.data.avg_rating)


                console.log((avg_val))
                let intValue = parseInt(avg_val)

                intValue = intValue + 0.5
                if (avg_val > intValue) {
                    intValue = parseInt(avg_val) + 1
                    console.log(avg_val, "ooo")
                }
                else if (intValue == avg_val) {
                    console.log("ll")
                    intValue = avg_val
                }
                else {
                    console.log("p")
                    intValue = intValue
                }
                avg_val = intValue
                console.log(avg_val, "avg")
                this.setState({
                    rating_summary: json.data,
                    avg_rating: avg_val

                })
                console.log(this.state.avg_rating, "this.state.rating_summary.avg_rating")



            }
            else {
                // this.CreateEvaluateLiveInterviewButton()
            }

        }

        else {
            // alert("Something Went Wrong !!!")
        }

    }

    ChangeStatus = async (status) => {
        this.setState({ loading: true })
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        const payload = {
            "applied_id": this.props.navigation.state.params.appiled_id,
            "current_status": status,
            "contact_text": "test"
        }


        const json = await PostFetch("change-status", payload, header)


        if (json != null) {
            if (json.error == 0) {

                this.setState({
                    current_status: status
                })

            }
            else {
                alert(json.message)
            }

        }
        else {
            // alert("Something Went Wrong !!!")
        }
        this.setState({ loading: false })

    }
    get_data = async () => {
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        const payload = {
            "applied_id": this.props.navigation.state.params.appiled_id
        }

        // console.log(payload, "applid 5555555555555555555")

        const json = await PostFetch("candidate-detail", payload, header)


        if (json != null) {
            console.log(json, "------------------------------------------------------------")
            if (json.error == 0) {
                console.log(json.data.evalution_list.interview_mode, " --------------------------- interview mode 0000000000000000")
                if (parseInt(json.data.evalution_list.interview_mode) == 2) {
                    this.CreateEvaluateLiveInterviewButton()
                    return 0
                }
                if (parseInt(json.data.evalution_list.interview_mode) == 0) {
                    this.setState({ go_to_rate: false })
                }
                await this.setState({
                    pitcher_data: json.data
                })
                // console.log(json.data.evalution_list.current_status, "::::::::::::::::::::::::::::::::::::::::::::")

                this.setState({ current_status: json.data.evalution_list.status })

                this.Get_interview_question()
                // console.log(json.data.viewed, "Ljson.data.viewedjson.data.viewedjson.data.viewedjson.data.viewed")
                if (String(this.state.pitcher_data.evalution_list.interview_mode) == "1") {
                    if (json.data.evalution_list.viewed == false) {
                        this.UpdateViewedStatus()

                    }
                }


            }
            else {
                let permission = await AsyncStorage.getItem("permission")
                // console.log(permission(item=>"1"==item), "-------permission-----")
                permission = JSON.parse(permission)
                // console.log(typeof(permission))
                // console.log(permission.indexOf("1"))
                if (permission[0] != "") {
                    if (permission.indexOf("1") == -1) {
                        Toast.showWithGravity("You don't have permission to perform this action! Please Contact Main User.", Toast.SHORT, Toast.BOTTOM);
                        this.props.navigation.goBack()

                    }

                }
                else {
                    alert(json.message)
                    // this.CreateEvaluateLiveInterviewButton()
                }

            }

        }
        else {
            // alert("Something Went Wrong !!!")
        }

    }

    UpdateViewedStatus = async () => {

        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        const payload = {
            "pitcher_id": this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_id,
            "post_id": this.state.pitcher_data.evalution_list.job_id
        }

        // console.log(payload, "applid 5555555555555555555")

        const json = await PostFetch("update-viewed-status", payload, header)
        // console.log(json, "uodate view josn adhfiah")
        if (json != null) {
            if (json.error == 1) {
                Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
            }
            else {

            }

        }
        else {
            // alert("Something Went Wrong !!!")
        }


    }
    CheckStatusButton = (status) => {
        let msg = ""
        if (status == 2) {
            msg = "select"
        }
        else if (status == 1) {
            msg = "on-Hold"
        }
        else if (status == 3) {
            msg = "reject"
        }
        Alert.alert(
            '',
            'Are you sure you want to ' + String(msg) + " jobseeker?",
            [{
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },

            { text: 'OK', onPress: () => this.ChangeStatus(status) }
            ],
            { cancelable: true }
        );
    }
    CreateEvaluateLiveInterviewButton = () => {
        Alert.alert(
            '',
            'To evaluate live interview.Please refer website',
            [

                { text: 'OK', onPress: () => this.props.navigation.goBack() }
            ],
            { cancelable: false }
        );
    }



    componentDidMount = () => {

        this.get_data()
        this.User_Evaluate()
        this.Get_ratings()
        // console.log(this.state, "------ppppppppppppps")

        console.log(this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_phone, "tthis.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_phone")


        // console.log(this.state.rating_summary, "this.state.rating_summary ------------------this.state.rating_summary")
    }
    render() {
        //console.log(this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_phone, "tthis.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_phone")
        // console.log("this.state.applied_user_evaluate==>",this.state.applied_user_evaluate)

        let appiled_id = this.props.navigation.state.params.appiled_id
        let fedd_param = []
        // //console.log(this.state.rating_summary, "LLL55555555555LLSDS")
        let counter = 0
        for (let i in this.state.rating_summary.rating_data) {
            let data = null
            if (counter == 0) {
                data = <View key={counter} style={{ width: Scales.deviceWidth * 0.95, minHeight: Scales.deviceHeight * 0.06, alignSelf: 'center', flexDirection: 'row', backgroundColor: '#faf9fd', borderRadius: 10 }}>
                    <View style={{ width: Scales.deviceWidth * 0.30, justifyContent: "center", minHeight: Scales.deviceHeight * 0.06 }}>
                        <Text style={{ textAlign: 'left', paddingLeft: Scales.deviceWidth * 0.02, paddingTop: Scales.deviceHeight * 0.01, paddingBottom: Scales.deviceHeight * 0.01, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{i}</Text></View>
                    <View style={{ width: Scales.deviceWidth * 0.60, alignItems: 'flex-end', minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center' }}>
                        <Stars

                            default={this.state.rating_summary.rating_data[i]}

                            spacing={Scales.moderateScale(4)}
                            starSize={Scales.moderateScale(24)}
                            count={5}
                            disabled={true}
                            fullStar={this.state.rating_summary.rating_data[i] > 0 && this.state.rating_summary.rating_data[i] < 1.5 ? require('../../assets/Images/red_star.png') : this.state.rating_summary.rating_data[i] > 1 && this.state.rating_summary.rating_data[i] < 3.5 ? require('../../assets/Images/star.png') : this.state.rating_summary.rating_data[i] > 3 && this.state.rating_summary.rating_data[i] < 5.5 ? require('../../assets/Images/green_star.png') : null}
                            emptyStar={require('../../assets/Images/empty-star.png')}
                            halfStar={this.state.rating_summary.rating_data[i] > 0.0 && this.state.rating_summary.rating_data[i] <= 1.0 ? require('../../assets/Images/half_red_star.png') : this.state.rating_summary.rating_data[i] > 1.0 && this.state.rating_summary.rating_data[i] <= 3.0 ? require('../../assets/Images/half-filled-star.png') : this.state.rating_summary.rating_data[i] > 3.0 && this.state.rating_summary.rating_data[i] <= 5.0 ? require('../../assets/Images/half_green_star.png') : null} />
                    </View>
                </View>
            }
            else {
                data = <View key={counter} style={{ width: Scales.deviceWidth * 0.95, minHeight: Scales.deviceHeight * 0.06, alignSelf: 'center', borderTopWidth: 0.5, flexDirection: 'row', backgroundColor: '#faf9fd', borderRadius: 10 }}>
                    <View style={{ width: Scales.deviceWidth * 0.30, justifyContent: "center", minHeight: Scales.deviceHeight * 0.06 }}>
                        <Text style={{ textAlign: 'left', paddingLeft: Scales.deviceWidth * 0.02, paddingTop: Scales.deviceHeight * 0.01, paddingBottom: Scales.deviceHeight * 0.01, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{i}</Text></View>
                    <View style={{ width: Scales.deviceWidth * 0.60, alignItems: 'flex-end', minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center' }}>
                        <Stars

                            default={this.state.rating_summary.rating_data[i]}

                            spacing={Scales.moderateScale(4)}
                            starSize={Scales.moderateScale(24)}
                            count={5}
                            disabled={true}
                            fullStar={this.state.rating_summary.rating_data[i] > 0 && this.state.rating_summary.rating_data[i] < 1.5 ? require('../../assets/Images/red_star.png') : this.state.rating_summary.rating_data[i] > 1 && this.state.rating_summary.rating_data[i] < 3.5 ? require('../../assets/Images/star.png') : this.state.rating_summary.rating_data[i] > 3 && this.state.rating_summary.rating_data[i] < 5.5 ? require('../../assets/Images/green_star.png') : null}
                            emptyStar={require('../../assets/Images/empty-star.png')}
                            halfStar={this.state.rating_summary.rating_data[i] > 0.0 && this.state.rating_summary.rating_data[i] <= 1.0 ? require('../../assets/Images/half_red_star.png') : this.state.rating_summary.rating_data[i] > 1.0 && this.state.rating_summary.rating_data[i] <= 3.0 ? require('../../assets/Images/half-filled-star.png') : this.state.rating_summary.rating_data[i] > 3.0 && this.state.rating_summary.rating_data[i] <= 5.0 ? require('../../assets/Images/half_green_star.png') : null} />
                    </View>
                </View>
            }
            counter = counter + 1
            fedd_param.push(data)
        }
        console.log("this.state.rate_datas[0].feedback_params==>>", this.state.rate_datas)

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#faf9fd" }}>
                    <Header heading="Evaluate" {...this.props} textalign='center' left={Scales.deviceWidth * 0.10} back={true} />
                    <View style={{ flex: 1, backgroundColor: "#faf9fd" }}>

                        <ScrollView>
                            <View style={{ alignSelf: 'center', zIndex: 100, position: "absolute", top: Scales.deviceHeight * 0.09, right: Scales.deviceWidth * 0.012 }}>
                                {this.state.showRate ?
                                    <TouchableOpacity disabled={this.state.go_to_rate} style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.06, zIndex: 100 }} onPress={() => this.props.navigation.navigate('Rate', { "apply_id": appiled_id, "get_rating": this.Get_ratings, "get_data": this.get_data, "User_Evaluate": this.User_Evaluate, "rating_params": this.state.RateParms, "avg": this.state.feedback_avg_rating, 'comment': this.state.rate_datas.length == 0 ? "" : this.state.rate_datas[0].comment, "feedbacks": this.state.rate_datas.length == 0 ? [] : this.state.rate_datas[0].feedback_params })}>
                                        <LinearGradient style={{ width: Scales.deviceHeight * 0.07, height: Scales.deviceHeight * 0.07, borderRadius: Scales.deviceHeight * 0.07 / 2, }} colors={["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"]}>
                                            <View style={{ width: Scales.deviceHeight * 0.07, height: Scales.deviceHeight * 0.07, borderRadius: Scales.deviceHeight * 0.07 / 2, justifyContent: "center" }}>
                                                <Image source={require("../../assets/Images/rate.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.055, height: Scales.deviceHeight * 0.045, alignSelf: "center" }} />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    : null}

                            </View>
                            <View style={{ width: Scales.deviceWidth * 1.00, height: Scales.deviceHeight * 0.12, flexDirection: "row", backgroundColor: "#faf9fd" }}>
                                <View style={{ width: Scales.deviceWidth * 0.20, justifyContent: 'flex-end', height: Scales.deviceHeight * 0.10, }}>
                                    <View style={{ width: Scales.deviceHeight * 0.078, justifyContent: 'center', borderColor: "#251e57", borderWidth: 2, height: Scales.deviceHeight * 0.078, borderRadius: (Scales.deviceHeight * 0.078) / 2, alignSelf: 'center', }}>
                                        {this.state.image != null ? <Image onError={() => this.setState({ image: null })} source={{ uri: this.props.navigation.state.params.image }} style={{ width: Scales.deviceHeight * 0.078, height: Scales.deviceHeight * 0.078, borderRadius: Scales.deviceHeight * 0.078 / 2, alignSelf: 'center' }} /> :
                                            <Text style={{ alignSelf: 'center', color: "#251e57", fontFamily: "roboto-bold", fontSize: Scales.moderateScale(20), bottom: 3 }}>{this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_fname.slice(0, 2)}</Text>}

                                    </View>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.12, justifyContent: "center", padding: Scales.deviceWidth * 0.03, }}>
                                    <Text style={{ fontFamily: "roboto-bold", color: "#3c3c3c", fontSize: Scales.moderateScale(16) }}>{this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_fname} {this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_lname}</Text>
                                    <Text style={{ fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(12) }}>{this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_email}</Text>
                                    <Text style={{ fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(12) }}>{this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_phone.length != 0 ? "" : null}{this.state.pitcher_data.evalution_list.pitcher_data.jobma_pitcher_phone}</Text>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.365, height: Scales.deviceHeight * 0.12, justifyContent: "center", }}>
                                    <View style={{ paddingRight: Scales.deviceWidth * 0.05 }}>
                                        <Stars
                                            half={false}
                                            default={this.state.avg_rating}

                                            spacing={Scales.moderateScale(4)}
                                            starSize={Scales.moderateScale(22)}
                                            disabled={true}
                                            count={5}

                                            fullStar={require('../../assets/Images/star.png')}
                                            emptyStar={require('../../assets/Images/empty-star.png')}
                                            halfStar={require('../../assets/Images/half-filled-star.png')} />

                                    </View>
                                </View>
                            </View>

                            <View style={{ width: Scales.deviceWidth * 1.00, backgroundColor: "#faf9fd", }}>

                                <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.05, justifyContent: "center", backgroundColor: '#ebebeb', borderRadius: 5, }}>
                                    <Text style={{ paddingLeft: Scales.deviceWidth * 0.03, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>Current status is <Text style={{ fontFamily: "roboto-bold", color: this.state.current_status == 1 ? "#ffb44f" : this.state.current_status == 2 ? "#5ed6a8" : this.state.current_status == 3 ? "#ff6a73" : this.state.current_status == 0 ? '#ff6a73' : null }}>{this.state.current_status == 1 ? "On-Hold" : this.state.current_status == 2 ? "Selected" : this.state.current_status == 3 ? "Rejected" : this.state.current_status == 0 ? 'Applied' : null}</Text></Text>
                                </View>

                            </View>



                            <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.12, justifyContent: "center" }}>
                                <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.09, left: Scales.deviceWidth * 0.01, flexDirection: 'row', backgroundColor: "#faf9fd" }}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.CheckStatusButton(2)}>
                                        <View style={{ width: Scales.deviceWidth * 0.2375, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: this.state.current_status == 2 ? '#5ed6a8' : "#faf9fd", }}>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                {this.state.current_status == 2 ?
                                                    <Image source={require("../../assets/Images/select.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(1) }}></Image> :
                                                    <Image source={require("../../assets/Images/yes.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(1) }}></Image>}
                                            </View>

                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: this.state.current_status == 2 ? 'white' : "black", }}>Select</Text>
                                            </View>
                                        </View></TouchableOpacity>

                                    <TouchableOpacity activeOpacity={1} onPress={() => this.CheckStatusButton(1)}>
                                        <View style={{ width: Scales.deviceWidth * 0.2375, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: this.state.current_status == 1 ? '#ffb44f' : "#faf9fd", }}>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                {this.state.current_status == 1 ?
                                                    <Image source={require("../../assets/Images/on-hlod.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }}></Image> :
                                                    <Image source={require("../../assets/Images/pending_clock.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8) }}></Image>}
                                            </View>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: this.state.current_status == 1 ? 'white' : "black", }}>On-Hold</Text>

                                            </View>
                                        </View></TouchableOpacity>

                                    <TouchableOpacity activeOpacity={1} onPress={() => this.CheckStatusButton(3)}>
                                        <View style={{ width: Scales.deviceWidth * 0.2375, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: this.state.current_status == 3 ? '#ff6a73' : "#faf9fd", }}>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }} >
                                                {this.state.current_status == 3 ?
                                                    <Image source={require("../../assets/Images/rejected.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(0.7) }}></Image> :
                                                    <Image source={require("../../assets/Images/no.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(0.7) }}></Image>}
                                            </View>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: this.state.current_status == 3 ? 'white' : "black", }}>Rejected</Text>

                                            </View>
                                        </View></TouchableOpacity>

                                    <TouchableOpacity activeOpacity={1} >
                                        <View style={{ width: Scales.deviceWidth * 0.2375, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: this.state.current_status == 0 ? '#ff6a73' : "#faf9fd", }}>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                {this.state.current_status == 0 ?
                                                    <Image source={require("../../assets/Images/applied_icon_white.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }}></Image> :
                                                    <Image source={require("../../assets/Images/applied_icon_black.png")} style={{ alignSelf: 'center', resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }}></Image>}
                                            </View>
                                            <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: this.state.current_status == 0 ? 'white' : "black" }}>Applied</Text>

                                            </View>
                                        </View></TouchableOpacity>
                                </View>
                            </View>


                            <View style={{ width: Scales.deviceWidth * 1.0, justifyContent: "center", backgroundColor: "#faf9fd" }}>
                                <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.05, justifyContent: 'center' }}>
                                    <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.05, justifyContent: "center", backgroundColor: '#ebebeb', borderRadius: 5, }}>
                                        <Text style={{ paddingLeft: Scales.deviceWidth * 0.02, fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#3c3c3c" }}>Total Questions : {this.state.video_interview_question.length + this.state.audio_interview_question.length + this.state.essay_interview_question.length + this.state.mcq_interview_question.length}</Text>
                                    </View>
                                </View>

                                <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.15, justifyContent: 'center', backgroundColor: '#faf9fd' }}>
                                    <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.10, flexDirection: "row", alignItems: "center", backgroundColor: '#faf9fd', borderRadius: 5, }}>
                                        <View style={{ width: Scales.deviceWidth * 0.24, left: 3, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                            <TouchableOpacity onPress={() => this.setState({ question_show: 1, collapsed_video: !this.state.collapsed_video, collapsed_audio: true, collapsed_essay: true, collapsed_mcq: true })} activeOpacity={1}><View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.10, borderRadius: 10, backgroundColor: '#45c8c8', elevation: 5 }}>
                                                <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                                                    <Image source={require("../../assets/Images/white_video.png")} style={{ resizeMode: 'contain', alignSelf: 'center', width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.02 }}></Image>
                                                </View>
                                                <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05 }}>
                                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: 'white' }}>Video</Text>
                                                </View>

                                            </View></TouchableOpacity>
                                        </View>

                                        <View style={{ width: Scales.deviceWidth * 0.24, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                            <TouchableOpacity onPress={() => this.setState({ question_show: 4, collapsed_audio: !this.state.collapsed_audio, collapsed_video: true, collapsed_mcq: true, collapsed_essay: true })} activeOpacity={1}>
                                                <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.10, borderRadius: 10, backgroundColor: '#f7655a', elevation: 5 }}>
                                                    <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                                                        <Image source={require("../../assets/Images/white_audio.png")} style={{ resizeMode: 'contain', alignSelf: 'center', width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.03 }}></Image>
                                                    </View>
                                                    <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05 }}>
                                                        <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: 'white' }}>Audio</Text>
                                                    </View>

                                                </View></TouchableOpacity>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.24, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                            <TouchableOpacity onPress={() => this.setState({ question_show: 3, collapsed_essay: !this.state.collapsed_essay, collapsed_mcq: true, collapsed_audio: true, collapsed_video: true })} activeOpacity={1}>
                                                <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.10, borderRadius: 10, backgroundColor: '#fdcd65', elevation: 5 }}>
                                                    <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                                                        <Image source={require("../../assets/Images/white_essay.png")} style={{ resizeMode: 'contain', alignSelf: 'center', width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.025 }}></Image>
                                                    </View>
                                                    <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05 }}>
                                                        <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: 'white' }}>Essay</Text>
                                                    </View>

                                                </View></TouchableOpacity>
                                        </View>


                                        <View style={{ width: Scales.deviceWidth * 0.24, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                            <TouchableOpacity onPress={() => this.setState({ question_show: 2, collapsed_mcq: !this.state.collapsed_mcq, collapsed_video: true, collapsed_audio: true, collapsed_essay: true })} activeOpacity={1}><View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.10, borderRadius: 10, backgroundColor: '#fc5d99', elevation: 5 }}>
                                                <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                                                    <Image source={require("../../assets/Images/white_mcq.png")} style={{ resizeMode: 'contain', alignSelf: 'center', width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.025 }}></Image>
                                                </View>
                                                <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.05 }}>
                                                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: 'white' }}>Mcq</Text>
                                                </View>

                                            </View></TouchableOpacity>
                                        </View>



                                    </View>

                                </View>

                            </View>




                            <View style={{ width: Scales.deviceWidth * 1.0, alignItems: "center", flexDirection: 'row', }}>
                                <Collapsible collapsed={this.state.collapsed_video} align="center">
                                    {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                                    {this.state.question_show == 1 ? this.state.video_interview_question.length != 0 ? <FlatList
                                        data={this.state.video_interview_question}
                                        renderItem={({ item, index }) => <Question_Slide data={item} index={index} navigation={this.props.navigation} />}
                                        horizontal={true}
                                        style={{ height: Scales.deviceHeight * 0.28 }}
                                        keyExtractor={(item, index) => index.toString()}
                                    /> : <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.28, justifyContent: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>No video question found</Text>
                                        </View> : null}
                                </Collapsible>


                                <Collapsible collapsed={this.state.collapsed_mcq} align="center">

                                    {this.state.question_show == 2 ? this.state.mcq_interview_question.length != 0 ?
                                        <View  >
                                            <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.10, justifyContent: 'center', backgroundColor: '#faf9fd' }}>
                                                <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.10, flexDirection: "row", alignItems: "center", backgroundColor: '#faf9fd', borderRadius: 5, }}>
                                                    <View style={{ width: Scales.deviceWidth * 0.24, left: 3, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                                        <View style={{
                                                            width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: '#f6f7fd', elevation: 3, shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 1
                                                        }}>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                                <Text style={{ textAlign: "center", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>Total Questions</Text>
                                                            </View>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04 }}>
                                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-regular", fontSize: Scales.moderateScale(16), color: '#3c3c3c' }}>{this.state.mcq_question_detail.total_question}</Text>
                                                            </View>

                                                        </View>

                                                    </View>

                                                    <View style={{ width: Scales.deviceWidth * 0.24, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                                        <View style={{
                                                            width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: '#f6f7fd', elevation: 3, shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 1
                                                        }}>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                                <Text style={{ textAlign: "center", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>Correct</Text>
                                                            </View>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04 }}>
                                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-regular", fontSize: Scales.moderateScale(16), color: '#3c3c3c' }}>{this.state.mcq_question_detail.correct_answer}</Text>
                                                            </View>

                                                        </View>
                                                    </View>
                                                    <View style={{ width: Scales.deviceWidth * 0.24, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                                        <View style={{
                                                            width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: '#f6f7fd', elevation: 3, shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 1
                                                        }}>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                                <Text style={{ textAlign: "center", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>Incorrect</Text>

                                                            </View>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04 }}>
                                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-regular", fontSize: Scales.moderateScale(16), color: '#3c3c3c' }}>{this.state.mcq_question_detail.incorrect_anwer}</Text>
                                                            </View>

                                                        </View>
                                                    </View>


                                                    <View style={{ width: Scales.deviceWidth * 0.24, height: Scales.deviceHeight * 0.10, backgroundColor: "#faf9fd" }}>
                                                        <View style={{
                                                            width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.08, borderRadius: 10, backgroundColor: '#fbf6df', elevation: 3, shadowColor: '#000',
                                                            shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 1
                                                        }}>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                                                <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(11), color: "#3c3c3c" }}>Total Score</Text>

                                                            </View>
                                                            <View style={{ width: Scales.deviceWidth * 0.22, height: Scales.deviceHeight * 0.04 }}>
                                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: '#3c3c3c' }}>{this.state.mcq_question_detail.total_score}%</Text>
                                                            </View>

                                                        </View>
                                                    </View>



                                                </View>

                                            </View>
                                            <FlatList
                                                data={this.state.mcq_interview_question}
                                                renderItem={({ item, index }) => <Question_Slide data={item} index={index} navigation={this.props.navigation} />}
                                                horizontal={true}
                                                style={{ height: Scales.deviceHeight * 0.30 }}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View> : <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.28, justifyContent: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>No mcq question found</Text>
                                        </View> : null}
                                </Collapsible>


                                <Collapsible collapsed={this.state.collapsed_essay} align="center">
                                    {this.state.question_show == 3 ? this.state.essay_interview_question.length != 0 ?
                                        <FlatList
                                            data={this.state.essay_interview_question}
                                            renderItem={({ item, index }) => <Question_Slide data={item} index={index} navigation={this.props.navigation} />}
                                            horizontal={true}
                                            style={{ height: Scales.deviceHeight * 0.28 }}
                                            keyExtractor={(item, index) => index.toString()}
                                        /> : <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.28, justifyContent: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>No essay question found</Text>
                                        </View> : null}
                                </Collapsible>

                                <Collapsible collapsed={this.state.collapsed_audio} align="center">
                                    {this.state.question_show == 4 ? this.state.audio_interview_question.length != 0 ? <FlatList
                                        data={this.state.audio_interview_question}
                                        renderItem={({ item, index }) => <Question_Slide data={item} index={index} navigation={this.props.navigation} />}
                                        horizontal={true}
                                        style={{ height: Scales.deviceHeight * 0.28 }}
                                        keyExtractor={(item, index) => index.toString()}
                                    /> : <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.28, justifyContent: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "roboto-medium", color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>No audio question found</Text>
                                        </View> : null}
                                </Collapsible>
                                {/* </ScrollView> */}
                            </View>


                            <View style={{ width: Scales.deviceWidth * 1.0, justifyContent: "center", backgroundColor: "#faf9fd" }}>
                                <View style={{ width: Scales.deviceWidth * 0.98, alignSelf: "center", height: Scales.deviceHeight * 0.06, borderRadius: 5, justifyContent: "center", backgroundColor: "#faf9fd" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, borderRadius: 5, alignItems: 'center', flexDirection: "row", backgroundColor: '#ededed', borderWidth: 0.3, alignSelf: "center" }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16), paddingLeft: 10, width: Scales.deviceWidth * 0.87, paddingTop: Scales.deviceHeight * 0.01, height: Scales.deviceHeight * 0.05, color: "#3c3c3c" }}>Summary</Text>
                                        <TouchableOpacity onPress={() => this.setState({ summary_collaps: !this.state.summary_collaps })}>
                                            <View><Image source={require("../../assets/Images/drop-down.png")} style={{ aspectRatio: Scales.moderateScale(1.5), resizeMode: "contain", }} />
                                            </View></TouchableOpacity>
                                    </View>

                                </View>
                                <View style={{ width: Scales.deviceWidth * 1.0, backgroundColor: "#faf9fd", paddingBottom: 10 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: 'center', backgroundColor: 'white', elevation: 3, borderRadius: 10 }}>
                                        {this.state.summary_collaps == true ? fedd_param : null}
                                    </View>
                                </View>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.12, alignItems: 'flex-end', flexDirection: 'row', backgroundColor: "#faf9fd" }}>
                                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.10, }}>
                                    <View style={{ width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.08, backgroundColor: '#4236a3', alignSelf: "center", borderRadius: 10, elevation: 5 }}>
                                        <View style={{ paddingTop: Scales.deviceHeight * 0.008 }}>
                                            <Stars
                                                half={false}
                                                default={this.state.avg_rating}

                                                spacing={Scales.moderateScale(4)}
                                                starSize={Scales.moderateScale(20)}
                                                disabled={true}
                                                faf9fd
                                                count={5}
                                                fullStar={require('../../assets/Images/star.png')}
                                                emptyStar={require('../../assets/Images/empty-star.png')}
                                                halfStar={require('../../assets/Images/half-filled-star.png')} />

                                            {/* <StarRatingBar
                                            starStyle={{
                                                width: 20,
                                                height: 20,
                                            }}
                                            readOnly={true}
                                            
                                            dontShowScore={false}
                                            score={3.7}
                                            allowsHalfStars={true}
                                            accurateHalfStars={true}
                                           
                                        /> */}

                                        </View>

                                        <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: 'flex-end' }}>
                                            <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16), color: "white" }}>Overall Rating</Text>
                                        </View>

                                    </View>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.10, }}>
                                    <View style={{ width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.08, backgroundColor: '#4236a3', alignSelf: "center", borderRadius: 10, elevation: 5 }}>
                                        <View style={{ width: Scales.deviceWidth * 0.45, justifyContent: 'center', height: Scales.deviceHeight * 0.04, }}>
                                            <Text style={{ textAlign: "center", color: "white", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14) }}>Recommend to Hire</Text>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>
                                            <View style={{ width: Scales.deviceWidth * 0.225, height: Scales.deviceHeight * 0.04, flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{ width: Scales.deviceWidth * 0.225, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                        <Image source={require("../../assets/Images/hire_yes1.png")} style={{ width: Scales.deviceWidth * 0.05, resizeMode: 'contain', height: Scales.deviceHeight * 0.04, }} />
                                                        <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: 'white', paddingLeft: 5 }}>{this.state.rating_summary.recommended_yes}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ width: Scales.deviceWidth * 0.225, height: Scales.deviceHeight * 0.04, flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{ width: Scales.deviceWidth * 0.225, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={require("../../assets/Images/hire_no.png")} style={{ width: Scales.deviceWidth * 0.05, resizeMode: 'contain', height: Scales.deviceWidth * 0.055, }} />
                                                    <Text style={{ textAlign: 'right', width: Scales.deviceWidth * 0.06, fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: 'white', }}>{this.state.rating_summary.recommended_no}</Text>
                                                </View>
                                            </View>
                                        </View>

                                    </View>

                                </View>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08, justifyContent: 'center', backgroundColor: "#faf9fd" }}>
                                <View style={{ width: Scales.deviceWidth * 0.955, alignSelf: "center", backgroundColor: "#ededed", height: Scales.deviceHeight * 0.05, borderRadius: 5, flexDirection: 'row' }}>
                                    <View style={{ width: Scales.deviceWidth * 0.85, height: Scales.deviceHeight * 0.05, justifyContent: 'center', }}>
                                        <Text style={{ textAlign: 'left', paddingLeft: Scales.deviceWidth * 0.03, fontSize: Scales.moderateScale(16), fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth * 0.04, color: "#3c3c3c" }}>Team Feedback</Text>
                                    </View>


                                </View>
                            </View>

                            <View style={{ width: Scales.deviceWidth * 1.0, justifyContent: 'center', }}>
                                <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: 'center', }}>

                                    <FlatList
                                        data={this.state.applied_user_evaluate}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => <Feddback data={item} avg_rate={this.state.applied_user_evaluate.rating} index={index} navigation={this.props.navigation} />}
                                    />

                                    {/* {this.state.Hide_fedback == true ? fedd_param : null} */}


                                </View>

                            </View>







                        </ScrollView>

                    </View>
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.09, justifyContent: 'center', }}>
                        <TouchableOpacity disabled={this.state.go_to_rate} onPress={() => this.props.navigation.navigate("forward", { "pitcher_data": this.state.pitcher_data, "video_interview_question": this.state.video_interview_question, "audio_interview_question": this.state.audio_interview_question, "mcq_interview_question": this.state.mcq_interview_question, "essay_interview_question": this.state.essay_interview_question, 'image': this.props.navigation.state.params.image })}><View style={{ width: Scales.deviceWidth * 0.95, alignSelf: 'center', height: Scales.deviceHeight * 0.05, justifyContent: 'center', borderRadius: 10, backgroundColor: '#483ca8' }}>
                            <Text style={{ textAlign: 'center', width: Scales.deviceWidth * 0.95, color: "white", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(18), }}>Forward</Text>
                        </View></TouchableOpacity>

                    </View>
                    <Modal isVisible={this.state.loading}>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                        </View>

                    </Modal>

                </View>


            </SafeAreaView>

        )
    }
}





class Question_Slide extends Component {
    constructor(props) {
        super(props)
        this.state = {

            loading: false,
            audio_duration: 6,
            audio_load: true,
            audio_load_yes: true,
            start: 0,
            pause: false,
            remaining: 0,
            timer: 1,
            isplaying: false,
            audio_file_ext: true,
            retry: false,
            count: 0,
            alpha: ["A", "B", "C", "D", "E", "F", "I", "J", "K", "L", "M", "N", "O", "P"],
            titleReadSwitch: true
        }
        if (this.props.data.qtype == 4) {

            // //console.log(this.props.data, "this.props.data")
            let audio_file_ext = this.props.data.answer.split('.')
            // //console.log(audio_file_ext)
            if (this.props.data.answer != "") {
                this.whoosh = new Sound(this.props.data.answer, null, (error) => {
                    if (error) {
                        //console.log('failed to load the sound', error);
                        return;
                    }
                    else {
                        this.callCheckAudio()

                    }
                }


                )

                this.PlayAudio = this.PlayAudio.bind(this)

                this.pauseAudio = this.pauseAudio.bind(this)
            }
            else {
                this.setState({ audio_file_ext: false, })
                // //console.log(this.state)
            }


        }


    }

    checkLoadAudio = () => {
        if (this.state.audio_file_ext == false) {
            return 0
        }
        if (this.whoosh.isLoaded() == true) {
            // //console.log(this.whoosh.isLoaded(), ")=================== loaded ====================")
            // //console.log(this.whoosh.getDuration(), "this.whoosh.getDuration()", this.props.data.ques_title)
            // //console.log(this.props.data.answer, "answer")
            this.setState({ count: this.state.count + 1 })
            // //console.log(this.state.count, "------count----------------")
            if (this.state.count > 10) {
                clearInterval(this.checkLoad)
                Toast.showWithGravity("Unable to load the audio", Toast.SHORT, Toast.BOTTOM);
                this.setState({ retry: true, audio_load_yes: false })
                return 0
            }
            if (this.whoosh.getDuration() >= 0) {
                this.settime(this.whoosh.getDuration())
                this.setState({ audio_load: false, audio_load_yes: false, audio_duration: this.whoosh.getDuration() })
                clearInterval(this.checkLoad)
            }

        }
    }
    callCheckAudio = () => {
        if (this.state.audio_file_ext == false) {
            return 0
        }
        if (this.props.data.qtype == 4) {
            this.checkLoad = setInterval(this.checkLoadAudio, 5000)
        }
    }

    settime = async (duration) => {
        if (this.state.audio_file_ext == false) {
            return 0
        }
        if (this.props.data.qtype == 4) {
            let t = duration
            if (duration < 0) {
                return 0
            }
            else if (duration == 0) {
                await this.setState({ start: 20 })
                return 0
            }
            for (let i = 0; i < 1000; i++) {
                // //console.log(t * i / 10)
                if (t * i / 10 >= 100.00 && t * this.state.start <= 103.00) {

                    // //console.log("innnn hua h")
                    let val = i / 10
                    // //console.log(val, ":::::::::::::::: val ::::::::::::::::::::::::::::::")
                    await this.setState({ start: val })
                    // //console.log(this.state.start, "))))))))))) start (((((((((((((((((((")
                    break;
                }
                else {


                }

            }

            // //console.log(this.state.start, "time")
        }



    }



    back = () => {
        if (this.props.data.qtype == 4) {
            if (this.state.audio_file_ext == false) {
                return 0
            }
            this.StopAudio()
            clearInterval(this.interval)
            this.setState({ loading: false, isplaying: false, timer: 1 })
        }
        else {
            this.setState({ loading: false })
        }
    }


    componentDidMount() {



    }



    pauseAudio = () => {
        if (this.state.audio_file_ext == false) {
            return 0
        }
        clearInterval(this.interval)

        this.setState({ isplaying: false, })
        this.whoosh.pause()
    }

    StopAudio = () => {
        if (this.state.audio_file_ext == false) {
            return 0
        }
        this.setState({ isplaying: false, timer: 1 })
        this.whoosh.stop()
    }
    counter = () => {
        let value = this.state.timer + this.state.start
        this.setState({ timer: value })
        // //console.log(this.state.start, "*********** start **************")
        // //console.log(value, "*********** value **************")

        // //console.log(this.state.timer, "*********** coutner **************")
    }

    PlayAudio = () => {
        if (this.state.audio_file_ext == false) {
            return 0
        }
        this.interval = setInterval(this.counter, 1000)
        this.setState({ audio_duration: this.whoosh.getDuration() })
        // //console.log(this.state.audio_duration, "ll    Duratio n llllll")
        this.whoosh.setVolume(50);
        this.setState({ isplaying: true, })
        // //console.log(this.whoosh.getVolume(), "volume", this.whoosh.isLoaded())


        // loaded successfully
        // //console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());

        // Play the sound with an onEnd callback
        this.whoosh.play((success) => {
            if (success) {
                // this.timer()
                // //console.log('successfully finished playing');
                clearInterval(this.interval)

                this.setState({ isplaying: false, timer: 1 })
            } else {
                // //console.log('playback failed due to audio decoding errors');
                clearInterval(this.interval)
                this.setState({ isplaying: false })
            }
        });



    }



    openModel = async () => {

        if (this.props.data.qtype == 4) {


            if (this.state.audio_load != true) {

                await this.setState({ audio_duration: this.whoosh.getDuration() })

                this.setState({ loading: !this.state.loading })
            }


        }
        else {
            this.setState({ loading: !this.state.loading })

        }
    }
    render() {
        let img = null
        let mcq_option = []
        if (this.props.data.qtype == 1) {
            img = <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.26, backgroundColor: "white", borderRadius: 10 }}>
                {!this.props.data.hasOwnProperty('is_deleted') ? <ImageBackground source={{ uri: this.props.data.poster }} style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.22, borderRadius: 10 }}>
                    {this.props.data.answer == '' ? <Text style={{ fontFamily: 'roboto-bold', paddingLeft: 5, fontSize: Scales.moderateScale(10), color: "#3c3c3c" }} >Not Answered*</Text> : null}

                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.22, justifyContent: "center", }}>
                        <Image source={require("../../assets/Images/question_video.png")} style={{ resizeMode: "contain", alignSelf: "center", width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.13 }} />
                    </View>
                </ImageBackground> : <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.22, justifyContent: "center", }}>
                        <MatI name="delete-empty" style={{ alignSelf: "center" }} size={50} />
                    </View>}
                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.03, justifyContent: "center", }}>
                    <Text style={{ fontFamily: "roboto-bold", fontSize: Scales.moderateScale(14), textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.ques_title.length < 10 ? this.props.data.ques_title : this.props.data.ques_title.slice(0, 10) + "... "}</Text>

                </View>

            </View>

        }
        else if (this.props.data.qtype == 4) {
            img = <View style={{ width: Scales.deviceWidth * 0.50, alignSelf: "center", height: Scales.deviceHeight * 0.25, justifyContent: "center", borderRadius: 10 }} >
                {!this.props.data.hasOwnProperty('is_deleted') ? <View>
                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.03, justifyContent: "center", }}>
                        {this.props.data.answer == '' ? <Text style={{ fontFamily: 'roboto-medium', paddingLeft: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(10), color: "#3c3c3c" }}>Not Answered*</Text> : null}
                        {this.state.audio_load_yes && this.props.data.answer != '' ? <ActivityIndicator style={{ alignSelf: "flex-end" }} /> : null}
                        {/* {this.state.retry?<Image source={require("../../assets/Images/retry.png")} style={{resizeMode:"contain", aspectRatio:1.0,alignSelf: "flex-end"}} />:null} */}
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.18, justifyContent: "center", }}>
                        <Image source={require("../../assets/Images/music_play.png")} style={{ alignSelf: "center", width: Scales.deviceWidth * 0.11, height: Scales.deviceHeight * 0.06 }} />
                    </View>
                </View> : <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.18, justifyContent: "center", }}>
                        <MatI name="delete-empty" style={{ alignSelf: "center" }} size={50} />
                    </View>}
                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                    <Text style={{ fontFamily: "roboto-bold", fontSize: Scales.moderateScale(14), textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.ques_title.length < 10 ? this.props.data.ques_title : this.props.data.ques_title.slice(0, 10) + "... "}</Text>

                </View>
            </View>

        }
        else if (this.props.data.qtype == 3) {
            img = <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.26, backgroundColor: "white", borderRadius: 10 }}>
                {this.props.data.answer == '' ? <Text style={{ fontFamily: 'roboto-bold', paddingLeft: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(10), color: "#3c3c3c" }} >Not Answered*</Text> : null}
                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.21, justifyContent: "center", }}>
                    <Image source={require("../../assets/Images/big_essay.png")} style={{ resizeMode: "contain", alignSelf: "center", width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.14 }} />
                </View>
                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.03, justifyContent: "center", }}>
                    <Text style={{ fontFamily: "roboto-bold", fontSize: Scales.moderateScale(14), textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.ques_title.length < 10 ? this.props.data.ques_title : this.props.data.ques_title.slice(0, 10) + "... "}</Text>

                </View>

            </View>
        }
        else if (this.props.data.qtype == 2) {


            img = <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.26, backgroundColor: "white", borderRadius: 10 }}>
                {this.props.data.answer == '' ? <Text style={{ fontFamily: 'roboto-bold', paddingLeft: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(10), color: "#3c3c3c" }} >Not Answered*</Text> : null}
                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.21, justifyContent: "center", }}>
                    <Image source={require("../../assets/Images/big_mcq.png")} style={{ resizeMode: "contain", alignSelf: "center", width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.13 }} />
                </View>
                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.03, justifyContent: "center", }}>
                    <Text style={{ fontFamily: "roboto-bold", fontSize: Scales.moderateScale(14), textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.ques_title.length < 10 ? this.props.data.ques_title : this.props.data.ques_title.slice(0, 10) + "... "}</Text>

                </View>

            </View>
        }

        let uri = this.props.data.fileurl
        if (uri == '') {
            uri = this.props.data.hls

        }
        //console.log(this.props.data, "uri----------------")
        let mcq_data = []
        let qtype = this.props.data.qtype
        if (qtype == 2) {
            // //console.log("MCQ5555555555555555555555555")
            for (let i of this.props.data.options) {
                let data = <View style={{ width: 250, height: 50, flexDirection: "row" }}>
                    <View style={{ width: 50, height: 50 }}>
                        <CheckBox />
                    </View>
                    <View style={{ width: 80, height: 50 }}>
                        <Text>{i}</Text>
                    </View>
                </View>
                mcq_data.push(data)
            }

        }

        let uri_ext = ''
        if (this.props.data.qtype == 1) {
            uri_ext = uri.split(".")
            // //console.log(uri_ext[uri_ext.length - 1] == "mp4")
        }



        return (

            <View key={this.props.index}>
                <TouchableOpacity activeOpacity={1} onPress={() => this.openModel()} >
                    <View style={{ width: Scales.deviceWidth * 0.55, height: Scales.deviceHeight * 0.28, borderRadius: 20, }}>
                        <View style={{
                            width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.26, borderRadius: 10, backgroundColor: 'white', elevation: 2, alignSelf: "center", justifyContent: "center", shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                        }}>
                            {img}
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    onRequestClose={() => this.back()}
                    animationType={'none'}

                    isVisible={this.state.loading}>

                    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "transparent", }}>
                        <View style={{ width: Scales.deviceWidth * 0.90, backgroundColor: 'white', alignSelf: "center", elevation: 5, borderRadius: 15 }}>
                            {this.props.data.qtype == 1 ?
                                <ScrollView><View style={{ width: Scales.deviceWidth * 0.90, padding: Scales.deviceWidth * 0.035 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.80, flexDirection: "row", justifyContent: 'center' }}>
                                        <View style={{ width: Scales.deviceWidth * 0.70, paddingLeft: Scales.deviceWidth * 0.035, justifyContent: "center", paddingTop: Scales.deviceHeight * 0.012 }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{this.props.data.ques_title ? String(this.props.data.ques_title).length > 100 ? this.state.titleReadSwitch ? String(this.props.data.ques_title).slice(0, 100) : this.props.data.ques_title : this.props.data.ques_title : null}</Text>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.10, marginTop: Scales.deviceHeight * 0.01 }}>
                                            <TouchableOpacity onPress={() => this.back()}><Image source={require("../../assets/Images/no.png")} style={{ alignSelf: "center", resizeMode: "contain", width: Scales.deviceWidth * 0.035 }} /></TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ paddingLeft: Scales.deviceWidth * 0.035 }}>
                                        {String(this.props.data.ques_title).length > 100 ? <TouchableOpacity onPress={() => { this.setState({ titleReadSwitch: !this.state.titleReadSwitch }) }}><Text style={{ fontSize: 14, fontWeight: '800' }}>{this.state.titleReadSwitch ? 'read more' : 'read less'}</Text></TouchableOpacity> : null}

                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.40, marginTop: Scales.deviceHeight * 0.01 }}>
                                        {this.props.data.answer != "" ?
                                            !this.props.data.hasOwnProperty('is_deleted') ?
                                                <Video style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.38, alignSelf: 'center' }} ref={ref => (this.player = ref)} bufferConfig={{
                                                    minBufferMs: 15000,
                                                    maxBufferMs: 50000,
                                                    bufferForPlaybackMs: 2500,
                                                    bufferForPlaybackAfterRebufferMs: 5000
                                                }} source={{ uri: uri }} controls={true} />
                                                : <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.38, justifyContent: "center" }}>
                                                    <Text style={{ textAlign: "center", fontFamily: "roboto-bold", }}>Video deleted from web</Text>
                                                </View> :
                                            <Text style={{ fontFamily: "roboto-bold", textAlign: "center", fontSize: Scales.moderateScale(14), }}>Not Answered</Text>}
                                    </View>
                                </View></ScrollView>
                                : null}


                            {this.props.data.qtype == 2 ?
                                <ScrollView><View style={{ width: Scales.deviceWidth * 0.90, paddingLeft: 10, paddingTop: Scales.deviceHeight * 0.008, paddingRight: Scales.deviceWidth * 0.018 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.90, flexDirection: "row", }}>
                                        <View style={{ width: Scales.deviceWidth * 0.70, justifyContent: "center", paddingTop: Scales.deviceHeight * 0.012 }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), paddingLeft: Scales.deviceWidth * 0.028, paddingTop: Scales.deviceHeight * 0.008, color: "#3c3c3c" }}>{this.props.data.ques_title}</Text>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.15, marginTop: Scales.deviceHeight * 0.01 }}>
                                            <TouchableOpacity onPress={() => this.back()}><Image source={require("../../assets/Images/no.png")} style={{ alignSelf: "center", resizeMode: "contain", width: Scales.deviceWidth * 0.035, }} /></TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.90, }}>
                                        <Text style={{ fontFamily: "roboto-regular", paddingRight: Scales.deviceWidth * 0.02, textAlign: "right", width: Scales.deviceWidth * 0.85, color: this.props.data.answer == this.props.data.correct ? "blue" : "red" }}>Correct : {this.state.alpha[this.props.data.correct]}</Text>
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.90, }}>
                                        <View style={{ width: Scales.deviceWidth * 0.90, padding: Scales.deviceWidth * 0.028, justifyContent: "space-between" }}>
                                            <FlatList
                                                data={this.props.data.options}

                                                renderItem={({ item, index }) => <MCQ_OPTIONS data={item} aplha={this.state.alpha} answer={this.props.data.answer} index={index} />}
                                                keyExtractor={(item, index) => index} />


                                        </View>

                                    </View>

                                </View></ScrollView>
                                : null}


                            {this.props.data.qtype == 3 ?
                                <ScrollView><View style={{ width: Scales.deviceWidth * 0.90, padding: 10 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.90, flexDirection: "row", }}>
                                        <View style={{ width: Scales.deviceWidth * 0.70, paddingLeft: 10, justifyContent: "center", paddingTop: Scales.deviceHeight * 0.012 }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{this.props.data.ques_title}</Text>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.15, marginTop: Scales.deviceHeight * 0.01 }}>
                                            <TouchableOpacity onPress={() => this.back()}><Image source={require("../../assets/Images/no.png")} style={{ alignSelf: "center", resizeMode: "contain", width: Scales.deviceWidth * 0.035, }} /></TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.85, }}>
                                        <View style={{ width: Scales.deviceWidth * 0.81, alignSelf: "center", borderWidth: 0.5, borderRadius: 5 }}>
                                            <Text style={{ fontFamily: "roboto-regular", fontSize: 12, padding: Scales.deviceWidth * 0.028, color: "#3c3c3c" }}>{this.props.data.answer.length == 0 ? "Not Answered" : this.props.data.answer}</Text>
                                        </View>

                                    </View>

                                </View></ScrollView>
                                : null}

                            {this.props.data.qtype == 4 ?
                                this.state.audio_load == false ? <ScrollView><View style={{ width: Scales.deviceWidth * 0.90, padding: 10 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.85, flexDirection: "row" }}>
                                        <View style={{ width: Scales.deviceWidth * 0.70, justifyContent: "center", }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{this.props.data.ques_title}</Text>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.15, marginTop: Scales.deviceHeight * 0.01 }}>
                                            <TouchableOpacity onPress={() => this.back()}><Image source={require("../../assets/Images/no.png")} style={{ alignSelf: "center", resizeMode: "contain", width: Scales.deviceWidth * 0.035, }} /></TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.40, justifyContent: "center" }}>
                                        <View style={{ alignSelf: "center", justifyContent: "center" }}>
                                            {this.state.audio_file_ext ?
                                                !this.props.data.hasOwnProperty('is_deleted') ?
                                                    <ProgressCircle
                                                        percent={this.state.timer}

                                                        style={{}}
                                                        radius={Scales.moderateScale(80)}
                                                        borderWidth={6}
                                                        color="#3399FF"
                                                        shadowColor="#999"
                                                        bgColor="#fff"
                                                    >
                                                        {this.state.isplaying ?
                                                            <TouchableOpacity activeOpacity={1} onPress={() => this.pauseAudio()}>
                                                                <Image source={require("../../assets/Images/pause.png")} style={{ resizeMode: 'contain', height: Scales.deviceHeight * 0.10, width: Scales.deviceWidth * 0.15, alignSelf: "center" }} />
                                                            </TouchableOpacity> :
                                                            <TouchableOpacity activeOpacity={1} onPress={() => this.PlayAudio()}>
                                                                {/* <Image source={require("../../assets/Images/play.png")} style={{ resizeMode: 'contain', height: Scales.deviceHeight * 0.10, width: Scales.deviceWidth * 0.15, alignSelf: "center" }} /> */}
                                                                <EntypoI name={"controller-play"} color={"#3c3c3c"} size={Scales.moderateScale(60)} />
                                                            </TouchableOpacity>}

                                                    </ProgressCircle> :
                                                    <Text style={{ textAlign: "center", fontFamily: "roboto-bold", }}>Audio deleted from web</Text>

                                                : <Text style={{ color: "#3c3c3c" }}> Not Answered* </Text>}


                                        </View>


                                    </View>

                                </View></ScrollView> : <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.40, justifyContent: "center" }}><ActivityIndicator style={{ alignSelf: "center" }} /></View>
                                : null}
                        </View>
                    </View>
                </Modal>
            </View>

        )
    }
}

class Feddback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            avg_value: 0
        }

    }
    componentDidMount() {
        let avg_val = (this.props.avg_rate)


        //console.log(this.props.avg_rate, "-----$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4feed avg rate$$$$$$$$$$$$$$$$$$$$$----")
        let intValue = parseInt(avg_val)
        //console.log(intValue, "lllllllllllllllllllllllll inttt value yyyyyyyyyyyyy")

        intValue = intValue + 0.5
        if (avg_val > intValue) {
            intValue = parseInt(avg_val) + 1
        }
        else if (intValue == avg_val) {
            intValue = avg_val
        }
        else {
            intValue = intValue
        }
        avg_val = intValue
        this.setState({ avg_value: avg_val })
    }



    render() {

        let fedd_param = []
        // //console.log(this.state.rating_summary, "LLL55555555555LLSDS")
        let counter = 0
        for (let i of this.props.data.feedback_params) {
            let data = null
            if (counter == 0) {
                data = <View key={counter} style={{ width: Scales.deviceWidth * 0.93, minHeight: Scales.deviceHeight * 0.06, flexDirection: 'row' }}>
                    <View style={{ width: Scales.deviceWidth * 0.30, justifyContent: "center", minHeight: Scales.deviceHeight * 0.06 }}>
                        <Text style={{ textAlign: 'left', padding: Scales.deviceWidth * 0.012, paddingTop: Scales.deviceHeight * 0.01, paddingBottom: Scales.deviceHeight * 0.01, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>{i.key}</Text></View>
                    <View style={{ width: Scales.deviceWidth * 0.60, alignItems: 'flex-end', minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center' }}><Stars
                        half={true}
                        default={i.value}
                        disabled={true}
                        spacing={Scales.moderateScale(4)}
                        starSize={Scales.moderateScale(24)}
                        count={5}
                        fullStar={i.value > 0 && i.value < 1.5 ? require('../../assets/Images/red_star.png') : i.value > 1 && i.value < 3.5 ? require('../../assets/Images/star.png') : i.value > 3 && i.value < 5.5 ? require('../../assets/Images/green_star.png') : null}
                        emptyStar={require('../../assets/Images/empty-star.png')}
                        halfStar={i.value > 0.0 && i.value <= 1.0 ? require('../../assets/Images/half_red_star.png') : i.value > 1.0 && i.value <= 3.0 ? require('../../assets/Images/half-filled-star.png') : i.value > 3.0 && i.value <= 5.0 ? require('../../assets/Images/half_green_star.png') : null} />


                    </View>
                </View>
            }
            else {
                data = <View key={counter} style={{ width: Scales.deviceWidth * 0.93, minHeight: Scales.deviceHeight * 0.06, alignSelf: 'center', borderTopWidth: 0.5, flexDirection: 'row' }}>
                    <View style={{ width: Scales.deviceWidth * 0.30, justifyContent: "center", minHeight: Scales.deviceHeight * 0.06 }}>
                        <Text style={{ textAlign: 'left', paddingLeft: Scales.deviceWidth * .012, paddingTop: Scales.deviceHeight * 0.01, paddingBottom: Scales.deviceHeight * 0.01, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c", }}>{i.key}</Text></View>
                    <View style={{ width: Scales.deviceWidth * 0.60, alignItems: 'flex-end', minHeight: Scales.deviceHeight * 0.06, justifyContent: 'center' }}><Stars
                        half={true}
                        default={i.value}
                        disabled={true}
                        spacing={Scales.moderateScale(4)}
                        starSize={Scales.moderateScale(24)}
                        count={5}
                        fullStar={i.value > 0 && i.value < 1.5 ? require('../../assets/Images/red_star.png') : i.value > 1 && i.value < 3.5 ? require('../../assets/Images/star.png') : i.value > 3 && i.value < 5.5 ? require('../../assets/Images/green_star.png') : null}
                        emptyStar={require('../../assets/Images/empty-star.png')}
                        halfStar={i.value > 0.0 && i.value <= 1.0 ? require('../../assets/Images/half_red_star.png') : i.value > 1.0 && i.value <= 3.0 ? require('../../assets/Images/half-filled-star.png') : i.value > 3.0 && i.value <= 5.0 ? require('../../assets/Images/half_green_star.png') : null} />


                    </View>
                </View>
            }
            counter = counter + 1
            fedd_param.push(data)

        }



        let render_data = null
        let avg_val = (this.props.data.rating)


        // //console.log(this.props.avg_rate, "-----$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4feed avg rate$$$$$$$$$$$$$$$$$$$$$----")
        let intValue = parseInt(avg_val)
        //console.log(intValue, "lllllllllllllllllllllllll inttt value yyyyyyyyyyyyy")

        intValue = intValue + 0.5
        if (avg_val > intValue) {
            intValue = parseInt(avg_val) + 1
        }
        else if (intValue == avg_val) {
            intValue = avg_val
        }
        else {
            intValue = intValue
        }
        avg_val = intValue


        render_data = <View style={{ width: Scales.deviceWidth * 1.0, backgroundColor: '#faf9fd' }}>
            <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, flexDirection: "row", borderRadius: 5, borderWidth: 0.3, alignItems: 'center', backgroundColor: 'white', paddingLeft: Scales.deviceHeight * 0.018 }}>
                <Text style={{ fontFamily: "roboto-medium", width: Scales.deviceWidth * 0.84, paddingTop: Scales.deviceHeight * 0.01, height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontSize: Scales.moderateScale(14) }}>{this.props.data.rated_by}</Text>
                {/* <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}><Image source={require("../../assets/Images/drop-down.png")} style={{ aspectRatio:1.5, resizeMode: "contain",  }} /></TouchableOpacity> */}
                <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}>
                    <View>
                        <Image source={require("../../assets/Images/drop-down.png")} style={{ aspectRatio: Scales.moderateScale(1.5), resizeMode: "contain", }} />
                    </View>
                </TouchableOpacity>


            </View>

            <View style={{ width: Scales.deviceWidth * 0.95, borderRadius: 10, marginTop: Scales.deviceHeight * 0.008, }}>
                {this.state.show ?
                    <View>
                        <View style={{ backgroundColor: "white", width: Scales.deviceWidth * 0.93, alignItems: 'center', alignSelf: 'center', elevation: 3, borderRadius: 5, }}>
                            {fedd_param}
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.94, alignSelf: "center", minHeight: Scales.deviceHeight * 0.10, justifyContent: "center" }}>
                            <View style={{ width: Scales.deviceWidth * 0.935, alignSelf: "center", borderRadius: 5, paddingTop: Scales.deviceHeight * 0.012, minHeight: Scales.deviceHeight * 0.09, backgroundColor: "white", elevation: 2 }}>
                                <Text style={{ fontSize: Scales.moderateScale(14), color: "#3c3c3c", paddingLeft: Scales.deviceWidth * 0.028 }}>Comment</Text>
                                <Text style={{ paddingLeft: Scales.deviceWidth * 0.038, fontSize: Scales.moderateScale(12) }}>{this.props.data.comment}</Text>
                            </View>

                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.11, alignItems: 'flex-end', flexDirection: 'row', backgroundColor: "#faf9fd" }}>
                            <View style={{ width: Scales.deviceWidth * 0.475, height: Scales.deviceHeight * 0.10, }}>
                                <View style={{ width: Scales.deviceWidth * 0.45, alignSelf: "center", height: Scales.deviceHeight * 0.08, backgroundColor: 'white', borderRadius: 5, elevation: 3, }}>
                                    <View style={{ paddingTop: Scales.deviceHeight * 0.008 }}>
                                        <Stars
                                            half={false}
                                            default={avg_val}
                                            // update={(val) => { this.setState({ stars: val }) }}
                                            spacing={Scales.moderateScale(4)}
                                            starSize={Scales.moderateScale(20)}
                                            disabled={true}
                                            count={5}
                                            fullStar={require('../../assets/Images/star.png')}
                                            emptyStar={require('../../assets/Images/empty-star.png')}
                                            halfStar={require('../../assets/Images/half-filled-star.png')} />
                                    </View>

                                    <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: 'flex-end' }}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16), color: "#3c3c3c" }}>Overall Rating</Text>
                                    </View>

                                </View>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.465, height: Scales.deviceHeight * 0.10, }}>
                                <View style={{ width: Scales.deviceWidth * 0.44, height: Scales.deviceHeight * 0.08, backgroundColor: 'white', alignSelf: "flex-end", borderRadius: 5, elevation: 3 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.44, justifyContent: 'center', height: Scales.deviceHeight * 0.04, }}>
                                        <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>Recommend to Hire</Text>
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.44, height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>
                                        <View style={{ width: Scales.deviceWidth * 0.225, height: Scales.deviceHeight * 0.04, flexDirection: 'row', alignItems: 'center', }}>
                                            <View style={{ width: Scales.deviceWidth * 0.44, flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>

                                                {this.props.data.recommended == 1 ?
                                                    <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.44, justifyContent: "center", alignItems: "center", }}>
                                                        <Image source={require("../../assets/Images/hire_yes.png")} style={{ width: Scales.deviceWidth * 0.05, alignSelf: "center", resizeMode: 'contain', height: Scales.deviceHeight * 0.04, }} />
                                                        <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>  Yes</Text>
                                                    </View> : null}
                                                {this.props.data.recommended == 0 ?
                                                    <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.44, alignItems: "center", justifyContent: "center" }}>
                                                        <Image source={require("../../assets/Images/hire_no1.png")} style={{ width: Scales.deviceWidth * 0.05, resizeMode: 'contain', alignSelf: "center", height: Scales.deviceHeight * 0.04, }} />
                                                        <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>  No</Text>
                                                    </View> : null}

                                            </View>
                                        </View>
                                    </View>


                                </View>

                            </View>

                        </View>

                    </View>


                    : null}
            </View>
        </View >



        return (
            <View style={{ width: Scales.deviceWidth * 1.0, borderRadius: 5, justifyContent: 'center', }}>{render_data}</View>
        )
    }


}




class MCQ_OPTIONS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alpha: ["A", "B", "C", "D", "E", "F", "I", "J", "K", "L", "M", "N", "O", "P"]
        }
    }

    componentDidMount() {

    }
    render() {
        // //console.log(parseInt(this.props.answer))
        // //console.log(parseInt(this.props.index))
        // //console.log()

        return (
            <View style={{ width: Scales.deviceWidth * 0.85, justifyContent: 'center', paddingTop: this.props.index == 0 ? 0 : Scales.deviceHeight * 0.012 }}>
                <LinearGradient colors={(parseInt(this.props.answer)) == (parseInt(this.props.index)) ? ['#5c49e0', '#5c49e0', '#5c49e0'] : ['#ffffff', '#ffffff']} style={{ width: Scales.deviceWidth * 0.80, elevation: 5 }}><View style={{ width: Scales.deviceWidth * 0.80, justifyContent: "center", alignSelf: 'center', backgroundColor: (parseInt(this.props.answer)) != (parseInt(this.props.index)) ? 'white' : 'transparent', elevation: 5 }}>
                    <Text style={{ fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth * 0.055, color: (parseInt(this.props.answer)) == (parseInt(this.props.index)) ? "#ffffff" : "#3c3c3c" }}>{this.state.alpha[this.props.index]}.<Text style={{ fontFamily: "roboto-medium", paddingLeft: Scales.deviceWidth * 0.055, color: (parseInt(this.props.answer)) == (parseInt(this.props.index)) ? "white" : "black" }}>   {this.props.data}</Text></Text>
                </View></LinearGradient>

            </View>
        )
    }
}