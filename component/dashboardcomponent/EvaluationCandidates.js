import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, FlatList, Image, AsyncStorage, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import Header from '../DrawerHeader'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PostFetch from "../../ajax/PostFetch"
import { LinearGradient } from 'expo-linear-gradient';
import { Scales } from "@common"
import Modal from "react-native-modal"
import moment from "moment"


export default class Evaluation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [], refreshing: false,
            head_index: null, loader: false

        }

    }

    _onrefresh = async (status) => {
        this.setState({ refreshing: true })
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let payload = {
            "job_id": this.props.navigation.state.params.job_id,
            "status": status
        }

        if (status == -1) {
            payload = {
                "job_id": this.props.navigation.state.params.job_id
            }
        }

        try {
            const json = await PostFetch("candidates-interview-list", payload, header)

            if (json != null) {
                // console.log(json.data.total_data, "sdkngk:LLLLLLLLLLLLLl")
                if (json.error == 0) {
                    if (json.data.total_data == null) {
                        this.setState({ data: [], head_index: null })

                    }
                    else {
                        let data = []
                        // for (let i of json.data.total_data) {
                        //     if (i.apply_mode == 2) {
                        //         continue
                        //     }
                        //     data.push(i)
                        // }
                        if (status == -1) {

                            this.setState({ data: json.data.total_data, head_index: null })

                        }
                        else {
                            this.setState({ data: json.data.total_data, head_index: status })

                        }
                    }
                }
                else {
                    alert(json.message)
                }
            }

            this.setState({ refreshing: false })
        }
        catch (err) {
            this.setState({ refreshing: false })
            console.log(err)
        }

    }

    get_other_data = async (status) => {
        this.setState({ loader: true })
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let payload = {
            "job_id": this.props.navigation.state.params.job_id,
            "status": status
        }
        if (status == null) {
            payload = {
                "job_id": this.props.navigation.state.params.job_id
            }
        }
        try {
            const json = await PostFetch("candidates-interview-list", payload, header)

            if (json != null) {

                let data = []
                // for (let i of json.data.total_data) {
                //     if (i.apply_mode == 2) {
                //         continue
                //     }
                //     data.push(i)
                // }
                if (json.error == 0) {
                    await this.setState({ data: json.data.total_data, head_index: status })
                }
                else {
                    alert(json.message)
                }
            }

            this.setState({ loader: false })
        }
        catch (err) {
            this.setState({ loader: false })
            console.log(err)
        }
    }

    get_all_data = async () => {
        this.setState({ loader: true })
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let status = this.props.navigation.state.params.status == undefined ? null : 0

        let payload = {
            "job_id": this.props.navigation.state.params.job_id
        }

        if (status != null) {
            payload = {
                "job_id": this.props.navigation.state.params.job_id,
                "status": status
            }
        }
        try {
            const json = await PostFetch("candidates-interview-list", payload, header)

            if (json != null) {
                // console.log(json.data.total_data, "-------------candidate evaluate list-----------")
                if (json.error == 0) {
                    if (json.data.total_data == null) {
                        this.setState({ data: [], head_index: null })

                    }
                    else {
                        let data = []
                        for (let i of json.data.total_data) {
                            if (parseInt(i.apply_mode) == 2|| parseInt(i.interview_mode)==0) {
                                continue
                            }
                            data.push(i)
                        }
                        let status = this.props.navigation.state.params.status == undefined ? null : 0

                        this.setState({ data: data, head_index: status })
                    }
                }
                else {
                    alert(json.message)
                }
            }

            this.setState({ loader: false })
        }
        catch (err) {
            console.log(err)
            this.setState({ loader: false })
        }
    }
    componentDidMount = async () => {
        // console.log(hp(1))
        this.get_all_data()
        // let status = this.props.navigation.state.params.status==undefined?null:0
        // this.setState({head_index:status})
        // console.log(this.state.data, "ksndg")

    }



    render() {
        // console.log(this.state.head_index, "LLLLLLLLLLLLLL")
        let color = this.state.head_index == null ? ["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"] : ['#ebebeb', '#ebebeb']
        let color1 = this.state.head_index == 0 ? ["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"] : ['#ebebeb', '#ebebeb']

        let color2 = this.state.head_index == 1 ? ["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"] : ['#ebebeb', '#ebebeb']

        let color3 = this.state.head_index == 3 ? ["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"] : ['#ebebeb', '#ebebeb']

        let color4 = this.state.head_index == 2 ? ["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"] : ['#ebebeb', '#ebebeb']
        let no_of_record = this.state.data.length == undefined ? 0 : this.state.data.length
        // console.log(this.state.data)

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Header heading="Evaluated Applicants" {...this.props} textalign='left' widths={wp(55)} left={Scales.deviceWidth * 0.14} Click_Search={this.Click_Search} back={true} />

                    <View style={{ flex: 1, backgroundColor: "#faf9fd" }}>
                        <View>
                            <View style={{ width: wp(98), flexDirection: 'row', height: hp(6), borderRadius: 10, marginTop: 15, backgroundColor: '#ebebeb', elevation: 5, alignSelf: 'center' }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity onPress={() => this.get_other_data(null)}>
                                        <LinearGradient colors={color} style={{ width: wp(20), height: hp(6), borderRadius: 10, }}  >
                                            <View style={{ width: wp(20), height: hp(6), borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: this.state.head_index == null ? "white" : "black" }}>Total Applicants</Text>
                                            </View></LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.get_other_data(0)}>
                                        <LinearGradient colors={color1} style={{ width: wp(20), height: hp(6), borderRadius: 10, }}  >
                                            <View style={{ width: wp(20), height: hp(6), borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: this.state.head_index == 0 ? "white" : "black" }}>Pending</Text>

                                            </View></LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.get_other_data(3)}>
                                        <LinearGradient colors={color3} style={{ width: wp(20), height: hp(6), borderRadius: 10, }}  >
                                            <View style={{ width: wp(20), height: hp(6), borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: this.state.head_index == 3 ? "white" : "black" }}>Rejected</Text>

                                            </View></LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.get_other_data(2)}>
                                        <LinearGradient colors={color4} style={{ width: wp(20), height: hp(6), borderRadius: 10, }}  >
                                            <View style={{ width: wp(20), height: hp(6), borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: this.state.head_index == 2 ? "white" : "black" }}>Selected</Text>

                                            </View></LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.get_other_data(1)}>
                                        <LinearGradient colors={color2} style={{ width: wp(20), height: hp(6), borderRadius: 10, }}  >
                                            <View style={{ width: wp(20), height: hp(6), borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: this.state.head_index == 1 ? "white" : "black" }}>On Hold</Text>

                                            </View></LinearGradient>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>

                        <View>
                            <View style={{ width: wp(95), justifyContent: 'center', height: hp(6), borderRadius: 10, marginTop: Scales.deviceHeight * 0.02, alignSelf: 'center' }}>
                                <Text style={{ fontFamily: "roboto-bold", fontSize: Scales.moderateScale(16), paddingLeft: Scales.deviceWidth * 0.03, paddingBottom: Scales.deviceHeight * 0.008 }}>Showing {no_of_record} Applicants List</Text>
                                <View style={{ width: wp(32), height: 1, borderWidth: 1.5, left: Scales.deviceWidth * 0.03, borderColor: "#ebebeb" }}></View>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, }}>
                                {this.state.data.length != 0 ? <FlatList
                                    data={this.state.data}
                                    onRefresh={() => this.state.head_index == null ? this._onrefresh(-1) : this._onrefresh(this.state.head_index)}
                                    refreshing={this.state.refreshing}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={({ item, index }) => <EvaluateList data={item} navigation={this.props.navigation} index={index} />}
                                ></FlatList> :
                                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.state.head_index == null ? this._onrefresh(-1) : this._onrefresh(this.state.head_index)} />}><View style={{ flex: 1, justifyContent: "center" }}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), paddingTop: Scales.deviceHeight * 0.30 }}>No data found !!</Text>
                                    </View></ScrollView>}


                            </View>

                        </View>
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



