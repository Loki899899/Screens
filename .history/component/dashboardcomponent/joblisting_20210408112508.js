import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, AsyncStorage, ActivityIndicator,RefreshControl,SafeAreaView } from 'react-native';
import Header from '../DrawerHeader'
import PostFetch from '../../ajax/PostFetch'
import Jobs from './job'
import { Scales } from "@common"
import Modal from "react-native-modal"
import NetworkUtils from "../../common/globalfunc"
import Toast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';
import {URL} from "../../ajax/PostFetch"

export default class Joblisting extends Component {
    constructor(props) {
        super(props)
        // this._get_more_data
        this.state = {
            offset: 0,
            limit: 10,
            value: false,
            show_search: false,
            refreshing: false,
            setValue: false,
            job_list: [

            ],
            filter: false,
            filter_payload: {},
            show_loader: false,
            date_format: "YYYY/MM/DD"
        }
    }





    _get_more_data = async () => {
        this.setState({ show_loader: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let payload = {}

        // console.log(this.state.filter, "this.state.filter")
        if (this.state.filter == true) {
            payload = this.state.filter_payload



        }
        else {
            // console.log("LLLLLLLLLLLLLLLLLLLLL")
            payload = {
                "offset": String(this.state.offset)
            }
        }

        console.log(payload, "hit -payload")


        const json = await PostFetch("filter-job", payload, headers)

        if (json != null) {

            // this.state.job_list.push(json.data.job_data)
            console.log(json.data.job_data.length)
            var previous_data = this.state.job_list.concat(json.data.job_data)

            if (this.state.filter == true) {
                payload.offset = this.state.filter_payload.offset + 10
                this.setState({
                    filter_payload: payload,
                    job_list: previous_data,
                    show_loader: false

                })

            }

            else {
                let offset = 10
                if (this.state.offset == 0) {
                    offset = 11
                }
                this.setState({
                    job_list: previous_data,
                    offset: this.state.offset + offset,
                    limit: this.state.limit + 10,
                    show_loader: false

                })
            }


        }
        else {
            // alert("Something Went Wrong !!!")
            this.setState({ show_loader: false })
        }
        this.setState({ show_loader: false })

    }

    Click_Search = () => {
        this.setState({
            show_search: !this.state.show_search
        })
    }

    // _refresh = async () => {
    //     this.setState({
    //         refreshing: true
    //     })
    //     let headers = {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         'Key': await AsyncStorage.getItem('token')
    //     };

    //     if(this.state.filter==true){
    //         payload = this.state.payload
    //     }
    //     else{
    //         payload = {
    //             "offset": 1,
    //             "limit": 10,
    //             "approval": 1
    //         }
    //     }

    //     const json = await PostFetch("filter-job", payload, headers)

    //     if (json != null) {


    //         // console.log(previous_data)
    //         this.setState({
    //             job_list: json.data.job_data,
    //             offset: 1,
    //             limit: 10,
    //             refreshing: false

    //         })

    //     }
    //     else {
    //         // alert("Something Went Wrong !!!")
    //     }
    // }
    _refresh = async () => {

        this.setState({
            refreshing: true
        })
        this.UpdateEmployerLang()
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };



        let payload = {}


        payload = {
            "offset": 0
        }





        const json = await PostFetch("filter-job", payload, headers)

        if (json != null) {

            this.setState({
                job_list: json.data.job_data,
                offset: 0,
                limit: 10,
                value: false,
                show_search: false,
                refreshing: false,
                setValue: false,
                filter: false,
                filter_payload: {},
                show_loader: false

            })

        }
        this.setState({refreshing:false})

    }


    searchFilterFunction = (text) => {

        if (text.length != 0) {

            const newData = this.state.job_list.filter(item => {
                const itemData = item.job_title.toUpperCase()
                const textData = text.toUpperCase()

                var b = itemData.match(textData)


                if (itemData.match(textData)) {
                    return item;

                }


            });


            this.setState({ job_list: newData });

        }
        else {
            this._refresh()
        }



    };

    componentDidMount = async () => {
        this._get_more_data()
        let date_format = await AsyncStorage.getItem('date_format')
        if (date_format == null) {
            this.setState({ date_format: "MM/DD/YYYY" })
        }
        else {
            this.setState({ date_format: date_format })
        }
        // console.log(this.props)
    }

    filter_data = (payload, filter) => {
        console.log(payload, filter)
        this.setState({ filter_payload: payload, filter: filter, job_list: [], limit: 10, offset: 0 })
        this._get_more_data()

    }
    UpdateEmployerLang = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        await fetch(URL.api_url+"emp-lang", {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(async (respJson) => {

                let date_format = "MM/DD/YYYY"
                if (respJson.data.date_format == "d/m/Y") {
                    date_format = "DD/MM/YYYY"
                }
                else if (respJson.data.date_format == "m/d/Y") {
                    date_format = "MM/DD/YYYY"
                }
                else if (respJson.data.date_format == "Y/m/d") {
                    date_format = "YYYY/MM/DD"
                }
                // console.log(respJson.data, "---------date ---------")
                await AsyncStorage.setItem("date_format", date_format)
                this.setState({
                    date_format: date_format
                })
            })
            .catch(async(err) => {
                
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })

    }








    render() {

        return (
            <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1 ,}}>
                <Header heading="Jobs Listing" {...this.props} textalign='left' widths={Scales.deviceWidth * 0.55} left={Scales.deviceWidth * 0.25} Click_Search={this.Click_Search} />
                {this.state.show_search ? <View style={{ width: "100%", height: 40, alignSelf: 'center', justifyContent: 'center', }}>
                    <TextInput placeholderTextColor = {"#c7c7c7"}  style={{ width: "90%", height: 30, backgroundColor: 'white', borderRadius: 5, textAlign: 'center', fontFamily: 'roboto-regular', borderWidth: 1, alignSelf: 'center', elevation: 5 }} placeholder="enter text" onChangeText={(text) => this.searchFilterFunction(text)} />
                </View> : null}
                <View style={{flex:1, backgroundColor: '#faf9fd' }}>
                    {this.state.job_list.length == 0 ?
                       <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._refresh} /> } style={{flex:1,}}>
                           <View    style={{  height:Scales.deviceHeight*0.45,justifyContent:"flex-end"}}>
                            <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium",color:"#3c3c3c" }}>No Job found with this search criteria!</Text>
                        </View></ScrollView> :
                        this.state.job_list.length <= 4 ? <FlatList
                            data={this.state.job_list}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <Jobs date_format={this.state.date_format} data={item} navigation={this.props.navigation} />}

