import React, { Component } from 'react';
import { Image, Text, View, ImageBackground, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';

import PostFetch from '../ajax/PostFetch'
import { Scales } from "@common"

export default class ForgetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {

            email: '',
            isModalVisible: false,
            show_toast: false, toast_message: ''
        }
        // console.warn(Scales.deviceWidth)
    }

    ChangeLock = (e) => {
        let enter_email = e
        this.setState({ email: enter_email, show_toast: false })

    }


    OnForgetPasswordFormSubmit = async () => {
        if (this.state.email.length == 0) {
            this.setState({ show_toast: true, toast_message: "Enter Email Address" })
            return 0
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email_test = re.test(String(this.state.email).toLowerCase());
        // console.log(email_test, "-----------------------------------------email test----------------------------")
        if (email_test == false) {
            this.setState({ show_toast: true, toast_message: "Enter valid Email Address" })
            return 0
        }

        const payload = {
            email: this.state.email
        };

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const json = await PostFetch('forgot-password', payload, headers)

        if (json != null) {
            if (json && json.error == 0) {

                this.setState({
                    isModalVisible: true
                })


            }
            if (json && json.error == 1) {
                this.setState({ show_toast: true, toast_message: json.message })


            }
        }
        else {
            alert("Something Went Wrong...!!!")
        }



    }

    _hideModal = () => {
        this.setState({ isModalVisible: false })
        this.props.navigation.navigate("loginscreen")
    }
    render() {
        return (

            <SafeAreaView style={{flex:1}} >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >

                <ScrollView style={{flex:1}}> 
                <View style={{ flex: 1, flexDirection: 'column',   }}>
                    <ImageBackground source={require('../assets/Images/login-background.png')} resizeMode={"cover"} style={{ alignItems: 'center',flex:1,height:Scales.deviceHeight*1.0,backgroundColor: "white" }}>

                        <View style={{ width: "100%", alignItems: 'center', height: Scales.deviceHeight * 0.12 }}>
                            <Image source={require('../assets/Images/jobma-logo.png')} style={{ width: Scales.deviceWidth * 0.41, resizeMode: 'contain', top: 20, }}></Image>
                        </View>

                        <View style={{ width: "100%", alignItems: 'center', height: Scales.deviceHeight * 0.28, }}>
                            <Image source={require('../assets/Images/forgetbg.png')} style={{ width: Scales.deviceWidth * 0.50, resizeMode: 'contain', height: Scales.deviceHeight * 0.28, }}></Image>
                        </View>

                        <View style={{ width: "100%", alignItems: 'center', height: Scales.deviceHeight * 0.058, marginTop: Scales.deviceHeight * 0.03 }} >
                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(22), color: "#3c3c3c", fontFamily: "roboto-medium" }}>
                                Forgot your password?
                    </Text>
                        </View>
                        <View >
                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium", color: "#999999" }}>
                                Enter your registered email below to receive
                    </Text>
                            <Text style={{ marginTop: 2, textAlign: 'center', fontFamily: 'roboto-medium', color: "#999999" }}>password reset instructions!</Text>
                        </View>

                        <View style={{ width: "80%", height: Scales.deviceHeight * 0.20, marginTop: Scales.deviceHeight * 0.027, paddingTop: Scales.deviceHeight * 0.03 }}>
                            <TextInput placeholderTextColor = {"#c7c7c7"}  placeholderTextColor={"#c7c7c7"} placeholder="Enter your email address" onChangeText={(e) => { this.ChangeLock(e) }} style={{ fontFamily: 'roboto-medium', width: "100%", color: 'black', borderBottomWidth: 1, fontSize: Scales.moderateScale(14), borderBottomColor: "#999999", paddingLeft: 5 }} />

                            {this.state.show_toast ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-end", marginTop: Scales.deviceHeight * 0.02 }}>
                                <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                                    <Image source={require("../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), color: "white" }}>{this.state.toast_message}</Text>
                                </View>

                                <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                                <TouchableOpacity onPress={() => this.setState({ show_toast: false })}>
                                    <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                                        <Image source={require("../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                                    </View>
                                </TouchableOpacity>
                            </View> : null}
                        </View>


                        <TouchableOpacity onPress={this.OnForgetPasswordFormSubmit}><View style={{ width: Scales.deviceWidth * 0.60, height: 40, backgroundColor: '#5c49e0', justifyContent: 'center', borderRadius: 10 }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'roboto-medium' }}>
                                Send Request
                    </Text>
                        </View></TouchableOpacity>


                        <View style={{ width: "80%", height: 80, justifyContent: "center", }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}><Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: 18, }}>
                                Back to login
                    </Text></TouchableOpacity>
                        </View>


                        <Modal isVisible={this.state.isModalVisible} style={{ width: "90%", height: Scales.deviceHeight * 0.13, alignSelf: 'center' }}>
                            <View style={{ backgroundColor: 'white', width: "100%", height: Scales.deviceHeight * 0.47, borderRadius: 10, padding: 10 }}>
                                <View style={{ width: "100%", height: "45%", justifyContent: "center", alignItems: 'center', }}>
                                    <Image source={require('../assets/Images/mail.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.40, aspectRatio: 1, height: Scales.deviceHeight * 0.22 }} />
                                </View>

                                <View style={{ width: "100%", height: "58%", justifyContent: "flex-start", padding: 5 }}>
                                    <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16) }}>We have sent an email with instructions </Text>
                                    <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16) }}>to reset your password, please check  </Text>
                                    <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16) }}>your email. </Text>

                                    <View style={{ width: "100%", height: "35%", justifyContent: "flex-end" }}>
                                        <TouchableOpacity onPress={this._hideModal}><View style={{ width: Scales.deviceWidth * 0.30, height: Scales.deviceHeight * 0.06, backgroundColor: 'blue', alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'center', fontSize: 18, color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                                        </View></TouchableOpacity>
                                    </View>
                                </View>


                            </View>
                        </Modal>

                    </ImageBackground>


                </View>

            </ScrollView>
            </KeyboardAvoidingView>
            </SafeAreaView>


        );
    }

}