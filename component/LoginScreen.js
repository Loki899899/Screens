import React, { Component } from 'react';
import { Image, Text, View, ScrollView, ImageBackground, TextInput, TouchableOpacity, StatusBar, ActivityIndicator,SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AsyncStorage } from 'react-native';
import PostFetch from '../ajax/PostFetch'
import { Scales } from "@common"
import Modal from "react-native-modal"
import Toast from "react-native-simple-toast"
import moment from "moment"
import AntDesignI from "react-native-vector-icons/AntDesign"

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            password_hide: true,
            email: '',
            password: '',

            loading: false, show_toast: false, toast_message: "",
            show_toast_pass: false, toast_message_pass: ""
        }

        this.OnLoginFormSubmit = this.OnLoginFormSubmit.bind(this)

    }


    OnLoginFormSubmit = async () => {
        this.setState({ loading: true })
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email_test = re.test(String(this.state.email).toLowerCase());
        if (this.state.email == "" && this.state.password == "") {
            this.setState({ show_toast: true, toast_message: "Enter email address", loading: false })
            return 0;

        }
        if (email_test == false) {
            this.setState({ show_toast: true, toast_message: "Enter valid email address", loading: false })
            return 0;


        }


        if (this.state.email == "" && this.state.password != "") {
            this.setState({ show_toast: true, toast_message: "Enter email address", loading: false })
            return 0;

        }
        else if (this.state.email != "" && this.state.password == "") {
            this.setState({ show_toast_pass: true, toast_message_pass: "Enter your password ", loading: false })
            return 0;
        }


        const payload = {
            email: this.state.email,
            password: this.state.password
        }


        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const json = await PostFetch('employer-login', payload, header);
        // console.log(json)

        if (json != null) {
            console.log(json)
            if (json.error == 0) {
                console.log(json)
                console.log(json.data.subscription_status)
                let end_sub_date = moment(json.data.subscription_expire_date).add(1,'days')

                if(moment(end_sub_date)<moment()){
                    this.setState({ show_toast: true, toast_message: "Your subscription plan has been expired.Please renew your subscription from website and continue the service", loading: false })

                    // Toast.showWithGravity("Yours subscription plan has been expired.Please renew your subscription from website and continue the service", Toast.LONG,Toast.BOTTOM)
                    this.setState({ loading: false })
                    return 0
                }
                
                await AsyncStorage.setItem("emp_pass", this.state.password)
                await AsyncStorage.setItem("token", json.data.api_key)
                await AsyncStorage.setItem("email", json.data.email)
                await AsyncStorage.setItem("lname", json.data.jobma_catcher_lname)
                await AsyncStorage.setItem("fname", json.data.jobma_catcher_fname)
                await AsyncStorage.setItem("user_id", JSON.stringify(json.data.id))
                await AsyncStorage.setItem('StopByAdmin',json.data.subscription_status)
                let date_format =  "DD/MM/YYYY"
                if(json.data.date_format=="d/m/Y"){
                    date_format = "DD/MM/YYYY"
                }
                else if(json.data.date_format=="m/d/Y"){
                    date_format = "MM/DD/YYYY"
                }
                else if(json.data.date_format=="Y/m/d"){
                    date_format = "YYYY/MM/DD"
                }
                await AsyncStorage.setItem("date_format", date_format)
                await AsyncStorage.setItem("unlimited",String(json.data.is_unlimited))        
                this.setState({ loading: false })
                // console.log(json)
                this.props.navigation.navigate('DrawerNav', { ...this.props })


            }
            if (json.error == 1) {
                this.setState({ loading: false, show_toast: true,show_toast_pass:false, toast_message: "These credentials do not match our records" })


            }
        }
        else {

            this.setState({ loading: false })
            alert("Something Went Wrong...!!!")
        }
    }


    componentDidMount = () => { }


    OnEnterPassword = (e) => {
        this.setState({
            password_hide: true,
            password: e,show_toast_pass:false
        })
    }

    GotoForgetScreen = () => {
        this.props.navigation.navigate("forgetscreen", { ...this.props })
    }

    Show_password = () => {
        this.setState({ password_hide: !this.state.password_hide })
    }



    render() {
        let enter_style = { height: Scales.deviceHeight * 0.06, width: Scales.deviceWidth * 0.70, color:'black',fontFamily: 'roboto-medium', textAlign: 'left', paddingLeft: 0, fontSize: Scales.moderateScale(16), }
        let enter_style_1 = { height: Scales.deviceHeight * 0.06, fontFamily: 'roboto-medium', textAlign: 'left', fontSize: Scales.moderateScale(14), paddingLeft: 0,color:'black' }

        let button_disable = this.state.email.length == 0 && this.state.password.length == 0 ? true : false;
        const data = (
            
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                <React.Fragment>
                <StatusBar backgroundColor="blue" barStyle="light-content" />

                <ImageBackground source={require('../assets/Images/login-background.png')} style={{
                    width: Scales.deviceWidth * 1.0,
                    // alignItems: 'center',
                    height: Scales.deviceHeight * 1.0,
                    backgroundColor: 'white'


                }} >
                    <View style={{ width: "100%", alignItems: 'center', }}>

                        <View style={{ paddingTop: 20 }}>
                            <Image source={require('../assets/Images/jobma-logo.png')} style={{ width: Scales.deviceWidth * 0.50, resizeMode: 'contain', marginTop: 20 }}></Image>
                        </View>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * .80, paddingTop: Scales.deviceHeight*0.04, }}>

                        <View style={{ width: Scales.deviceWidth * 0.88, height: Scales.deviceHeight * 0.65, borderRadius: Scales.deviceWidth * 0.05, alignSelf: "center" }}>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontSize: Scales.moderateScale(32), fontFamily: 'roboto-medium', }}>Login</Text>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.88, height: Scales.deviceHeight * 0.35, justifyContent: 'center', }}>
                                {/* <TextInput placeholderTextColor = {"#c7c7c7"}  placeholder="User name" onChangeText={(e) => { this.setState({ email: e }) }} style={{ height: Scales.deviceHeight*0.06,fontFamily: 'roboto-medium', textAlign: 'left', borderBottomWidth: 1, borderBottomColor: '#b1b1b1', fontSize: Scales.moderateScale(16), paddingLeft:10, paddingTop:5 }}></TextInput> */}
                                <FloatingLabelInput
                                    label="Username"
                                    value={this.state.value}
                                    style={enter_style_1}
                                    enter_data={this.state.email}
                                    pass={false}
                                    secureTextEntry={false}
                                    onChangeText={(e) => { this.setState({ email: e,show_toast:false }) }}
                                />

                                {this.state.show_toast ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, minHeight: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-start", }}>
                                    <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.05,justifyContent:"center" , paddingLeft: 10, }}>
                                        <Image source={require("../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.05, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: "white" }}>{this.state.toast_message}</Text>
                                    </View>

                                    <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                                    <TouchableOpacity onPress={() => this.setState({ show_toast: false })}>
                                        <View style={{ width: Scales.deviceWidth * 0.07,  alignSelf: "flex-end",justifyContent:'center', paddingRight: 5, height: Scales.deviceHeight * 0.05, }}>
                                        {/* <Image source={require("../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04,aspectRatio:0.2, resizeMode: "contain" }}></Image> */}
                                        <AntDesignI name={"close"} color={"white"}  size={20}/>
                                    </View></TouchableOpacity>
                                </View> : null}
                                <View style={{ flexDirection: 'row', height: Scales.deviceHeight * 0.12, alignItems: "flex-end", alignContent: "center" }}>
                                    {/* <TextInput placeholderTextColor = {"#c7c7c7"}  placeholder="Password" secureTextEntry={this.state.password_hide} onChangeText={this.OnEnterPassword} style={{ height: Scales.deviceHeight * 0.06, width: "88%", fontFamily: 'roboto-medium', textAlign: 'left', paddingLeft: 10, fontSize: Scales.moderateScale(16), }}></TextInput> */}
                                    <FloatingLabelInput
                                        label="Password"
                                        value={this.state.value}
                                        enter_data={this.state.password}
                                        style={enter_style}
                                        pass={true}
                                        secureTextEntry={true}
                                        onChangeText={(e) => { this.setState({ password: e,show_toast_pass:false }) }}
                                    />
                                    

                                </View>
                                {this.state.show_toast_pass ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-start", }}>
                                    <View style={{ width: Scales.deviceWidth * 0.12,height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                                        <Image source={require("../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045,  resizeMode: "contain" }} />
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: "white" }}>{this.state.toast_message_pass}</Text>
                                    </View>

                                    <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                                    <TouchableOpacity onPress={() => this.setState({ show_toast_pass: false })}>
                                        <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                                        <Image source={require("../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                                    </View></TouchableOpacity>
                                </View> : null}

                            </View>

                            <TouchableOpacity activeOpacity={1} onPress={this.OnLoginFormSubmit} ><LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#6059bb','#6059bb','#5b53b7','#5b53b7','#544bb2','#544bb2','#4b41ab','#4b41ab','#4539a6','#4539a6','#4135a3', '#4135a3']} style={{  alignItems: 'center', borderRadius:10, width: "100%", height: Scales.deviceHeight*0.06, alignSelf: 'center', elevation:3}}>

                                <View style={{ justifyContent: 'center', height: Scales.deviceHeight*0.06,}}>
                                    <Text style={{ fontSize: Scales.moderateScale(20), color: 'white',  fontFamily: 'roboto-medium', }}>Sign in</Text>
                                </View>

                            </LinearGradient></TouchableOpacity>
                            <View style={{ width: "100%", height: Scales.deviceHeight*0.07,  alignItems: 'center', justifyContent:"center" }}>
                                <TouchableOpacity onPress={this.GotoForgetScreen}><Text style={{ color: "#505050", fontSize: 20, fontFamily: 'roboto-medium' }}>Forgot password?</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Modal isVisible={this.state.loading}>
                
                    <View style={{flex:1, justifyContent:"center"}}>
                        <ActivityIndicator size={20} style={{alignSelf:"center"}} />
                    </View>
                
            </Modal>




                </ImageBackground>
            </React.Fragment></ScrollView>
        )
        return (
             <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, flexDirection: 'column', }}>
                {data}

            </View>
             </SafeAreaView>
        );
    }
}



