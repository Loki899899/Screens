import React, { Component } from 'react';
import { View,Text,StatusBar,SafeAreaView } from 'react-native';




class DrawerIndex extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            //<SafeAreaView style={{flex:1}}>
            <View style={{flex:1,}}>
                <View style = {{flexDirection:"row", width:"100%", height:50}}>

                    <View>
                        <Image source = {require('')} />
                    </View>

                </View>

                <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                    
                    <Text>ksndfn</Text>
                    <StatusBar backgroundColor="blue" barStyle="light-content" />
                </View>
            </View>
            //</SafeAreaView>
        )
    }
}


export default DrawerIndex