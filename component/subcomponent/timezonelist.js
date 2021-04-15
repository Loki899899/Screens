import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView, Dimensions, Modal, Alert, FlatList } from 'react-native';



export default class TImeZoneList extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        // console.log(this.props.title)
    }

    render(){
        // const items = {"name":this.props.title.name,"key":this.props.title.key} 
        return(
            <TouchableOpacity activeOpacity={1} onPress={()=>this.props.select_timezone(this.props.title)}><View><View style={{width:"90%", height:50, backgroundColor:'#faf9fd',alignSelf:'center', borderRadius:10, marginTop:10,elevation:5}}>
                    <Text style={{fontSize:20,textAlign:'center',paddingTop:15}}>{this.props.title.name}</Text>
                </View></View></TouchableOpacity>
        )
    }
}