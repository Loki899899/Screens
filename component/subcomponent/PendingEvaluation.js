import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage, Image, ActivityIndicator, BackHandler, SafeAreaView } from 'react-native'
import Header from '../DrawerHeader';
import { Scales } from "@common"
import Modal from "react-native-modal"
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment-timezone';
import NetworkUtils from "../../common/globalfunc"
import Toast from 'react-native-simple-toast';
import * as RNLocalize from 'react-native-localize';
import { URL } from "../../ajax/PostFetch"

export default class PendingEvaluation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pending_evaulation: [],
            offset: 0,
            loading: false,
            limit: 20
        }

    }

    GetPendingEvaulations = async () => {
        this.setState({ loading: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        let url = ''
        if (this.props.navigation.state.params.job_id != undefined) {
            url = URL.api_url + "pending-evaluation-list?offset=" + this.state.offset + "&limit=" + this.state.limit + "&job_id=" + this.props.navigation.state.params.job_id


        }
        else {
            url = URL.api_url + "pending-evaluation-list?offset=" + this.state.offset + "&limit=" + this.state.limit

        }




        await fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(respJson => {
                this.setState({
                    pending_evaulation: respJson.data,
                    offset: this.state.offset + 20,
                    limit: this.state.limit + 20

                })
            })
            .catch(async (err) => {

                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })
        this.setState({ loading: false })
    }

    _get_more_data = async () => {
        this.setState({ loading: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        let url = ''
        if (this.props.navigation.state.params.job_id != undefined) {
            url = URL.api_url + "pending-evaluation-list?offset=" + this.state.offset + "&limit=" + this.state.limit + "&job_id=" + this.props.navigation.state.params.job_id


        }
        else {
            url = URL.api_url + "pending-evaluation-list?offset=" + this.state.offset + "&limit=" + this.state.limit

        }





        await fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(respJson => {
                if (respJson != null) {

                    if (respJson.error == 0) {
                        var previous_data = this.state.pending_evaulation.concat(respJson.data)

                        // console.log(previous_data)

                        this.setState({
                            pending_evaulation: previous_data,

                            offset: this.state.offset + 20,
                            limit: this.state.limit + 20

                        })

                    }
                    else {
                        alert(respJson.message)
                    }


                }
                else {
                    // alert("Something Went Wrong !!!")
                }

            })
            .catch(async (err) => {

                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    // console.error(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })
        this.setState({ loading: false })
    }

    _onrefresh = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };


        let url = ''
        if (this.props.navigation.state.params.job_id != undefined) {
            url = URL.api_url + "pending-evaluation-list?offset=" + 0 + "&limit=" + 20 + "&job_id=" + this.props.navigation.state.params.job_id


        }
        else {
            url = URL.api_url + "pending-evaluation-list?offset=" + 0 + "&limit=" + 20

        }

        // console.log(url, "LLL")



        await fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())

            .then(respJson => {
                if (respJson != null) {

                    if (respJson.error == 0) {
                        // var previous_data = this.state.pending_evaulation.concat(respJson.data)

                        // console.log(previous_data)

                        this.setState({
                            pending_evaulation: respJson.data
                        })

                    }
                    else {
                        alert(respJson.message)
                    }


                }
                else {
                    // alert("Something Went Wrong !!!")
                }

            }
            )
            .catch(async (err) => {

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
    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        console.log("pending remove-------")
        this.props.navigation.goBack();
        return true;
    }
    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }



    componentDidMount() {

        fetch("https://extreme-ip-lookup.com/json/")
            .then((resp) => resp.json())
            .then((json) => {
                // console.log(json)
                // console.log("==================== json ====================================")
            })
        // console.log(this.props.navigation.state)
        this.GetPendingEvaulations()

    }


    render() {
        let backfunc = []
        if (this.props.navigation.state.params.job_id != undefined) {

        }
        else {
            let backfunc = [this.props.navigation.state.params.interview, this.props.navigation.state.params.pending]
        }


        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Header heading="Awaiting Decision" widths={Scales.deviceWidth * 0.52} {...this.props} textalign='right' backfunc={backfunc} left={Scales.deviceWidth * 0.04} back={true} />

                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.90, flexDirection: "column" }}>

                        {this.state.pending_evaulation.length != 0 ? <FlatList
                            data={this.state.pending_evaulation}
                            renderItem={({ item, index }) => <PendingDesign title={item} key={item.id} index={index} navigation={this.props.navigation} />}
                            // keyExtractor={index => index.toString()}
                            onEndReached={this.state.pending_evaulation.length < 8 ? null : this._get_more_data}
                            style={{}}
                            onEndReachedThreshold={0.5}
                            windowSize={20}

                        /> : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: "center", fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14) }}>No Records Found.</Text>
                            </View>}

                    </View>
                    <Modal isVisible={this.state.loading}>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator size={20} style={{ alignSelf: "center" }} />
                        </View>

                    </Modal>
                </View>
            </SafeAreaView>
        )

    }
}



