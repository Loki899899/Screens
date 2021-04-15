import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, AsyncStorage, ActivityIndicator, Image, SafeAreaView,Alert } from "react-native"
import Modal from "react-native-modal"

import Header from "./DrawerHeader"
import { Scales } from "@common"
import PostFetch from "../ajax/PostFetch"
import Toast from 'react-native-simple-toast';
import Popover from 'react-native-popover-view';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            new: '',
            current: '',
            confirm: '', loading: false, alert_modal: false, show_loader: false, loading: false
        }

    }

    UpdatePassword = async () => {
        this.setState({ loading: true })
        if (this.state.current == '') {
            Toast.showWithGravity("Enter current password", Toast.SHORT, Toast.BOTTOM);
            this.setState({ loading: false })
            return 0

        }
        if (this.state.new == '') {
            Toast.showWithGravity("Enter new password", Toast.SHORT, Toast.BOTTOM);
            this.setState({ loading: false })
            return 0

        }
        if (this.state.confirm == '') {
            Toast.showWithGravity("Enter confirm password", Toast.SHORT, Toast.BOTTOM);
            this.setState({ loading: false })
            return 0

        }
        // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        let new_pass = this.state.new
        let test = re.test(String(new_pass))
        if (test == false) {
            Toast.showWithGravity("Please enter the strong password.", Toast.SHORT, Toast.BOTTOM);
            this.setState({ loading: false })
            return 0
        }
        // console.warn(test)
        if (this.state.confirm == this.state.new) {

            if (this.state.new.length < 6) {
                Toast.showWithGravity("Enter  minimum 6 characters", Toast.SHORT, Toast.BOTTOM);
                this.setState({ loading: false })
                return 0
            }



            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Key': await AsyncStorage.getItem('token')
            };


            const payload = {
                "current_password": this.state.current,
                "new_password": this.state.new
            }

            const json = await PostFetch("chp", payload, headers)

            if (json != null) {
                // console.log(json, "=============== Chnaged password ===========================")
                if (json.error == 0) {
                    this.setState({
                        new: '',
                        current: '',
                        confirm: '', loading: false, alert_modal: false, show_loader: false
                    })
                    this.refs.current.reset()
                    this.refs.new.reset()
                    this.refs.confirm.reset()
                    Toast.showWithGravity("Password Changed Successfully", Toast.LONG, Toast.BOTTOM);
                    this.props.navigation.navigate("firstscreen")
                }
                else {
                    await this.setState({ loading: false })
                    Alert.alert(
                        "Alert",
                        json.message,
                        [
                          {
                            text: "ok",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          }
                        
                        ],
                        { cancelable: true }
                      );
              
                  

                }

            }
            else {
                this.setState({ loading: false })
                // alert("Something Went Wrong !!!")
            }

        }
        else {
            Toast.showWithGravity("New password and confirm password must be same", Toast.SHORT, Toast.BOTTOM);

        }
        this.setState({ loading: false })
    }

    clearState = () => {
        // console.log("--------------clear change data =--------------------------")
        this.setState({
            new: '',
            current: '',
            confirm: '', loading: false, alert_modal: false, show_loader: false
        })
        this.refs.current.reset()
        this.refs.new.reset()
        this.refs.confirm.reset()
    }
   


    render() {
        let backfunc = [this.clearState]
        let enter_style = { height: Scales.deviceHeight * 0.06, color: 'black', width: Scales.deviceWidth * 0.70, fontFamily: 'roboto-medium', textAlign: 'left', paddingLeft: 0, fontSize: Scales.moderateScale(16), }
        let enter_style_1 = { height: Scales.deviceHeight * 0.06, color: 'black', fontFamily: 'roboto-medium', textAlign: 'left', fontSize: Scales.moderateScale(14), paddingLeft: 0, }
        // let disable_button = this.state.current == null && this.state.new == null && this.state.confirm == null ? true : false
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Header heading="Change Password" left={Scales.deviceWidth * 0.10} {...this.props} textalign='center' backfunc={backfunc} />
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.80, }}>
                        <View style={{ width: Scales.deviceWidth * 1.0, borderRadius: 10, alignSelf: "center", padding: Scales.deviceHeight * 0.028, }}>
                            <View style={{ width: Scales.deviceWidth * 0.88, height: Scales.deviceHeight * 0.06, justifyContent: 'center', paddingBottom: Scales.deviceHeight * 0.015, }}>

                                <FloatingLabelInput
                                    label="Enter current password*"
                                    ref="current"
                                    style={enter_style_1}
                                    value={this.state.current}
                                    pass={false}
                                   
                                    
                                    onChangeText={(e) =>  this.setState({ current: e, }) }
                                />
                            </View>
                            <View style={{ flexDirection: 'row', height: Scales.deviceHeight * 0.10, alignItems: "flex-end", alignContent: "center" }}>
                                {/* <TextInput placeholderTextColor = {"#c7c7c7"}  placeholder="Password" secureTextEntry={this.state.password_hide} onChangeText={this.OnEnterPassword} style={{ height: Scales.deviceHeight * 0.06, width: "88%", fontFamily: 'roboto-medium', textAlign: 'left', paddingLeft: 10, fontSize: Scales.moderateScale(16), }}></TextInput> */}
                                <FloatingLabelInput
                                    label="Enter new password*"
                                    ref="new"
                                    value={this.state.new}
                                    style={enter_style}
                                    pass={true}
                                  
                                    onChangeText={(e) =>  this.setState({new:e}) }
                                />


                            </View>
                            <View style={{ width: Scales.deviceWidth * 0.88, height: Scales.deviceHeight * 0.10, justifyContent: 'center', paddingBottom: 10 }}>

                                <FloatingLabelInput
                                    label="Enter confirm password*"
                                    style={enter_style}
                                    value={this.state.confirm}
                                    pass={false}
                                    ref="confirm"
                                  
                                    onChangeText={(e) => this.setState({ confirm: e }) }
                                />
                            </View>


                           

                        </View>

                    </View>


                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08, justifyContent: "center" }}>
                        <TouchableOpacity disabled={this.state.loading} onPress={this.UpdatePassword}><View style={{ width: Scales.deviceWidth * 0.90, alignSelf: "center", borderRadius: 15, height: Scales.deviceHeight * 0.06, backgroundColor:this.state.loading==true?"#c7c7c7": "#473ca8", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "roboto-medium", width: Scales.deviceWidth * 0.90, textAlign: "center", fontSize: Scales.moderateScale(20), color: 'white' }}>Submit</Text>

                        </View></TouchableOpacity>
                    </View>


                    <Modal isVisible={this.state.alert_modal} transparent={true} >

                        <View style={{ backgroundColor: "transparent", width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", }}>
                            <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.16, borderRadius: 10, opacity: 1, alignSelf: "center" }}>


                                <View style={{}}>
                                    <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', paddingTop: Scales.deviceHeight * 0.02, fontSize: 16 }}>Confirm and New password Mismatch</Text>


                                    <TouchableOpacity disabled={this.state.loading == false ? false : true} onPress={() => this.setState({ alert_modal: false })}><View style={{ width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                                        <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, backgroundColor: this.state.loading==true?'#ebebeb':'blue', alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                                        </View>
                                    </View></TouchableOpacity>
                                </View>


                            </View>


                        </View>
                    </Modal>

                    <Modal isVisible={false}>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                        </View>

                    </Modal>

                </View>
            </SafeAreaView>
        )
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

        if (this.props.value.length == 0) {
            // console.warn("{{}}}")
            this.setState({ isFocused: false });
        }
        this.setState({ focus: !this.state.focus })

    }
    reset = () => {
        // console.log("------------reset--------------")
        this.setState({
            isFocused: false,
            password_hide: true,
            focus: false
        })
    }




    render() {
        const { label, ...props } = this.props;
        const { isFocused } = this.state;
        let img_path = this.state.password_hide ? require('../assets/Images/change_pass_icon.png') : require('../assets/Images/unlock.png')
     
        const labelStyle = {
            position: 'absolute',
            left: 0,
            paddingLeft: 5,
            top: !isFocused ? 25 : 5,
            fontSize: !isFocused ? Scales.moderateScale(14) : Scales.moderateScale(12),
            color: !isFocused ? '#aaa' : '#5300ed', fontFamily: 'roboto-regular',

        };
        let view_style = {}
        if (this.props.pass != true) {
            view_style = {}
        }
        else {
            view_style = { flexDirection: "row", width: Scales.deviceWidth * 0.60 }
        }
        return (
            <View style={{ paddingTop: Scales.deviceHeight*0.02}}>

                <Text style={labelStyle}>
                    {label}
                </Text>


                <View style={view_style}>
                    <TextInput placeholderTextColor = {"#c7c7c7"} 

                        {...props}

                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        returnKeyLabel={"done"}
                        returnKeyType={'done'}
                        secureTextEntry={true}
                    // secureTextEntry={this.props.pass ? this.state.password_hide : false}

                    />
                    {this.props.pass == true ? <View style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.04, justifyContent: "flex-end", }}>
                        <Popover placement={"bottom"} from={(
                            <TouchableOpacity><View><Image source={img_path} style={{ resizeMode: 'contain', alignSelf: "flex-end", width: Scales.deviceWidth * 0.04, }}></Image></View></TouchableOpacity>
                        )} >
                            <View style={{ width: Scales.deviceWidth * 0.65, height: Scales.deviceHeight * 0.20, backgroundColor: 'white' }}>
                                <View style={{ width: Scales.deviceWidth * 0.65, height: Scales.deviceHeight * 0.05, backgroundColor: '#f7f7f7', padding: 5, }}>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(11) }}>To make a strong password, it must include:</Text>
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.65, height: Scales.deviceHeight * 0.15, paddingTop: 5, justifyContent: "space-between", paddingBottom: 10, paddingLeft: 10 }}>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10) }}>* At least one uppercase letter.</Text>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10) }}>* At least one lowercase letter.</Text>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10) }}>* At least one numeric value.</Text>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10) }}>* At least one special character.</Text>
                                    <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10) }}>* At least 6 characters.</Text>

                                </View>

                            </View>
                        </Popover>

                    </View> : null}
                </View>
                <View style={{ borderTopWidth: 0.8, borderColor: this.state.isFocused ? "#5300ed" : '#b1b1b1', backgroundColor: this.state.isFocused ? "#5300ed" : '#b1b1b1', bottom: 10, width: Scales.deviceWidth * 0.90 }}></View>
            </View>
        );
    }
}