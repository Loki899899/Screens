import React, { Component } from 'react';
import { View, Image, Text, AsyncStorage, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'
import PostFetch from '../../ajax/PostFetch'
import Modal from 'react-native-modal'
import { Scales } from "@common"
import moment from "moment"
import Toast from 'react-native-simple-toast';

export default class Jobs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.data.job_status,
            modal_visible: false,
            modal_data: {},
            setValue: false,
            list: [],
            show_loader: false,
            date_format: "YYYY/MM/DD"

        }




    }

    ActiveDisableStatus = async (isON, Key) => {
        this.setState({ show_loader: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "job_id": Key
        }
        const json = await PostFetch("activateDeactivateJOB", payload, headers)
        // console.log(json)
        if (json != null) {
            if (json.error == 0) {
                // console.log(json.data.job_status, ":::::")

                this.setState({
                    value: json.data.job_status
                })
                // console.log(this.state.value, "value")


            }
            else {
                alert(json.message)
            }
        }


        this.setState({ show_loader: false })

    }

    Renew_job = async () => {
        this.setState({ show_loader: true })
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "job_id": this.state.modal_data.job_id
        }
        const json = await PostFetch("renew-job", payload, header)

        if (json != null) {
            if (json.error == 0) {
                Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
                // alert(json.message)
                this.setState({
                    modal_data: {},
                    modal_visible: false
                })
            }
            else {
                Toast.showWithGravity(json.message, Toast.SHORT, Toast.BOTTOM);
            }
        }

        this.setState({ show_loader: false })
    }

    Show_Pop = (data) => {
        this.setState({
            modal_visible: true,
            modal_data: data
        })
    }

    Click_Evaluate = async () => {
        await this.setState({ modal_visible: false })
        this.props.navigation.navigate('evaluation', { "job_id": this.props.data.job_id })
    }
    Click_Track = async () => {
        await this.setState({ modal_visible: false })
        this.props.navigation.navigate('track', { "job_id": this.props.data.job_id, "job_title": this.props.data.job_title, previous_screen: "jobs" })
    }

    componentDidMount = async () => {
        // let date_format =   await AsyncStorage.getItem('date_format')
        // if(date_format == null){
        //     this.setState({date_format:"YYYY/MM/DD"})
        // }
        // else{
        //     this.setState({date_format:date_format})
        // }
        this.setState({ value: this.props.data.job_status })

        // console.log(typeof(this.props.data.job_status), "MMMMM", this.state.value, "https://testing.jobma.com:8090/")
        // console.log(this.state.value )

    }

    componentWillReceiveProps = () => {

        //console.log("this is compoent did moint wokirng ar reeresh")
        this.setState({ value: this.props.data.job_status })
    }

    render() {
        let posted_date = moment(this.props.data.create_date).format(this.props.date_format)
        let expired_date = moment(this.props.data.expiry_date).format(this.props.date_format)
        let value = this.state.value == "1" ? true : this.state.value == "0" ? false : null
        let opaci = this.state.value == "1" ? true : this.state.value == "0" ? false : null
        let expired = false
        let expired_date_check = this.props.data.expiry_date



        // console.log(moment(), "new Date()new Date()")
        // console.log(moment(expired_date_check), "this.props.data.expiry_datethis.props.data.expiry_datethis.props.data.expiry_date")
        // console.log((moment() > (moment(expired_date_check))), "----------date -----------")
        // if(this.props.data.job_title=="Min III"){
        //     console.log(this.props.data.job_title)
        //     console.log("y------------------es")
        //     console.log(moment(), "new Date()new Date()")
        // console.log(moment(expired_date_check), "this.props.data.expiry_datethis.props.data.expiry_datethis.props.data.expiry_date")
        // console.log((moment() > (moment(expired_date_check))), "----------date -----------")
        // }
        if (moment() > moment(expired_date_check).add(1, "days")) {

            expired = true
            // value = false
            opaci = false
            // console.log(expired)
        }


        return (<React.Fragment>
            <View key={this.props} style={{ flex: 1, flexDirection: 'column', marginTop: 10, }}>
                <View style={{
                    width: Scales.deviceWidth * 0.95, minHeight: Scales.deviceHeight * 0.185, alignSelf: 'center', backgroundColor: '#3d3d46', elevation: 9, borderRadius: 10, shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 2,
                }}>
                    <View style={{ width: Scales.deviceWidth * 0.95, paddingTop: Scales.deviceHeight * 0.01, paddingLeft: Scales.deviceWidth * 0.028, flexDirection: 'row', opacity: opaci == true ? 1 : 0.3, }}>
                        <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: 'row' }}>
                            <Text style={{ fontSize: Scales.moderateScale(18), fontFamily: 'roboto-medium', textTransform: "capitalize", color: "#ffffff" }}>{this.props.data.job_title}</Text>{expired ? <Text style={{ fontFamily: "roboto-regular", textAlignVertical: "top", color: 'red', fontSize: Scales.moderateScale(8) }}>(Expired)</Text> : null}
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.15, alignItems: "center", justifyContent:'space-between', flexDirection:'row',}}>
                            <ToggleSwitch
                                isOn={value}
                                onColor={expired ? "#9d9d9d" : "#13d7a6"}
                                offColor="#9d9d9d"
                                disabled={this.state.show_loader}
                                key={this.props.data.id}
                                size="small"
                                thumbOffStyle={{
                                    backgroundColor:'#2d2d3a'
                                }}
                                thumbOnStyle={{
                                    backgroundColor:'#2d2d3a'
                                }}
                                onToggle={(isOn) => this.ActiveDisableStatus(isOn, this.props.data.job_id)}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('menu')
                                }}
                            >
                            <Image
                                source={require('./../../assets/JobmaIcons/3dot-nav.png')}
                                style={{width:10, height:10, }}
                                resizeMode='contain'
                            ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ width: Scales.deviceWidth * 0.95, minHeight: Scales.deviceHeight * 0.04, flexDirection: 'row', opacity: opaci == true ? 1 : 0.3, paddingLeft: Scales.deviceHeight * 0.01, alignItems:'flex-end' }}>
                        <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: 'row', alignItems: 'center', padding: Scales.deviceWidth * 0.005,  }}>
                            <Image source={require('../../assets/Images/job_listing/person.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.03 }} />
                            <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: Scales.deviceWidth * 0.015, color: "#ffffff" }}>Recruiter name: <Text style={{ fontFamily: 'roboto-medium', }}>{this.props.data.catcher.fname} {this.props.data.catcher.lname}</Text></Text>
                        </View>

                        {/*PROVIDED COMPONENT FOR POPUP MENU*/}
                        {/* <View style={{ width: Scales.deviceWidth * 0.18, flexDirection: 'column', alignItems: 'center', opacity: opaci == true ? 1 : 0.8 }}>

                            {this.state.value == 1 ? <Text style={{ fontFamily: 'roboto-regular', color: 'green', fontSize: Scales.moderateScale(10) }}>Active</Text> : <Text style={{ fontFamily: 'roboto-regular', color: 'red', fontSize: Scales.moderateScale(10) }}>In-active</Text>}

                            <TouchableOpacity onPress={() => this.Show_Pop(this.props.data)}>
                                <View>
                                    <Image source={require('../../assets/Images/job_listing/option.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.06, height: Scales.deviceHeight * 0.02 }} />
                                </View>
                            </TouchableOpacity>

                        </View> */}

                        <View>

                        </View>

                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.03, flexDirection: 'row', alignItems: 'center', padding: Scales.deviceWidth * 0.002, opacity: opaci == true ? 1 : 0.3, paddingLeft: Scales.deviceWidth * 0.03 }}>

                        <Image source={require('../../assets/Images/job_listing/public.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.03 }} />
                        <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: Scales.deviceWidth * 0.015, color: "#8b8b8b", }}>Posted on: <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: Scales.deviceWidth * 0.015 }}>{posted_date} </Text> </Text>
                        <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: Scales.deviceWidth * 0.015, color: "#8b8b8b" }}>Expiry date: <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: Scales.deviceWidth * 0.015 }}>{expired_date}</Text> </Text>


                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.03, flexDirection: 'row', alignItems: 'center', opacity: opaci == true ? 1 : 0.3, paddingLeft: Scales.deviceWidth * 0.03 }}>

                        <Image source={require('../../assets/Images/job_listing/approval.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.03, height: Scales.deviceHeight * 0.03 }} />
                        <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(12), left: Scales.deviceWidth * 0.015, color: "#8b8b8b" }}>Job approval</Text>
                        {this.props.data.approval == "1" ? <Image source={require('../../assets/Images/job_listing/watch1.png')} style={{ resizeMode: 'contain', width: Scales.deviceWidth * 0.04, height: Scales.deviceHeight * 0.03, left: Scales.deviceWidth * 0.065 }} /> : null}



                    </View>

                    <View style={{flexDirection: 'row', paddingLeft: '3%', opacity: opaci == true ? 1 : 0.3, }}>

                        <View style={{ backgroundColor: '#52526c', borderRadius: 10, flexDirection:'row', padding:4, marginLeft:4, }}>
                            <View style={{ backgroundColor:'#ffffff' , height:Scales.deviceHeight * 0.018, width:Scales.deviceWidth * 0.032, justifyContent:'center', borderRadius:5,}}>
                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", borderRadius:5,  }}>{this.props.data.applicants}</Text>
                            </View>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ffffff", marginLeft:2 }}>Applicants</Text>

                        </View>
                        <View style={{ backgroundColor: '#52526c', borderRadius: 10, flexDirection:'row', padding:4, marginLeft:4, }}>
                            <View style={{ backgroundColor:'#ffffff' , height:Scales.deviceHeight * 0.018, width:Scales.deviceWidth * 0.032, justifyContent:'center', borderRadius:5,}}>
                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", borderRadius:5,  }}>{this.props.data.invited}</Text>
                            </View>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ffffff", marginLeft:2 }}>Invited</Text>

                        </View>
                        <View style={{ backgroundColor: '#52526c', borderRadius: 10, flexDirection:'row', padding:4, marginLeft:4, }}>
                            <View style={{ backgroundColor:'#ffffff' , height:Scales.deviceHeight * 0.018, width:Scales.deviceWidth * 0.032, justifyContent:'center', borderRadius:5,}}>
                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", borderRadius:5,  }}>{this.props.data.selected}</Text>
                            </View>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ffffff", marginLeft:2 }}>Selected</Text>

                        </View>
                        <View style={{ backgroundColor: '#52526c', borderRadius: 10, flexDirection:'row', padding:4, marginLeft:4, }}>
                            <View style={{ backgroundColor:'#ffffff' , height:Scales.deviceHeight * 0.018, width:Scales.deviceWidth * 0.032, justifyContent:'center', borderRadius:5,}}>
                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", borderRadius:5,  }}>{this.props.data.hold}</Text>
                            </View>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ffffff", marginLeft:2 }}>On Hold</Text>

                        </View>
                        <View style={{ backgroundColor: '#52526c', borderRadius: 10, flexDirection:'row', padding:4, marginLeft:4, }}>
                            <View style={{ backgroundColor:'#ffffff' , height:Scales.deviceHeight * 0.018, width:Scales.deviceWidth * 0.032, justifyContent:'center', borderRadius:5,}}>
                            <Text style={{ fontSize: Scales.moderateScale(12), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c", borderRadius:5,  }}>{this.props.data.rejected}</Text>
                            </View>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', color: "#ffffff", marginLeft:2 }}>Rejected</Text>

                        </View>
                        
                        {/* <View style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.06, backgroundColor: '#52526c', borderRadius: 5 }}>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', paddingTop: Scales.deviceWidth * 0.015, color: "#ffa001" }}>APPLICANTS</Text>
                            <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.applicants}</Text>

                        </View> */}
                        {/* <View style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.06, backgroundColor: '#52526c', borderRadius: 5, }}>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', paddingTop: Scales.deviceWidth * 0.015, color: "#69d8ad" }}>SELECTED</Text>
                            <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.selected}</Text>

                        </View>

                        <View style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.06, backgroundColor: '#52526c', borderRadius: 5 }}>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', paddingTop: Scales.deviceWidth * 0.015, color: "#5eb442" }}>ON HOLD</Text>
                            <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.hold}</Text>

                        </View>

                        <View style={{ width: Scales.deviceWidth * 0.17, height: Scales.deviceHeight * 0.06, backgroundColor: '#52526c', borderRadius: 5, }}>
                            <Text style={{ fontSize: Scales.moderateScale(10), fontFamily: 'roboto-medium', textAlign: 'center', paddingTop: Scales.deviceWidth * 0.015, color: "#ff5367" }}>REJECTED</Text>
                            <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', textAlign: 'center', color: "#3c3c3c" }}>{this.props.data.rejected}</Text>

                        </View> */}

                    </View>
                </View>


                <Modal
                    isVisible={this.state.modal_visible}

                    onBackButtonPress={() => this.setState({ modal_visible: false })}
                >
                    <View style={{ flex: 1, justifyContent: "center" }}>

                        <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.30, backgroundColor: 'white', elevation: 1, alignSelf: "center", borderRadius: 10, borderTopWidth: 4, borderColor: "#564db3", }}>

                            <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.055, alignSelf: "center", alignItems: "center" }}>
                                <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(18), fontFamily: "roboto-medium", color: "#3c3c3c" }}>Jobma Hire</Text>
                                <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(10), fontFamily: "roboto-regular", color: "#3c3c3c" }}>Select an action</Text>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.185, paddingTop: Scales.deviceHeight * 0.015, alignItems:'center' }}>
                                {this.state.value == 1 ? <TouchableOpacity activeOpacity={1} onPress={this.Renew_job}><View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.04, borderWidth: 0.5, borderColor: 'black', justifyContent: "center" }} >
                                    <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular", color: "#3c3c3c" }}>Renew Job</Text>
                                </View></TouchableOpacity> : null}

                                <TouchableOpacity activeOpacity={1} onPress={this.Click_Track}><View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.04, justifyContent: "center", borderColor: 'black', borderBottomWidth: 0.5, borderLeftWidth: 0.5, borderTopWidth: this.state.value == 1 ? 0 : 0.5, borderRightWidth: 0.5, borderBottomWidth: 0.5 }} >
                                    <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular", color: "#3c3c3c" }}>Track</Text>

                                </View></TouchableOpacity>

                                <TouchableOpacity activeOpacity={1} onPress={this.Click_Evaluate}><View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.04, justifyContent: "center", borderColor: 'black', borderBottomWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, borderBottomWidth: 0.5 }} >
                                    <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular", color: "#3c3c3c" }}>Evaluate</Text>

                                </View></TouchableOpacity>

                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ modal_visible: false })}><View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.04, justifyContent: "center", borderColor: 'black', borderBottomWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, borderBottomWidth: 0.5 }} >
                                    <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(12), fontFamily: "roboto-regular", color: "#3c3c3c" }}>Cancel</Text>

                                </View></TouchableOpacity>


                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.06, }}>
                                <Image source={require('../../assets/Images/bg-image.png')} style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.058, }} />
                            </View>

                        </View>


                    </View>



                </Modal>
                <Modal isVisible={this.state.show_loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>
            </View>
        </React.Fragment>)
    }
}

