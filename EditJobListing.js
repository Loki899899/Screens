import React, {useState, useCallback} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { SafeAreaView, Text, StyleSheet, View, Image, ImageBackground, TouchableOpacity, TextInput  } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'

 import RangeSlider from 'rn-range-slider';


const Drawer = createDrawerNavigator()

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        justifyContent:'flex-end',
    },
    menuIcon: {
        width:15,
        height:15,
    },
    notificationIcon: {
        marginRight: 7,
    },
    bgimg: {
        width:'100%', 
        height:'100%',
        paddingTop:'4%',
    },
    filterContainer: {
        padding:'6%',
        paddingTop:'4%',
        flex:0.98,
        borderTopLeftRadius:22,
        borderTopRightRadius:22,
        backgroundColor:'aliceblue',
    },
    filterHeadingContainer: {
        flexDirection:'row',
        justifyContent:'center'
    },
    filterHeading: {
        fontSize:15,
        fontWeight:'bold',
    },
    crossIcon: {
        position:'absolute',
        right:-5,
        top:'20%',
    },
    section: {
        marginBottom:'2%',
    },
    sectionHeader: {
        fontSize:12,
        color:'grey',
        marginBottom:'2%',
    },
    jobTypeButton: {

    },
    choiceTouchablesContainer: {
        flexDirection:'row',
        flexWrap:'wrap',
        padding:'0%'
    },
    choiceTouchable: {
        marginBottom:7,
        marginRight:1
    },
    choice: {
        color:'black',
        fontSize:12,
        padding:'3%',
        paddingLeft:'5%',
        paddingRight:'5%'
    },
    choiceContainer: {
        borderRadius:20,
        backgroundColor:'#f4f4f4'
    },
    salaryContainer: {
        flexDirection:'row',
        justifyContent:'space-between'
    },
    salary: {
        fontWeight:'bold'
    },
    location: {
        backgroundColor:'#f4f4f4',
        borderRadius:25,
        fontSize:18,
    },
    thumb: {
        padding:5.5,       
        backgroundColor:'#51536c',
        fontSize:18,
        borderRadius:20,
    },
    rail: {
        ...StyleSheet.absoluteFillObject,
        borderRadius:5,
        marginTop:'0.5%',
        height:6,
        backgroundColor:'#f4f4f4'
    },
    railSelected: {
        backgroundColor:'#51536c',
        height:6,
        
    },
    buttonsContainer: {
        marginTop:'3%',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    button: {
        width:160,
        height:40,
        justifyContent:'center',
        borderWidth:2,
        borderRadius:20,
        borderColor:'#50526b',
    },
})

const Thumb = () => {
    return (
        <View style={styles.thumb}></View>
    );
}

const Rail = () => {
    return (
        <View style={styles.rail}></View>
    );
}

const RailSelected = () => {
    return (
        <View style={styles.railSelected}></View>
    );
}

const Slider = (props) => {
    const setLow = (val) => {
        props.setLowValue(val)
    }
    const setHigh = (val) => {
        props.setHighValue(val)
    }
    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    // const renderLabel = useCallback(value => <Label text={value} />, []);
    //const renderNotch = useCallback(() => <Notch />, []);
    const handleValueChange = useCallback((low, high) => {
        setLow(low);
        setHigh(high);
    }, []);


    return (
        <RangeSlider
            style={styles.slider}
            min={props.lowLimit}
            max={props.highLimit}
            step={1}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            //renderLabel={renderLabel}
            //renderNotch={renderNotch}
            onValueChanged={handleValueChange}
        />
    );
}

const WithLinearGradient = (props) => {
    return (
        <LinearGradient
            colors={['#0fb8d6', '#73b943']}
            start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            style={{borderRadius:20,}}
        >
            <Text style={[styles.choice, {color:'white'}]}>{props.text}</Text>
        </LinearGradient>
    );
}

const WithoutLinearGradient = (props) => {
    return (
        <View style={styles.choiceContainer}>
        <Text style={styles.choice}>{props.text}</Text>
        </View>
    );
}

