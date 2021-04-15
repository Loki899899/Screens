import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, AsyncStorage, Image, Platform,SafeAreaView,ActivityIndicator,Linking,Alert } from 'react-native';
import Header from '../DrawerHeader';
import PostFetch from '../../ajax/PostFetch'
import { Scales } from "@common"
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from "react-native-modal"
import axios from "axios"
import NetworkUtils from "../../common/globalfunc"
import { ScrollView } from 'react-native-gesture-handler';
import { URL } from "../../ajax/PostFetch"
import AntI from "react-native-vector-icons/AntDesign"
import { PERMISSIONS, check, RESULTS } from 'react-native-permissions';

export default class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            "first_name": "",
            "last_name": "",
            "image_url": "",
            show_picker: false, loader: false, toast: false
        }
        this.show_fname = this.props.navigation.state.params.fname
        this.show_lname = this.props.navigation.state.params.lname == null ? "" : this.props.navigation.state.params.lname
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

                        //    console.log(respJson)
                        this.setState({
                            image_url: respJson.data.catcher_photo
                        })
                        // console.log(this.state)

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
                console.log(check_connection, "[[[[[[[[[")
                if (check_connection) {
                    console.log(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })
    }

    CheckPermissions = async () => {
        try {
            let permissions = ''
            let permision_write = ''
            if (Platform.OS == "ios") {
                permissions = PERMISSIONS.IOS.CAMERA
                permision_write = PERMISSIONS.IOS.PHOTO_LIBRARY
            }
            else {
                permissions = PERMISSIONS.ANDROID.CAMERA
                permision_write = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
            }

            const granted = await check(permissions);

            if (granted === RESULTS.GRANTED) {
                this.setState({show_picker:true})
            } else {
                Toast.showWithGravity("You need to give the access in order to upload profile picture",Toast.LONG,Toast.BOTTOM)
            }
            const granted2 = await check(permision_write);

            if (granted2 === RESULTS.GRANTED) {
                console.log("You can use the external storage");
            } else {
                console.log("external storage permission denied");
            }
        } catch (err) {
            console.log(err);
        }
    }
    OpenCamera = () => {
        this.setState({ toast: false })
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            this.setState({ image_url: image.path, show_picker: false })
        }).catch(err => {
            console.log(err, "llllllllll")
            Alert.alert(
                "Permission Alert",
                "Please allow permission in order to upload profile pic",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => Linking.openSettings() }
                ],
                { cancelable: true }
              );
        });



    }


    OpenImagePicker = () => {
        this.setState({ toast: false })
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            this.setState({ image_url: image.path, show_picker: false })
        }).catch(err => {
            Alert.alert(
                "Permission Alert",
                "Please allow storage permission in order to upload profile pic",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => Linking.openSettings() }
                ],
                { cancelable: true }
              );
        });
    }


    UpdateProfile = async () => {
        this.setState({ loader: true })
        let first_name = this.state.first_name.trim()
        let last_name = this.state.last_name.trim()
        if (first_name.length == 0||/^[\s/]*$/g.test(this.state.first_name)) {
            Toast.showWithGravity("First name should not be blank", Toast.LONG, Toast.BOTTOM);
            this.setState({ loader: false })
            return 0
        }
        if (this.state.image_url == ""|| /^[\s/]*$/g.test(this.state.image_url)) {
            Toast.showWithGravity("Please select image", Toast.LONG, Toast.BOTTOM);
            // this.setState({ loader: false, toast: true })
            return 0
        }
        if (last_name.length == 0||/^[\s/]*$/g.test(this.state.last_name)) {
            Toast.showWithGravity("Last name should not be blank", Toast.LONG, Toast.BOTTOM);
            this.setState({ loader: false })
            return 0
        }

        try {
            let token = await AsyncStorage.getItem("token")
            let data = new FormData()

            data.append("fname", this.state.first_name.trim())
            data.append("lname", this.state.last_name.trim())
            data.append('imagefile', { uri: this.state.image_url, name: 'image.jpg', type: 'image/jpeg' })
            let config = {
                method: 'post',
                url: URL.api_url + "uploadcatpic",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data",
                    "key": token
                },
                data: (data),
            };
            console.log(data)
            axios(config)

                .then(async (json) => {
                    console.log(json.data)
                    if (json.data.error == 0) {
                        this.setState({
                            first_name: json.data.data.fname,
                            last_name: json.data.data.lname,
                            image_url: json.data.path
                        })
                        await AsyncStorage.setItem('fname', json.data.data.fname)
                        await AsyncStorage.setItem('lname', json.data.data.lname)
                        this.show_fname = json.data.data.fname
                        this.show_lname = json.data.data.lname
                        this.props.navigation.state.params.Get_catcher_img()
                        this.setState({ loader: false })
                        Toast.showWithGravity("Profile Updated Successfully", Toast.LONG, Toast.BOTTOM);
                        
                        return 0


                    }
                    else {
                        // console.log(json)
                        Toast.showWithGravity(json.message, Toast.LONG, Toast.BOTTOM);
                    }
                    this.setState({ loader: false })

                })
                .catch(async (err) => {
                    let check_connection = await NetworkUtils.isNetworkAvailable()
                    console.log(check_connection, "[[[[[[[[[")
                    if (check_connection) {
                        console.log(err)
                        Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                    }
                    else {
                        Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                    }
                    this.setState({ loader: false })
                })
        }
        catch (err) {
            this.setState({ loader: false })
            console.log(err)
        }

    }

    EnterFirstName = (text) => {
        if(text.length>20){
            Toast.showWithGravity("You have entered max no of characters", Toast.SHORT, Toast.BOTTOM);
            // this.setState({ show_toast: true, toast_message: "Enter letters only" })
            return 0  
        }

            if(!/^[\s/A-Za-z]*$/g.test(text)||text.charAt(text.length-1)=="/"){
            Toast.showWithGravity("Enter letters only", Toast.LONG, Toast.BOTTOM);
            // this.setState({ show_toast: true, toast_message: "Enter letters only" })
            return 0
        }
        else {
            this.setState({ first_name: text })
        }
    }

    EnterLastName = (text) => {
        if(text.length>20){
            Toast.showWithGravity("You have entered max no of characters", Toast.LONG, Toast.BOTTOM);
            // this.setState({ show_toast: true, toast_message: "Enter letters only" })
            return 0  
        }
        if(!/^[\s/A-Za-z]*$/g.test(text)||text.charAt(text.length-1)=="/"){
            Toast.showWithGravity("Enter letters only", Toast.LONG, Toast.BOTTOM);
            // this.setState({ show_toast: true, toast_message: "Enter letters only" })
            return 0
        }
        else {
            this.setState({ last_name: text })
        }
    }

    componentDidMount = () => {
        this.Get_catcher_img()
        // console.log(this.props, "----------------------------------------props-----")
        this.setState({ first_name: this.props.navigation.state.params.fname, last_name: this.props.navigation.state.params.lname == null ? "" : this.props.navigation.state.params.lname })
    }
    render() {
        let backfunc = [this.props.navigation.state.params.Get_catcher_img]


        return (
            <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1 }}>
                <Header heading="Edit Profile" {...this.props} textalign='left' backfunc={backfunc} width={Scales.deviceWidth * 0.50} left={80} back={true} />
                <ScrollView><View style={{ flex: 1 }}>
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.30, }}>
                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.20, flexDirection: "column-reverse", }} >
                            <View style={{ width: Scales.deviceHeight * 0.18, height: Scales.deviceHeight * 0.18, alignSelf: "center", borderColor: "#5b50af", borderWidth: 1.5, borderRadius: (Scales.deviceHeight * 0.18)/2, justifyContent: "center" }}>

                                {this.state.image_url != "" ? <View>
                                    <Image source={{ uri: this.state.image_url }} onError={() => this.setState({ image_url: "" })} style={{ width: Scales.deviceHeight * 0.175, height: Scales.deviceHeight * 0.175, borderRadius: (Scales.deviceHeight * 0.175/2), alignSelf: "center", }} />

                                </View> :
                                    <View style={{ justifyContent: "center" }}>
                                        <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(40),color:"#3c3c3c" }}>{this.show_fname.slice(0, 2) == undefined ? this.show_fname.slice(0, 1) : this.show_fname.slice(0, 2)}</Text>
                                    </View>}


                            </View>
                            
                        </View>
                        <View style={{ width: Scales.deviceWidth * 1.0, minHeight: Scales.deviceHeight * 0.10, }}>
                            <View style={{ width: Scales.deviceWidth * 1.0, paddingTop: Scales.deviceHeight*0.012 }}>
                                <Text style={{ alignSelf: "center", fontFamily: "roboto-medium", textTransform: "capitalize", fontSize: Scales.moderateScale(18),color:"#3c3c3c" }}>{this.show_fname} <Text style={{ fontFamily: "roboto-medium", textTransform: "capitalize",fontSize:Scales.moderateScale(18) }}>{this.show_lname}</Text></Text>
                            </View>
                            <View style={{ width: Scales.deviceWidth * 1.0, }}>
                                <Text style={{ alignSelf: "center",fontSize:Scales.moderateScale(14),color:"#3c3c3c" }}>{this.props.navigation.state.params.email}</Text>
                            </View>
                            {this.state.toast == true ? <View style={{ height: Scales.deviceHeight * 0.06, width: Scales.deviceWidth * 0.50,right:Scales.deviceWidth*0.02, justifyContent: "center", alignSelf: "flex-end",  }}>
                                <View style={{ height: Scales.deviceHeight * 0.03, alignItems: "center", paddingLeft: Scales.deviceWidth*0.02, flexDirection: "row", borderRadius: 5, width: Scales.deviceWidth * 0.50, backgroundColor: '#c9252d', alignSelf: "flex-end", }}>
                                    <Text style={{ color: "white", fontSize: Scales.moderateScale(12) }}>Please select a profile image</Text>
                                    <TouchableOpacity onPress={() => this.setState({ toast: false })}><AntI name={"close"} color={"white"} size={18} style={{ paddingLeft: 8 }} /></TouchableOpacity>
                                </View>
                            </View> : false}
                        </View>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.45, }}>
                        <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.11, }}>
                            <FloatingLabelInput
                                label="First Name"
                                value={this.state.first_name}
                                enter_data={this.props.navigation.state.params.fname}
                                onChangeText={(e) => { this.EnterFirstName(e) }}
                                style={{ alignSelf: "center" }}
                            />
                        </View>

                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.11, }}>
                            <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.11, }}>
                                <FloatingLabelInput
                                    label="Last Name"
                                    value={this.state.last_name}
                                    enter_data={this.props.navigation.state.params.lname == null ? "" : this.props.navigation.state.params.lname}
                                    onChangeText={(e) => { this.EnterLastName(e) }}
                                    style={{ alignSelf: "center" }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08, justifyContent: "flex-end" }}>
                        <TouchableOpacity disabled={this.state.loader} onPress={() => this.UpdateProfile()}>
                            <View style={{ alignSelf: "center", width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.06, borderRadius: 15, backgroundColor:this.state.loader==true?"#c7c7c7": "blue", justifyContent: "center" }}>
                            <Text style={{ textAlign: "center", color: "#ffffff", fontSize: Scales.moderateScale(18), fontFamily: "roboto-medium" }}>Save</Text>
                        </View></TouchableOpacity>
                    </View>



                    <Modal isVisible={this.state.show_picker} onBackButtonPress={() => this.setState({ show_picker: false })}>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.45, alignSelf: "center", backgroundColor: "white", borderRadius: 10 }}>
                                <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, }}>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.03, justifyContent: "flex-end" }}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ show_picker: false })}><Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8), alignSelf: "flex-end", right: Scales.deviceWidth*0.03,  }} /></TouchableOpacity>
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.06, }}>
                                        <Text style={{ alignSelf: "center", fontFamily: "roboto-medium", fontSize: Scales.moderateScale(18) }}>Upload Photo</Text>
                                        <Text style={{ alignSelf: "center", fontFamily: "roboto-regular", color: "#c7c7c7", fontSize: Scales.moderateScale(12), paddingTop: 5 }}>Choose Your Company Profile Picture</Text>
                                    </View>
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.30, justifyContent: "space-evenly" }}>
                                    <TouchableOpacity onPress={() => this.OpenCamera()}><View style={{ width: Scales.deviceWidth * 0.60, borderRadius: 20, height: Scales.deviceHeight * 0.07, backgroundColor: 'red', justifyContent: "center", alignSelf: "center" }}>
                                        <Text style={{ alignSelf: "center", fontFamily: "roboto-medium", color: "white", fontSize: Scales.moderateScale(18) }}>Take Photo</Text>
                                    </View></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.OpenImagePicker()}><View style={{ width: Scales.deviceWidth * 0.60, borderRadius: 20, height: Scales.deviceHeight * 0.07, backgroundColor: 'red', justifyContent: "center", alignSelf: "center" }}>
                                        <Text style={{ alignSelf: "center", fontFamily: "roboto-medium", color: "white", fontSize: Scales.moderateScale(18) }}>Choose From Library</Text>
                                    </View></TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ show_picker: false })}><View style={{ width: Scales.deviceWidth * 0.60, borderRadius: 20, height: Scales.deviceHeight * 0.07, backgroundColor: 'red', justifyContent: "center", alignSelf: "center" }}>
                                        <Text style={{ alignSelf: "center", fontFamily: "roboto-medium", color: "white", fontSize: Scales.moderateScale(18) }}>Cancel</Text>
                                    </View></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{ position: "absolute", left: Scales.deviceWidth * 0.61, top: Scales.deviceHeight * 0.11, zIndex: 50 }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.CheckPermissions()}><Image source={require("../../assets/Images/editprofile.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.09, height: Scales.deviceHeight * 0.09, zIndex: 100 }} /></TouchableOpacity>
                            </View>
                </ScrollView>
            </View>
            <Modal isVisible={false}>
                
                <View style={{flex:1, justifyContent:"center"}}>
                    <ActivityIndicator size={Scales.moderateScale(20)} style={{alignSelf:"center"}} />
                </View>
            
        </Modal>
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
            this.setState({ isFocused: false });
        }
        this.setState({ focus: !this.state.focus })

    }
    componentDidMount() {
        console.log(this.props.enter_data.length)
        if (this.props.enter_data.length != 0) {
            this.setState({ isFocused: true, focus: true })
        }
    }



    render() {
        const { label, ...props } = this.props;
        const { isFocused } = this.state;

        const labelStyle = {
            position: 'absolute',
            left: 0,
            bottom: isFocused ? Scales.deviceHeight*0.03 : 0,
            fontSize: !isFocused ? Scales.moderateScale(14) : Scales.moderateScale(12),
            color: !this.state.focus ? 'black' : '#4438a5', fontFamily: "../assets/font/Roboto-Bold",
            paddingLeft: Scales.deviceWidth*0.012

        };
       

        return (
            <View style={{  }}>
                <Text style={labelStyle}>
                    {label}
                </Text>
                <View  style={{justifyContent:"center"}}>
                    <TextInput
                        {...props}
                        style={{ paddingLeft: Scales.deviceWidth*0.012,top:Scales.deviceHeight*0.02,textAlignVertical:"center",color:"#3c3c3c", fontSize:Scales.moderateScale(12) }}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                    />

                </View>
                <View style={{ borderWidth: 0.8, backgroundColor: "#4438a5",  borderColor: this.state.focus ? "#4438a5" : '#b1b1b1', width: Scales.deviceWidth * 0.95 }}></View>
            </View>
        );
    }
}


