import React, { Component } from 'react';
import { View, Text, ScrollView, Image, FlatList, AsyncStorage, Alert, SafeAreaView } from 'react-native';
import { Scales } from "@common"
import GetFetch from "../ajax/GetFetch"
import moment from "moment"
import NetworkUtils from "../common/globalfunc"
import Toast from 'react-native-simple-toast';
import * as RNLocalize from "react-native-localize"


export default class Activies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            refreshing: false
        }
        this.get_data()
    }

    get_data = async () => {
        this.setState({ refreshing: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        console.log("Recent headers==>>", headers)
        let json = await GetFetch(name = "GetRecentActivities", header = headers)

        if (json != null) {
            // console.log('recent acitivities',json)
            if (json.error == 0) {

                this.setState({
                    data: json.data
                })

            }
            else {
                console.log(json)
                alert(json.message)
            }
        }
        else {

            // let check_connection = await NetworkUtils.isNetworkAvailable()
            // if (check_connection) {

            //     Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

            // }
            // else {
            //     Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
            // }
        }

        this.setState({ refreshing: false })

    }

    render() {

        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "#faf9fd" }}>


                {this.state.data.length != 0 ? <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => <RecentList data={item} index={index} />}
                    keyExtractor={(item, index) => String(index)}
                    onRefresh={this.get_data}
                    refreshing={this.state.refreshing}
                    windowSize={21}
                /> : <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ textAlign: "center", color: "#3c3c3c" }}>No Activities</Text>
                    </View>}


            </View>
        )
    }
}


class RecentList extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount = () => {
        if (true) {
            // console.log(this.props.data, "{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
        }

    }
    render() {



        var today = moment().format("YYYY-MM-DDTHH:mm:ssZ")





        // console.log(today, "tofay dare")

        var applied_date = moment(this.props.data.created_at)
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


        let colr = '#ff5367'
        if (this.props.index % 2 == 0) {
            colr = "#ffa001"
        }
        var dates = null

        if (today > applied_date) {
            var diff = moment.duration(moment(today).diff(moment(applied_date)))


            diff = Math.round(((diff / 60000)))

            var days = null


            var days = null


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




        // console.log(dates)
        return (
            //<SafeAreaView style={{flex:1}}>
            <View>
                {this.props.data.activity_type == 5 || this.props.data.activity_type == 3 || this.props.data.activity_type == 1 ? <View style={{
                    flexDirection: 'row', width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.085, alignSelf: 'center', backgroundColor: 'white', elevation: 2, marginTop: Scales.deviceHeight * 0.012, borderRadius: 5, shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 2,
                }}>
                    <View style={{ width: Scales.deviceHeight * 0.06, height: Scales.deviceHeight * 0.06, borderRadius: Scales.deviceHeight * 0.06 / 2, backgroundColor: colr, alignSelf: 'center', marginLeft: Scales.deviceWidth * 0.028, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), fontFamily: 'roboto-bold', color: 'white', textTransform: "uppercase" }}>{this.props.data.pitcher_fname.slice(0, 2)}</Text>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.06, flexDirection: 'column', left: Scales.deviceWidth * 0.012, alignSelf: 'center', }}>
                        <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', paddingLeft: Scales.deviceWidth * 0.012, color: "#3c3c3c" }}>{this.props.data.pitcher_fname} {this.props.data.pitcher_lname}</Text>
                        <View style={{ flexDirection: 'row', flexBasis: 25, paddingLeft: Scales.deviceWidth * 0.012 }}>
                            <Image source={require('../assets/Images/pending_clock.png')} style={{ resizeMode: 'contain', alignSelf: 'center', width: Scales.deviceWidth * 0.04, height: Scales.deviceHeight * 0.02 }}></Image>
                            <Text style={{ alignSelf: 'center', fontFamily: 'roboto-regular', left: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(12), color: "#3c3c3c", }}>{days} </Text>
                        </View>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.085, justifyContent: 'center', left: Scales.deviceWidth * 0.02, }}>
                        <View style={{ borderColor: "#ffa001", width: Scales.deviceWidth * 0.20, borderRadius: 5, height: Scales.deviceHeight * 0.03, alignSelf: 'flex-end', justifyContent: "center", backgroundColor: '#ffc972', }}>
                            <Text style={{ textAlign: 'center', textAlignVertical: "center", color: "#ffa001", fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(10) }}>{this.props.data.activity_type == 5 ? "Evaluated" : this.props.data.activity_type == 3 ? "Viewed" : this.props.data.activity_type == 1 ? "Profile Viewed" : null}</Text>
                        </View>

                    </View>
                </View> : null}

                {this.props.data.activity_type == 4 ? <View style={{ flexDirection: 'row', width: Scales.deviceWidth * 0.95, minHeight: Scales.deviceHeight * 0.085, alignSelf: 'center', backgroundColor: 'white', elevation: 2, marginTop: Scales.deviceHeight * 0.012, borderRadius: 5 }}>
                    <View style={{ width: Scales.deviceHeight * 0.06, height: Scales.deviceHeight * 0.06, borderRadius: Scales.deviceHeight * 0.06 / 2, backgroundColor: colr, alignSelf: 'center', marginLeft: Scales.deviceWidth * 0.028, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), fontFamily: 'roboto-bold', color: 'white', textTransform: "uppercase" }}>{this.props.data.job_name.slice(0, 2)}</Text>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.50, minHeight: Scales.deviceHeight * 0.06, flexDirection: 'column', left: Scales.deviceWidth * 0.012, alignSelf: 'center', }}>
                        <Text style={{ fontSize: Scales.moderateScale(14), fontFamily: 'roboto-medium', paddingLeft: Scales.deviceWidth * 0.012, color: "#3c3c3c", textTransform: "capitalize" }}>{this.props.data.catcher_name}</Text>
                        <View style={{ flexDirection: 'row', flexBasis: 25, paddingLeft: Scales.deviceWidth * 0.012 }}>
                            <Image source={require('../assets/Images/pending_clock.png')} style={{ resizeMode: 'contain', alignSelf: 'center', width: Scales.deviceWidth * 0.04, height: Scales.deviceHeight * 0.02 }}></Image>
                            <Text style={{ alignSelf: 'center', fontFamily: 'roboto-regular', left: Scales.deviceWidth * 0.012, fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}> {days}</Text>
                        </View>
                    </View>
                    <View style={{ width: Scales.deviceWidth * 0.25, minHeight: Scales.deviceHeight * 0.085, justifyContent: 'center', left: 8, }}>
                        <View style={{ borderColor: "#ffa001", justifyContent: 'center', borderRadius: 5, minHeight: Scales.deviceHeight * 0.03, alignSelf: 'flex-end' }}>
                            <Text style={{ textAlign: 'center', width: Scales.deviceWidth * 0.16, textAlignVertical: "center", alignSelf: "center", borderRadius: 5, color: "#ffa001", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(11) }}>Job Posted</Text>
                            <Text style={{ textAlign: 'center', textAlignVertical: "center", alignSelf: "flex-end", borderRadius: 5, color: "#ffa001", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(11) }}>{this.props.data.job_name}</Text>

                        </View>

                    </View>
                </View> : null}


            </View>
            //</SafeAreaView>
        )
    }
}