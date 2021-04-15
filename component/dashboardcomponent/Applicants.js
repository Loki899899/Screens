import React, { Component } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, AsyncStorage, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native'
import Header from '../DrawerHeader';
import { Scales } from "@common"
import PostFetch from "../../ajax/PostFetch"
import NetworkUtils from "../../common/globalfunc"
import Toast from 'react-native-simple-toast';
import {URL} from "../../ajax/PostFetch"
import Collapsible from 'react-native-collapsible';
import { TextInput } from 'react-native-gesture-handler';


export default class Applicants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            picker_data: [
                {
                    "id": 1,
                    "name": "Pending Evalutaion"
                },
                {
                    "id": 2,
                    "name": "Evaluated"
                },
                {
                    "id": 3,
                    "name": "Invited candidates"
                },


            ],
            selected_item: null,
            button_disable: true,
            picker_data_remover: false,
            offset: 0,
            limit: 30,
            show: false,
            focused: false,
            job_list: [],
            fix_job_list: [],
            refreshing: false, loading: false,search_job:""
        }
    }

    ResetState=()=>{
        this.setState({
            selected_item: null,
            button_disable: true,
            picker_data_remover: false,
            offset: 0,
            limit: 30,
            show: false,
            focused: false,
             
            refreshing: false, loading: false,search_job:""
        })
    }


    _get_more_data = async () => {
        try{
            this.setState({ refreshing: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };

        await fetch(URL.api_url+"interview-job-list?active=True", {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((resp) => {
                //   console.log(resp)
               
                let picker_datas = []
                console.log(resp.data)
                for (let x of resp.data) {
                    let context = {
                        "id": x.jobma_job_post_id,
                        "name": x.jobma_job_title
                    }
                  
                    picker_datas.push(context)
                }
                if (resp.error == 0) {

                    this.setState({
                        job_list: picker_datas,
                        fix_job_list:picker_datas
                    })
                }
                else {
                    alert(resp.message)
                }
            })
            .catch(async(err) => {
                let check_connection = await NetworkUtils.isNetworkAvailable()
                if(check_connection){
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);
                    
                }
                else{
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }

                
            })


        this.setState({ refreshing: false })
        }
        catch(err){
            console.log(err)
            this.setState({ refreshing: false })
        }

        

    }
    _onrefresh = async () => {
        try{
            this.setState({ refreshing: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        const payload = {
            "offset": 0,
            "approval": 1


        }
        const json = await PostFetch("filter-job", payload, headers)

        if (json != null) {

            // this.state.job_list.push(json.data.job_data)
            // var previous_data = this.state.job_list.concat(json.data.job_data)

            // console.log(previous_data)
            this.setState({
                job_list: json.data.job_data,
                offset: 0


            })

        }

        this.setState({ refreshing: false })

        }
        catch(err){
            console.log(err)
            this.setState({ refreshing: false })
        }
    }




    _Clear_select_picker = () => {
        this.setState({
            picker_data_remover: true
        })
    }

    _on_select_item = (item) => {
        this.setState({ selected_item: JSON.stringify(item), button_disable: false })
        if (item.id == 1) {
            this.props.navigation.navigate('pending')
        }

    }

    componentDidMount() {
        this._get_more_data()
    }

    collapse = () => {
        this.setState({ show: !this.state.show, focused: !this.state.focused })
    }

    searchJobsFilterFunction = (text) => {
        try {
            if (text.length != 0) {

                const newData = this.state.fix_job_list.filter(item => {

                    let itemData = item.name.toLowerCase()
                    let textData = text.replace("\\",'\\\\')
                    textData = text.toLowerCase()


                    var b = itemData.match(textData)


                    if (itemData.match(textData)) {
                        // console.log(item.name, "LKKKK0", text)

                        return item;

                    }


                });


                this.setState({ job_list: newData,show: true, focused: true ,search_job:text});

            }
            else {
                this.setState({ job_list: this.state.fix_job_list,search_job:"" })
            }

        }
        catch (err) {
            console.log(err)
        }


    };
    ResetState=()=>{
        this.setState({show:false})
    }

    render() {
        let border = this.state.focused == false ? { width: Scales.deviceWidth * 0.90, flexDirection: 'row', alignItems: "center", height: Scales.deviceHeight * 0.06, borderWidth: 0.5, borderRadius: 10,borderColor: "#3f32a1" } : { width: Scales.deviceWidth * 0.90, flexDirection: 'row', alignItems: "center", height: Scales.deviceHeight * 0.06, borderWidth: 1.0, borderRadius: 10,  }

        return (
            <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header heading="Applicants " {...this.props} textalign='center' backfunc={[this.ResetState,]} left={Scales.deviceWidth * 0.07} />
                <View style={{ width: Scales.deviceWidth * 1.0, }}>
                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.10, justifyContent: "flex-end" }}>
                        <View style={{ width: Scales.deviceWidth * 0.90, flexDirection: "row", height: Scales.deviceHeight * 0.06, alignSelf: "center", borderWidth: 0.1, backgroundColor: "#f9f9f9", borderRadius: 10, }}>
                            <View style={border}>
                                <View style={{ alignSelf: "flex-start", justifyContent: 'center', width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.06, }}>
                                    {/* <Text style={{ fontFamily: "roboto-medium", paddingLeft: 15, color: "#3c3c3c", fontSize: Scales.moderateScale(15), }}>Jobs</Text> */}
                                    <TextInput placeholderTextColor = {"#c7c7c7"}  value={this.state.search_job} onChangeText={(text)=>{this.searchJobsFilterFunction(text)}} placeholderTextColor={"#c7c7c7"} style={{fontFamily: "roboto-medium", paddingLeft: 15, color: "#3c3c3c", fontSize: Scales.moderateScale(12)}} placeholder={"Select a job to view the total applicants"} />
                                </View>
                                <TouchableOpacity onPress={this.collapse}><View style={{ width: Scales.deviceWidth * 0.20, alignSelf: "flex-end", justifyContent: "center", height: Scales.deviceHeight * 0.06, }} >
                                    <Image source={require("../../assets/Images/drop-down.png")} style={{ alignSelf: "center" }} />
                                </View></TouchableOpacity>

                            </View>
                        </View>

                    </View>

                    {
                        this.state.show == false ? null :
                            this.state.job_list.length != 0 ? <View style={{ backgroundColor: 'white', width: Scales.deviceWidth * 0.90, maxHeight: Scales.deviceHeight * 0.70, alignSelf: 'center', borderRadius: 10, elevation: 9,shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2 }}>
                                <FlatList
                                    data={this.state.job_list}
                                    renderItem={({ item, index }) => <Joblist  ResetState={this.ResetState} data={item} index={index} navigation={this.props.navigation} />}
                                    keyExtractor={(item, index) => String(index)}


                                    onRefresh={this._get_more_data}

                                    refreshing={this.state.refreshing}
                                /></View> : <View style={{ backgroundColor: 'white', width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.15, alignSelf: 'center', justifyContent: "center", borderRadius: 10, elevation: 9 }}>
                                    <Text style={{ textAlign: 'center', fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(14) }}>No Records Found!</Text>
                                </View>
                    }
                </View>
            </View>
            </SafeAreaView>
        )
    }
}



class Joblist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapse: true,
            selected: false,
            opac: false,
            list: [{ "id": 1, "name": "Pending Evaluation" }, { "id": 2, "name": "Evaluated" }, { "id": 3, "name": "Invited candidates" }]
        }

    }
    componentDidMount() {
        console.log(this.props.data)
    }

    Go_evaluate = () => {
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
        this.props.navigation.navigate('evaluation', { "job_id": this.props.data.id })
    }

    render() {
        let heights = this.state.collapse == true ? Scales.deviceHeight * 0.06 : Scales.deviceHeight * 0.07 + Scales.deviceHeight * 0.15
        return (
            <View style={{ width: Scales.deviceWidth * 0.90, alignSelf: "center", height: heights, backgroundColor: 'white', }}>

                <View style={{ width: Scales.deviceWidth * 0.90, borderTopWidth: 0.3, height: heights, alignSelf: "center", }}>
                    <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.90, }}>
                        <View style={{ width: Scales.deviceWidth * 0.70, height: Scales.deviceHeight * 0.07, justifyContent: 'center', backgroundColor: this.state.selected == false ? "white" : "#dde9fb" }}>
                            <Text style={{ fontSize: Scales.moderateScale(14), paddingLeft: 15, fontFamily: "roboto-medium",color:"#3c3c3c" }}>{this.props.data.name}</Text>
                        </View>

                        <TouchableOpacity style={{ backgroundColor: "#dde9fb" }} onPress={() => this.setState({ collapse: !this.state.collapse, selected: !this.state.selected })}><View style={{ width: Scales.deviceWidth * 0.20, height: Scales.deviceHeight * 0.07, alignItems: "center", justifyContent: 'center', backgroundColor: this.state.selected == false ? "white" : "#dde9fb", }}>
                            {this.state.collapse == true ? <Image source={require("../../assets/Images/plusblack.png")} /> : <Image source={require("../../assets/Images/minusblack.png")} />}
                        </View></TouchableOpacity>
                    </View>

                    {/* <Collapsible collapsed={this.state.collapse}> */}
                    {this.state.collapse ? null : <FlatList
                        data={this.state.list}

                        renderItem={({ item, index }) => <ListFlat data={item} job_id={this.props.data.id} job_title={this.props.data.name} ResetState={this.props.ResetState} index={index} navigation={this.props.navigation} />}
                        keyExtractor={(item, index) => index}
                        style={{ zIndex: 2, backgroundColor: "white", borderTopWidth: 0.5 }}

                    />}
                    {/* </Collapsible> */}
                </View>


            </View>
        )
    }

}


