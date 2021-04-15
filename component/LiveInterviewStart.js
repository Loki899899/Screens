import React, { Component } from 'react';
import { View, Text,TextInput } from 'react-native';
import Header from "./DrawerHeader"
import { Scales } from "@common"

export default class LiveInterviewStart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor:"white" }}>
                <Header heading="Interview" left={Scales.deviceWidth*0.09} {...this.props} textalign='center' back={true} />
                <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.85, backgroundColor:"white" }}>
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.28, justifyContent: "flex-end" }}>
                        <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.23, alignSelf: "center", backgroundColor: "white", bottom: 10, elevation: 5, borderRadius: 10, padding: 10 }}>
                            <View><Text style={{ fontFamily: "roboto-medium", width: Scales.deviceWidth * 0.90, textAlign: "center", fontSize: Scales.moderateScale(16) }}>Important Instruction</Text></View>
                            <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.23, paddingTop: 10, paddingLeft: 10, paddingRight: 20 }}>
                                <Text style={{ fontFamily: "roboto-regular", width: Scales.deviceWidth * 0.90, textAlign: "left", fontSize: Scales.moderateScale(12) }}>{'\u2B24'}  Please make sure that your internet speed is at  {"\n"}     least 5 Mbps or higher</Text>
                                <Text style={{ fontFamily: "roboto-regular", width: Scales.deviceWidth * 0.90, textAlign: "left", fontSize: Scales.moderateScale(12) }}>{'\u2B24'}  If you have any issues while connecting then please {"\n"}     restart the app</Text>
                                <Text style={{ fontFamily: "roboto-regular", width: Scales.deviceWidth * 0.90, textAlign: "left", fontSize: Scales.moderateScale(12) }}>{'\u2B24'}  This interview can be recorded by the employer {"\n"}     without further notification</Text>

                            </View>

                        </View>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.08, alignSelf: "center", paddingTop:10 }}>
                        <Text style={{ fontFamily: "roboto-medium", width: Scales.deviceWidth * 0.90, textAlign: "center", fontSize: Scales.moderateScale(24) }}>Lets get started</Text>
                        <Text style={{ fontFamily: "roboto-regular", width: Scales.deviceWidth * 0.90, textAlign: "center", fontSize: Scales.moderateScale(8) }}>THIS WILL BE AN AMAZING EXPERIENCE</Text>
                    </View>

                    <View style={{width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08,paddingTop:10 }}>
                        <TextInput placeholderTextColor = {"#c7c7c7"}  placeholder={"Enter access token"} style={{width: Scales.deviceWidth * 0.90,fontFamily:"roboto-medium",backgroundColor:"#faf9fd",color:'black', paddingLeft:10,borderWidth:0.3,borderRadius:10, height: Scales.deviceHeight * 0.06,alignSelf:"center"}} />
                    </View>

                    <View style={{width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.45,justifyContent:"flex-end" }}>
                        <View style={{width: Scales.deviceWidth * 0.90,alignSelf:"center",borderRadius:15, height: Scales.deviceHeight * 0.06,backgroundColor:"#473ca8", justifyContent:"center"}}>
                        <Text style={{ fontFamily: "roboto-medium", width: Scales.deviceWidth * 0.90, textAlign: "center", fontSize: Scales.moderateScale(20), color:'white' }}>Start</Text>
                            
                        </View>

                    </View>
                </View>
            </View>
        )
    }
}