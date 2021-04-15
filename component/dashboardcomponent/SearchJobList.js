import React, { Component } from 'react';
import {View,TouchableOpacity,Text} from "react-native"
import {Scales} from "@common"

export default class Joblist extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        // console.log(this.props.data)
        let render_data = ''
        if (this.props.index == 0) {
            render_data =<TouchableOpacity onPress={()=>this.props.SelectData(this.props.data)}><View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, justifyContent: "center" }}>
                <Text style={{ paddingLeft: 10, fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium",color:"#3c3c3c" }}>{this.props.data.name}</Text>

            </View></TouchableOpacity>
        }
        else {
            render_data = <TouchableOpacity onPress={()=>this.props.SelectData(this.props.data)}><View style={{ width: Scales.deviceWidth * 0.95, height: Scales.deviceHeight * 0.05, borderTopWidth: 0.3, justifyContent: "center" }}>
                <Text style={{ paddingLeft: 10, fontSize: Scales.moderateScale(14), fontFamily: "roboto-medium",color:"#3c3c3c" }}>{this.props.data.name}</Text>

            </View></TouchableOpacity>
        }
        return (
            <React.Fragment>
                {render_data}
            </React.Fragment>

        )
    }
}