class PendingDesign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            img_height: 0, image: ""
        }
    }
    componentDidMount = async () => {
        console.log(this.props.title)
        let img = this.props.title.jobma_pitcher_url
        let ext = String(img).split(".")
        console.log(ext)
        ext = ext[ext.length - 1]
        console.log(ext, "props.title.jobma_pitcher_urllprops.title.jobma_pitcher_urlprops.title.jobma_pitcher_url")
        if (ext == "jpg") {

            this.setState({ image: this.props.title.jobma_pitcher_url })
        }

        // console.log(this.props.title.jobma_pitcher_url, "jobma_pitcher_urljobma_pitcher_url")
        // var today = new Date();
        // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // console.log(Scales.deviceWidth*0.01, "-----------------aplied dare")
        // console.log(, "tofay dare")

    }
    formatTimeByOffset = (dateString, offset) => {
        // Params:
        // How the backend sends me a timestamp
        // dateString: on the form yyyy-mm-dd hh:mm:ss
        // offset: the amount of hours to add.

        // If we pass anything falsy return empty string
        if (!dateString) return ''
        if (dateString.length === 0) return ''

        // Step 1: Parse the backend date string

        // Get Parameters needed to create a new date object
        const year = dateString.slice(0, 4)
        const month = dateString.slice(5, 7)
        const day = dateString.slice(8, 10)
        const hour = dateString.slice(11, 13)
        const minute = dateString.slice(14, 16)
        const second = dateString.slice(17, 19)

        // Step: 2 Make a JS date object with the data
        const dateObject = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)

        // Step 3: Get the current hours from the object
        const currentHours = dateObject.getHours()

        // Step 4: Add the offset to the date object
        dateObject.setHours(currentHours + offset)

        // Step 5: stringify the date object, replace the T with a space and slice off the seconds.
        const newDateString = dateObject
            .toISOString()
            .replace('T', ' ')
            .slice(0, 16)

        // Step 6: Return the new formatted date string with the added offset
        return `${newDateString}`
    }
    render() {

        // var changed_date = Date(this.props.title.applied_date)
        // var offsetInHours = changed_date.getTimezoneOffset() / 60;
        // console.log(offsetInHours, "-------------------------------offsethour of utme======================")
        var today = moment().format("YYYY-MM-DDTHH:mm:ssZ")

        // console.log(today, "tofay dare")

        var applied_date = moment(this.props.title.applied_date)
        // var dateFormat = 'YYYY-DD-MM HH:mm:ss';
        // var testDateUtc = moment.utc(this.props.title.applied_date);
        // var localDate = testDateUtc.local();
        // console.log(this.props.title.applied_date, "-----------this.props.title.applied_datep------")
        // console.log(localDate.format(dateFormat), "-------------------local tume date ");
        const deviceTimeZone = RNLocalize.getTimeZone();
        // console.log(deviceTimeZone, "---------deviceTimeZone-------")


        // console.log( "-------------------------- time diff ========================", this.props.data.pitcher_fname)
        // console.log(this.props.title.applied_date, "aplied dare type")

        // applied_date = moment(applied_date).add(570, "minutes").format("YYYY-MM-DDTHH:mm:ssZ")
        applied_date = moment(applied_date).tz("America/New_York")
        const currentTimeZoneOffsetInHours = moment(applied_date).utcOffset() / 60;
        // console.log(currentTimeZoneOffsetInHours, "currentTimeZoneOffsetInHours")
        let server_time_zone_time = ""
        if (Math.sign(currentTimeZoneOffsetInHours) == -1) {
            server_time_zone_time = moment(applied_date).subtract(currentTimeZoneOffsetInHours, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        else {
            server_time_zone_time = moment(applied_date).add(currentTimeZoneOffsetInHours, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        // console.log((server_time_zone_time), "-------server_time_zone_time------")
        // console.log(today, "9999999999999999999today )))))))))))))))))))))))))))))")
        let india_server = moment(server_time_zone_time).tz(deviceTimeZone)
        const currentTimeZoneOffsetIn = moment(india_server).utcOffset() / 60;
        if (Math.sign(currentTimeZoneOffsetIn) == -1) {
            applied_date = moment(india_server).subtract(currentTimeZoneOffsetIn, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        else {
            applied_date = moment(india_server).add(currentTimeZoneOffsetIn, "hours").format("YYYY-MM-DDTHH:mm:ssZ")

        }
        // console.log(currentTimeZoneOffsetIn, "--------currentTimeZoneOffsetIn----------")
        // console.log((india_server), "-------india_servertime_zone_time------")





        let colr = '#ff5367'
        if (this.props.index % 2 == 0) {
            colr = "#ffa001"
        }
        var dates = null

        if (today > applied_date) {
            var diff = moment.duration(moment(today).diff(moment(applied_date)))


            diff = Math.round(((diff / 60000)))

            var days = null


            // diff = Math.round(diff / 3600000)
            var days = null
            // console.log(this.props.title.applied_id)
            // if(this.props.title.pitcher_fname=="Sujeet"){
                console.log(diff, "================== diff ==================",diff,typeof(diff), this.props.title.pitcher_fname)

            // }

            if (diff < 60) {
                if (diff >= 1) {
                    days = diff + " minutes ago"
                }
                else if (diff == 0) {
                    days = "Just an moment"
                }

            }

            else if (diff > 60 && diff <= 1440) {

                diff = Math.round(diff / 60)

                days = diff + " hours ago"
            }
            else if (diff > 1440 && diff <= 10080) {
                diff = Math.round((diff / 60) / 24)

                days = diff + " days ago"

            }
            else if (diff >= 10080) {

                diff = Math.round(((diff / 60) / 24) / 7)
                days = diff + " weeks ago"
            }


        }
        else {

        }

        let ext = this.state.image.split(".")
        ext = ext[ext.length - 1]
        // console.log(ext, "------ext lll----")
        // let img_height = ""

        // if(ext=="jpg"){
        //     Image.getSize( this.props.title.jobma_pitcher_url, (width, height) => {
        //         this.setState({img_height:height})
        //         // console.log(img_height, "------------------------image heifht---------------------")
        //       }, (error) => {
        //         console.error(`Couldn't get the image size: ${error.message}`);
        //       });

        // }

        return (
            <React.Fragment key={this.props.key}>
                <View style={{ height: Scales.deviceHeight * 0.10, width: Scales.deviceWidth * 1.0, alignItems: "center" }}>
                    <View style={{ width: Scales.deviceWidth * 0.95, flexDirection: 'row', height: Scales.deviceHeight * 0.09, backgroundColor: 'white', elevation: 3, borderRadius: 10, }}>
                        <View style={{ width: Scales.deviceWidth * 0.19, height: Scales.deviceHeight * 0.08, justifyContent: 'center', paddingTop: Scales.deviceHeight * 0.01 }}>
                            {this.state.image == "" ? <View style={{ width: Scales.deviceHeight * 0.07, justifyContent: "center", alignSelf: 'center', backgroundColor: this.props.index % 2 == 0 ? "#ff5367" : "#ffa001", borderRadius: Scales.deviceHeight * 0.035, height: Scales.deviceHeight * 0.07 }}>
                                <Text style={{ textAlign: "center", fontFamily: "roboto-medium", fontSize: Scales.moderateScale(16), color: "white" }}>{this.props.title.pitcher_fname.slice(0, 2)}</Text>
                            </View> : null}
                            {this.state.image != "" ? <View style={{ height: Scales.deviceHeight * 0.07, alignSelf: "center", justifyContent: "center", borderRadius: Scales.deviceHeight * 0.07 / 2, width: Scales.deviceWidth * 0.13, }} >
                                <Image onError={() => this.setState({ image: "" })} source={{ uri: this.state.image }} style={{ alignSelf: "center", width: Scales.deviceHeight * 0.07, height: Scales.deviceHeight * 0.07, borderRadius: (Scales.deviceHeight * 0.07) / 2 }} /></View> : null}
                        </View>
                        <View style={{ width: Scales.deviceWidth * 0.57, height: Scales.deviceHeight * 0.09, justifyContent: "center" }}>


                            <Text style={{ fontSize: Scales.moderateScale(13), fontFamily: 'roboto-regular', color: "#3c3c3c" }}><Text style={{ fontWeight: "bold", color: "#3c3c3c" }}>{this.props.title.pitcher_fname} {this.props.title.pitcher_lname}</Text> applied for <Text style={{ fontWeight: "bold", color: "#3c3c3c" }}>{this.props.title.job_title}</Text></Text>

                            {/* <Text style={{fontSize:12, fontFamily: 'roboto-regular' }}>{this.state.pending_evaluation[i].applied_date}</Text> */}
                            <View style={{ flexDirection: "row", marginTop: 2 }}>
                                <Image source={require("../../assets/Images/clock.png")} style={{ width: Scales.deviceWidth * 0.035, resizeMode: "contain", paddingTop: 3, height: Scales.deviceHeight * 0.02, top: 1 }} />
                                <Text style={{ fontSize: Scales.moderateScale(11), fontFamily: 'roboto-regular', left: 5, color: "#3c3c3c" }}>Interviewed On {days}  </Text></View>
                        </View>

                        <View style={{ width: Scales.deviceWidth * 0.14, height: Scales.deviceHeight * 0.08, flexDirection: "column", justifyContent: 'center', alignItems: "flex-start", }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Evaluate", { "appiled_id": this.props.title.applied_id, "image": ext == "jpg" ? this.props.title.jobma_pitcher_url : null })}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.03, borderRadius: 5, borderWidth: 1, borderColor: "#ffa001", justifyContent: "center", }}>
                                <Text style={{ color: "#ffa001", fontFamily: 'roboto-regular', textAlign: 'center', fontSize: Scales.moderateScale(10) }}>Evaluate</Text>
                            </View></TouchableOpacity>
                        </View>

                    </View>
                </View>

            </React.Fragment>
        )
    }
}