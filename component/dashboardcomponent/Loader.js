import React, { Component } from 'react';
import {View,Text,ActivityIndicator} from "react-native"
import Modal from "react-native-modal"


export default class Loader extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Modal isVisible={true}>
                
                    <View style={{flex:1, justifyContent:"center"}}>
                        <ActivityIndicator size={20} style={{alignSelf:"center"}} />
                    </View>
                
            </Modal>
        )
    }
}