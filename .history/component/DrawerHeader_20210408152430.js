import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar,AsyncStorage ,SafeAreaView,TouchableWithoutFeedback} from 'react-native';
import {Scales} from "@common"

export default class Header extends Component {
    constructor(props){
        super(props)
        this.state={
            unlimited:false
        }
    }
    componentDidMount=async()=>{
       
       let unlimited = await AsyncStorage.getItem('unlimited')
    //    console.log(unlimited, "unlimited")
       if(unlimited=="true"){
        console.log(this.state.unlimited, "{{{{{{{{{{{{{{{{{{{{unlimited}}}}}}}}}}}}}}}}}}}}}}")

           this.setState({unlimited:true})
       }
    }

    BackMethod=()=>{
        // console.log("------------------back method------------", this.props.backfun)
        if(this.props.backfunc!=undefined){
            for(let i of this.props.backfunc){
          
                i()
            }
        }
        if(this.props.back!=undefined){
            this.props.navigation.goBack()
        }
        else{
            this.props.navigation.openDrawer()
        }
    }

    render() {
        // let left_shift = this.props.searchoff==undefined?70:18
        let widths = this.props.searchoff==undefined?Scales.deviceWidth*0.55:Scales.deviceWidth*0.85
        console.log(this.props)
        return (
            //<SafeAreaView style={{flex:1}}>
            <React.Fragment>
                <StatusBar backgroundColor="#2c2c39" barStyle="light-content" />
                <View style={{ flexDirection: "row", width: Scales.deviceWidth*1.0, height: Scales.deviceHeight*0.07, backgroundColor: '#2c2c39', alignItems: 'center', }}>

                
                    {this.props.back==undefined?<TouchableOpacity style={{ width: Scales.deviceWidth*0.12, height: Scales.deviceHeight*0.065,}} onPress={() => this.BackMethod()}><View style={{ width: Scales.deviceWidth*0.12,zIndex:100, height: Scales.deviceHeight*0.065, justifyContent: 'center', paddingLeft: 10, }}>
                    <Image source={require('../assets/Images/sidebar-menu.png')} style={{ resizeMode: "contain", height: Scales.deviceHeight*0.035,aspectRatio:Scales.moderateScale(0.9),paddingBottom:5 }} />
                    </View></TouchableOpacity>:<TouchableOpacity style={{ width: Scales.deviceWidth*0.12, height: Scales.deviceHeight*0.065,}} onPress={() => this.BackMethod()}><View style={{ width: Scales.deviceWidth*0.12,zIndex:100, height: Scales.deviceHeight*0.065, justifyContent: 'center', paddingLeft: 10, }}>
                    <Image source={require('../assets/Images/back_button.png')} style={{ resizeMode: "contain", height: Scales.deviceHeight*0.028,aspectRatio:Scales.moderateScale(0.5), }} />
                    </View></TouchableOpacity>
                    }
                    <View style={{ width: widths, height: Scales.deviceHeight*0.07,justifyContent: 'flex-end',alignItems:'center' ,alignContent: 'center',  flexDirection: 'row',}}>
                    
                        <View style={{width:this.props.widths==undefined?Scales.deviceWidth*0.50:this.props.widths,height:Scales.deviceHeight*0.055,justifyContent:"center"}}>
                        <Text style={{ fontFamily: 'roboto-regular', fontSize: Scales.moderateScale(20),left:this.props.left, textAlign: this.props.textalign, color: 'white', textAlignVertical:"center"  }}>{this.props.heading}</Text>
                        </View>
                        {this.props.searchoff!=undefined?<View style={{width:Scales.deviceWidth*0.08, height:Scales.deviceHeight*0.035, backgroundColor:'white', borderRadius:5, alignSelf:'center',justifyContent:'center'}}>
                            <TouchableWithoutFeedback onPress={this.props.Click_Search}><Image source ={require('../assets/Images/search.png')} style={{resizeMode:'contain', alignSelf:'center', width:Scales.deviceWidth*0.05, height:Scales.deviceHeight*0.02}} /></TouchableWithoutFeedback>

                        </View>: null}

                    </View>
                    {this.props.heading==='Jobs Listing' ?
                        <View style={{ width: Scales.deviceWidth * 0.30, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                // onPress={() => {
                                //     console.log('filter')
                                // }}
                                onPress={() => this.props.navigation.navigate("filters", { "filter_data": this.filter_data })}
                            >
                                <Image
                                    source={require('./../assets/JobmaIcons/filter.png')}
                                    style={{ width: 20, height: 20 }}
                                    resizeMode='contain'
                                ></Image>
                            </TouchableOpacity>
                        </View> : null
                    }

                    {this.props.credit==true?<View style={{width:Scales.deviceWidth*0.30, height:Scales.deviceHeight*0.07, justifyContent:'center',}}>
                        <View style={{width:Scales.deviceWidth*0.15, height:Scales.deviceHeight*0.025, alignSelf:'flex-end', right:10}}>
                        <Text style={{fontFamily:'roboto-medium', fontSize:Scales.moderateScale(12), textAlign:'center',color:"white"}}>Credits</Text>

                        </View>
                        <View style={{width:Scales.deviceWidth*0.15, height:Scales.deviceHeight*0.025,backgroundColor:'white',justifyContent:"center", alignSelf:"flex-end", right:10,borderRadius:5, marginTop:2,  }}>
                        <Text style={{fontFamily:'roboto-medium', fontSize:this.state.unlimited?Scales.moderateScale(10):Scales.moderateScale(12), textAlign:'center',color:"orange"}}>{this.state.unlimited==true?"Unlimited":this.props.credit_amount}</Text>

                        </View>

                    </View>:null}

                </View>

            </React.Fragment>
            //</SafeAreaView>
        )
    }
}