                            onRefresh={this._refresh}
                            refreshing={this.state.refreshing}

                        /> : <FlatList
                                data={this.state.job_list}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <Jobs date_format={this.state.date_format} data={item} navigation={this.props.navigation} />}
                                windowSize={21}
                                onRefresh={this._refresh}
                                refreshing={this.state.refreshing}
                                onEndReached={this._get_more_data}
                                onEndReachedThreshold={0.5}

                            />

                    }
                    <View style={{ width: Scales.deviceWidth * 0.20, left: Scales.deviceWidth * 0.78, height: Scales.deviceHeight * 0.10, backgroundColor: "transparent", position: "absolute", top: Scales.deviceHeight * 0.78 }}>
                        <TouchableOpacity style={{ width: Scales.deviceWidth * 0.20, }} activeOpacity={1} onPress={() => this.props.navigation.navigate("filters", { "filter_data": this.filter_data })}><Image source={require("../../assets/Images/filter.png")} style={{ width: Scales.deviceWidth * 0.18, height: Scales.deviceHeight * 0.10, alignSelf: "flex-end", resizeMode: "contain", right: 8 }} /></TouchableOpacity>
                    </View>
                </View>
                <Modal isVisible={this.state.show_loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>

            </View>
            </SafeAreaView>
        )
    }
}       