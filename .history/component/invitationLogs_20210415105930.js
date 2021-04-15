import React, { Component } from 'react';
import { View, Text, BackHandler, FlatList, Image, AsyncStorage, SafeAreaView,ActivityIndicator } from "react-native"
import Modal from "react-native-modal"
import Header from "./DrawerHeader"
import { Scales } from "@common"
import PostFetch from "../ajax/PostFetch"
import FeatherI from "react-native-vector-icons/Feather"
import FontistoI from "react-native-vector-icons/Fontisto"
import moment from "moment"


export default class InvitationLogs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logs: [],
            refresh: false
        }
    }
    GetLogsData = async (refresh = false) => {
        if (refresh == true) {
            this.setState({ refresh: true })
        }
        else {
            this.setState({ loader: true })

        }
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let jobs_id = this.props.navigation.state.params.job_id


        const payload = {
            "job_id": jobs_id
        }
        const json = await PostFetch("invitation-log", payload, headers)
        if (json != null) {
            console.log(json)
            if (json.error == 0) {
                let data = json.data.reverse()
                this.setState({ logs: data })

            }
            else {

                alert(json.message)
            }

        }

        if (refresh == true) {
            this.setState({ refresh: false })
        }
        else {
            this.setState({ loader: false })

        }

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
        console.log(this.props.navigation.state.params.job_id)
        this.GetLogsData()
    }
    render() {
        let refresh = true
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#2d2d3a' }}>
                    <Header heading="Invitation Logs" backfunc={[]} {...this.props} textalign='center' left={Scales.deviceWidth * 0.08} back={true} />
                    <View style={{ flex: 1 }}>
                        {this.state.logs != 0 ? <FlatList
                            data={this.state.logs}
                            onRefresh={() => this.GetLogsData(refresh)}
                            refreshing={this.state.refresh}
                            style={{ marginTop: 10 }}
                            renderItem={({ item, index }) => <Logs data={item} index={index} />}
                        /> : <View style={{ flex: 1, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "#3c3c3c" }}>No Logs Found</Text></View>}
                    </View>

                </View>
                <Modal isVisible={this.state.loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>

            </SafeAreaView>
        )
    }
}