class EvaluateList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date_format: "DD/MM/YYYY", img: ""
        }
    }

    componentDidMount = async () => {
        console.log(hp(1))
        let date_format = await AsyncStorage.getItem('date_format')
        this.setState({ img: this.props.data.pitcher_data.jobma_pitcher_photo })
        if (date_format == null) {
            this.setState({ date_format: "YYYY/MM/DD" })
        }
        else {
            this.setState({ date_format: date_format })
        }
        // if (this.props.data.pitcher_data.jobma_pitcher_email == "sujeetk@yopmail.com") {
        // console.log(this.props.data, "---------------------------candidate data ---------------------------")
        // }
        console.log(this.props.data.current_status)

    }

    render() {
        let interviews_mode = parseInt(this.props.data.interview_mode)==1?"Pre recorded interview":parseInt(this.props.data.interview_mode)==2?"Live interview":null

        return (
            <View style={{ width: wp(100), justifyContent: "center", padding: Scales.deviceWidth * 0.012, minHeight: hp(18) }}>
                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("Evaluate", { "appiled_id": this.props.data.applied_id, "image": this.props.data.pitcher_data.jobma_pitcher_photo == "" ? null : this.props.data.pitcher_data.jobma_pitcher_photo })}>
                    <View style={{
                        width: wp(95), flexDirection: "row", borderRadius: 10, backgroundColor: 'white', elevation: 3, alignSelf: 'center', padding: Scales.deviceWidth * 0.028, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 2,
                    }}>
                        <View style={{ width: wp(20), minHeight: Scales.deviceHeight * 0.14, paddingTop: 13, }}>
                            <View style={{ width: hp(7.3), height: hp(7.3), borderRadius: hp(7.3) / 2, justifyContent: 'center', backgroundColor: this.props.index % 2 != 0 ? '#ffa001' : '#ff5367', alignSelf: 'center', }}>
                                {this.state.img == "" ? <Text style={{ fontSize: Scales.moderateScale(16), paddingBottom: Scales.deviceHeight * 0.008, fontFamily: 'roboto-medium', textAlign: "center", color: 'white' }}>{this.props.data.pitcher_data.jobma_pitcher_fname.slice(0, 1)}{this.props.data.pitcher_data.jobma_pitcher_lname.slice(0, 1)}</Text> :
                                    <Image source={{ uri: this.state.img }} onError={() => this.setState({ img: "" })} style={{ width: hp(7.3), height: hp(7.3), borderRadius: hp(7.3) / 2 }} />}
                            </View>
                        </View>
                        <View style={{ width: wp(75), minHeight: Scales.deviceHeight * 0.14, }}>
                            <View style={{ width: wp(75), minHeight: hp(3), justifyContent: "center" }}>

                                <Text style={{ fontSize: Scales.moderateScale(16), fontFamily: 'roboto-bold', color: "#3c3c3c" }}>{this.props.data.pitcher_data.jobma_pitcher_fname}{this.props.data.pitcher_data.jobma_pitcher_lname}</Text>


                            </View>
                            <View style={{ width: wp(75), }}>
                                <View style={{ width: wp(75), minHeight: hp(3), flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: wp(26), flexDirection: 'row', alignItems: "center", }}>
                                        <Image source={require("../../assets/Images/calendar.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(1), width: wp(4), height: hp(2) }} />
                                        <Text style={{ fontFamily: "roboto-regular", left: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{moment(this.props.data.jobma_applied_date).format(this.state.date_format)}</Text>
                                    </View>
                                    <View style={{ width: wp(48), alignItems: "center", flexDirection: 'row', }}>
                                        <Image source={require("../../assets/Images/notification.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(1), width: wp(4), height: hp(3) }} />
                                        <Text style={{ fontFamily: "roboto-regular", left: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{interviews_mode}</Text>

                                    </View>

                                </View>

                                <View style={{ width: wp(75), flexDirection: 'row', }}>
                                    <View style={{ width: wp(5), justifyContent: "center" }}>
                                        <Image source={require("../../assets/Images/msg.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.4), width: wp(4), height: hp(3.5) }} />

                                    </View>
                                    <View style={{ width: wp(60), justifyContent: "center" }}>
                                        <Text style={{ textAlign: "left", paddingBottom: Scales.deviceHeight * 0.003, fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{this.props.data.pitcher_data.jobma_pitcher_email}</Text>
                                    </View>

                                </View>

                                {this.props.data.pitcher_data.jobma_pitcher_phone.length != 0 ? <View style={{ width: wp(65), flexDirection: 'row', }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        {this.props.data.pitcher_data.jobma_pitcher_phone.length != 0 ? <Image source={require("../../assets/Images/mob.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8), width: wp(2.5), height: hp(2.5) }} /> : null}

                                    </View>
                                    <View style={{ width: wp(65), justifyContent: 'center', }}>
                                        <Text style={{ textAlign: "left", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>  {this.props.data.pitcher_data.jobma_pitcher_phone}</Text>
                                    </View>

                                </View> : null}
                                <View style={{ width: wp(65), alignItems: "flex-end" }}>
                                    <View style={{ width: wp(30), height: hp(5), flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                                        {this.props.data.viewed == true ? <React.Fragment><View style={{ minWidth: wp(15), height: hp(3), alignSelf: 'center', justifyContent: "center" }}>
                                            <Text style={{ color: "#ffa001", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), textAlign: 'center', backgroundColor: "#fff2bc", paddingLeft: Scales.deviceWidth * 0.02, paddingRight: Scales.deviceWidth * 0.02, paddingBottom: Scales.deviceHeight * 0.008, paddingTop: 5, borderRadius: 5, }}>Viewed</Text>
                                        </View>
                                            <View style={{ borderRightWidth: 1, width: 5, minHeight: hp(3), borderColor: "#c8c8c8", alignSelf: 'center', }}></View></React.Fragment> : null}

                                        {/* <View style={{ minWidth: wp(13), borderRadius: 5, height: hp(3),justifyContent:"center",paddingLeft:Scales.deviceWidth*0.012,backgroundColor: this.props.data.current_status == "Pending" ? "#b7f0a4" : this.props.data.current_status == "Selected" ? "#e1f7ee" : this.props.data.current_status == "Rejected" ? "#ffdcda" : null,padding:Scales.deviceWidth*0.02  }}>

                                            <Text style={{textAlignVertical:"center", borderRadius:5, fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), textAlign: 'center',color: this.props.data.status == "Pending" ? "#5eb442" : this.props.data.current_status == "Selected" ? "#5ed6a8" : this.props.data.current_status == "Rejected" ? "#ff5367" : null, }}>{this.props.data.status == "0" ? "Applied" : this.props.data.status == "1" ? "On-Hold" : this.props.data.status == "2" ? "Selected" : this.props.data.status == "3" ? "Rejected" : null}</Text>
                                        </View> */}
                                        <View style={{ minWidth: wp(15), height: hp(3), alignSelf: 'center', justifyContent: "center" }}>
                                            <Text style={{ left: Scales.deviceWidth * 0.01, color: this.props.data.status == "#c7c7c7" ? "Applied" : this.props.data.status == "1" ? "#98d984" : this.props.data.status == "2" ? "#7eddb7" : this.props.data.status == "3" ? "#ff5f71" : null, fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), textAlign: 'center', backgroundColor: this.props.data.status == "0" ? "#ededed" : this.props.data.status == "1" ? "#cdffbc" : this.props.data.status == "2" ? "#e1f7ee" : this.props.data.status == "3" ? "#ffdcda" : null, paddingLeft: Scales.deviceWidth * 0.02, paddingRight: Scales.deviceWidth * 0.02, paddingBottom: Scales.deviceHeight * 0.008, paddingTop: 5, borderRadius: 5, }}>{this.props.data.status == "0" ? "Applied" : this.props.data.status == "1" ? "On-Hold" : this.props.data.status == "2" ? "Selected" : this.props.data.status == "3" ? "Rejected" : null}</Text>
                                        </View>


                                    </View>
                                </View>

                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

