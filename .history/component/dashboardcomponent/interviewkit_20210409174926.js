import React, { Component } from 'react';
import { View, Text, FlatList, TextInput, AsyncStorage, ActivityIndicator,ScrollView,RefreshControl,SafeAreaView, TouchableOpacity } from 'react-native'
import Header from '../DrawerHeader'
import PostFetch from '../../ajax/PostFetch'

import { Scales } from "@common"
import KitList from './interviewkitlist'
import Modal from "react-native-modal"
import NetworkUtils from "../../common/globalfunc"
import Toast from 'react-native-simple-toast';

import {URL} from "../../ajax/PostFetch"


export default class InterviewKit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: true,
            offset: 0,
            refreshing: false,
            limit: 10,
            data: [],
            show_search: false,
            fixed_kit_list: [],
            previous_data: [], loader: false, date_format: "YYYY/MM/DD", loading: false,search_text:"",
            selected_filter_button:'Active',
        }



    }

    get_more_data = async () => {
        
        // this.setState({ loader: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "offset": 0,
            "limit": this.state.offset

        }
        // console.log(payload)
        const json = await PostFetch("kit-list?full_list=True", payload, headers)

        if (json != null) {

            console.log(json.data.total_count, "----------------------------INTERVIEW KIT-------------")

            // this.state.job_list.push(json.data.job_data)
            if (json.error == 0) {
                let count = this.state.offset
                console.log(json.data.kit_list.length, "--------count-------")
                this.setState({
                    offset: json.data.total_count,
                    data: json.data.kit_list,
                    fixed_kit_list: json.data.kit_list
                })

            }
            else {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                 
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            }

        }

        // this.setState({ loader: false })

    }

    _get_more_data = async () => {
        if (this.state.loader == true) {
            return 0
        }
        // this.setState({ loader: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "offset": this.state.offset,

        }
        console.log(payload)
        const json = await PostFetch("kit-list?full_list=True", payload, headers)

        if (json != null) {

            console.log(json.data.total_count, "----------------------------INTERVIEW KIT-------------")

            // this.state.job_list.push(json.data.job_data)
            if (json.error == 0) {
                let count = this.state.offset
                console.log(count, "--------count-------")
                this.setState({
                    offset: json.data.total_count,
                    // data:json.data.kit_list,
                    // fixed_kit_list:json.data.kit_list
                })
                if (count == 0) {
                    console.log("recursion")
                    // await this.get_more_data()
                    console.log("end")
                }
            }
            else {
                console.log(json.message)
            }

        }

        // this.setState({ loader: false })

    }

    UpdateKitStatus = (id) => {
        let index = this.state.fixed_kit_list.findIndex(kit => kit.id==id)
        console.log(this.state.fixed_kit_list[index])
        let arr = this.state.fixed_kit_list
        let item = arr[index]
        // console.log(item)
        item.is_active = item.is_active==1?0:1
        // console.log(item)
        arr.splice(index,1,item)
        this.setState({data:arr, fixed_kit_list:arr,search_text:""})
        console.log(this.state.fixed_kit_list[index])

        // console.log(index, "---index----")
        // this.state.fixed_kit_list.filter(kit => {
            
        //     if (kit.id === id) {
        //         console.log(kit)
        //         let kit_active = kit.is_active;
        //         kit.is_active = parseInt(kit_active) == 1 ? 0 : 1
        //         console.log(kit)
        //     }
        // })
        // this.state.data.filter(kit => {
        //     if (kit.id === id) {
        //         let kit_active = kit.is_active
        //         kit.is_active = kit_active == 1 ? 0 : 1
        //     }
        // })
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
                console.log(respJson.data, "---------date ---------")
                await AsyncStorage.setItem("date_format", date_format)
                this.setState({
                    date_format: date_format
                })
            })
            .catch(async (err) => {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })

    }

    _refresh = async () => {
        this.setState({
            refreshing: true
        })
        this.UpdateEmployerLang()
        
        await this.get_more_data()
        // let headers = {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //     'Key': await AsyncStorage.getItem('token')
        // };
        // const payload = {
        //     "offset": 0,


        // }
        // const json = await PostFetch("kit-list", payload, headers)

        // if (json != null) {


        //     // console.log(json)
        //     this.setState({
        //         data: json.data.kit_list,
        //         fixed_kit_list: json.data.kit_list,
        //         offset: 0,


        //     })

        // }

        this.setState({ refreshing: false })
    }

    Click_Search = () => {
        this.setState({
            show_search: !this.state.show_search
        })
    }



    searchFilterFunction = (text) => {

        try {
            if (text.length != 0) {
                this.setState({search_text:text})
                let fix_kit = this.state.fixed_kit_list
                const newData = fix_kit.filter(item => {
                    let itemData = item.title.toUpperCase()
                    let textData = text.replace("\\",'\\\\')
                    textData = text.toUpperCase()
                    if (itemData.match(textData)) {
                        return item;

                    }


                });

                this.setState({ data: newData });

            }
            else {
                // console.warn("LLLadf")
                // this._get_more_data()
                this.setState({ data: this.state.fixed_kit_list,search_text:"" })
            }
        }
        catch (err) {
            console.log(err)

        }



    };

    GetInitailData=async()=>{
         this.setState({loader:true})
        
        await this.get_more_data()
         this.setState({loader:false})
    }

    componentDidMount = async () => {
        await this.GetInitailData()
        let date_format = await AsyncStorage.getItem('date_format')
        if (date_format == null) {
            this.setState({ date_format: "MM/DD/YYYY" })
        }
        else {
            this.setState({ date_format: date_format })
        }
    }





    render() {
        return (
            <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "#2d2d3a", }}>
                <Header heading="Interview Kits" {...this.props} textalign='left' left={Scales.deviceWidth * 0.03} widths={Scales.deviceWidth * 0.60} searchoff={true} Click_Search={this.Click_Search} />

                {this.state.show_search ? <View style={{ width: Scales.deviceWidth*0.90, marginTop: Scales.deviceHeight*0.013, marginBottom: Scales.deviceHeight*0.01, alignSelf: 'center', justifyContent: 'center', elevation: 5 }}>
                    <TextInput placeholderTextColor = {"#c7c7c7"}  style={{ width: Scales.deviceWidth*0.90, height: Scales.deviceHeight * 0.06,color:"#3c3c3c", backgroundColor: '#3d3d46', borderRadius: 5, textAlign: 'left', fontFamily: 'roboto-regular', alignSelf: 'center', paddingLeft:Scales.deviceWidth*0.03,fontSize:Scales.moderateScale(14)}} placeholder="Enter text" value ={this.state.search_text} onChangeText={(text) => this.searchFilterFunction(text)} />
                </View> : null}
                <View style={{ flexDirection: 'row', paddingLeft:'2%' }}>
                        <TouchableOpacity
                                style={{ backgroundColor: this.state.selected_filter_button==='All'?'#13d7a6':'#52526c', borderRadius: 20, marginLeft:'1%', }}
                                onPress={() => {
                                    this.setState({selected_filter_button:'All'})
                                }}
                            >
                                <Text style={{
                                    color: this.state.selected_filter_button==='All'?'black':'white',
                                    fontSize: 12,
                                    padding: '3%',
                                    paddingLeft: '6%',
                                    paddingRight: '6%'
                                }}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: this.state.selected_filter_button==='Active'?'#13d7a6':'#52526c' , borderRadius: 20, marginLeft:'1%', }}
                                onPress={() => {
                                    this.setState({selected_filter_button:'Active'})
                                }}
                            >
                                <Text style={{
                                    color: this.state.selected_filter_button==='Active'?'black':'white',
                                    fontSize: 12,
                                    padding: '3%',
                                    paddingLeft: '6%',
                                    paddingRight: '6%'
                                }}>Active</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: this.state.selected_filter_button==='Inactive'?'#13d7a6':'#52526c', borderRadius: 20, marginLeft:'1%', }}
                                onPress={() => {
                                    this.setState({selected_filter_button:'Inactive'})
                                }}
                            >
                                <Text style={{
                                    color: this.state.selected_filter_button==='Inactive'?'black':'white',
                                    fontSize: 12,
                                    padding: '3%',
                                    paddingLeft: '6%',
                                    paddingRight: '6%'
                                }}>In-active</Text>
                            </TouchableOpacity>
                        </View>
                {this.state.data.length != 0 ? <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => <KitList date_format={this.state.date_format} data={item} UpdateKitStatus={this.UpdateKitStatus} />}
                    onRefresh={this._refresh}
                    keyExtractor={(item, index) => index.toString()}
                    // onEndReached={this._get_more_data}
                    refreshing={this.state.refreshing}
                    windowSize={21}
                // onEndReachedThreshold={1}
                /> :
                    <ScrollView style={{flex:1}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._refresh} />} refreshing={this.state.refreshing} ><View style={{flex:1, justifyContent:"center"}}><View style={{ flex: 1, justifyContent: "center", marginTop:Scales.deviceHeight*0.40 }}><Text style={{ textAlign: 'center', fontFamily: 'roboto-medium',color:"#3c3c3c" }}>No Records Found.</Text></View></View></ScrollView>}


                <Modal isVisible={this.state.loader}>

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                    </View>

                </Modal>
            </View>
            </SafeAreaView>

        )
    }
}