const JobType = () => {
    const [fullTimeFocused, setFullTimeFocused] = useState(true)
    const [fresherFocused, setFresherFocused] = useState(false)
    const [partTimeFocused, setPartTimeFocused] = useState(false)

    return (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>JOB TYPE</Text>
            <View style={styles.choiceTouchablesContainer}>
                <TouchableOpacity 
                style={styles.choiceTouchable}
                onPress={() => {
                    setFullTimeFocused(true)
                    setFresherFocused(false)
                    setPartTimeFocused(false)
                }}>
                    {fullTimeFocused ? <WithLinearGradient text='Full Time' /> : <WithoutLinearGradient text='Full Time' />}
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.choiceTouchable}
                onPress={() => {
                    setFullTimeFocused(false)
                    setFresherFocused(true)
                    setPartTimeFocused(false)
                }}>
                    {fresherFocused ? <WithLinearGradient text='Fresher' /> : <WithoutLinearGradient text='Fresher' />}
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.choiceTouchable}
                onPress={() => {
                    setFullTimeFocused(false)
                    setFresherFocused(false)
                    setPartTimeFocused(true)
                }}>
                    {partTimeFocused ? <WithLinearGradient text='Part Time' /> : <WithoutLinearGradient text='Part Time' />}
                </TouchableOpacity>
            </View>
        </View>
    );
}


const Salary = (props) => {
    const [lowValue, setLowValue] = useState(props.leftLimit)
    const [highValue, setHighValue] = useState(props.rightLimit)

    return (
        <View style={styles.section}>
        <View style={styles.salaryContainer}>
            <Text style={styles.sectionHeader}>SALARY</Text>
            <Text style={styles.salary}>${lowValue}-${highValue} PA</Text>
        </View>
        <Slider lowLimit={props.leftLimit} highLimit={props.rightLimit} setLowValue={setLowValue} setHighValue={setHighValue} />
        </View>
    );
}

const Location = () => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>LOCATION</Text>
            <TextInput style={styles.location}></TextInput>
        </View>
    );
}

const Experience = (props) => {
    const [lowValue, setLowValue] = useState(props.leftLimit)
    const [highValue, setHighValue] = useState(props.rightLimit)

    return (
        <View style={styles.section}>
            <View style={styles.salaryContainer}>
                <Text style={styles.sectionHeader}>EXPERIENCE</Text>
                <Text style={styles.salary}>{lowValue}-{highValue} Years</Text>
            </View>
            <Slider lowLimit={props.leftLimit} highLimit={props.rightLimit} setLowValue={setLowValue} setHighValue={setHighValue} />
        </View>
    );
}

const Freshness = (props) => {
    const [isOneDayOld, setIsOneDayOld] = useState(true)
    const [isLessThanThreeDaysOld, setIsLessThanThreeDaysOld] = useState(false)
    const [isLessThanSevenDaysOld, setIsLessThanSevenDaysOld] = useState(false)
    return (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>FRESHNESS</Text>
            <View style={styles.choiceTouchablesContainer}>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setIsOneDayOld(true)
                    setIsLessThanThreeDaysOld(false)
                    setIsLessThanSevenDaysOld(false)
                }}
            >
                {isOneDayOld?<WithLinearGradient text='1 day old' />:<WithoutLinearGradient text='1 day old' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setIsOneDayOld(false)
                    setIsLessThanThreeDaysOld(true)
                    setIsLessThanSevenDaysOld(false)
                }}
            >
                {isLessThanThreeDaysOld?<WithLinearGradient text='< 3 days old' />:<WithoutLinearGradient text='< 3 days old' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setIsOneDayOld(false)
                    setIsLessThanThreeDaysOld(false)
                    setIsLessThanSevenDaysOld(true)
                }}
            >
                {isLessThanSevenDaysOld?<WithLinearGradient text='< 7 days old' />:<WithoutLinearGradient text='< 7 days old' />}
            </TouchableOpacity>
            </View>
        </View>
    );
}

