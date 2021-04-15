import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Image, FlatList, AsyncStorage, BackHandler, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import Header from '../DrawerHeader';
import { CheckBox } from 'react-native-elements'
import CalendarPicker from 'react-native-calendar-picker';
import { Scales } from "@common"
import Modal from "react-native-modal"
import TImeZoneList from '../subcomponent/timezonelist'
import moment from 'moment';
import Popover from 'react-native-popover-view';
import NetworkUtils from "../../common/globalfunc"

import Toast from 'react-native-simple-toast';
import AntI from "react-native-vector-icons/AntDesign"
import { URL } from "../../ajax/PostFetch"






export default class SetupInterview_second extends Component {

    constructor(props) {
        super(props)
        this.state = {
            select_interview_type: 1,
            select_interview_type_detail: null,
            select_starttime: null,
            select_time_flag: false,
            no_of_candidate: 1,
            no_cand_index: 0,
            show_toast: false,
            toast_message: '',
            checked: false,
            modalvisible: false,
            mobile_code_list: [],
            mobile_code_list1: [],
            mobile_code_list2: [],
            mobile_code_list3: [],
            mobile_code_list4: [],
            selectedStartDate: null,
            candidate_name_1: null,
            candidate_name_2: null,
            candidate_name_3: null,
            candidate_name_4: null,
            candidate_name_5: null,
            candidate_email_1: null,
            candidate_email_2: null,
            candidate_email_3: null,
            candidate_email_4: null,
            candidate_email_5: null,
            candidate_phone_1: null,
            candidate_phone_2: null,
            candidate_phone_3: null,
            candidate_phone_4: null,
            candidate_phone_5: null,
            open_candidate: 1,
            open_drop_no: [false, false, false, false, false],
            candidate_phone_code: ["", "", "", "", "", ""],
            selected_pin_code: {},
            scrollview_scroll: true,
            select_timezone: null,
            timezone_modalvisible: false,
            starttime_modal: false,
            timezone: null,
            fixed_timezone: [],
            start_time: null,
            end_time: null,
            end_modal: false,
            alert_modal: false,
            limit_add_modal: false,
            index_slice_time_list: 0,
            index_slice_starttime_list: 0,
            select_date_modal: false,
            sms_notification: false,
            date_format: "YYYY/MM/DD",
            selected_interview: "Pre-recorded Video Interview",
            interview_pop: false,
            phonecodePop: false,
            phonecodePop1: false,
            phonecodePop2: false,
            phonecodePop3: false,
            phonecodePop4: false,
            start_time_list: [
                {
                    name: "09:00 AM"
                },
                {
                    name: "09:30 AM"
                },
                {
                    name: "10:00 AM"
                },
                {
                    name: "10:30 AM"
                },
                {
                    name: "11:00 AM"
                },
                {
                    name: "11:30 AM"
                },
                {
                    name: "12:00 PM"
                },
                {
                    name: "12:30 PM"
                },
                {
                    name: "01:00 PM"
                },
                {
                    name: "01:30 PM"
                },
                {
                    name: "02:00 PM"
                },
                {
                    name: "02:30 PM"
                },
                {
                    name: "03:00 PM"
                },
                {
                    name: "03:30 PM"
                },
                {
                    name: "04:00 PM"
                },
                {
                    name: "04:30 PM"
                },
                {
                    name: "05:00 PM"
                },
                {
                    name: "05:30 PM"
                },
                {
                    name: "06:00 PM"
                },
                {
                    name: "06:30 PM"
                },
                {
                    name: "07:00 PM"
                },
                {
                    name: "07:30 PM"
                },
                {
                    name: "08:00 PM"
                },
                {
                    name: "08:30 PM"
                }

            ],
            interview_type: [
                {
                    "id": 1,
                    "name": "pre-recorded Video Interview"
                },
                {
                    "id": 2,
                    "name": "live Video Interview"
                }
            ],
            wallet_credit: 0,
            is_unlimited: false,
            disbale_invite: true



        }




    }

    onDateChange = (date) => {
        let today = moment.utc().format("YYYY-MM-DD")
        let select_dates = moment.utc(date).format("YYYY-MM-DD")
        if (this.state.select_interview_type == 2) {
            if (today > select_dates) {
                Toast.showWithGravity("Select valid date", Toast.SHORT, Toast.BOTTOM);
                return 0
            }
        }

        if (this.state.select_interview_type == 1) {
            console.log("LIVE OR NOT")
            let next_date_from_today = moment(today).add(1, "day")
            if (next_date_from_today >= select_dates) {
                Toast.showWithGravity("Select valid date", Toast.SHORT, Toast.BOTTOM);
                return 0
            }

            if (today >= select_dates) {
                Toast.showWithGravity("Select valid date", Toast.SHORT, Toast.BOTTOM);
                return 0
            }
        }



        this.setState({
            selectedStartDate: date,
            modalvisible: false

        });
        // console.log(this.state.selectedStartDate, "date")



    }

    Add_more_candidate = () => {
        if (this.state.no_of_candidate == 5) {
            this.setState({ limit_add_modal: true, })
        }
        else {

            if (this.state.no_of_candidate == 1) {


                this.setState({ candidate_phone_2: "", no_of_candidate: this.state.no_of_candidate + 1, no_cand_index: this.state.no_cand_index + 1, open_candidate: this.state.open_candidate + 1 })

            }
            else if (this.state.no_of_candidate == 2) {

                this.setState({ candidate_phone_3: "", no_of_candidate: this.state.no_of_candidate + 1, no_cand_index: this.state.no_cand_index + 1, open_candidate: this.state.open_candidate + 1 })


            }
            else if (this.state.no_of_candidate == 3) {

                this.setState({ candidate_phone_4: "", no_of_candidate: this.state.no_of_candidate + 1, no_cand_index: this.state.no_cand_index + 1, open_candidate: this.state.open_candidate + 1 })


            }
            else if (this.state.no_of_candidate == 4) {

                this.setState({ candidate_phone_5: "", no_of_candidate: this.state.no_of_candidate + 1, no_cand_index: this.state.no_cand_index + 1, open_candidate: this.state.open_candidate + 1 })


            }

            // this.setState({ no_of_candidate: this.state.no_of_candidate + 1, no_cand_index: this.state.no_cand_index + 1, open_candidate: this.state.open_candidate + 1 })

        }

    }

    delete_candidate = () => {
        if (this.state.no_of_candidate == 1) {
            return 0;
        }
        else {
            if (this.state.no_of_candidate == 2) {
                let code = this.state.candidate_phone_code
                code[2] = ""
                this.setState({ candidate_email_2: null, candidate_phone_code: code, candidate_name_2: null, candidate_phone_2: null, no_of_candidate: this.state.no_of_candidate - 1, open_candidate: this.state.open_candidate - 1 })

            }
            else if (this.state.no_of_candidate == 3) {
                let code = this.state.candidate_phone_code
                code[3] = ""
                this.setState({ candidate_email_3: null, candidate_phone_code: code, candidate_name_3: null, candidate_phone_3: null, no_of_candidate: this.state.no_of_candidate - 1, open_candidate: this.state.open_candidate - 1 })


            }
            else if (this.state.no_of_candidate == 4) {
                let code = this.state.candidate_phone_code
                code[3] = ""
                this.setState({ candidate_email_4: null, candidate_phone_code: code, candidate_name_4: null, candidate_phone_4: null, no_of_candidate: this.state.no_of_candidate - 1, open_candidate: this.state.open_candidate - 1 })


            }
            else if (this.state.no_of_candidate == 5) {
                let code = this.state.candidate_phone_code
                code[3] = ""
                this.setState({ candidate_email_5: null, candidate_phone_code: code, candidate_name_5: null, candidate_phone_5: null, no_of_candidate: this.state.no_of_candidate - 1, open_candidate: this.state.open_candidate - 1 })


            }



            // this.setState({ no_of_candidate: this.state.no_of_candidate - 1, open_candidate: this.state.open_candidate - 1 })
        }
    }

    select_starttime = async (item) => {
        // const data = JSON.stringify(item)
        let index = this.state.start_time_list.indexOf(item)

        await this.setState({
            select_starttime: item,
            select_time_flag: true,
            starttime_modal: false,
            end_time: null,
            index_slice_time_list: index,
            index_slice_starttime_list: 0
        })



    }


    select_endtime = async (item) => {
        // const data = JSON.stringify(item)
        let index = this.state.start_time_list.indexOf(item)


        await this.setState({
            end_time: item,
            end_modal: false,
            index_slice_starttime_list: index,

            // select_time_flag: true
        })



    }


    select_timezone = async (item) => {
        // const data = JSON.stringify(item)

        await this.setState({
            select_timezone: item,
            timezone_modalvisible: false,
            timezone: this.state.fixed_timezone
        })



    }



    show_start_time = () => {
        this.setState({
            starttime_modal: true
        })
    }

    show_end_time = () => {
        this.setState({
            end_modal: true
        })
    }

    show_calender = () => {
        this.setState({
            modalvisible: true
        })
    }

    show_timezone = () => {
        this.setState({
            timezone_modalvisible: true
        })
    }


