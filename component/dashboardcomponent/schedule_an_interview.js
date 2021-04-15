import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage, Image, FlatList, TextInput, BackHandler, SafeAreaView } from 'react-native';
import Header from '../DrawerHeader';
import { Scales } from "@common"
import Joblist from "./SearchJobList"
import Toast from 'react-native-simple-toast';
import { URL } from "../../ajax/PostFetch"


export default class SetupInterview extends Component {

    constructor(props) {
        super(props)
        this.state = {
            picker_data: [],
            selected_item: '',
            button_disable: true,
            dash: false,
            show_toast: false,
            toast_message: '',
            showlist: false,
            refreshing: false,
            select_job_name: ''
        }

        this.Get_jobs = this.Get_jobs.bind(this);
        this.Get_jobs()

        // console.log("----------------------_COnstrictr+++++++++++++++++++++++++++")


    }



    Get_jobs = async () => {
        this.setState({ refreshing: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        // console.log("=======================GET JOSBS +++++++++++++++++++++++++++++++++++==")

        await fetch(URL.api_url + "interview-job-list", {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((resp) => {
                //   console.log(resp)

                let picker_datas = []
                for (let job of resp.data) {

                    let context = {
                        "id": job.jobma_job_post_id,
                        "name": job.jobma_job_title
                    }

                    picker_datas.push(context)
                }
                if (resp.error == 0) {
                    picker_datas = picker_datas.reverse()
                    this.setState({
                        picker_data: picker_datas,
                        fixed_job_list: picker_datas
                    })
                }
                else {
                    alert(resp.message)
                }
            })
            .catch((err) => {
                // console.error(err)
            })


        this.setState({ refreshing: false })

    }

    componentDidMount = async () => {
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        // console.log("----------this.props.navigation.state.params.dash -------", this.props.navigation.state.params )
        let ppd = false
        try {
            ppd = this.props.navigation.state.params.dash == true ? true : false
        }
        catch {
            ppd = false
        }

        if (ppd == true) {
            this.setState({ dash: true })
        }
        else {
            this.setState({ dash: false })
        }

        let sub_status = await AsyncStorage.getItem("subscription_status")
        let stopStatus = await AsyncStorage.getItem('StopByAdmin')

        console.log(sub_status, "-----Subsc Status-----")
        if (JSON.parse(sub_status) == 0 || JSON.parse(sub_status) == 3) {
            Toast.showWithGravity("Your subscription has been paused.Please refer website to activate it.", Toast.LONG, Toast.BOTTOM)
        }
        if (JSON.parse(stopStatus) == 2 ) {
            Toast.showWithGravity("Your subscription has been paused.Please refer website to activate it.", Toast.SHORT, Toast.BOTTOM)
            return 0
        }

    }

    RestState = async () => {
        // console.log(",-------------------------------Reset State job -----------------")
        await this.setState({
            picker_data: [],
            selected_item: '',
            button_disable: true,
            show_toast: false,
            toast_message: '',
            select_job_name: "",
            showlist:false
        })
        this.Get_jobs()
    }

    _search_picker = (text) => {

        if (text.length == 0) {
            this.setState({
                button_disable: true,
                selected_item: ''
            })
        }

    }
    _clear_data = () => {
        this.setState({
            button_disable: true,
            selected_item: '',
            select_job_name: ''
        })
    }

    Go_to_next = async () => {
        let sub_status = await AsyncStorage.getItem("subscription_status")
        let stopStatus = await AsyncStorage.getItem('StopByAdmin')
        console.log(sub_status, "-----Subsc Status-----")
        if (JSON.parse(sub_status) == 0 || JSON.parse(sub_status) == 3) {
            Toast.showWithGravity("Your subscription has been paused.Please refer website to activate it.", Toast.SHORT, Toast.BOTTOM)
            return 0
        }
        if (JSON.parse(stopStatus) == 2 ) {
            Toast.showWithGravity("Your subscription has been paused.Please refer website to activate it.", Toast.SHORT, Toast.BOTTOM)
            return 0
        }
        let permission = await AsyncStorage.getItem("permission")
        // console.log(permission(item=>"1"==item), "-------permission-----")
        permission = JSON.parse(permission)
        // console.log(permission.length)
        // console.log(permission.indexOf("1"))
        if (permission[0] != "") {
            if (permission.indexOf("3") == -1) {
                Toast.showWithGravity("You don't have permission to perform this action! Please Contact Main User.", Toast.SHORT, Toast.BOTTOM);
                // this.props.navigation.goBack()
                return 0
            }
        }

        if (this.state.selected_item == '') {
            this.setState({
                show_toast: true,
                toast_message: 'Select a job.'
            })
        }
        else {
            this.props.navigation.navigate('mid_setup_interview', { _clear_data: this._clear_data, select_job: this.state.selected_item, ResetState: this.RestState, Get_jobs: this.Get_jobs() })
        }

    }


    SelectData = (item) => {
        this.setState({ selected_item: item, showlist: false, select_job_name: item.name })
    }

    searchJobFilterFunction = (text) => {

        this.setState({
            showlist: true, select_job_name: text
        })
        try {
            if (text.length != 0) {

                const newData = this.state.fixed_job_list.filter(item => {

                    const itemData = item.name.toLowerCase()
                    const textData = text.toLowerCase()


                    var b = itemData.match(textData)


                    if (itemData.match(textData)) {


                        return item;

                    }


                });


                this.setState({ picker_data: newData });

            }
            else {
                this.setState({ picker_data: this.state.fixed_job_list })
            }
        }
        catch (err) {
            console.log(err)
        }



    };


    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // }
    // navigationButtonPressed({ buttonId }) {
    //     this.handleBackPress();
    // }

    // handleBackPress = () => {
    //     //Custom logic

    //     this.RestState()
    //     //    console.log(this.props.navigation.state.params.dash)
    //     this.setState({ dash: false })
    //     this.props.navigation.goBack()
    //     return true;
    // };









    render() {

        // console.log(this.props.navigation)
        let backfunc = [this.Get_jobs, this.RestState,]
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {this.state.dash == false ?
                        <Header heading="Invite" {...this.props} backfunc={backfunc} textalign='center' left={Scales.deviceWidth * 0.09} /> : <Header heading="Invite" {...this.props} textalign='center' backfunc={backfunc} back={true} left={Scales.deviceWidth*0.09} />}
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.11, justifyContent: 'center', }}>
                    <TouchableOpacity onPress={async() => {
                        let sub_status = await AsyncStorage.getItem("subscription_status")
                       
                        if (JSON.parse(sub_status) == 0 || JSON.parse(sub_status) == 3) {
                            Toast.showWithGravity("Your subscription has been paused.Please refer website to activate it.", Toast.LONG, Toast.BOTTOM)
                            return 0
                        }; this.props.navigation.navigate('create_job', { "Get_jobs": this.Get_jobs, "dash": this.state.dash })
                    }}>
                        <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.06, backgroundColor: "#626a72", alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', color: 'white' }}>CREATE A JOB</Text>
                        </View></TouchableOpacity>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.05 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(16) }}>Or</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.95, alignSelf: 'center', height: Scales.deviceHeight * 0.06 }}>
                            <TextInput placeholderTextColor = {"#c7c7c7"}  returnKeyLabel='Done'
                                returnKeyType='done' value={this.state.select_job_name} onChangeText={(text) => this.searchJobFilterFunction(text)} style={{ width: Scales.deviceWidth * 0.80, fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', height: Scales.deviceHeight * 0.06, alignSelf: "center", borderWidth: 0.3, borderRightWidth: 0, borderTopLeftRadius: Scales.deviceHeight * 0.01, borderBottomLeftRadius: Scales.deviceHeight * 0.01, backgroundColor: "#faf9fd",color:"#3c3c3c",paddingLeft:Scales.deviceWidth*0.02 }} placeholderTextColor={"#3c3c3c"} placeholder={"Select Job"} />

                            <TouchableOpacity onPress={() => this.setState({ showlist: !this.state.showlist })}><View style={{ width: Scales.deviceWidth * 0.15, justifyContent: "center", height: Scales.deviceHeight * 0.06, backgroundColor: '#faf9fd', borderWidth: 0.3, borderTopRightRadius: Scales.deviceHeight * 0.01, borderBottomRightRadius: Scales.deviceHeight * 0.01, borderLeftWidth: 0 }}>
                                <Image source={require("../../assets/Images/drop-down.png")} style={{ resizeMode: 'contain', alignSelf: "center" }} />
                            </View></TouchableOpacity>
                        </View>

                        {this.state.show_toast ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-end", right: Scales.deviceWidth * 0.04 }}>
                            <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: 10 }}>
                                <Image source={require("../../assets/Images/login_toast.png")} style={{ width: Scales.deviceWidth * 0.045, height: Scales.deviceHeight * 0.03, resizeMode: "contain" }} />
                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.04, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), color: "white" }}>{this.state.toast_message}</Text>
                            </View>

                            <View style={{ borderLeftWidth: 0.5, width: Scales.deviceWidth * 0.02, height: Scales.deviceHeight * 0.03, borderColor: "white", alignSelf: 'center', }}></View>

                            <TouchableOpacity onPress={() => this.setState({ show_toast: false })}>
                                <View style={{ width: Scales.deviceWidth * 0.07, height: Scales.deviceHeight * 0.04, alignSelf: "flex-end", paddingRight: 5, }}>
                                    <Image source={require("../../assets/Images/rejected.png")} style={{ width: Scales.deviceWidth * 0.03, alignSelf: 'flex-end', height: Scales.deviceHeight * 0.04, resizeMode: "contain" }}></Image>
                                </View></TouchableOpacity>
                        </View> : null}


                        {this.state.showlist ? <View style={{ width: Scales.deviceWidth * 0.95, maxHeight: Scales.deviceHeight * 0.55, alignSelf: "center", elevation: 5, backgroundColor: "white", borderRadius: Scales.deviceHeight * 0.01 }}>
                            {this.state.picker_data.length != 0 ? <FlatList
                                data={this.state.picker_data}
                                renderItem={({ item, index }) => <Joblist data={item} index={index} SelectData={this.SelectData} />}
                                keyExtractor={item => item.id}
                                scrollEnabled={true}
                                onRefresh={this.Get_jobs}
                                refreshing={this.state.refreshing}
                            /> : <Text style={{ height: Scales.deviceHeight * 0.08, paddingLeft: Scales.deviceWidth * 0.02, fontFamily: 'roboto-medium', textAlignVertical:'center', fontsize: Scales.moderateScale(14),textAlign:"center" }}>No Record Found</Text>}

                        </View> : null}


                    </View>

                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.09, alignSelf: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.Go_to_next()}><View style={{ width: Scales.deviceWidth*0.90, height: Scales.deviceHeight*0.06, backgroundColor: '#4b40aa', alignSelf: 'center', borderRadius: 10, justifyContent: 'center', elevation: 3 }}>
                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(18), fontFamily: 'roboto-medium', color: 'white', paddingBottom: Scales.deviceHeight*0.006 }}>
                                {"Next"}
                            </Text>

                        </View></TouchableOpacity>

                    </View>

                </View>
            </SafeAreaView>
        )
    }
}



