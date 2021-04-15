import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage, ScrollView, TextInput, Image, TouchableOpacity, SafeAreaView, ImageBackground, Alert, BackHandler, Keyboard, KeyboardAvoidingView } from 'react-native';
import Header from "../DrawerHeader"
import { Scales } from "@common"
import Stars from 'react-native-stars';
import PostFetch from "../../ajax/PostFetch"
import Modal from 'react-native-modal'
import { LinearGradient } from 'expo-linear-gradient';
import NetworkUtils from "../../common/globalfunc"

import Toast from 'react-native-simple-toast';
import { URL } from "../../ajax/PostFetch"
import KeyboardDoneButton from '../KeyBoard'


export default class RateCandidate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FeedParams: [],
            feed_data: [],
            comment: "",
            avg_rate: 0,
            alert_modal: false,
            hire: null
        }
        this.avg_star_rate = 0
    }
    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack()
        return true;
    }
    componentDidMount = async () => {
        console.log(this.props.navigation.state.params.rating_params)
        if (parseInt(this.props.navigation.state.params.rating_params.recommended_yes) >= parseInt(this.props.navigation.state.params.rating_params.recommended_no)) {
            this.setState({ hire: 1 })
        }
        else if (parseInt(this.props.navigation.state.params.rating_params.recommended_yes) < parseInt(this.props.navigation.state.params.rating_params.recommended_no)) {
            this.setState({ hire: 0 })
        }
        this.setState({ avg_rate: this.props.navigation.state.params.avg, comment: this.props.navigation.state.params.comment })
        let permission = await AsyncStorage.getItem("permission")

        permission = JSON.parse(permission)


        if (permission.indexOf("10") == -1 && permission[0] != "") {
            Toast.showWithGravity("You don't have permission to perform this action! Please Contact Main User.", Toast.SHORT, Toast.BOTTOM);
            this.props.navigation.goBack()
            return 0
        }

        console.log("::::::===>>",this.props.navigation.state.params.feedbacks)
        if(this.props.navigation.state.params.feedbacks.length!=0){
            let rate_data = []
            let rates_data = []
            for(let i of this.props.navigation.state.params.feedbacks){
                console.log("[][][]][][]",i)
              let  contxt = {
                "param_value": i.value,
                "param": i.key
                }
                rates_data.push(i.value)
                rate_data.push(contxt)
            }
            this.setState({
                FeedParams: rate_data,
                feed_data: rates_data
            })
        }
        
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        let url = URL.api_url + "feedback-param"

        await fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(respJson => {
                if (respJson.error == 0) {
                    console.log(respJson.data, "---respJson.data")
                    let data = []
                    // this.add_items = []
                    // for(let x in this.props.navigation.state.params.rating_params.rating_data){
                    //     if(respJson.data.indexOf(x)==-1){
                    //         respJson.data.push(x)
                    //         this.add_items.push(x)
                    //     }
                    // }
                    console.log(respJson, "check noetetet")
                    let rates = []
                    let counter = 0
                    console.log(this.props.navigation.state.params.rating_params.rating_data, "------params")
                    for (let i in respJson.data) {

                        let context = {
                            "param_value": this.props.navigation.state.params.rating_params.rating_data == undefined ? 0 : this.props.navigation.state.params.rating_params.rating_data[respJson.data[counter]],
                            "param": respJson.data[counter]
                        }
                        console.log(context, "con")

                        data.push(context)

                        rates.push((this.props.navigation.state.params.rating_params.rating_data[respJson.data[counter]]) == undefined ? "0" : this.props.navigation.state.params.rating_params.rating_data[respJson.data[counter]])
                        counter = counter + 1
                    }
                    console.log("----data----",rates)
                   if(this.props.navigation.state.params.feedbacks.length==0){
                        this.setState({
                        FeedParams: data,
                        feed_data: rates
                    })
                   }
                    console.log(this.state.feed_data, "----feed_data--")

                }
                else {
                    Alert.alert(
                        "",
                        "Rating parameter is disable or not available, please update your rating parameter from website",
                        [

                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ],
                        { cancelable: false }
                    );

                }


            })
            .catch(async (err) => {
                console.log(err)
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })

        // console.log(this.props.navigation.state)

    }

    add_param_data = (value, index) => {
        console.log(value, index)
        if (index == undefined) {
            return 0
        }
        this.state.feed_data[index] = value
        let total = 0
        let count = 0
        for (let i of this.state.feed_data) {
            if (i != undefined) {
                console.log(parseInt(i), "---value of i")
                total = total + parseInt(i)
                count = count + 1
            }
        }
        let avg = total / count
        this.setState({ avg_rate: avg })
        console.log(avg, "----avg")
        console.log(this.state.feed_data)

    }

    Add_Rating = async () => {

        let permission = await AsyncStorage.getItem("permission")
        // console.log(permission(item=>"1"==item), "-------permission-----")
        permission = JSON.parse(permission)
        if (permission.indexOf("10") == -1 && permission[0] != "") {
            Toast.showWithGravity("You don't have permission to perform this action! Please Contact Main User.", Toast.SHORT, Toast.BOTTOM);
            // this.props.navigation.goBack()
            return 0
        }
        console.log(this.state.feed_data, this.state.FeedParams)
        console.log(this.state.feed_data.indexOf(undefined), "---index off")
        let count = 0
        for (let i of this.state.feed_data) {
            if (i != undefined) {
                count = count + 1
            }
        }
        console.log(count)
        if (count != this.state.FeedParams.length) {

            Toast.showWithGravity("Please Give All rating", Toast.SHORT, Toast.BOTTOM);

            return 0
        }
        if (this.state.comment == '') {
            Toast.showWithGravity("Enter Comment", Toast.SHORT, Toast.BOTTOM);
            return 0
        }
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let values = this.state.feed_data.join(",")
        if (this.state.hire == null) {
            Toast.showWithGravity("Select recommend to hire", Toast.SHORT, Toast.BOTTOM);
            return 0
        }

        const payload = {
            "applied_id": this.props.navigation.state.params.apply_id,
            "comment": this.state.comment,
            "value": values,
            "recommend": this.state.hire
        }


        const json = await PostFetch("add-rating", payload, header)

        console.log(json)
        if (json != null) {

            if (json.error == 0) {
                this.props.navigation.state.params.get_rating()
                this.props.navigation.state.params.get_data()
                this.props.navigation.state.params.User_Evaluate()
                // console.log(json)
                this.setState({ alert_modal: true })


                // await this.setState({
                //     interview_question: json.data.jobma_answers.question
                // })



            }
            else {
                alert(json.message)
            }

        }
        else {
            // alert("Something Went Wrong !!!")
        }


    }

    onok = () => {
        this.setState({ alert_modal: false })
        this.props.navigation.goBack()
    }



    render() {
        console.log("========",this.state.FeedParams)
        let backfunc = [this.props.navigation.state.params.get_rating, this.props.navigation.state.params.get_data, this.props.navigation.state.params.User_Evaluate]
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ flex: 1 }}>

                    <Header heading="Rate the Candidate" backfunc={backfunc} {...this.props} textalign='center' left={Scales.deviceWidth * 0.10} back={true} />
                    {/* <KeyboardAvoidingView style={{flex:1}} behavior="padding" >  */}
                    <KeyboardDoneButton style={{ flex: 1 }} />
                    <ScrollView style={{ flex: 1 }}>


                        <View style={{ flex: 1, }}>
                            <View style={{ height: Scales.deviceHeight * 0.02 }}>

                            </View>


                            <FlatList
                                data={this.state.FeedParams}
                                becausebecau
                                renderItem={({ item, index }) => <CandidateFed data={item} add_items={this.add_items} index={index} navigation={this.props.navigation} add_param_data={this.add_param_data} />}
                                keyExtractor={(item, index) => index.toString()}
                            />


                        </View>

                        <View style={{ height: Scales.deviceHeight * 0.4, width: Scales.deviceWidth * 1.0, alignSelf: 'flex-end', paddingLeft: Scales.deviceWidth * 0.028, paddingRight: Scales.deviceWidth * 0.028, paddingTop: Scales.deviceHeight * 0.012 }}>
                            <View style={{ height: Scales.deviceHeight * 0.12, width: Scales.deviceWidth * 0.95, alignSelf: 'center', }}>
                                <TextInput placeholderTextColor={"#c7c7c7"} value={this.state.comment} placeholder="Enter comment here*" onChangeText={(text) => this.setState({ comment: text })} multiline={true} numberOfLines={10} style={{ textAlignVertical: 'top', paddingLeft: Scales.deviceWidth * 0.012, backgroundColor: "white", borderColor: "#c7c7c7", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), height: Scales.deviceHeight * 0.12, width: Scales.deviceWidth * 0.95, borderRadius: 10, borderWidth: 1 }} />
                            </View>
                            <View style={{ height: Scales.deviceHeight * 0.12, width: Scales.deviceWidth * 0.95, alignItems: 'flex-end', flexDirection: 'row', elevation: 5 }}>
                                <View style={{ height: Scales.deviceHeight * 0.09, width: Scales.deviceWidth * 0.45, backgroundColor: '#4236a3', borderRadius: 5 }}>
                                    <View style={{ paddingTop: Scales.deviceHeight * 0.008 }}>
                                        <Stars
                                            half={false}
                                            default={this.state.avg_rate == 0 ? 0 : this.state.avg_rate > 0 && this.state.avg_rate <= 0.5 ? 0.5 : this.state.avg_rate > 0.5 && this.state.avg_rate <= 1 ? 1 : this.state.avg_rate > 1 && this.state.avg_rate <= 1.5 ? 1.5 : this.state.avg_rate > 1.5 && this.state.avg_rate <= 2 ? 2 : this.state.avg_rate > 2.0 && this.state.avg_rate <= 2.5 ? 2.5 : this.state.avg_rate > 2.5 && this.state.avg_rate <= 3.0 ? 3 : this.state.avg_rate > 3.0 && this.state.avg_rate <= 3.5 ? 3.5 : this.state.avg_rate > 3.5 && this.state.avg_rate <= 4 ? 4 : this.state.avg_rate > 4.0 && this.state.avg_rate <= 4.5 ? 4.5 : this.state.avg_rate > 4.5 && this.state.avg_rate <= 5 ? 5 : null}
                                            // update={(val) => {console.log(val); this.avg_star_rate=val }}
                                            spacing={Scales.moderateScale(4)}
                                            starSize={Scales.moderateScale(20)}
                                            disabled={true}
                                            count={5}

                                            fullStar={require('../../assets/Images/star.png')}
                                            emptyStar={require('../../assets/Images/empty-star.png')}
                                            halfStar={require('../../assets/Images/half-filled-star.png')} />
                                    </View>
                                    <View style={{ paddingTop: Scales.deviceHeight * 0.01, width: Scales.deviceWidth * 0.45 }}>
                                        <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(16), fontFamily: 'roboto-medium', color: 'white' }} >Overall Rating</Text>
                                    </View>
                                </View>

                                <View style={{ height: Scales.deviceHeight * 0.09, width: Scales.deviceWidth * 0.45, backgroundColor: '#4236a3', left: Scales.deviceWidth * 0.04, borderRadius: 5, elevation: 5 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.09, alignSelf: "center", }}>
                                        <View style={{ width: Scales.deviceWidth * 0.45, justifyContent: 'center', height: Scales.deviceHeight * 0.04, }}>
                                            <Text style={{ textAlign: "center", color: "white", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14) }}>Recommend to Hire</Text>
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.45, height: Scales.deviceHeight * 0.04, flexDirection: 'row', }}>
                                            <View style={{ width: Scales.deviceWidth * 0.225, height: Scales.deviceHeight * 0.04, flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{ width: Scales.deviceWidth * 0.225, flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                        <Image source={require("../../assets/Images/yes.png")} style={{ width: Scales.deviceWidth * 0.05, resizeMode: 'contain', height: Scales.deviceHeight * 0.04, }} />
                                                        <TouchableOpacity onPress={() => this.setState({ hire: 1 })}><Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), color: this.state.hire == 1 ? 'green' : "white", paddingLeft: 5 }}>Yes</Text></TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ width: Scales.deviceWidth * 0.225, height: Scales.deviceHeight * 0.04, flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{ width: Scales.deviceWidth * 0.225, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={require("../../assets/Images/no.png")} style={{ width: Scales.deviceWidth * 0.04, resizeMode: 'contain', height: Scales.deviceWidth * 0.04, }} />
                                                    <TouchableOpacity onPress={() => this.setState({ hire: 0 })}><Text style={{ textAlign: 'right', width: Scales.deviceWidth * 0.06, fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), color: this.state.hire == 0 ? 'green' : "white", }}>No</Text></TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>

                                    </View>
                                </View>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                                <TouchableOpacity onPress={this.Add_Rating}><View style={{ width: Scales.deviceWidth * 0.95, justifyContent: 'center', height: Scales.deviceHeight * 0.06, backgroundColor: "#4236a3", borderRadius: 10 }}>
                                    <Text style={{ width: Scales.deviceWidth * 0.95, textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(16), color: 'white' }}>Submit</Text>
                                </View></TouchableOpacity>

                            </View>


                        </View>
                        {/* </KeyboardAvoidingView> */}

                    </ScrollView>
                {/* </KeyboardAvoidingView> */}

                <Modal isVisible={this.state.alert_modal} style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.13, alignSelf: "flex-start", right: Scales.deviceWidth * 0.07 }}  >
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", backgroundColor: "transparent" }}>

                        <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.35, borderRadius: 10, opacity: 1, alignSelf: "center", }}>
                            <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.25, paddingTop: Scales.deviceHeight * 0.008 }}>
                                <Image source={require("../../assets/Images/comment_success.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.18, alignSelf: 'center', paddingTop: Scales.deviceHeight * 0.02 }} />
                                <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textAlign: "center", }}>Comment Published {"\n"} successfully</Text>

                            </View>

                            <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, }}>
                                <ImageBackground source={require("../../assets/Images/big_bg.png")} style={{ resizeMode: "contain", width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.10, paddingTop: Scales.deviceHeight * 0.008 }}>
                                        <TouchableOpacity onPress={() => this.onok()}><LinearGradient style={{ width: Scales.deviceWidth * 0.20, height: Scales.deviceHeight * 0.05, borderRadius: Scales.deviceHeight * 0.01, alignSelf: "center" }} colors={["#615abb", "#6059bb", "#5e57ba", "#5b53b7", "#554cb2", "#4c41ab", "#473ba7", "#4337a4", "#4034a2"]}><View style={{ width: Scales.deviceWidth * 0.20, justifyContent: "center", height: Scales.deviceHeight * 0.05, borderRadius: Scales.deviceHeight * 0.01, alignSelf: "center" }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), textAlign: "center", color: "white" }}>Ok</Text>
                                        </View></LinearGradient></TouchableOpacity>

                                    </View>
                                </ImageBackground>

                            </View>
                        </View>



                    </View>
                </Modal>
            </View>
           
        </SafeAreaView >
        )
    }
}