    get_timezone = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        await fetch(URL.api_url + "time-zone-list", {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((resp) => {
                if (resp.error == 0) {
                    this.setState({
                        timezone: resp.data,
                        fixed_timezone: resp.data
                    })


                }
                else {
                    alert(resp.message)
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


    }

    Get_phone_code = async () => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        };
        await fetch(URL.api_url + "phonecode", {
            method: 'GET',
            headers: headers
        })
            .then((response) => response.json())
            .then((resp) => {
                // console.log(resp.data)
                let phone_codes = []
                for (let code of resp.data) {
                    // console.log(code, "lllllllll")
                    code = {
                        "name": code.name,
                        "phone_code": "+" + String(code.phone_code)
                    }
                    phone_codes.push(code)

                }
                if (resp.error == 0) {
                    this.setState({
                        mobile_code_list: phone_codes,
                        mobile_code_list1: phone_codes,
                        mobile_code_list2: phone_codes,
                        mobile_code_list3: phone_codes,
                        mobile_code_list4: phone_codes,
                        fixed_mobile_code_list: phone_codes
                    })


                }
                else {
                    // alert(resp.message)
                    Toast.showWithGravity(resp.message, Toast.LONG, Toast.BOTTOM);
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

            },
            )


    }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // }

    navigationButtonPressed({ buttonId }) {
        this.handleBackPress();
    }

    handleBackPress = () => {
        //Custom logic
        console.log(this.props.navigation.state.params.dash, this.props.navigation.state.params, "this.props.navigation.state.params.dash")
        if (this.props.navigation.state.params.dash == true) {
            this.props.navigation.navigate("fourthscreen", { "dash": this.props.navigation.state.params.dash })
        }
        else {
            this.props.navigation.navigate("fourthscreen", { "dash": false })
        }
        return true;
    };


    Get_wallet_credit = async () => {
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Key': await AsyncStorage.getItem('token')
        };
        console.log(URL.api_url, "--------URL API------")
        await fetch(URL.api_url + "wallet-amount", {
            method: 'GET',
            headers: header
        })
            .then(response => response.json())
            .then(respJson => {
                console.log(respJson)
                if (respJson != null) {

                    if (respJson.error == 0) {


                        this.setState({
                            wallet_credit: respJson.data.amount,
                            disbale_invite: false
                        })



                    }
                    else {
                        Toast.showWithGravity(respJson.message, Toast.SHORT, Toast.BOTTOM)
                    }


                }
                else {
                    // alert("Something Went Wrong !!!")
                }
            })
            .catch(async (err) => {

                let check_connection = await NetworkUtils.isNetworkAvailable()
                if (check_connection) {
                    console.log(err)
                    Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                }
                else {
                    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                }
            })
    }


    componentDidMount = async () => {
        await this.Get_wallet_credit()
        let date_format = await AsyncStorage.getItem('date_format')
        let is_unlimited = await AsyncStorage.getItem('unlimited')
        this.setState({ is_unlimited: is_unlimited })
        if (date_format == null) {
            this.setState({ date_format: "YYYY/MM/DD" })
        }
        else {
            this.setState({ date_format: date_format })
        }
        // console.log(typeof(this.state.is_unlimited), "this.state.is_unlimited")

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.Get_phone_code()
        console.log(this.props.navigation.state.params.create_job, "this.props.navigation.state.params.create_jobthis.props.navigation.state.params.create_job")

        this.props.navigation.state.params._clear_data()


        this.get_timezone()
        fetch("https://www.iplocate.io/api/lookup/")
            .then((resp) => resp.json())
            .then((json) => {
                console.log(json)
                // console.log("==================== json ====================================")
                let country_name = json.country.slice(0, 3)
                fetch("https://restcountries.eu/rest/v2/alpha/" + country_name)
                    .then((res) => res.json())
                    .then((resJson) => {
                        console.log(resJson)
                        let callingCodes = "+" + String(resJson.callingCodes[0])
                        let code_arr = ["", callingCodes, callingCodes, callingCodes, callingCodes, callingCodes]
                        // console.log(code_arr)
                        this.setState({ candidate_phone_code: code_arr })

                    })
                    .catch(async (err) => {
                        console.log(err)
                        let check_connection = await NetworkUtils.isNetworkAvailable()
                        if (check_connection) {
                            console.log(err)
                            //Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);

                        }
                        else {
                            Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
                        }
                    })

            })
        // console.log(this.props.navigation.state)


    }

    GotoNext = () => {

        if (this.state.select_interview_type == 2) {
            if (this.state.is_unlimited == "false") {
                // console.log("wan")
                if (this.state.wallet_credit <= 0) {
                    Toast.showWithGravity("You dont have enough credits to invite live interview", Toast.SHORT, Toast.BOTTOM)

                    return 0
                }
            }

            if (this.state.select_timezone == null) {
                Toast.showWithGravity("Select Timezone", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Select Timezone" })
                return 0

            }
            if (this.state.select_starttime == null) {
                Toast.showWithGravity("Select Start Time", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Select Start Time" })
                return 0

            }
            if (this.state.end_time == null) {
                Toast.showWithGravity("Select End Time", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Select End Time" })
                return 0

            }
            if (this.state.selectedStartDate == null) {
                Toast.showWithGravity("Select date", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Select End Time" })
                return 0

            }

        }


        if (this.state.open_candidate == 1) {
            // let trim = String(this.state.candidate_name_1).trimLeft()


            if (this.state.candidate_name_1 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_1 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
        }

        if (this.state.open_candidate == 2) {
            if (this.state.candidate_name_1 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_1 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }

            if (this.state.candidate_name_2 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_2 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
        }

        if (this.state.open_candidate == 3) {
            if (this.state.candidate_name_1 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_1 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }

            if (this.state.candidate_name_2 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_2 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
            if (this.state.candidate_name_3 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_3 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
        }

        if (this.state.open_candidate == 4) {
            if (this.state.candidate_name_1 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_1 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }

            if (this.state.candidate_name_2 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_2 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
            if (this.state.candidate_name_3 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_3 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
            if (this.state.candidate_name_4 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_4 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
        }

        if (this.state.open_candidate == 5) {
            if (this.state.candidate_name_1 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_1 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }

            if (this.state.candidate_name_2 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_2 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
            if (this.state.candidate_name_3 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_3 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
            if (this.state.candidate_name_4 == null) {
                Toast.showWithGravity("Enter Name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_4 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
            if (this.state.candidate_name_5 == null) {
                Toast.showWithGravity("Enter name", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Name" })

                return 0
            }
            if (this.state.candidate_email_5 == null) {
                Toast.showWithGravity("Enter Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Email Address" })

                return 0
            }
        }


        if (this.state.sms_notification == true) {
            // console.warn(this.state.open_candidate == 1 || this.state.candidate_phone_code[1]=="")
            if (this.state.open_candidate == 1) {
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_1 == "") {
                    Toast.showWithGravity("Enter phone no", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })
                    return 0
                }
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_code[1] == "") {
                    Toast.showWithGravity("Enter phone code", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone code" })
                    return 0
                }
            }

            if (this.state.open_candidate == 2) {
                // console.warn("OOOOOOOO")
                // console.warn(this.state.candidate_phone_2)
                // console.warn(this.state.candidate_phone_1)
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_2 == "") {
                    Toast.showWithGravity("Phone number required", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })

                    return 0
                }
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_code[1] == "" || this.state.candidate_phone_code[2] == "") {
                    Toast.showWithGravity("Enter phone code", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "please enter phone code" })

                    return 0
                }
            }

            if (this.state.open_candidate == 3) {
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_1 == "" || this.state.candidate_phone_2 == null || this.state.candidate_phone_2 == "" || this.state.candidate_phone_3 == null || this.state.candidate_phone_3 == "") {
                    Toast.showWithGravity("Phone number required", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })

                    return 0
                }
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_3 == null || this.state.candidate_phone_code[1] == "" || this.state.candidate_phone_code[2] == "" || this.state.candidate_phone_code[3] == "") {
                    Toast.showWithGravity("Enter phone code", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "please enter phone code" })

                    return 0
                }
            }

            if (this.state.open_candidate == 4) {
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_3 == null || this.state.candidate_phone_4 == null || this.state.candidate_phone_1 == "" || this.state.candidate_phone_2 == "" || this.state.candidate_phone_3 == "" || this.state.candidate_phone_4 == "") {
                    Toast.showWithGravity("Phone number required", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })

                    return 0
                }
                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_3 == null || this.state.candidate_phone_4 == null || this.state.candidate_phone_code[1] == "" || this.state.candidate_phone_code[2] == "" || this.state.candidate_phone_code[3] == "" || this.state.candidate_phone_code[4] == "") {
                    Toast.showWithGravity("Enter phone code", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })

                    return 0
                }
            }
            if (this.state.open_candidate == 5) {
                if (this.state.candidate_phone_1 == "" || this.state.candidate_phone_2 == "" || this.state.candidate_phone_3 == "" || this.state.candidate_phone_4 == "" || this.state.candidate_phone_5 == "" || this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_3 == null || this.state.candidate_phone_4 == null || this.state.candidate_phone_5 == null) {
                    Toast.showWithGravity("Phone number required", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })

                    return 0
                }

                if (this.state.candidate_phone_1 == null || this.state.candidate_phone_2 == null || this.state.candidate_phone_3 == null || this.state.candidate_phone_4 == null || this.state.candidate_phone_5 == null || this.state.candidate_phone_code[1] == "" || this.state.candidate_phone_code[2] == "" || this.state.candidate_phone_code[3] == "" || this.state.candidate_phone_code[4] == "" || this.state.candidate_phone_code[5] == "") {
                    Toast.showWithGravity("Enter phone code", Toast.SHORT, Toast.BOTTOM);
                    // this.setState({ show_toast: true, toast_message: "Enter phone no" })

                    return 0
                }
            }
        }






        let context = null
        let country_code = null
        let email = null
        let name = null
        let phone = null
        let code = null


        code = this.state.candidate_phone_code.slice(1, this.state.open_candidate + 1)

        country_code = code.join(",")



        if (this.state.candidate_phone_1 != null && String(this.state.candidate_phone_1).length != 0) {
            if ((this.state.candidate_phone_1.length < 3)) {
                Toast.showWithGravity("Enter valid phone number", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            else if (this.state.candidate_phone_1.length > 20) {
                Toast.showWithGravity("Please enter no more than 20 digits.", Toast.SHORT, Toast.BOTTOM);
                return 0

            }


            phone = this.state.candidate_phone_1

        }

        if (this.state.candidate_phone_2 != null && String(this.state.candidate_phone_2).length != 0) {
            if ((this.state.candidate_phone_2.length < 3)) {
                Toast.showWithGravity("Enter valid phone number", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            else if (this.state.candidate_phone_2.length > 20) {
                Toast.showWithGravity("Please enter no more than 20 digits.", Toast.SHORT, Toast.BOTTOM);
                return 0

            }



            phone = phone + ',' + this.state.candidate_phone_2

        }

        if (this.state.candidate_phone_3 != null && String(this.state.candidate_phone_3).length != 0) {
            if ((this.state.candidate_phone_3.length < 3)) {
                Toast.showWithGravity("Enter valid phone number", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            else if (this.state.candidate_phone_3.length > 20) {
                Toast.showWithGravity("Please enter no more than 20 digits.", Toast.SHORT, Toast.BOTTOM);
                return 0

            }


            phone = phone + ',' + this.state.candidate_phone_3

        }

        if (this.state.candidate_phone_4 != null && String(this.state.candidate_phone_4).length != 0) {
            if ((this.state.candidate_phone_4.length < 3)) {
                Toast.showWithGravity("Enter valid phone number", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            else if (this.state.candidate_phone_4.length > 20) {
                Toast.showWithGravity("Please enter no more than 20 digits.", Toast.SHORT, Toast.BOTTOM);
                return 0

            }

            phone = phone + "," + this.state.candidate_phone_4


        }

        if (this.state.candidate_phone_5 != null && String(this.state.candidate_phone_5).length != 0) {
            if ((this.state.candidate_phone_5.length < 3)) {
                Toast.showWithGravity("Enter valid phone number", Toast.SHORT, Toast.BOTTOM);
                return 0

            }
            else if (this.state.candidate_phone_5.length > 20) {
                Toast.showWithGravity("Please enter no more than 20 digits.", Toast.SHORT, Toast.BOTTOM);
                return 0

            }

            phone = phone + "," + this.state.candidate_phone_5


        }



        if (this.state.candidate_name_1 != null) {

            if (!/^[a-zA-Z\s/]*$/g.test(this.state.candidate_name_1)) {
                Toast.showWithGravity("Enter letters only", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter letters only" })
                return 0
            }
            if (name == null) {
                name = this.state.candidate_name_1
            }
            else {
                name = name + ',' + this.state.candidate_name_1
            }
        }

        if (this.state.candidate_name_2 != null) {
            if (!/^[a-zA-Z\s/]*$/g.test(this.state.candidate_name_2)) {
                Toast.showWithGravity("Enter letters only", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true,toast_message : "Enter letters only" })
                return 0
            }
            if (name == null) {
                name = this.state.candidate_name_2
            }
            else {
                name = name + ',' + this.state.candidate_name_2
            }
        }

        if (this.state.candidate_name_3 != null) {
            if (!/^[a-zA-Z\s/]*$/g.test(this.state.candidate_name_3)) {
                Toast.showWithGravity("Enter letters only", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter letters only" })
                return 0
            }
            if (name == null) {
                name = this.state.candidate_name_3
            }
            else {
                name = name + ',' + this.state.candidate_name_3
            }
        }

        if (this.state.candidate_name_4 != null) {
            if (!/^[a-zA-Z\s/]*$/g.test(this.state.candidate_name_4)) {
                Toast.showWithGravity("Enter letters only", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter letters only" })
                return 0
            }
            if (name == null) {
                name = this.state.candidate_name_4
            }
            else {
                name = name + ',' + this.state.candidate_name_4
            }
        }

        if (this.state.candidate_name_5 != null) {
            if (!/^[a-zA-Z\s/]*$/g.test(this.state.candidate_name_5)) {
                Toast.showWithGravity("Enter letters only", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter letters only" })
                return 0
            }
            if (name == null) {
                name = this.state.candidate_name_5
            }
            else {
                name = name + ',' + this.state.candidate_name_5
            }
        }



        if (this.state.candidate_email_1 != null) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const email_test = re.test(String(this.state.candidate_email_1).toLowerCase());
            if (email_test == false) {
                Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter Valid Email Address" });
                return 0;
            }
            if (email == null) {
                email = this.state.candidate_email_1
            }
            else {
                email = email + ',' + this.state.candidate_email_1
            }
        }

        if (this.state.candidate_email_2 != null) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const email_test = re.test(String(this.state.candidate_email_2).toLowerCase());
            if (email_test == false) {
                Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
                //  this.setState({ show_toast: true, toast_message: "Enter valid Email Address" }); 
                return 0;
            }
            if (email == null) {
                email = this.state.candidate_email_2
            }
            else {
                email = email + ',' + this.state.candidate_email_2
            }
        }

        if (this.state.candidate_email_3 != null) {

            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const email_test = re.test(String(this.state.candidate_email_3).toLowerCase());
            if (email_test == false) {
                Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
                //  this.setState({ show_toast: true, toast_message: "Enter valid Email Address" });
                return 0;
            }
            if (email == null) {
                email = this.state.candidate_email_3
            }
            else {
                email = email + ',' + this.state.candidate_email_3
            }
        }

        if (this.state.candidate_email_4 != null) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const email_test = re.test(String(this.state.candidate_email_4).toLowerCase());
            if (email_test == false) {
                Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
                // this.setState({ show_toast: true, toast_message: "Enter valid Email Address" });
                return 0;
            }
            if (email == null) {
                email = this.state.candidate_email_4
            }
            else {
                email = email + ',' + this.state.candidate_email_4
            }
        }
        if (this.state.candidate_email_5 != null) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const email_test = re.test(String(this.state.candidate_email_5).toLowerCase());
            if (email_test == false) {
                Toast.showWithGravity("Enter Valid Email Address", Toast.SHORT, Toast.BOTTOM);
                //  this.setState({ show_toast: true, toast_message: "Enter vaid Email Address" });
                return 0;
            }
            if (email == null) {
                email = this.state.candidate_email_5
            }
            else {
                email = email + ',' + this.state.candidate_email_5
            }
        }


        let interview_date = this.state.selectedStartDate
        if (this.state.selectedStartDate == null) {
            let startdate = new Date()
            let new_date = moment(startdate, "DD-MM-YYYY").add(30, 'days');
            interview_date = moment.utc(new_date).format("YYYY-MM-DD")
            this.setState({ selectedStartDate: new_date })
            // console.log(new_date, "24555555555555555555 new_date ----------------------------")
        }
        // if(this.state.sms_notification==false){
        //     phone = country_code
        // }


        console.log("country_code", country_code)
        console.log("phone", phone, typeof(phone),"phones != null",phones != null)
        let country_codes = country_code
        let phones = phone
        if (phones != null){
            phones = phones.split(",")
        }
        else{
            phones = [] 
        }
        country_codes = country_codes.split(",")
        country_codes.slice(1, phones.length)
        console.log(country_codes)
        
        country_code = country_codes.join(",")
        let arr = []
        // for (let y of country_codes){
        //     let item = y
        //     console.log("item == null",item == "null",typeof(item))
        //     if(item == "null"){
        //         item = 0
        //     }
        //     arr.push(item)
        // }
       
        country_codes.forEach((element,index) => {
            console.log("phones[index]",phones[index],"type",typeof(phones[index]))
            if(phones[index]==undefined || phones[index]==null||phones[index]=="null"  ){
                arr.push(0)
            }
            else{
                arr.push(phones[index])
            }
        });

        console.log("phones",phones)
        phone = arr.join(",")

        if (this.state.select_interview_type == 1) {
            context = { "email": email, "name": name, "phone": phone, "interview_type": this.state.select_interview_type, "date": interview_date, "select_job": this.props.navigation.state.params.select_job, "sms_notification": this.state.sms_notification ? 1 : 0, "country_code": country_code }

        }
        else {
            context = { "email": this.state.candidate_email_1, "sms_notification": this.state.sms_notification ? 1 : 0, "country_code": country_code, "name": this.state.candidate_name_1, "phone": this.state.candidate_phone_1, "interview_type": this.state.select_interview_type, "date": interview_date, "select_job": this.props.navigation.state.params.select_job, "start_time": this.state.select_starttime, "timezone": this.state.select_timezone, "endtime": this.state.end_time }
        }

        console.log("----->>>>", context)
        this.props.navigation.navigate('last_setup_interview', context)




    }

    enter_candidate_name = async (text, Type) => {
        text = String(text).trimLeft()
        console.log(text)
        if (text.length == 0) {
            text = null
            if (Type == 1) {
                this.setState({
                    candidate_name_1: null
                })

            }
            if (Type == 2) {
                this.setState({
                    candidate_name_2: null
                })

            }
            if (Type == 3) {
                this.setState({
                    candidate_name_3: null
                })

            }
            if (Type == 4) {
                this.setState({
                    candidate_name_4: null
                })

            }
            if (Type == 5) {
                this.setState({
                    candidate_name_5: null
                })

            }
            return 0
        }
        if (!/^[a-zA-Z\s/]*$/g.test(text)) {
            Toast.showWithGravity("Enter letters only", Toast.SHORT, Toast.BOTTOM);
            // this.setState({ show_toast: true, toast_message: "Enter letters only" })
            return 0

        }
        // if (/^[a-zA-Z]*$/g.test(text)) {
        //     // this.setState({ show_toast: false, toast_message: "" })

        // }

        console.log(text, "----------name=------------")

        if (Type == 1) {
            if (text.length == 0) {

                this.setState({
                    candidate_name_1: null
                })
            }
            else {

                await this.setState({
                    candidate_name_1: text
                })

            }

        }

        if (Type == 2) {
            if (text.length == 0) {

                this.setState({
                    candidate_name_2: null
                })
            }
            else {

                await this.setState({
                    candidate_name_2: text
                })

            }

        }

        if (Type == 3) {
            if (text.length == 0) {

                this.setState({
                    candidate_name_3: null
                })
            }
            else {

                await this.setState({
                    candidate_name_3: text
                })

            }

        }

        if (Type == 4) {
            if (text.length == 0) {

                this.setState({
                    candidate_name_4: null
                })
            }
            else {

                await this.setState({
                    candidate_name_4: text
                })

            }

        }

        if (Type == 5) {
            if (text.length == 0) {

                this.setState({
                    candidate_name_5: null
                })
            }
            else {

                await this.setState({
                    candidate_name_5: text
                })

            }

        }



    }




    onSaveMobCode = (text, Type) => {
        // console.warn(Type)
        if (Type == 1) {
            this.setState({ phonecodePop: !this.state.phonecodePop, mobile_code_list: this.state.fixed_mobile_code_list })
        }
        else if (Type == 2) {
            this.setState({ phonecodePop1: !this.state.phonecodePop1, mobile_code_list1: this.state.fixed_mobile_code_list })
        }
        else if (Type == 3) {
            this.setState({ phonecodePop2: !this.state.phonecodePop2, mobile_code_list2: this.state.fixed_mobile_code_list })
        }
        else if (Type == 4) {
            this.setState({ phonecodePop3: !this.state.phonecodePop3, mobile_code_list3: this.state.fixed_mobile_code_list })
        }
        else if (Type == 5) {
            this.setState({ phonecodePop4: !this.state.phonecodePop4, mobile_code_list4: this.state.fixed_mobile_code_list })
        }
        this.setState({ selected_pin_code: text })
        // console.log(text)
        this.state.candidate_phone_code[Type] = text.phone_code
        let arr = this.state.candidate_phone_code
        this.setState({ candidate_phone_code: arr })


    }


    enter_candidate_phone = async (text, Type) => {
        console.log(this.state.candidate_phone_1)
        let reg = /^[0-9]+$/
        let test = reg.test(text)
        // console.log(test)
        if (text.length != 0) {
            if (test == false) {
                Toast.showWithGravity("Enter valid digit", Toast.SHORT, Toast.BOTTOM);
                return 0
            }
        }
        //    console.log("LLLLLLLL")
        if (Type == 1) {
            if (text.length == 0) {
                await this.setState({
                    candidate_phone_1: null
                })
            }
            else {
                await this.setState({
                    candidate_phone_1: text
                })
            }
        }

        if (Type == 2) {
            if (text.length == 0) {
                await this.setState({
                    candidate_phone_2: null
                })
            }
            else {
                await this.setState({
                    candidate_phone_2: text
                })
            }
        }

        if (Type == 3) {
            if (text.length == 0) {
                await this.setState({
                    candidate_phone_3: null
                })
            }
            else {
                await this.setState({
                    candidate_phone_3: text
                })
            }
        }

        if (Type == 4) {
            if (text.length == 0) {
                await this.setState({
                    candidate_phone_4: null
                })
            }
            else {
                await this.setState({
                    candidate_phone_4: text
                })
            }
        }

        if (Type == 5) {
            if (text.length == 0) {
                await this.setState({
                    candidate_phone_5: null
                })
            }
            else {
                await this.setState({
                    candidate_phone_5: text
                })
            }
        }

    }

    searchFilterFunction = (text, type) => {
        try {
            console.log(text)
            if (text.length != 0) {

                let newData = this.state.fixed_mobile_code_list.filter(item => {

                    const itemData = String(item.phone_code)
                    const textData = String(text).slice(1, text.length)
                    // console.log(textData.slice(1,textData.length))

                    // console.log(item.name, "LKKKK0", text)

                    var b = itemData.match(textData)


                    if (itemData.match(textData)) {

                        return item;

                    }


                });
                console.log(newData)

                newData = newData.sort(function (a, b) { return a.phone_code - b.phone_code });

                if (type == 0) {
                    this.setState({ mobile_code_list: newData });
                }
                else if (type == 1) {
                    this.setState({ mobile_code_list1: newData });
                }
                else if (type == 2) {
                    this.setState({ mobile_code_list2: newData });
                }
                else if (type == 3) {
                    this.setState({ mobile_code_list3: newData });
                }
                else if (type == 4) {
                    this.setState({ mobile_code_list4: newData });
                }

            }
            else {
                if (type == 0) {
                    this.setState({ mobile_code_list: this.state.fixed_mobile_code_list });
                }
                else if (type == 1) {
                    this.setState({ mobile_code_list1: this.state.fixed_mobile_code_list });
                }
                else if (type == 2) {
                    this.setState({ mobile_code_list2: this.state.fixed_mobile_code_list });
                }
                else if (type == 3) {
                    this.setState({ mobile_code_list3: this.state.fixed_mobile_code_list });
                }
                else if (type == 4) {
                    this.setState({ mobile_code_list4: this.state.fixed_mobile_code_list });
                }
                // this.setState({ mobile_code_list: this.state.fixed_mobile_code_list })
            }
        }
        catch (err) {
            console.log(err)
        }



    };

    searchTimeZoneFilterFunction = (text) => {
        try {
            if (text.length != 0) {

                const newData = this.state.fixed_timezone.filter(item => {

                    const itemData = item.key.toLowerCase()
                    const textData = text.toLowerCase()


                    var b = itemData.match(textData)


                    if (itemData.match(textData)) {
                        // console.log(item.name, "LKKKK0", text)

                        return item;

                    }


                });


                this.setState({ timezone: newData });

            }
            else {
                this.setState({ timezone: this.state.fixed_timezone })
            }

        }
        catch (err) {
            console.log(err)
        }


    };


    SelectPicker = (itemValue, itemIndex) => {
        if (this.state.select_interview_type == itemValue) {
            this.setState({ interview_pop: false, })
            return 0
        }
        if (itemValue == 2) {
            if (this.state.is_unlimited == "false") {
                console.log(this.state.wallet_credit)
                if (this.state.wallet_credit <= 0) {
                    Toast.showWithGravity("You dont have enough credits to invite live interview", Toast.SHORT, Toast.BOTTOM)


                }
            }
        }
        let interview_text = itemValue == 1 ? "Pre-recorded Video Interview" : "Live Video Interview"
        this.setState({
            select_interview_type: itemValue,
            interview_pop: false,
            selected_interview: interview_text,
            select_interview_type_detail: null,
            select_starttime: null,
            no_of_candidate: 1,
            no_cand_index: 0,
            show_toast: false,
            toast_message: '',
            checked: false,
            modalvisible: false,
            selectedStartDate: null,
            candidate_name_1: null,
            candidate_name_2: null,
            candidate_name_3: null,
            candidate_name_4: null,
            candidate_name_5: null,
            candidate_email_1: null,
            candidate_email_2: null,
            candidate_email_3: null,
            candidate_email_4: null,
            candidate_email_5: null,
            candidate_phone_1: null,
            candidate_phone_2: null,
            candidate_phone_3: null,
            candidate_phone_4: null,
            candidate_phone_5: null,
            open_candidate: 1,
            open_drop_no: [false, false, false, false, false],
            selected_pin_code: {},
            scrollview_scroll: true,
            select_timezone: null,
            timezone_modalvisible: false,
            starttime_modal: false,

            start_time: null,
            end_time: null,
            end_modal: false,
            alert_modal: false,
            limit_add_modal: false,
            index_slice_time_list: 0,
            index_slice_starttime_list: 0,
            select_date_modal: false,
            sms_notification: false

        })

    }

    openDropDown = (Type) => {
        let arr = this.state.open_drop_no
        arr[Type] = !arr[Type]

        this.open_tab = !this.open_tab
        // console.warn(Type)
        if (Type == 0) {
            this.setState({ phonecodePop: !this.state.phonecodePop })
        }
        else if (Type == 1) {
            this.setState({ phonecodePop1: !this.state.phonecodePop1 })
        }
        else if (Type == 2) {
            this.setState({ phonecodePop2: !this.state.phonecodePop2 })
        }
        else if (Type == 3) {
            this.setState({ phonecodePop3: !this.state.phonecodePop3 })
        }
        else if (Type == 4) {
            this.setState({ phonecodePop4: !this.state.phonecodePop4 })
        }
        this.setState({ open_drop_no: arr, scrollview_scroll: !this.state.scrollview_scroll })
    }

    enter_candidate_email = async (text, Type) => {


        if (Type == 1) {
            if (text.length == 0) {

                await this.setState({
                    candidate_email_1: null

                })
            }
            else {
                await this.setState({
                    candidate_email_1: text
                })


            }
        }

        if (Type == 2) {
            if (text.length == 0) {
                await this.setState({
                    candidate_email_2: null
                })
            }
            else {
                await this.setState({
                    candidate_email_2: text
                })


            }
        }

        if (Type == 3) {
            if (text.length == 0) {
                await this.setState({
                    candidate_email_3: null
                })
            }
            else {
                await this.setState({
                    candidate_email_3: text
                })


            }
        }

        if (Type == 4) {
            if (text.length == 0) {
                await this.setState({
                    candidate_email_4: null
                })
            }
            else {
                await this.setState({
                    candidate_email_4: text
                })


            }
        }
        if (Type == 5) {
            if (text.length == 0) {
                await this.setState({
                    candidate_email_5: null
                })
            }
            else {
                await this.setState({
                    candidate_email_5: text
                })


            }
        }
    }
    render() {
        let select_endtime_field = this.state.end_time == null ? "Interview end Time" : String(this.state.end_time.name)
        let select_starttime_field = this.state.select_starttime == null ? "Interview Start Time" : String(this.state.select_starttime.name)
        let select_timezone_field = this.state.select_timezone == null ? "Select Timezone" : String(this.state.select_timezone.key)
        let select_date = this.state.selectedStartDate == null ? this.state.select_interview_type == 2 ? "Interview Date" : "Expiration date" : String(moment(this.state.selectedStartDate).format(this.state.date_format)).slice(0, 10)
        let screen_height = Dimensions.get('screen').height
        const index_name = ["First", "Second", "Third", "Fourth", "Fifth"]
        const block = []

        for (let i = 0; i < this.state.no_of_candidate; i++) {
            let open_status = this.state.open_drop_no
            open_status = open_status[i]
            // console.log(i, "KKKK")
            let value = ""
            if (i == 1) {
                value = this.state.candidate_phone_1
            }
            if (i == 2) {
                value = this.state.candidate_phone_2
            }
            if (i == 3) {
                value = this.state.candidate_phone_3
            }
            if (i == 4) {
                value = this.state.candidate_phone_4
            }
            if (i == 5) {
                value = this.state.candidate_phone_5
            }
            this.open_tab = false
            console.log("this.open_tab==>>", this.open_tab)
            block.push(
                <View key={i} style={{ flex: 1, flexDirection: "column", paddingLeft: Scales.deviceWidth * 0.07, paddingTop: Scales.deviceHeight * 0.013, paddingRight: Scales.deviceWidth * 0.05, }}>
                    {this.state.select_interview_type == 1 ? <View style={{ width: Scales.deviceWidth * 0.32, height: Scales.deviceHeight * 0.05, borderRadius: 10, justifyContent: "center", backgroundColor: "#faf9fd", borderWidth: 0.3, borderColor: "#c7c7c7" }}>
                        <Text style={{ textAlign: "center", fontSize: Scales.moderateScale(13), color: "#3c3c3c", fontFamily: 'roboto-medium', }}>
                            {index_name[i]} candidate
                            </Text>
                    </View > : null}
                    <View style={{ width: Scales.deviceWidth * 0.85, height: Scales.deviceHeight * 0.22, paddingTop: Scales.deviceHeight * 0.013, justifyContent: "space-around" }}>
                        {i == 0 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Name"} value={this.state.candidate_name_1} onChangeText={(text) => this.enter_candidate_name(text, i + 1)} style={{ paddingLeft: Scales.deviceWidth * .05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                            i == 1 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Name"} value={this.state.candidate_name_2} onChangeText={(text) => this.enter_candidate_name(text, i + 1)} style={{ paddingLeft: Scales.deviceWidth * .05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                i == 2 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Name"} value={this.state.candidate_name_3} onChangeText={(text) => this.enter_candidate_name(text, i + 1)} style={{ paddingLeft: Scales.deviceWidth * .05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                    i == 3 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Name"} value={this.state.candidate_name_4} onChangeText={(text) => this.enter_candidate_name(text, i + 1)} style={{ paddingLeft: Scales.deviceWidth * .05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                        i == 4 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Name"} value={this.state.candidate_name_5} onChangeText={(text) => this.enter_candidate_name(text, i + 1)} style={{ paddingLeft: Scales.deviceWidth * .05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> : null}




                        <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Email"} onChangeText={(text) => this.enter_candidate_email(text, i + 1)} style={{ paddingLeft: Scales.deviceWidth * .05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "black", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} />
                        <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.85, alignItems: 'center' }}>
                            <View style={{ width: Scales.deviceWidth * 0.15, justifyContent: "center", height: Scales.deviceHeight * 0.05, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, fontSize: Scales.moderateScale(12), color: "#c7c7c7", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }}>
                                <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(10), fontFamily: 'roboto-regular', color: "#3c3c3c" }}>{this.state.candidate_phone_code[i + 1] == "" || this.state.candidate_phone_code[i + 1] == null ? null : this.state.candidate_phone_code[i + 1]}</Text>

                            </View>
                            <Popover placement={"top"} isVisible={i == 0 ? this.state.phonecodePop : i == 1 ? this.state.phonecodePop1 : i == 2 ? this.state.phonecodePop2 : i == 3 ? this.state.phonecodePop3 : i == 4 ? this.state.phonecodePop4 : false} onRequestClose={() => { i == 0 ? this.setState({ phonecodePop: false, mobile_code_list: this.state.fixed_mobile_code_list }) : i == 1 ? this.setState({ phonecodePop1: false, mobile_code_list1: this.state.fixed_mobile_code_list }) : i == 2 ? this.setState({ phonecodePop2: false, mobile_code_list2: this.state.fixed_mobile_code_list }) : i == 3 ? this.setState({ phonecodePop3: false, mobile_code_list3: this.state.fixed_mobile_code_list }) : i == 4 ? this.setState({ phonecodePop4: false, mobile_code_list4: this.state.fixed_mobile_code_list }) : false }} backgroundStyle={{ flex: 1 }} from={(
                                <TouchableOpacity onPress={() => this.openDropDown(i)}>

                                    <View style={{ width: Scales.deviceWidth * 0.10, justifyContent: 'center', height: Scales.deviceHeight * 0.05, backgroundColor: '#faf9fd', borderTopWidth: 0.5, borderColor: "#c7c7c7", borderBottomWidth: 0.5 }}>

                                        <Image source={require("../../assets/Images/drop-down.png")} style={{ alignSelf: 'center' }} />
                                    </View>
                                </TouchableOpacity>
                            )} >
                                <ScrollView style={{ flex: 1 }}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.15, backgroundColor: "white", borderRadius: 5, elevation: 5 }}>
                                    <View style={{ width: Scales.deviceWidth * 0.15, }}>
                                        <View style={{ width: Scales.deviceWidth * 0.12, alignSelf: 'center', height: Scales.deviceHeight * 0.05, borderWidth: 0.5, marginTop: Scales.deviceHeight * 0.01, borderRadius: 5, justifyContent: "center" }}>
                                            <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} keyboardType={"phone-pad"} onChangeText={(text) => this.searchFilterFunction(text, i)} style={{ width: Scales.deviceWidth * 0.12, textAlign: "center", color: "black", textAlignVertical: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), }} />
                                        </View>

                                    </View>

                                    <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.12, alignSelf: 'center', }}>
                                        <TouchableOpacity activeOpacity={1}  >
                                            <FlatList
                                                data={i == 0 ? this.state.mobile_code_list : i == 1 ? this.state.mobile_code_list1 : i == 2 ? this.state.mobile_code_list2 : i == 3 ? this.state.mobile_code_list3 : i == 4 ? this.state.mobile_code_list4 : []}
                                                renderItem={({ item }) => <Mobile_code data={item} onSaveMobCode={this.onSaveMobCode} i={i + 1} />}
                                                keyExtractor={item => item.id}
                                                contentContainerStyle={{ zIndex: 100 }}
                                                style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.11, alignSelf: 'center' }}
                                                scrollEnabled={true}
                                            />
                                        </TouchableOpacity>


                                    </View>

                                </View></ScrollView>
                            </Popover>

                            {i == 0 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Phone Number"} onChangeText={(text) => this.enter_candidate_phone(text, i + 1)} value={this.state.candidate_phone_1 == null ? "" : this.state.candidate_phone_1} keyboardType="numeric" style={{ paddingLeft: Scales.deviceWidth * .05, width: Scales.deviceWidth * 0.60, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "black", fontFamily: "roboto-medium", borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                i == 1 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Phone Number"} onChangeText={(text) => this.enter_candidate_phone(text, i + 1)} value={this.state.candidate_phone_2 == null ? '' : this.state.candidate_phone_2} keyboardType="numeric" style={{ paddingLeft: Scales.deviceWidth * .05, width: Scales.deviceWidth * 0.60, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                    i == 2 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Phone Number"} onChangeText={(text) => this.enter_candidate_phone(text, i + 1)} value={this.state.candidate_phone_3 == null ? '' : this.state.candidate_phone_3} keyboardType="numeric" style={{ paddingLeft: Scales.deviceWidth * .05, width: Scales.deviceWidth * 0.60, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                        i == 3 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Phone Number"} onChangeText={(text) => this.enter_candidate_phone(text, i + 1)} value={this.state.candidate_phone_4 == null ? "" : this.state.candidate_phone_4} keyboardType="numeric" style={{ paddingLeft: Scales.deviceWidth * .05, width: Scales.deviceWidth * 0.60, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> :
                                            i == 4 ? <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Phone Number"} onChangeText={(text) => this.enter_candidate_phone(text, i + 1)} value={this.state.candidate_phone_5 == null ? "" : this.state.candidate_phone_5} keyboardType="numeric" style={{ paddingLeft: Scales.deviceWidth * .05, width: Scales.deviceWidth * 0.60, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "#3c3c3c", fontFamily: "roboto-medium", borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} /> : null}


                        </View>
                    </View>

                    {/* add the popover for this  */}
                    {/* {open_status ? <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.15, backgroundColor: "white", borderRadius: 5, elevation: 5 }}>
                        <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, }}>
                            <View style={{ width: Scales.deviceWidth * 0.12, alignSelf: 'center', height: Scales.deviceHeight * 0.04, borderWidth: 1, }}>
                                <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} keyboardType={"numeric"} onChangeText={(text) => this.searchFilterFunction(text)} style={{ width: Scales.deviceWidth * 0.14, fontFamily: 'roboto-medium', height: Scales.deviceHeight * 0.04, paddingBottom: 5, fontSize: Scales.moderateScale(10), }} />
                            </View>

                        </View>

                        <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.12, alignSelf: 'center', }}>
                            <TouchableOpacity activeOpacity={1}  >
                                <FlatList
                                    data={this.state.mobile_code_list}
                                    renderItem={({ item }) => <Mobile_code data={item} onSaveMobCode={this.onSaveMobCode} i={i + 1} />}
                                    keyExtractor={item => item.id}
                                    contentContainerStyle={{ zIndex: 100 }}
                                    style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.11, alignSelf: 'center' }}
                                    scrollEnabled={true}
                                />
                            </TouchableOpacity>


                        </View>

                    </View> : null} */}



                    {/* <View style={{ width: Scales.deviceWidth * 0.50, height: Scales.deviceHeight * 0.02, left: 25, borderTopWidth: 0.8, alignSelf: 'center', top: 5 }} /> */}





                </View>

            )
        }


        // var buttondisable = null
        // if (this.select_interview_type == 1) {
        //     buttondisable = this.state.checked == true && this.state.selectedStartDate != null && this.state.candidate_email != null && this.state.candidate_name != null ? false : true
        // }
        // else {
        //     this.state.select_starttime != null && this.state.selectedStartDate != null && this.state.candidate_email != null && this.state.candidate_name != null && this.state.select_timezone && this.state.end_time != null != null ? false : true
        // }
        const select_interview_shadow = this.state.select_interview_type == 0 ? 0 : null



        let backfunc = [this.props.navigation.state.params.ResetState,]

        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* <KeyboardAvoidingView behavior={"padding"} style={{flex:1}} > */}
                <ScrollView style={{ flex: 1, backgroundColor: "white", flexDirection: 'column' }} >

                    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "white" }}>

                        <Header heading="Invite" {...this.props} textalign='center' left={Scales.deviceWidth * 0.07} back={true} backfunc={backfunc} />

                        <View style={{ flex: 1, flexDirection: "column", }}>

                            <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.103, justifyContent: "center" }}>
                                <Popover placement={"bottom"} isVisible={this.state.interview_pop}
                                    onRequestClose={() => this.setState({ interview_pop: false })}
                                    from={(
                                        <TouchableOpacity onPress={() => this.setState({ interview_pop: true })} >
                                            <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.06, justifyContent: "center", borderRadius: 10, backgroundColor: "white", borderWidth: 0.5, backgroundColor: '#faf9fd', borderColor: '#c7c7c7', alignSelf: "center", elevation: select_interview_shadow }}>
                                                <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(16), paddingLeft: Scales.deviceWidth * 0.025 }} >{this.state.selected_interview}</Text>
                                            </View>

                                        </TouchableOpacity>
                                    )} >
                                    <View style={{ width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.10, backgroundColor: "white", justifyContent: "space-between", borderRadius: 5, elevation: 5 }}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => this.SelectPicker(1, 0)}><View style={{ width: Scales.deviceWidth * 0.90, justifyContent: "center", height: Scales.deviceHeight * 0.05, }}>
                                            <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(18), paddingLeft: Scales.deviceWidth * 0.025 }}>Pre-recorded Video Interview</Text>
                                        </View></TouchableOpacity>
                                        <TouchableOpacity activeOpacity={1} onPress={() => this.SelectPicker(2, 0)}><View style={{ width: Scales.deviceWidth * 0.90, justifyContent: "center", height: Scales.deviceHeight * 0.05 }}>
                                            <Text style={{ fontFamily: "roboto-regular", fontSize: Scales.moderateScale(18), paddingLeft: Scales.deviceWidth * 0.025 }}>Live Video Interview</Text>
                                        </View></TouchableOpacity>
                                    </View>
                                </Popover>
                            </View>


                            {this.state.select_interview_type == 2 ? <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceWidth * 0.22, }}>
                                <View style={{ flexDirection: "row", }}>
                                    <TouchableOpacity onPress={this.show_calender}>
                                        <View style={{ width: Scales.deviceWidth * 0.435, height: Scales.deviceHeight * 0.045, justifyContent: 'center', backgroundColor: this.state.selectedStartDate == null ? "#faf9fd" : "green", borderRadius: 10, left: Scales.deviceWidth * 0.05, borderWidth: 0.3, borderColor: "#c7c7c7" }}>
                                            {/* <MyDatePicker OnSelecteDate={this.onDateChange} selected_date={moment.utc("08/08/2020").format("DD-MM-YYYY")} /> */}

                                            <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: this.state.selectedStartDate == null ? "#7e7e7f" : "white", fontFamily: 'roboto-regular' }}>{select_date}</Text>

                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={this.show_timezone}><View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.045, marginLeft: Scales.deviceWidth * 0.06, justifyContent: 'center', backgroundColor: this.state.select_timezone == null ? "#faf9fd" : "green", borderRadius: 10, left: Scales.deviceWidth * 0.05, borderWidth: 0.3, borderColor: "#c7c7c7" }}>
                                        <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: this.state.select_timezone == null ? "#7e7e7f" : "white", fontFamily: 'roboto-regular' }}>{select_timezone_field}</Text>

                                    </View></TouchableOpacity>
                                </View >

                                <View style={{ flexDirection: "row", paddingTop: Scales.deviceHeight * 0.012 }}>
                                    <TouchableOpacity onPress={this.show_start_time}><View style={{ width: Scales.deviceWidth * 0.435, height: Scales.deviceHeight * 0.05, justifyContent: 'center', backgroundColor: this.state.select_starttime == null ? "#faf9fd" : "green", borderRadius: 10, left: Scales.deviceWidth * 0.05, borderWidth: 0.3, borderColor: "#c7c7c7" }}>
                                        <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: this.state.select_starttime == null ? "#7e7e7f" : "white", fontFamily: 'roboto-regular' }}>{select_starttime_field}</Text>

                                    </View></TouchableOpacity>

                                    <TouchableOpacity onPress={this.show_end_time}><View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.05, marginLeft: Scales.deviceWidth * 0.06, justifyContent: 'center', backgroundColor: this.state.end_time == null ? "#faf9fd" : "green", borderRadius: 10, left: Scales.deviceWidth * 0.05, borderWidth: 0.3, borderColor: "#c7c7c7" }}>
                                        <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: this.state.end_time == null ? "#7e7e7f" : "white", fontFamily: 'roboto-regular' }}>{select_endtime_field}</Text>

                                    </View></TouchableOpacity>


                                </View>



                            </View> : <View>
                                    <TouchableOpacity onPress={this.show_calender}><View style={{ width: Scales.deviceWidth * 0.40, left: Scales.deviceWidth * 0.06, height: Scales.deviceHeight * 0.05, flexDirection: "row", backgroundColor: this.state.selectedStartDate == null ? "#faf9fd" : "green", borderRadius: 10, borderWidth: 0.3, borderColor: "#c7c7c7" }}>

                                        <View style={{ width: Scales.deviceWidth * 0.10, borderRadius: 5, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                                            <Image source={require("../../assets/Images/filter_cal.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.8), alignSelf: "center" }} />
                                        </View>
                                        <View style={{ width: Scales.deviceWidth * 0.30, borderRadius: 5, justifyContent: "center", height: Scales.deviceHeight * 0.05 }}>
                                            <Text style={{ textAlign: 'left', fontSize: Scales.moderateScale(12), color: this.state.selectedStartDate == null ? "#7e7e7f" : "white", fontFamily: 'roboto-regular' }}>{select_date}</Text>

                                        </View>

                                    </View>
                                    </TouchableOpacity>
                                    <View style={{ paddingLeft: Scales.deviceWidth * 0.06, width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.04 }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), color: "#8a8a8a", paddingTop: Scales.deviceHeight * 0.008 }}>(30 days by default for expired interview link)</Text>

                                    </View>
                                </View>
                            }


                            {this.state.select_interview_type == 2 ?
                                <View style={{ flex: 1, flexDirection: 'column', }}>
                                    <View style={{ flex: 1, flexDirection: "column" }}>
                                        <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.90, height: Scales.deviceHeight * 0.05, alignSelf: "center" }}>
                                            <View style={{ height: Scales.deviceHeight * 0.05, justifyContent: "flex-start" }}>
                                                <CheckBox
                                                    size={Scales.moderateScale(22)}
                                                    checked={this.state.sms_notification}

                                                    onIconPress={() => this.setState({ sms_notification: !this.state.sms_notification })}
                                                    wrapperStyle={{ width: Scales.deviceWidth * 0.05, alignSelf: 'flex-start', height: Scales.deviceHeight * 0.04, }}
                                                    containerStyle={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', alignSelf: "flex-start" }}
                                                    checkedColor="#3c3c3c"
                                                />
                                            </View>
                                            <View style={{ width: Scales.deviceWidth * 0.40, height: Scales.deviceHeight * 0.045, justifyContent: "center" }}>
                                                <Text style={{ fontFamily: "roboto-medium", justifyContent: "flex-start", fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>
                                                    SMS Notification
                                        </Text>
                                            </View>
                                        </View>






                                        <View style={{ width: Scales.deviceWidth * 0.90, alignSelf: "center", height: Scales.deviceHeight * 0.25, justifyContent: "space-around", }}>
                                            <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Name"} value={this.state.candidate_name_1} onChangeText={(text) => this.enter_candidate_name(text, 1)} style={{ paddingLeft: Scales.deviceWidth * 0.05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "black", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} />
                                            <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Email"} value={this.state.candidate_email_1} onChangeText={(text) => this.enter_candidate_email(text, 1)} style={{ paddingLeft: Scales.deviceWidth * 0.05, borderRadius: 5, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "black", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} />


                                            <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.95, alignItems: 'center', }}>
                                                <View style={{ width: Scales.deviceWidth * 0.15, justifyContent: "center", height: Scales.deviceHeight * 0.05, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, fontSize: Scales.moderateScale(12), color: "black", fontFamily: "roboto-medium", borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }}>
                                                    <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(10), fontFamily: 'roboto-regular' }}>{this.state.candidate_phone_code[1] == "" ? null : this.state.candidate_phone_code[1]}</Text>

                                                </View>
                                                <Popover placement={"top"} isVisible={this.state.phonecodePop1} onRequestClose={() => this.setState({ phonecodePop1: false, mobile_code_list1: this.state.fixed_mobile_code_list })} from={(
                                                    <TouchableOpacity onPress={() => this.openDropDown(1)}>

                                                        <View style={{ width: Scales.deviceWidth * 0.10, justifyContent: 'center', height: Scales.deviceHeight * 0.05, backgroundColor: '#faf9fd', borderTopWidth: 0.5, borderColor: "#c7c7c7", borderBottomWidth: 0.5 }}>

                                                            <Image source={require("../../assets/Images/drop-down.png")} style={{ alignSelf: 'center' }} />
                                                        </View></TouchableOpacity>
                                                )} >
                                                    <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.15, backgroundColor: "white", borderRadius: 5, elevation: 5 }}>
                                                        <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.06, justifyContent: "center" }}>
                                                            <View style={{ width: Scales.deviceWidth * 0.12, justifyContent: 'center', alignSelf: 'center', height: Scales.deviceHeight * 0.05, borderWidth: 0.5, borderRadius: 5 }}>
                                                                <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} keyboardType={"phone-pad"} onChangeText={(text) => this.searchFilterFunction(text, 1)} style={{ textAlignVertical: "center", textAlign: "center", fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(10), }} />
                                                            </View>

                                                        </View>

                                                        <View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.12, alignSelf: 'center', }}>
                                                            <TouchableOpacity activeOpacity={1}  >
                                                                <FlatList
                                                                    data={this.state.mobile_code_list1}
                                                                    renderItem={({ item }) => <Mobile_code data={item} onSaveMobCode={this.onSaveMobCode} i={1} />}
                                                                    keyExtractor={item => item.id}
                                                                    contentContainerStyle={{ zIndex: 100 }}
                                                                    style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.11, alignSelf: 'center' }}
                                                                    scrollEnabled={true}
                                                                />
                                                            </TouchableOpacity>


                                                        </View>

                                                    </View>
                                                </Popover>
                                                <TextInput returnKeyLabel={"done"} value={this.state.candidate_phone_1} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholder={"Enter Phone Number"} onChangeText={(text) => this.enter_candidate_phone(text, 1)} keyboardType="numeric" style={{ paddingLeft: Scales.deviceWidth * 0.05, width: Scales.deviceWidth * 0.65, fontSize: Scales.moderateScale(12), height: Scales.deviceHeight * 0.05, color: "black", fontFamily: "roboto-medium", borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 0.5, backgroundColor: "#faf9fd", borderColor: "#c7c7c7" }} />

                                            </View>
                                        </View>




                                    </View>
                                </View> : <View style={{ flex: 1 }}>
                                    <View style={{ width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 0.08, paddingLeft: Scales.deviceWidth * 0.07, justifyContent: "center", }}>
                                        <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(14), color: "#3c3c3c" }}>Invite Individually</Text>
                                        <View>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(10), color: "#8a8a8a", paddingTop: Scales.deviceHeight * 0.01 }}>(You can invite upto 5 candidates)</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: "row", width: Scales.deviceWidth * 0.90, alignSelf: "center", height: Scales.deviceHeight * 0.05, }}>
                                        <View style={{ width: Scales.deviceWidth * 0.11, height: Scales.deviceHeight * 0.05, justifyContent: 'flex-start', alignSelf: "flex-start", }}>
                                            <CheckBox
                                                size={Scales.moderateScale(22)}
                                                checked={this.state.sms_notification}

                                                wrapperStyle={{ width: Scales.deviceWidth * 0.05, alignSelf: 'flex-start', height: Scales.deviceHeight * 0.04, }}
                                                containerStyle={{ width: Scales.deviceWidth * 0.08, height: Scales.deviceHeight * 0.04, justifyContent: 'center', alignSelf: "flex-start" }}
                                                onIconPress={() => this.setState({ sms_notification: !this.state.sms_notification })}

                                                checkedColor="#3c3c3c"
                                            />
                                        </View>
                                        <View style={{ justifyContent: "center", height: Scales.deviceHeight * 0.045 }}>
                                            <Text style={{ fontFamily: "roboto-medium", fontSize: Scales.moderateScale(12), color: "#3c3c3c" }}>
                                                SMS Notification
                                        </Text>
                                        </View>
                                    </View>

                                    {this.state.show_toast ? <View style={{ width: Scales.deviceWidth * 0.75, flexDirection: "row", borderRadius: Scales.deviceWidth * 0.01, height: Scales.deviceHeight * 0.04, backgroundColor: "#c9252d", alignSelf: "flex-end", right: Scales.deviceWidth * 0.04 }}>
                                        <View style={{ width: Scales.deviceWidth * 0.12, height: Scales.deviceHeight * 0.04, justifyContent: 'center', paddingLeft: Scales.deviceWidth * 0.02 }}>
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


                                    <View style={{ flex: 1 }}>
                                        {block}
                                    </View>

                                </View>}

                        </View>
                        <View style={{ width: Scales.deviceWidth * 1.0, minHeight: this.state.select_interview_type == 1 ? Scales.deviceHeight * 0.20 : Scales.deviceHeight * 0.28, alignSelf: "flex-end", justifyContent: "flex-end", }}>

                            {this.state.select_interview_type == 1 ?
                                <View style={{ width: Scales.deviceWidth * 0.88, alignSelf: 'center', height: Scales.deviceHeight * 0.06, flexDirection: "row", alignItems: 'center' }}>
                                    <View style={{ width: Scales.deviceWidth * 0.44, height: Scales.deviceHeight * 0.06, alignSelf: "flex-start", justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.Add_more_candidate()}><View style={{ width: Scales.deviceWidth * 0.25, height: Scales.deviceHeight * 0.04, flexDirection: 'row', alignItems: 'center', paddingBottom: Scales.deviceHeight * 0.008 }}>
                                            <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(22), color: "#3c3c3c" }}>+</Text>
                                            <Text style={{ fontFamily: 'roboto-medium', fontSize: Scales.moderateScale(12), paddingTop: Scales.deviceHeight * 0.005, paddingLeft: Scales.deviceWidth * 0.01, color: "#3c3c3c" }}>ADD More</Text>
                                        </View></TouchableOpacity>

                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.44, height: Scales.deviceHeight * 0.06, }}>
                                        {this.state.no_of_candidate > 1 ? <View style={{ width: Scales.deviceWidth * 0.05, paddingLeft: 5, height: Scales.deviceHeight * 0.05, alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.delete_candidate()}><Image source={require("../../assets/Images/delete.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }} /></TouchableOpacity>
                                        </View> : null}
                                    </View>
                                </View>
                                : null}

                            <TouchableOpacity disabled={this.state.disbale_invite} onPress={this.GotoNext}>
                                <View style={{ width: "90%", height: Scales.deviceHeight * 0.06, backgroundColor: "#4b40aa", alignSelf: 'center', borderRadius: 10, justifyContent: "center" }}>
                                    <Text style={{ textAlign: "center", fontFamily: 'roboto-bold', fontSize: Scales.moderateScale(20), color: "white" }}>
                                        Next
                                </Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                        <Modal visible={this.state.alert_modal} transparent={true} >
                            <View style={{ backgroundColor: "transparent", width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", }}>
                                <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.16, borderRadius: 10, opacity: 1, alignSelf: "center" }}>


                                    <View style={{}}>
                                        <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', paddingTop: Scales.deviceHeight * 0.02, fontSize: Scales.moderateScale(16) }}>Please enter name or email</Text>


                                        <View style={{ width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ alert_modal: false })}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, backgroundColor: "#554cb2", alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                                            </View></TouchableOpacity>
                                        </View>
                                    </View>


                                </View>


                            </View>
                        </Modal>



                        <Modal visible={this.state.limit_add_modal} transparent={true} >
                            <View style={{ backgroundColor: "transparent", width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", }}>
                                <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.16, borderRadius: 10, opacity: 1, alignSelf: "center" }}>


                                    <View style={{}}>
                                        <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', paddingTop: Scales.deviceHeight * 0.02, fontSize: Scales.moderateScale(16) }}>Maximum candidate limit exceeded.</Text>


                                        <View style={{ width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ limit_add_modal: false })}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, backgroundColor: 'blue', alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                                            </View></TouchableOpacity>
                                        </View>
                                    </View>


                                </View>


                            </View>
                        </Modal>





                        <Modal visible={this.state.select_date_modal} transparent={true} >
                            <View style={{ backgroundColor: "transparent", width: Scales.deviceWidth * 1.0, height: Scales.deviceHeight * 1.0, justifyContent: "center", }}>
                                <View style={{ backgroundColor: 'white', elevation: 9, width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.16, borderRadius: 10, opacity: 1, alignSelf: "center" }}>


                                    <View style={{}}>
                                        <Text style={{ textAlign: "center", fontFamily: 'roboto-medium', paddingTop: Scales.deviceHeight * 0.02, fontSize: Scales.moderateScale(16) }}>You have selected expired date. Please select correct date</Text>


                                        <View style={{ width: Scales.deviceWidth * 0.60, height: Scales.deviceHeight * 0.10, justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ select_date_modal: false })}><View style={{ width: Scales.deviceWidth * 0.15, height: Scales.deviceHeight * 0.04, backgroundColor: '#554cb2', alignSelf: 'center', borderRadius: 10, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontSize: Scales.moderateScale(14), color: 'white', fontFamily: "roboto-medium" }}>Ok</Text>
                                            </View></TouchableOpacity>
                                        </View>
                                    </View>


                                </View>


                            </View>
                        </Modal>
                        <View style={{}}>
                            <Modal
                                animationType="slide"
                                transparent={true}

                                isVisible={this.state.modalvisible}
                                onRequestClose={() => {
                                    this.setState({ modalvisible: !this.state.modalvisible })
                                }}>
                                <View style={{ width: Scales.deviceWidth * 0.80, minHeight: Scales.deviceHeight * 0.42, borderRadius: 10, alignSelf: "center", backgroundColor: 'white' }}>


                                    <View style={{ height: Scales.deviceWidth * 0.10, justifyContent: "center", alignSelf: "flex-end", right: Scales.deviceWidth * 0.02 }} >
                                        <TouchableOpacity onPress={() => this.setState({ modalvisible: !this.state.modalvisible })}><Image source={require("../../assets/Images/no.png")} style={{ resizeMode: "contain", aspectRatio: Scales.moderateScale(0.6) }} /></TouchableOpacity>
                                    </View>
                                    <View style={{ minHeight: Scales.deviceWidth * 0.32, }}>
                                        <CalendarPicker
                                            onDateChange={(date) => this.onDateChange(date)}
                                            todayBackgroundColor="blue"

                                            selectedDayColor="#7300e6"
                                            selectedDayTextColor="#FFFFFF"
                                            enableSwipe={true}
                                            width={Scales.deviceWidth * 0.75}
                                        />
                                    </View>



                                </View>


                            </Modal>


                            <Modal
                                animationType="slide"
                                transparent={true}
                                isVisible={this.state.timezone_modalvisible}
                                onRequestClose={() => {
                                    this.setState({ timezone_modalvisible: !this.state.timezone_modalvisible })
                                }}>


                                <View style={{ flex: 1, flexDirection: "column", backgroundColor: "transparent" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.87, alignSelf: 'center', alignItems: "center", flexDirection: "row", height: Scales.deviceHeight * 0.06, borderWidth: 0.3, borderRadius: 10, marginTop: Scales.deviceHeight * 0.012, backgroundColor: "#faf9fd" }}>
                                        <TextInput returnKeyLabel={"done"} returnKeyType={"done"} placeholderTextColor={"#c7c7c7"} placeholderTextColor={"#c7c7c7"} placeholder={"Search"} onChangeText={(text) => this.searchTimeZoneFilterFunction(text)} style={{ height: Scales.deviceHeight * 0.059, width: Scales.deviceWidth * 0.77, backgroundColor: "#faf9fd", fontSize: Scales.moderateScale(14), color: "black", borderRadius: 10, fontFamily: 'roboto-medium', paddingLeft: 10 }} />
                                        <TouchableOpacity onPress={() => this.setState({ timezone_modalvisible: !this.state.timezone_modalvisible })}><AntI name={"closecircle"} style={{ paddingRight: 10 }} size={24} /></TouchableOpacity>
                                    </View>
                                    <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.90 }}>
                                        <FlatList
                                            data={this.state.timezone}
                                            renderItem={({ item }) => <NewTimeZone title={item} key={item.id} select_timezone={this.select_timezone} />}
                                            keyExtractor={item => item.id}
                                        />
                                    </View>
                                </View>


                            </Modal>


                            <Modal
                                animationType="slide"
                                transparent={true}
                                isVisible={this.state.starttime_modal}
                                onRequestClose={() => {
                                    this.setState({ starttime_modal: !this.state.starttime_modal })
                                }}>


                                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.90 }}>
                                        <FlatList
                                            data={this.state.start_time_list}
                                            renderItem={({ item }) => <TImeZoneList title={item} key={item.id} select_timezone={this.select_starttime} />}
                                            keyExtractor={item => item.id}
                                        />
                                    </View>
                                </View>


                            </Modal>


                            <Modal
                                animationType="slide"
                                transparent={true}
                                isVisible={this.state.end_modal}
                                onRequestClose={() => {
                                    this.setState({ end_modal: !this.state.end_modal })
                                }}>




                                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                                    <View style={{ width: Scales.deviceWidth * 0.95, alignSelf: "center", height: Scales.deviceHeight * 0.90 }}>
                                        <FlatList
                                            data={this.state.select_time_flag == false ? this.state.start_time_list : this.state.start_time_list.slice(this.state.index_slice_time_list + 1, this.state.select_time_flag == false ? this.state.start_time_list.length : this.state.index_slice_time_list + 5)}
                                            renderItem={({ item }) => <TImeZoneList title={item} key={item.id} select_timezone={this.select_endtime} />}
                                            keyExtractor={item => item.id}
                                        />
                                    </View>
                                </View>


                            </Modal>

                        </View>




                    </View>

                </ScrollView>
                {/* </KeyboardAvoidingView> */}
            </SafeAreaView>

        )



    }
}



class Mobile_code extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: Scales.deviceWidth * 0.17, height: Scales.deviceHeight * 0.03, borderBottomWidth: 0.3, justifyContent: "center" }}>
                <TouchableOpacity onPress={() => this.props.onSaveMobCode(this.props.data, this.props.i)}>
                    <Text style={{ paddingLeft: Scales.deviceWidth * 0.04, fontSize: Scales.moderateScale(10), fontFamily: "roboto-regular" }}>{this.props.data.phone_code}</Text></TouchableOpacity>
            </View>
        )
    }
}




class NewTimeZone extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        // console.log(this.props)
    }

    render() {
        // const items = {"name":this.props.title.name,"key":this.props.title.key} 
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.props.select_timezone(this.props.title)}><View><View style={{ width: "90%", minHeight: Scales.deviceHeight * 0.05, backgroundColor: '#faf9fd', alignSelf: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 10, elevation: 5 }}>
                <Text style={{ fontSize: Scales.moderateScale(20), textAlign: 'center', textTransform: "capitalize" }}>{this.props.title.key}</Text>
            </View></View></TouchableOpacity>
        )
    }
}