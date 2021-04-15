import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, AsyncStorage, Image, ImageBackground, ActivityIndicator, SafeAreaView, Keyboard } from 'react-native';
import Header from '../DrawerHeader';
import { CheckBox } from 'react-native-elements'
import PostFetch from '../../ajax/PostFetch'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import Modal from "react-native-modal"
import { Scales } from "@common"
import Toast from 'react-native-simple-toast';
import { LinearGradient } from 'expo-linear-gradient';



import KeyboardDoneButton from '../KeyBoard'




export default class CreateJob extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            title: null,
            date: null,
            job_desc: null,
            modalvisible: false,
            public: 0,
            expired_date_modal: false,
            modal_title_error: false,
            show_toast_title: false,
            show_toast_date: false,
            modal_title_error_1: false,
            show_toast_msg: false,
            error: "",
            date_format: "YYYY/DD/MM", loading: false
        }
    }

    RestState = () => {
        this.setState({
            checked: false,
            title: null,
            date: null,
            job_desc: null,
            modalvisible: false,
            public: 0,
            expired_date_modal: false,
            modal_title_error: false,
            show_toast_title: false,
            show_toast_date: false,
            modal_title_error_1: false,
            show_toast_msg: false,
            error: ""
        })
    }

    show_calender = () => {
        this.setState({
            modalvisible: true, show_toast_date: false
        })
    }

    Create_job = async () => {
        try {
            this.setState({ loading: true })
            if (this.state.title == null||(/^[\s/]*$/g).test(this.state.title)||this.state.title=="") {
                this.setState({ show_toast_title: true, loading: false })
                return 0
            }
            if (this.state.date == null) {
                this.setState({ show_toast_date: true, loading: false })
                return 0
            }
            if (this.state.job_desc == null||(/^[\s/]*$/g).test(this.state.job_desc)||this.state.job_desc=="") {
                this.setState({ show_toast_msg: true, loading: false })
                return 0
            }

            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Key': await AsyncStorage.getItem('token')
            };

            let date = this.state.date
            date = moment.utc(date).format("MM/DD/YYYY")

            if (this.state.title == null) {
                this.setState({ modal_title_error: true, loading: false })
                return 0
            }

            let payload = {

                "title": this.state.title,
                "expirydate": date,
                "description": this.state.job_desc,
                "public": this.state.public

            }

            const json = await PostFetch("create-job", payload, headers)
            if (json != null) {
                // console.log(json, "-----------------create job-----------------")
                if (json.error == 0) {

                    this.props.navigation.state.params.Get_jobs()
                    //    this.setState({modal_title_error:true})

                    Toast.showWithGravity("Job Created Successfully", Toast.SHORT, Toast.BOTTOM);
                    this.props.navigation.navigate('mid_setup_interview', { select_job: { "id": json.data.job_id }, _clear_data: this._clear_data, ResetState: this.RestState, "dash": this.props.navigation.state.params.dash })

                }
                else {
                    alert(json.message)
                }


            }
            // else {
            //     alert("Something Went Wrong !!!")
            // }
            this.setState({ loading: false })
        }
        catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }

    }
    _clear_data = () => {

        this.setState({
            checked: false,
            title: null,
            date: null,
            job_desc: null,
            modalvisible: false,
            public: 0,
            expired_date_modal: false,
            modal_title_error: false,
            show_toast_title: false,
            show_toast_date: false,
            modal_title_error_1: false,
            show_toast_msg: false,
            error: ""
        })
    }
    OnOKs = () => {

        this.setState({ modal_title_error_1: false })

    }

    ChangeDescText = (text) => {
        try {
            if (text.length == 0) {
                this.setState({ job_desc: null, show_toast_msg: false })
                return 0
            }
            this.setState({ job_desc: text, show_toast_msg: false })
        }
        catch (err) {
            console.log(err)
        }

    }


    ChangeText = (text) => {

        this.setState({ title: text, show_toast_title: false })

    }

    OnOK = () => {
        this.setState({ modal_title_error: false })
        this.props.navigation.navigate('fourthscreen')
    }

    select_date = async () => {

        await this.setState({ checked: !this.state.checked })
        if (this.state.checked == true) {
            this.setState({
                public: 1
            })
        }
        else {
            this.setState({
                public: 0
            })
        }
    }

    onDateChange = (date) => {

        try {
            let select_dates = moment(date)
            

            let today = moment()
            if (today >select_dates) {
                //    this.setState({modal_title_error_1:true,error:"please select the valid date"})
                Toast.showWithGravity("please select the valid date", Toast.SHORT, Toast.BOTTOM);

                return 0;
            }

            this.setState({
                modalvisible: false,
                date: date
            })
        }
        catch (err) {
            console.log(err)
        }

    }

    componentDidMount = async () => {
        try {
            let date_format = await AsyncStorage.getItem('date_format')
            if (date_format == null) {
                this.setState({ date_format: "YYYY/MM/DD" })
            }
            else {
                this.setState({ date_format: date_format })
            }
        }
        catch (err) {
            console.log(err)
        }
        console.log(Scales.deviceHeight * 0.103, "scamflasml")
    }



    render() {
        let select_date_head = this.state.date == null ? 'Select Date ( Job Expiration Date)' : String(moment(this.state.date).format(this.state.date_format)).slice(0, 10)
        // console.log(select_date_head, "redner date")
        let backfunc = [this.props.navigation.state.params.Get_jobs]
        let buttonidsable = this.state.title != null && this.state.date != null && this.state.job_desc != null ? false : true
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardDoneButton style={{flex:1}} />

                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Header heading="Create Job" {...this.props} textalign='left' backfunc={backfunc} width={Scales.deviceWidth * 0.50} left={Scales.deviceWidth*0.20} back={true} />
                    <View style={{ flex: 1, flexDirection: "column", backgroundColor: 'white' }}>
                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.103, justifyContent: "flex-end" }}>
                            <TextInput  placeholderTextColor={"#c7c7c7"} placeholder={"Enter Job Title"} onChangeText={(text) => this.ChangeText(text)} value={this.state.title} style={{ paddingLeft: Scales.deviceWidth * 0.04, width: Scales.deviceWidth * 0.90, alignSelf: 'center', borderRadius: 5, height: Scales.deviceHeight * 0.064, fontFamily: "roboto-medium", borderWidth: 0.5, fontSize: Scales.moderateScale(12), backgroundColor: "#faf9fd", borderColor: "#c7c7c7",color:"#3c3c3c" }} />

                        </View>
                        {this.state.show_toast_title ?
                            <View style={{ justifyContent: "flex-end",height: Scales.deviceHeight * 0.05 }}>
                                <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-end", right: Scales.deviceWidth * 0.06, }}>
                                    <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.012 }}>
                                        <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), color: "white", }}>{"Enter a job title"}</Text>
                                    </View>

                                    <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                                    <TouchableOpacity onPress={() => this.setState({ show_toast_title: false })}>
                                        <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                                            <Image source={require("../../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                                        </View></TouchableOpacity>
                                </View>
                            </View>
                            : null}

                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08, justifyContent: "flex-end", }}>
                            {/* <TextInput placeholderTextColor = {"#c7c7c7"}  onChangeText={(text) => this.setState({ date: text })} placeholder={"Select Date ( Job Expiration Date)"} style={{ paddingLeft: 20, width: "90%", alignSelf: 'center', borderRadius: 5, height: 50, fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> */}
                            <TouchableOpacity onPress={this.show_calender}><View style={{ width: Scales.deviceWidth * 0.90, borderRadius: 5, height: Scales.deviceHeight * 0.064, borderWidth: 0.5, alignSelf: 'center', justifyContent: 'center', backgroundColor: this.state.date == null ? "#faf9fd" : "green", borderColor: "#c7c7c7" }}>
                                <Text style={{ paddingLeft: Scales.deviceWidth*0.05, fontFamily: 'roboto-regular', color: this.state.date == null ? "#c7c7c7" : "white",fontSize:Scales.moderateScale(12) }}>{select_date_head}</Text>
                            </View></TouchableOpacity>
                        </View>

                        {this.state.show_toast_date ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-end", right: Scales.deviceWidth * 0.06, marginTop: 5 }}>
                            <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.02 }}>
                                <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), color: "white", fontSize: Scales.moderateScale(12) }}>{"Choose a expiration date"}</Text>
                            </View>

                            <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                            <TouchableOpacity onPress={() => this.setState({ show_toast_date: false })}>
                                <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                                    <Image source={require("../../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                                </View></TouchableOpacity>
                        </View> : null}

                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.17,  justifyContent: "flex-end" }}>
                            <TextInput placeholderTextColor = {"#c7c7c7"} onSubmitEditing={()=>Keyboard.dismiss()}   returnKeyLabel={"done"} returnKeyType="done" multiline={true} placeholder={"Job Description"} onChangeText={(text) => this.ChangeDescText(text)} value={this.state.job_desc} style={{ paddingLeft: Scales.deviceWidth * .05, textAlignVertical: "top", fontSize: Scales.moderateScale(12), width: Scales.deviceWidth * 0.90, alignSelf: 'center', borderRadius: 5, height: Scales.deviceHeight * 0.15, fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7",color:"#3c3c3c" }} />

                        </View>

                        {this.state.show_toast_msg ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-end", right: Scales.deviceWidth * 0.06, marginTop: 5 }}>
                            <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                                <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), color: "white", fontSize: Scales.moderateScale(12), }}>{"Enter a job description"}</Text>
                            </View>

                            <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>


                            <TouchableOpacity onPress={() => this.setState({ show_toast_msg: false })}>
                                <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                                    <Image source={require("../../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                                </View></TouchableOpacity>
                        </View> : null}

                        <View style={{ width: Scales.deviceWidth*0.90,alignSelf:"center", flexDirection: 'row', height: Scales.deviceHeight * 0.05, }}>
                            <View style={{  justifyContent: "center", height: Scales.deviceHeight * 0.05, }}>
                                <CheckBox
                                    size={Scales.moderateScale(22)}
                                    checked={this.state.checked}
                                    
                                    onIconPress={() => this.setState({ checked: !this.state.checked })}
                                    wrapperStyle={{width: Scales.deviceWidth*0.05,alignSelf:'flex-start',height:Scales.deviceHeight * 0.04,}}
                                    containerStyle={{width: Scales.deviceWidth*0.08,height:Scales.deviceHeight * 0.04,justifyContent:'center',alignSelf:"flex-start" }}
                                    checkedColor="#3c3c3c"
                                />
                            </View>

                            <View style={{ height: Scales.deviceHeight * 0.05, justifyContent: "center", }}>
                                <Text style={{ textAlign: 'center', fontFamily: "roboto-regular", color: "#c7c7c7", fontSize: Scales.moderateScale(14) }}>Public</Text>
                            </View>

                        </View>

                        <View style={{ width: Scales.deviceWidth*1.0, height: Scales.deviceHeight * 0.13, justifyContent: "center" }}>
                            <TouchableOpacity disabled={this.state.loading} onPress={this.Create_job}>
                                <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.064, backgroundColor: "#4b40aa", alignSelf: 'center', borderRadius: 10, justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", fontFamily: 'roboto-bold', fontSize: Scales.moderateScale(20), color: "white" }}>
                                    Create
                            </Text>
                            </View></TouchableOpacity>

                        </View>
                    </View>
                    <Modal isVisible={this.state.loading}>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                        </View>

                    </Modal>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        isVisible={this.state.modalvisible}
                        onRequestClose={() => this.setState({ modalvisible: false })}

                    >

                        <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.42, borderRadius: 10, alignSelf: "center", backgroundColor: 'white' }}>
                           
                                <View style={{ height: Scales.deviceWidth * 0.10, justifyContent: "center", alignSelf: "flex-end", right: Scales.deviceWidth*0.02 }} >
                                    <TouchableOpacity onPress={() => this.setState({ modalvisible: !this.state.modalvisible })}>
                                        <View style={{ height: Scales.deviceWidth * 0.10 ,justifyContent:"center"}}>
                                            <Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ minHeight: Scales.deviceWidth * 0.32,}}>
                                    <CalendarPicker
                                        onDateChange={(date) => this.onDateChange(date)}
                                        todayBackgroundColor="blue"
                                        selectedDayColor="#7300e6"
                                        selectedDayTextColor="#FFFFFF"
                                        enableSwipe={true}
                                         //minDate={moment().add(1, "days")}
                                        width={Scales.deviceWidth * 0.75}
                                    />
                                </View>

                         
                        </View>


                    </Modal>


                    <Modal visible={this.state.modal_title_error} transparent={false} style={{ width: "100%", height: 100, alignSelf: "flex-start", right: 25 }}  >
                        <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", backgroundColor: "transparent" }}>

                            <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.35, borderRadius: 10, opacity: 1, alignSelf: "center", }}>
                                <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.25, paddingTop: 5 }}>
                                    <Image source={require("../../assets/Images/create_job_icon.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.18, alignSelf: 'center', paddingTop: 15 }} />
                                    <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textAlign: "center", }}>Job has been created {"\n"} Successfully!</Text>

                                </View>

                                <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, }}>
                                    <ImageBackground source={require("../../assets/Images/big_bg.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10 }}>
                                        <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, paddingTop: 5 }}>
                                            <TouchableOpacity onPress={() => this.OnOK()}><LinearGradient style={{ width: Scales.deviceWidth * 0.20, height: Scales.deviceHeight * 0.05, borderRadius: Scales.deviceHeight * 0.01, alignSelf: "center" }} colors={["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"]}><View style={{ width: Scales.deviceWidth * 0.20, justifyContent: "center", height: Scales.deviceHeight * 0.05, borderRadius: Scales.deviceHeight * 0.01, alignSelf: "center" }}>
                                                <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textAlign: "center", color: "white" }}>Ok</Text>
                                            </View></LinearGradient></TouchableOpacity>

                                        </View>
                                    </ImageBackground>

                                </View>
                            </View>



                        </View>
                    </Modal>

                    <Modal visible={this.state.modal_title_error_1} transparent={true}


                    >
                        <View style={{ backgroundColor: "transparent", width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", }}>
                            <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.16, borderRadius: 10, opacity: 1, alignSelf: "center" }}>


                                <View style={{}}>
                                    <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', paddingTop: Scales.deviceHeight * 0.02, fontSize: 16 }}>{this.state.error}</Text>


                                    <View style={{ width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => this.OnOKs()}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, backgroundColor: 'blue', alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                                        </View></TouchableOpacity>
                                    </View>
                                </View>


                            </View>


                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        )
    }
}