class ListFlat extends Component {
    constructor(props) {
        super(props)
    }

    _clear_data = () => {

    }

    show = () => {
        if (this.props.data.id == 1) {
            // this.props.navigation.navigate('pending', { "job_id": this.props.job_id })
            this.props.ResetState()
            this.props.navigation.navigate('evaluation', { "job_id": this.props.job_id,"status":0 })


        }
        if (this.props.data.id == 2) {
            this.props.ResetState()
            this.props.navigation.navigate('evaluation', { "job_id": this.props.job_id })
        }
        if (this.props.data.id == 3) {
            this.props.ResetState()
            this.props.navigation.navigate('track', { "job_id": this.props.job_id, "job_title": this.props.job_title, previous_screen: "jobs" })
        }

    }

    render() {
        return (
            <View style={{ width: Scales.deviceWidth * 0.90, backgroundColor: "#ededed", height: Scales.deviceHeight * 0.05, }}>
                <TouchableOpacity onPress={this.show}><View style={{ width: Scales.deviceWidth * 0.90, borderBottomWidth: 0.8, justifyContent: "center", height: Scales.deviceHeight * 0.05, zIndex: 25 }}>
                    <Text style={{ textAlign: "left", paddingLeft: 20, fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), }}>{this.props.data.name}</Text>
                </View></TouchableOpacity>

            </View>
        )
    }
}