const Industry = (props) => {
    const [choiceOne, setChoiceOne] = useState(true)
    const [choiceTwo, setChoiceTwo] = useState(false)
    const [choiceThree, setChoiceThree] = useState(false)
    const [choiceFour, setChoiceFour] = useState(false)

    return (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>INDUSTRY</Text>
            <View style={styles.choiceTouchablesContainer}>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(true)
                    setChoiceTwo(false)
                    setChoiceThree(false)
                    setChoiceFour(false)
                }}
            >
                {choiceOne?<WithLinearGradient text='IT software, software services' />:<WithoutLinearGradient text='IT software, software services' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(false)
                    setChoiceTwo(true)
                    setChoiceThree(false)
                    setChoiceFour(false)
                }}
            >
                {choiceTwo?<WithLinearGradient text='BPO, Call centre, ITes' />:<WithoutLinearGradient text='BPO, Call centre, ITes' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(false)
                    setChoiceTwo(false)
                    setChoiceThree(true)
                    setChoiceFour(false)
                }}
            >
                {choiceThree?<WithLinearGradient text='Banking, financial' />:<WithoutLinearGradient text='Banking, financial' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(false)
                    setChoiceTwo(false)
                    setChoiceThree(false)
                    setChoiceFour(true)
                }}
            >
                {choiceFour?<WithLinearGradient text='Construction, Engineering, metals' />:<WithoutLinearGradient text='Construction, Engineering, metals' />}
            </TouchableOpacity>
            </View>
        </View>
    )
}

const FunctionalArea = () => {
    const [choiceOne, setChoiceOne] = useState(true)
    const [choiceTwo, setChoiceTwo] = useState(false)
    const [choiceThree, setChoiceThree] = useState(false)
    const [choiceFour, setChoiceFour] = useState(false)

    return (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>FUNCTIONAL AREA</Text>
            <View style={styles.choiceTouchablesContainer}>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(true)
                    setChoiceTwo(false)
                    setChoiceThree(false)
                    setChoiceFour(false)
                }}
            >
                {choiceOne?<WithLinearGradient text='IT software, software services' />:<WithoutLinearGradient text='IT software, software services' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(false)
                    setChoiceTwo(true)
                    setChoiceThree(false)
                    setChoiceFour(false)
                }}
            >
                {choiceTwo?<WithLinearGradient text='BPO, Call centre, ITes' />:<WithoutLinearGradient text='BPO, Call centre, ITes' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(false)
                    setChoiceTwo(false)
                    setChoiceThree(true)
                    setChoiceFour(false)
                }}
            >
                {choiceThree?<WithLinearGradient text='Banking, financial' />:<WithoutLinearGradient text='Banking, financial' />}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.choiceTouchable}
                onPress={ () => {
                    setChoiceOne(false)
                    setChoiceTwo(false)
                    setChoiceThree(false)
                    setChoiceFour(true)
                }}
            >
                {choiceFour?<WithLinearGradient text='Construction, Engineering, metals' />:<WithoutLinearGradient text='Construction, Engineering, metals' />}
            </TouchableOpacity>
            </View>
        </View>
    )
}


const JobListing = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <ImageBackground source={require('./android/app/src/main/assets/images/bg-blue.png')} style={styles.bgimg}>
                <View style={styles.filterContainer}>
                    <View style={styles.filterHeadingContainer}>
                        <Text style={styles.filterHeading}>Filter</Text>
                        <View style={styles.crossIcon}>
                            <TouchableOpacity >
                                <Image source={require('./android/app/src/main/assets/images/cross.png')} style={{ width: 15, height: 15, }}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <JobType />
                    <Salary leftLimit={0} rightLimit={800}/>
                    <Location />
                    <Experience leftLimit={0} rightLimit={6}/>
                    <Freshness />
                    <Industry />
                    <FunctionalArea />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                           style={styles.button}
                        >
                            <Text style={{textAlign:'center', color:'#50526b', fontWeight:'bold',}}>Clear all</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor:'#50526b', borderWidth:0}]}
                        >
                            <Text style={{textAlign:'center', color:'white', fontWeight:'bold',}}>Apply Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const App = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen
                    name='JobListing'
                    component={JobListing}
                    options={{
                        headerShown: true,
                        title:'Job Listing',
                        headerTitleAlign:'center',
                        headerStyle: {
                            backgroundColor:'#cacbdd',
                            paddingLeft:'7%',
                            paddingRight:'7%'
                        },
                        //Header left if needed to be applied custom
                        // headerLeft:(props) => (
                        // <View>
                        //     <TouchableOpacity
                        //         onPress={props.navigation.openDrawer()}
                        //     ><Image 
                        //         source={require('./android/app/src/main/assets/images/menu.png')} 
                        //         style={styles.menuIcon}
                        //     ></Image>
                        //     </TouchableOpacity>
                        // </View>),
                        headerRight: () => (
                            <Image
                                source={require('./android/app/src/main/assets/images/notification.png')}
                                style={{width:15, height:15}}
                            ></Image>
                        )
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default App