import React, { Component } from 'react';
import {View,Text,TouchableOpacity, Image} from "react-native"
import  {DrawerNavigatorItems} from 'react-navigation-drawer'


export default class DashContent extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
     
    }
    render(){
        return(
            <View style={{flex:1,width:"100%", backgroundColor:"blue", borderRadius:10, flexDirection:'column'}}>
                {/* HEADER */}
                <View style ={{width:"100%",flexDirection:'row', height:110,marginTop:20}}>
                    <View style={{flex:0, width:110, justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:70, height:70, borderRadius:35, backgroundColor:'white'}}>

                        </View>
                    </View>
                    <View style={{flex:0,width:170, flexDirection:"column" }}>
                        <View style={{flex:1, alignItems:'flex-start', justifyContent:"flex-end" }}>
                            <Text style = {{textAlign:'left', color:'white', fontFamily:'roboto-medium', fontSize:18}}>
                                Jobma
                            </Text>

                        </View>
                        <View style={{flex:1,  }}>
                        <Text style = {{textAlign:'left', color:'white', fontFamily:'roboto-medium', fontSize:14}}>
                                Jobmatestlive@gmail.com
                            </Text>
                        </View>

                    </View>
                </View>

                {/* Content */}

                

                <View style={{flex:0,flexDirection:'column', height:500,justifyContent:"space-evenly"}}>
                    <View style={{width:"100%", height:40, justifyContent:'flex-start',flexDirection:'row', paddingLeft:30}} >
                        <Image source = {require('../assets/Images/joblist.png')} style={{width:25, height:25,  resizeMode:'contain'}}></Image>
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18, color:'white', left:10}}>Dashboard</Text>

                    </View>

                    <View style={{width:"100%", height:50,  justifyContent:'flex-start',flexDirection:'row', paddingLeft:30}} >
                        <TouchableOpacity onPress={()=>this.props.navigations.navigate('joblisting')}><View style={{flexDirection:'row',}}>
                            <Image source = {require('../assets/Images/joblist.png')} style={{width:25, height:25, resizeMode:'contain'}}></Image>
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18,left:10,  color:'white'}}>Jobs Listing</Text>
                        </View></TouchableOpacity>

                    </View>
                    <View style={{width:"100%", height:50, justifyContent:'center',}} >
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18, paddingLeft:70, color:'white'}}>Interview Kits</Text>

                    </View>
                    <View style={{width:"100%", height:50, justifyContent:'center',}} >
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18, paddingLeft:70, color:'white'}}>Setup an interview</Text>

                    </View>
                    <View style={{width:"100%", height:50,  justifyContent:'center',}} >
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18, paddingLeft:70, color:'white'}}>Applicants</Text>

                    </View>
                    <View style={{width:"100%", height:50,justifyContent:'center',}} >
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18, paddingLeft:70, color:'white'}}>Change password</Text>

                    </View>
                    <View style={{width:"100%", height:50,  justifyContent:'center',}} >
                        <Text style={{textAlign:'left', fontFamily:"roboto-medium", fontSize:18, paddingLeft:70, color:'white'}}>logout</Text>

                    </View>

                </View>
            </View>
        )
    }
} 