class FloatingLabelInput extends Component {
    state = {
        isFocused: false,
        password_hide: true,
        focus: false
    };

    handleFocus = () => this.setState({ isFocused: true, focus: true });
    handleBlur = () => {

        if (this.props.enter_data.length == 0) {
            this.setState({ isFocused: false });
        }
        this.setState({ focus: !this.state.focus })

    }




    render() {
        const { label, ...props } = this.props;
        const { isFocused } = this.state;
        let img_path = this.state.password_hide ? require('../assets/Images/unlock.png') : require('../assets/Images/password-show.png')
        const labelStyle = {
            position: 'absolute',
            left: 0,
            top: !isFocused ? 25 : 5,
            fontSize: !isFocused ? Scales.moderateScale(16) : Scales.moderateScale(12),
            color: !isFocused ? '#aaa' : '#5300ed', fontFamily: 'roboto-regular',

        };
        let view_style = {}
        if (this.props.pass != true) {
            view_style = {}
        }
        else {
            view_style = { flexDirection: "row", width: Scales.deviceWidth * 0.90 }
        }
        return (
            <View style={{ paddingTop: 18 }}>
                <Text style={labelStyle}>
                    {label}
                </Text>
                <View style={view_style}>
                    <TextInput placeholderTextColor = {"#c7c7c7"} 
                        {...props}

                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        secureTextEntry={this.props.pass ? this.state.password_hide : false}

                    />
                    {this.props.pass == true ? <View style={{ width: Scales.deviceWidth * 0.13, height: Scales.deviceHeight * 0.04, justifyContent: "flex-end", }}>
                        <TouchableOpacity onPress={() => this.setState({ password_hide: !this.state.password_hide })}><Image source={img_path} style={{ resizeMode: 'contain',alignSelf:"flex-end", width: Scales.deviceWidth * 0.06,  }}></Image></TouchableOpacity>
                    </View> : null}
                </View>
                <View style={{ borderWidth: 1, borderBottomColor: this.state.focus ? "#5300ed" : '#b1b1b1', bottom: 10, width: Scales.deviceWidth * 0.85 }}></View>
            </View>
        );
    }
}