class CandidateFed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            star_rate: 0,
            disabled: false
        }
    }

    AddRate = (val) => {
        this.setState({
            star_rate: val
        })
        console.log(val, "this.props.index")
        this.props.add_param_data(val, this.props.index)
    }

    componentDidMount = () => {
        // if(this.props.add_items.indexOf(this.props.data.param)!=-1){
        //     this.setState({disabled:true})
        // } 
        console.log(this.props.data.param_value)
        this.setState({ star_rate: this.props.data.param_value == undefined ? "0" : this.props.data.param_value })
    }
    render() {
        return (
            <View style={{ width: Scales.deviceWidth * 1.0, padding: Scales.deviceWidth * 0.012, justifyContent: "center", elevation: 5 }}>
                <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", flexDirection: "row", alignItems: 'center', backgroundColor: 'white', elevation: 5, borderRadius: 10, minHeight: Scales.deviceHeight * 0.06, elevation: 5 }}>
                    <View style={{ width: Scales.deviceWidth * 0.40, justifyContent: 'center', }}>
                        <Text style={{ padding: 10, fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14), textAlign: "left" }}>{this.props.data.param}</Text>
                    </View>

                    <View style={{ width: Scales.deviceWidth * 0.50, alignItems: 'flex-end', height: Scales.deviceHeight * 0.07, justifyContent: 'center' }}>
                        <Stars
                            default={this.state.star_rate}
                            update={(val) => this.AddRate(val)}
                            disabled={this.state.disabled}
                            spacing={Scales.moderateScale(4)}
                            starSize={Scales.moderateScale(20)}
                            count={5}
                            fullStar={this.state.star_rate > 0 && this.state.star_rate < 1.5 ? require('../../assets/Images/red_star.png') : this.state.star_rate > 1 && this.state.star_rate < 3.5 ? require('../../assets/Images/star.png') : this.state.star_rate > 3 && this.state.star_rate < 5.5 ? require('../../assets/Images/green_star.png') : null}
                            emptyStar={require('../../assets/Images/empty-star.png')}
                            halfStar={this.state.star_rate > 0.0 && this.state.star_rate <= 1.0 ? require('../../assets/Images/half_red_star.png') : this.state.star_rate > 1.0 && this.state.star_rate <= 3.0 ? require('../../assets/Images/half-filled-star.png') : this.state.star_rate > 3.0 && this.state.star_rate <= 5.0 ? require('../../assets/Images/half_green_star.png') : null} />

                    </View>
                </View>
            </View>

        )
    }
}