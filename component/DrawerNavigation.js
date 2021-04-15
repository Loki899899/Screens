import { createDrawerNavigator, } from 'react-navigation-drawer';
import { createAppContainer, } from 'react-navigation';
import React, { Component } from 'react';
import { View, AsyncStorage, SafeAreaView } from 'react-native'
// import DrawerIndex from './DrawerHomePage';
import HomePage from "./Homepage"

import { Image, Text, TouchableOpacity } from 'react-native'
import Joblisting from '../component/dashboardcomponent/joblisting'
import InterviewKit from './dashboardcomponent/interviewkit'
import Applicants from "./dashboardcomponent/Applicants"
import SetupInterview from './dashboardcomponent/schedule_an_interview'
import ForwardProfile from "./dashboardcomponent/forward"
import { Scales } from "@common"
import ChangePasword from "./ChangesPassword"
import Modal from "react-native-modal"
import Track from "../component/dashboardcomponent/TrackPage"

import NetworkUtils from "../common/globalfunc"


import Toast from 'react-native-simple-toast'
import { URL } from "../ajax/PostFetch"


const drawer = createDrawerNavigator({
    firstscreen: {
        screen: HomePage,
        navigationOptions: {
            title: "Dashboard"
        }
    },
    joblisting: {
        screen: Joblisting,
        navigationOptions: {
            title: "Jobs Listing"
        }
    },
    thirdscreen: {
        screen: InterviewKit,
        navigationOptions: {
            title: "Interview Kits"
        }
    },
    fourthscreen: {
        screen: SetupInterview,
        navigationOptions: {
            title: "Setup an interview"
        }
    },
    eightscreen: {
        screen: Track,
        navigationOptions: {
            title: "Track"
        }
    },
    fivescreen: {
        screen: Applicants,
        navigationOptions: {
            title: "Applicants"
        }
    },
    sixscreen: {
        screen: ChangePasword,
        navigationOptions: {
            title: "Change password"
        }
    },
    sevenscreen: {
        screen: HomePage,
        navigationOptions: {
            title: "Logout"
        }
    },

},

    {
        contentComponent: (props) => <MainScreen {...props} />,
        drawerWidth: Scales.deviceWidth * 0.80,
        drawerBackgroundColor: "#faf9fd",


    },

)


class MainScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            image: "",
            fname: '',
            lname: '',
            logout: false,

        }
        this.Get_catcher_img()
    }
    Get_catcher_img = async () => {
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        await fetch(URL.api_url + "catcherpic", {
            method: 'GET',
            headers: header
        })
            .then(response => response.json())
            .then(respJson => {
                if (respJson != null) {

                    if (respJson.error == 0) {

                        console.log(respJson)
                        this.setState({
                            image: respJson.data.catcher_photo
                        })

                    }
                    else {
                        // alert(respJson.message)
                    }


                }
                else {
                    // alert("Something Went Wrong !!!")
                }
            })
            .catch(async (err) => {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                console.log(check_connection, "llll")
                if (check_connection == false) {
                    Toast.showWithGravity("Check your internet connection", Toast.SHORT, Toast.BOTTOM);
                    return 0
                }
                else {
                    Toast.showWithGravity("Something Went Wrong!!!", Toast.LONG, Toast.BOTTOM)
                }
            })
    }
    BackFunction = async () => {
        this.Get_catcher_img()
        let fname = await AsyncStorage.getItem("fname")
        let lname = await AsyncStorage.getItem("lname")
        this.setState({ fname: fname, lname: lname })
    }

    Logout = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('loginscreen')
    }
    componentDidMount = async () => {

        let email = await AsyncStorage.getItem("email")
        let fname = await AsyncStorage.getItem("fname")
        let lname = await AsyncStorage.getItem("lname")
        console.log(lname)

        this.setState({
            email: email,
            fname: fname,
            lname: lname

        })
    }
    render() {
        let img = this.state.image


        return (
            <SafeAreaView style={{ flex: 1 }}>


                <View style={{ flex: 1 }}>
                   
                    <View style={{ flex: 1, flexDirection: "column", backgroundColor: "#faf9fd" }}>


                        <View style={{ flex: 1 }}>
                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.15, flexDirection: "row" }}>
                                <View style={{ width: Scales.deviceWidth * 0.28, height: Scales.deviceHeight * 0.15, paddingTop: Scales.deviceHeight * 0.02, }}>
                                    <View style={{ width: Scales.deviceHeight * 0.10, height: Scales.deviceHeight * 0.10, borderWidth: 0.3, borderRadius: (Scales.deviceHeight * 0.10) / 2, alignSelf: "center", elevation: 5, justifyContent: "center", backgroundColor: "white" }}>
                                        {img != "" ? <Image source={{ uri: img }} onError={() => this.setState({ image: '' })} style={{ width: Scales.deviceHeight * 0.10, height: Scales.deviceHeight * 0.10, borderRadius: Scales.deviceHeight * 0.10 / 2 }} /> : <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(20), fontFamily: "roboto-medium", textTransform: 'capitalize' }}>{this.state.fname.slice(0, 1)}{this.state.lname == null ? null : this.state.lname.slice(0, 1)}</Text>}

                                    </View>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.44, height: Scales.deviceHeight * 0.18, justifyContent: "center", paddingBottom: Scales.deviceHeight * 0.052 }}>
                                    <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c", textTransform: 'capitalize' }}>{this.state.fname} <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textTransform: 'capitalize' }}>{this.state.lname}</Text></Text>
                                    <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>{this.state.email}</Text>
                                </View>

                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.09, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("firstscreen", { "nav": this.props.navigation })} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.07, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.07, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Home.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.07, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Dashboard</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>


                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("joblisting")} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Job-Listing.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Jobs Listing</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("thirdscreen")} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Interview-Kits.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Interview Kits</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("fourthscreen")} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Setup-an-Interview.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Setup an Interview</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>


                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("eightscreen")} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/track.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Track</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>


                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("fivescreen")} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Applicants.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Applicants</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("sixscreen", { "previous_screen": this.props.navigation.state.routeName })} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Change--Passwords.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Change password</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.06, justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.setState({ logout: true })} ><View style={{ width: Scales.deviceWidth * 0.72, height: Scales.deviceHeight * 0.05, flexDirection: "row" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.16, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Image source={require("../assets/Images/Logout.png")} style={{ width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.04, left: Scales.deviceWidth * 0.05, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "#3c3c3c" }} >Logout</Text>
                                    </View>
                                </View></TouchableOpacity>
                            </View>



                        </View>


                        <Modal isVisible={this.state.logout}>
                            <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.30, justifyContent: "center" }}>
                                <View style={{ width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.18, borderRadius: Scales.moderateScale(10), alignSelf: 'center', backgroundColor: "white", elevation: 5 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.08, paddingTop: Scales.deviceHeight * 0.012, justifyContent: "center" }}>
                                        <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14) }}>Do you really want to logout ?</Text>

                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.05, flexDirection: "row", alignItems: "center", marginTop: Scales.deviceHeight * 0.012, justifyContent: "center" }}>
                                        <TouchableOpacity onPress={() => this.Logout()}><View style={{ width: Scales.deviceWidth * 0.20, justifyContent: "center", borderRadius: 5, height: Scales.deviceHeight * 0.045, borderWidth: 0.3 }}>
                                            <Text style={{ fontFamily: "roboto-medium", textAlign: "center", fontSize: Scales.moderateScale(12) }}>Yes</Text>
                                        </View></TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ logout: false })}><View style={{ width: Scales.deviceWidth * 0.20, justifyContent: "center", left: Scales.deviceWidth * 0.022, height: Scales.deviceHeight * 0.045, borderWidth: 0.3, borderRadius: 5 }}>
                                            <Text style={{ fontFamily: "roboto-medium", textAlign: "center", fontSize: Scales.moderateScale(12) }}>No</Text>
                                        </View></TouchableOpacity>
                                    </View>

                                </View>

                            </View>

                        </Modal>


                    </View>
                    <View style={{ position: "absolute", top: Scales.deviceHeight * 0.07, width: Scales.deviceHeight * 0.03, height: Scales.deviceHeight * 0.03, left: Scales.deviceWidth * 0.20, zIndex: 100 }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("editprofile", { "fname": this.state.fname, "lname": this.state.lname, "email": this.state.email, "Get_catcher_img": this.BackFunction })}>
                            <Image source={require("../assets/Images/edit.png")} style={{ width: Scales.deviceHeight * 0.03, height: Scales.deviceHeight * 0.03 }} />
                        </TouchableOpacity>

                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default createAppContainer(drawer)