class Logs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            "date_format": "MM/DD/YYYY"
        }
    }
    componentDidMount = async () => {
        console.log(String(this.props.data.created_date).split(","))
        let date_format = await AsyncStorage.getItem('date_format')
        if (date_format == null) {
            this.setState({ date_format: "MM/DD/YYYY" })
        }
        else {
            this.setState({ date_format: date_format })
        }
    }
    render() {
        let created_date = String(this.props.data.created_date).split(",")[0]
        return (
            <View style={{ flex:1, backgroundColor: '#2d2d3a', paddingLeft:'5%', paddingRight:'5%',}}>

                <View style={{ height: Scales.deviceWidth * 0.04, borderWidth: 1, alignSelf: "center", borderColor: "#c7c7c7", borderRadius: 0.01, borderStyle: "dashed" }}></View>

                <View style={{ borderRadius: 5 }}>
                    {/* <View></View> */}
                    <View style={{ marginBottom:'-2%',width: Scales.deviceHeight * 0.08, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: (Scales.deviceHeight * 0.08) / 2, alignSelf: "center", backgroundColor: '#13d7a6', borderWidth: 2, elevation: 1 }}>
                        <Text style={{ color: "#2d2d3a", fontSize: 18, alignSelf: 'center', textTransform: "capitalize" }}>{this.props.data.name.slice(0, 2)}</Text>
                    </View>
                    <View style={{ backgroundColor: '#3d3d46', marginTop: '-7%', borderRadius: 5, padding: '5%' }}>
                        <View style={{ borderRadius: 10, justifyContent: "center", }}>
                            <Text style={{ maxWidth: Scales.deviceWidth * 0.27, minHeight: Scales.deviceHeight * 0.025, fontFamily: "roboto-regular", textAlign: "left", borderRadius: 10, color: "#2d2d3a", backgroundColor: 'white', fontSize: Scales.moderateScale(9), padding: 2.5, textAlign: "center" }}>{this.props.data.interview_mode == 1 ? "Pre-recorded Interview" : "Live-Interview"}</Text>
                        </View>
                        <View style={{ minHeight: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                            <Text style={{ fontFamily: "roboto-medium", textTransform: "capitalize", color: "white", fontSize: Scales.moderateScale(16) }}>{this.props.data.name} <Text style={{ fontFamily: "roboto-regular", color: "white", textTransform: "lowercase", fontSize: Scales.moderateScale(14) }}>was invited for </Text>{this.props.data.job_name}</Text>
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.53, minHeight: Scales.deviceHeight * 0.04, alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                            <View style={{ width: Scales.deviceWidth * 0.25, minHeight: Scales.deviceHeight * 0.04, flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../assets/JobmaIcons/calendar-lightBlue.png')} style={{width:14, height:14}} resizeMode='contain'></Image>
                                <Text style={{ color: "#8b8b8b", fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular", paddingTop: 2, paddingLeft: 6 }}>{moment(created_date).format(this.state.date_format)}</Text>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.25, minHeight: Scales.deviceHeight * 0.04, flexDirection: "row", alignItems: 'center' }}>
                                <Image source={require('../assets/Images/job_listing/public.png')} style={{width:14, height:14}} resizeMode='contain'></Image>
                                <Text style={{ color: "#8b8b8b", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 6 }}>{(String(this.props.data.created_date).split(",")[1]).slice(1, (String(this.props.data.created_date).split(",")[1]).length)}</Text>
                            </View>
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.71, minHeight: Scales.deviceHeight * 0.03, flexDirection: "row", }}>
                            <Image source={require('../assets/JobmaIcons/email.png')} style={{width:14, height:14}} resizeMode='contain'></Image>
                            <Text style={{ color: "#8b8b8b", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>{String(this.props.data.email)}</Text>
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.71, }}>
                            <Text style={{ color: "white", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>Invited by: <Text style={{fontFamily: "roboto-regular", fontSize: Scales.moderateScale(12), color:'#8b8b8b'}}>{String(this.props.data.employer_email)}</Text></Text>
                            {this.props.data.interview_mode == 1 ? <Text style={{ color: "white", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>Interview kit : <Text style={{fontFamily: "roboto-regular", fontSize: Scales.moderateScale(12), color:'#8b8b8b'}}>{String(this.props.data.kit_name)}</Text></Text> : null}
                        </View>
                    </View>
                    <View style={{  padding: 5, justifyContent: 'center', borderRadius: 5, alignSelf:'flex-end'}}>
                            <Text style={{ color:'white', backgroundColor:'#52526c', fontFamily: "roboto-regular", textAlign: 'left', paddingLeft: 8, borderRadius: 2, paddingTop: 2, paddingBottom: 2, fontSize: 10, }}>{this.props.data.msg}</Text>
                        </View>
                </View>

                {/* <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <View style={{ width: Scales.deviceWidth * 0.22, minHeight: Scales.deviceHeight * 0.26, justifyContent: "center", }}>
                        <View style={{ height: Scales.deviceWidth * 0.16, borderWidth: this.props.index != 0 ? 0.8 : 0, alignSelf: "center", borderColor: "#c7c7c7", borderRadius: 0.01, borderStyle: "dashed" }}>

                        </View>
                        <View style={{ width: Scales.deviceHeight * 0.08, justifyContent: "center", height: Scales.deviceHeight * 0.08, borderRadius: (Scales.deviceHeight * 0.08) / 2, alignSelf: "center", backgroundColor: this.props.index % 2 == 0 ? '#ffa001' : '#ff5367', elevation: 3 }}>
                            <Text style={{ color: "white", fontSize: 18, alignSelf: 'center', textTransform: "capitalize" }}>{this.props.data.name.slice(0, 2)}</Text>
                        </View>
                        <View style={{ minHeight: Scales.deviceHeight * 0.11, borderWidth: 0.8, borderRadius: 0.01, alignSelf: "center", borderColor: "#c7c7c7", borderStyle: "dashed" }}>

                        </View>

                    </View>
                    <View style={{ minHeight: Scales.deviceHeight * 0.26, justifyContent: "center", }}>
                        <View style={{ width: Scales.deviceWidth * 0.73, minHeight: Scales.deviceHeight * 0.22, backgroundColor: 'white', elevation: 3, padding: 8, borderRadius: 5 ,shadowColor: '#000',
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.1,
   shadowRadius: 1,
   elevation: 1,
}}>
                            <View style={{ minHeight: Scales.deviceHeight * 0.04, justifyContent: "center" }}>
                                <Text style={{ fontFamily: "roboto-medium", textTransform: "capitalize", color: "#3c3c3c", fontSize: Scales.moderateScale(16) }}>{this.props.data.name} <Text style={{ fontFamily: "roboto-regular", color: "#3c3c3c", textTransform: "lowercase", fontSize: Scales.moderateScale(14) }}>was invited for </Text>{this.props.data.job_name}</Text>
                            </View>
                            <View style={{ minHeight: Scales.deviceHeight * 0.025, borderRadius: 5, justifyContent: "center", }}>
                                <Text style={{ maxWidth: Scales.deviceWidth * 0.35, minHeight: Scales.deviceHeight * 0.025, fontFamily: "roboto-regular", textAlign: "left", borderRadius: 5, color: "white", backgroundColor: this.props.data.interview_mode == 1 ? "#ffa001" : "#5b53b7", fontSize: Scales.moderateScale(11), padding: 2.5, textAlign: "center" }}>{this.props.data.interview_mode == 1 ? "Pre-recorded Interview" : "Live-Interview"}</Text>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.71, minHeight: Scales.deviceHeight * 0.04, alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                                <View style={{ width: Scales.deviceWidth * 0.35, minHeight: Scales.deviceHeight * 0.04, flexDirection: "row", alignItems: "center" }}>
                                    <FeatherI name={"calendar"} size={20} style={{ color: "#3c3c3c" }} />
                                    <Text style={{ color: "#3c3c3c", fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular", paddingTop: 2, paddingLeft: 3 }}>{moment(created_date).format(this.state.date_format)}</Text>
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.35, minHeight: Scales.deviceHeight * 0.04, flexDirection: "row", alignItems: 'center' }}>
                                    <FeatherI name={"clock"} size={20} style={{ color: "#3c3c3c" }} />
                                    <Text style={{ color: "#3c3c3c", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>{(String(this.props.data.created_date).split(",")[1]).slice(1, (String(this.props.data.created_date).split(",")[1]).length)}</Text>
                                </View>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.71, minHeight: Scales.deviceHeight * 0.03, flexDirection: "row", }}>
                                <FontistoI name={"email"} size={20} style={{ marginVertical: 1, color: "#3c3c3c" }} />
                                <Text style={{ color: "#3c3c3c", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>{String(this.props.data.email)}</Text>

                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.71, }}>
                                <Text style={{ color: "#3c3c3c", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>Invited by: {String(this.props.data.employer_email)}</Text>
                                {this.props.data.interview_mode == 1 ? <Text style={{ color: "#3c3c3c", fontSize: Scales.moderateScale(12), paddingTop: 2, fontFamily: "roboto-regular", paddingLeft: 3 }}>Interview kit : {String(this.props.data.kit_name)}</Text> : null}

                            </View>
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.71, padding: 5, justifyContent: 'center', borderRadius: 5, }}>
                            <Text style={{ color: this.props.data.status == 1 ? "#6eaff1" : "#ff7886", backgroundColor: this.props.data.status == 1 ? '#def3ff' : "#ffdcda", fontFamily: "roboto-regular", textAlign: 'left', paddingLeft: 8, borderRadius: 2, paddingTop: 2, paddingBottom: 2, fontSize: 12, }}>{this.props.data.msg}</Text>
                        </View>

                    </View>

                </View> */}

            </View>
        )
    }
}