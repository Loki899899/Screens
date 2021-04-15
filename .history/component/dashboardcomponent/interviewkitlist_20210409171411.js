import React, { Component } from 'react';
import { View, Text, TextInput, Image, AsyncStorage, ActivityIndicator } from 'react-native'

import ToggleSwitch from 'toggle-switch-react-native'
import PostFetch from '../../ajax/PostFetch'
import { Scales } from "@common"
import Modal from "react-native-modal"
import moment from "moment"


export default class KitList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.data.is_active,
            show_loader: false,
            date_format: "YYYY/MM/DD"
        }
        // console.log(this.props.data.is_active, ";;;;;;;;;;;;;;;;;;;")

    }

    
    ActiveDisableStatus = async ( Key) => {
        this.setState({ show_loader: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "kit_id": Key
        }
        const json = await PostFetch("activateDeactivateKit", payload, headers)
        // console.log(json)

        if (json != null) {
            if (json.error == 0) {

                this.value = json.data.status==1?true:false
                this.setState({
                    
                    value: json.data.status == 1 ? true : false
                })
                // console.log(this.props)
                await this.props.UpdateKitStatus(this.props.data.id)

            }
            else {
                alert(json.message)
            }
        }


        this.setState({ show_loader: false })

    }

    componentDidMount = async () => {
        let date_format = await AsyncStorage.getItem('date_format')
    
        if (date_format == null) {
            this.setState({ date_format: "YYYY/MM/DD" })
        }
        else {
            this.setState({ date_format: date_format })
        }
        // console.log("this.sta")
        
        this.value = this.props.is_active==1?true:false
        let status = this.props.data.is_active == 0 ? false : true
        this.setState({ value: status })

    }

    render() {
        let expiry_date = new Date(this.props.data.updated_at)
        let get_date = expiry_date.getDate()
        let get_month = expiry_date.getMonth() + 1
        if (get_month < 10) {
            get_month = "0" + String(get_month)
        }
        if (get_date < 10) {
            get_date = "0" + String(get_date)
        }

        if (this.props.date_format == "DD/MM/YYYY") {

            // console.log(expiry_date.getMonth(), "----")

            expiry_date = get_date + "/" + get_month + "/" + String(expiry_date.getFullYear())

        }
        else if (this.props.date_format == "YYYY/MM/DD") {

            // console.log(expiry_date.getMonth(), "----")
            expiry_date = String(expiry_date.getFullYear()) + "/" + get_month + "/" + get_date

        }
        else if (this.props.date_format == "MM/DD/YYYY") {

            // console.log(expiry_date.getMonth(), "----")
            expiry_date = get_month + "/" + get_date + "/" + String(expiry_date.getFullYear())

        }
        else {
            expiry_date = String(expiry_date.getFullYear()) + "/" + get_month + "/" + get_date
        }
        if(this.props.data.title=="preeti"){
            console.log(this.state.value, "--value---pppppppppp")
        }
        this.value = this.props.data.is_active==1?true:false
        return (
            <React.Fragment>
                <View style={{ backgroundColor: '#3d3d46', marginTop: 10, flexDirection: 'column', width: Scales.deviceWidth * 0.95, alignSelf: 'center', borderRadius: 5,}}>
                    <View style={{ padding: Scales.deviceWidth*0.03, paddingBottom:0}}>
                    <View style={{ flexBasis: 25, width: Scales.deviceWidth * 0.90,  flexDirection: 'row', opacity: this.value==true ? 1 : 0.3 }}>
                        <Text style={{ fontFamily: 'roboto-medium', width: Scales.deviceWidth * 0.67, textTransform: "capitalize",color:"white",fontSize:Scales.moderateScale(13) }}>{this.props.data.title}</Text>
                        <View style={{ height: Scales.deviceHeight * 0.03, width: Scales.deviceWidth * 0.2, alignItems: 'flex-end', }}>
                            <ToggleSwitch
                                isOn={this.value}
                                onColor="#13d7a6"
                                offColor="#9d9d9d"
                                size="small"
                                thumbOffStyle={{
                                    backgroundColor:'#2d2d3a'
                                }}
                                thumbOnStyle={{
                                    backgroundColor:'#2d2d3a'
                                }}
                                onToggle={isOn => this.ActiveDisableStatus(this.props.data.id)}
                            />
                        </View>

                    </View>

                    {/* CREATED AT AND UPDATED DATE */}
                    <View style={{ height: Scales.deviceHeight * 0.04, width: Scales.deviceWidth * 0.85, flexDirection: 'row', paddingTop: Scales.deviceHeight*0.006, opacity: this.value==true ? 1 : 0.3 }}>
                        <View style={{ height: Scales.deviceHeight * 0.025, width: Scales.deviceWidth * 0.34, justifyContent: 'center' }}>
                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular",color:"#8b8b8b"}}>Created: {moment(this.props.data.created_at).format(this.props.date_format)}</Text>
                        </View>
                        <View style={{ height: Scales.deviceHeight * 0.025, width: Scales.deviceWidth * 0.34, justifyContent: 'center', marginLeft: Scales.deviceWidth * 0.01 }}>
                            <Text style={{ height: Scales.deviceHeight * 0.025, fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular",color:"#8b8b8b" }}>Updated: {expiry_date}</Text>

                        </View>
                        {/* <View style={{ height: Scales.deviceHeight * 0.02, width: Scales.deviceWidth * 0.20, justifyContent: 'center' }}>
                            <View style={{ height: Scales.deviceHeight * 0.02, width: Scales.deviceWidth * 0.13, alignSelf: 'flex-end', borderRadius: 5, backgroundColor: this.value==true ? '#ffdddc' : "#eeeeee", justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(10), color: this.value==true ? "green" : "#b9b9b9" }}>{this.value==true == 1 ? 'Active' : 'Inactive'}</Text>
                            </View>
                        </View> */}


                    </View>

                    {/* CREATED BY CATHCER NAME */}
                    <View style={{ height: Scales.deviceHeight * 0.02, width: Scales.deviceWidth * 0.80, flexDirection: 'row', opacity: this.value==true ? 1 : 0.3 }}>
                        <View style={{ height: Scales.deviceHeight * 0.02, width: Scales.deviceWidth*0.90, justifyContent: 'center' }}>
                            <Text style={{ fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.025, fontFamily: "roboto-regular",color:"#8b8b8b" }}>Created by: {this.props.data.catcher_name}</Text>
                        </View>
                    </View>
                    </View>

                    {/* NO OF QUESTIONS AND DIFFERENT TYPES OF QUESTION NUMBERS WITH ICONS */}
                    <View style={{ flexDirection: 'row', height: Scales.deviceHeight * 0.04, width: Scales.deviceWidth * 0.95, backgroundColor: '#52526c', flexDirection: 'row', marginTop: Scales.deviceHeight * 0.015, alignItems: "center", borderBottomRightRadius: 5, borderBottomLeftRadius:5, opacity: this.value == true ? 1 : 0.3 }}>
                        <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>

                            <View style={{  height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>

                                <View style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}>
                                    <Image source={require('../../assets/Images/essay1.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.02, }} />
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }} >{this.props.data.essay}</Text>
                                </View>
                                <View style={{ borderRightWidth: 1, height: Scales.deviceHeight * 0.03, borderColor: "#c8c8c8", alignSelf: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}></View>

                            </View>

                            <View style={{ height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>

                                <View style={{ height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}>
                                    <Image source={require('../../assets/Images/slide1.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.02, }} />
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }} >{this.props.data.slide}</Text>
                                </View>
                                <View style={{ borderRightWidth: 1, height: Scales.deviceHeight * 0.03, borderColor: "#c8c8c8", alignSelf: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}></View>


                            </View>



                            <View style={{ width: "20%", height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>

                                <View style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}>
                                    <Image source={require('../../assets/Images/mcq1.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.02, }} />
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }} >{this.props.data.mcq}</Text>
                                </View>
                                <View style={{ borderRightWidth: 1, height: Scales.deviceHeight * 0.03, borderColor: "#c8c8c8", alignSelf: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}></View>


                            </View>








                            <View style={{ width: "20%", height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>

                                <View style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}>
                                    <Image source={require('../../assets/Images/video.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.02, }} />
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }} >{this.props.data.video}</Text>
                                </View>

                                <View style={{ borderRightWidth: 1, height: Scales.deviceHeight * 0.03, borderColor: "#c8c8c8", alignSelf: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}></View>


                            </View>

                            <View style={{ width: "20%", height: Scales.deviceHeight * 0.04, flexDirection: 'row' }}>

                                <View style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}>
                                    <Image source={require('../../assets/Images/audio.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.05, height: Scales.deviceHeight * 0.02, }} />
                                </View>
                                <View style={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', color: "#3c3c3c", fontSize: Scales.moderateScale(14) }} >{this.props.data.audio}</Text>
                                </View>

                            </View>



                        </View>



                        {/* <View style={{ width: Scales.deviceWidth * 0.30, height: Scales.deviceHeight * 0.04, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'white', }}>
                            <View style={{ width: Scales.deviceWidth * 0.30, height: Scales.deviceHeight * 0.04, justifyContent: 'space-evenly', alignItems: 'flex-end', paddingBottom: 5, flexDirection: 'row' }}>

                                <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.03, borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderColor: "#ff5569" }}>
                                    <Image source={require('../../assets/Images/preview.png')} />

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.03, borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderColor: "#72b1f1" }}>
                                    <Image source={require('../../assets/Images/setupaninterview.png')} />

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.03, borderWidth: 1, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderColor: "#8f6fe3" }}>
                                    <Image source={require('../../assets/Images/redirecttowebsite.png')} />

                                </View>

                            </View>

                        </View> */}
                    </View>

                </View>
                <Modal isVisible={this.state.show_loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>

            </React.Fragment>
        )
    }
}