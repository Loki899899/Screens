import React, { useState, useRef } from 'react'
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity, Animated } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

const styles = StyleSheet.create({
    optionCollection: {
        paddingLeft: '7%',
        paddingRight: '7%',
        flex: 1,
        marginTop: '4%',
    },
    privacyOptionContainer: {
        flexDirection: 'row',
        padding: '3%',
    },
    privacyOptionsContainer: {
        backgroundColor: '#f4f4f4'
    },
    privacyOptionInfo: {
        paddingLeft: '3%',
    },
    privacyOptionHeader: {
        color:'#393b62',
        fontWeight: 'bold',
    },
    privacyOptionValue: {
        color: '#8a88ad',
        fontSize: 13,
    },
    socailMediaHeaderContainer: {
        padding:'7%',
        paddingLeft:'2%',
    },
    socailMediaHeaderText: {
        color:'#50526b',
        fontSize:15,
    },
    switchRail: {
        width: 24,
        height: 1.5,
    },
    switchThumb: {
        width: 13,
        height: 13,
        borderRadius: 8,
        position: 'absolute',
        top: '50%',
    },
})

const Switch = () => {
    const [switchValue, setSwitchValue] = useState(false)
    const [switchColor, setSwitchColor] = useState('#ded6d4')
    const leftPos = useRef(new Animated.Value(2)).current;
    return (
        <TouchableOpacity style={{ padding: 6, width: 40 }}
            onPress={() => {
                if (switchValue) {
                    Animated.timing(leftPos, {
                        toValue: 2,
                        duration: 300,
                        useNativeDriver: false,
                    }).start()
                    setSwitchColor('#ded6d4')
                    setSwitchValue(false)
                } else {
                    Animated.timing(leftPos, {
                        toValue: 22,
                        duration: 300,
                        useNativeDriver: false,
                    }).start()
                    setSwitchColor('#9dca3b')
                    setSwitchValue(true)
                }
            }}
        >
            <View style={[styles.switchRail, { backgroundColor: switchColor }]}></View>
            <Animated.View style={[styles.switchThumb, { backgroundColor: switchColor, left: leftPos, }]}></Animated.View>
        </TouchableOpacity>
    );
}

const PrivacyOption = (props) => {
    return (
        <View style={styles.privacyOptionContainer}>
            <View style={{ padding: '4%' }}>
                <Switch />
            </View>
            <View style={styles.privacyOptionInfo}>
                <Text style={styles.privacyOptionHeader}>{props.header}</Text>
                <Text style={styles.privacyOptionValue}>{props.value}</Text>
            </View>
        </View>
    );
}

const PrivacyOptionsList = () => {
    return (
        <View style={styles.privacyOptionsContainer}>
            <PrivacyOption header='Primary Email' value='reetuc@selectsourceintl.com' />
            <PrivacyOption header='Primary Phone' value='9087654321' />
            <PrivacyOption header='Text Resume' value='MyResume.PDF' />
            <PrivacyOption header='Video Resume' value='myVideoResume.webm' />
            <PrivacyOption header='Audio Resume' value='myAudioResume.mp4' />
        </View>
    );
}

const SocialMediaLinks = () => {
    return (
        <View style={styles.privacyOptionsContainer}>
            <PrivacyOption header='Facebook Profile' value='facebook.com' />
            <PrivacyOption header='Linkedin Profile' value='Linkedin.com' />
            <PrivacyOption header='Twitter Profile' value='Twitter.com' />
            <PrivacyOption header='Quora Profile' value='Quora.com' />
        </View>
    );
}

const PrivacySettings = () => {
    return (
        //uncomment the backgroundColor to change it to white
        <SafeAreaView style={{ flex: 1, /*backgroundColor:'white'*/ }}>
            <View style={styles.optionCollection}>
                <PrivacyOptionsList />
                <View style={styles.socailMediaHeaderContainer}>
                    <Text style={styles.socailMediaHeaderText}>Social Media Links</Text>
                </View>
                <SocialMediaLinks />
            </View>
        </SafeAreaView>
    );
}

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='PrivacySettings'
                    component={PrivacySettings}
                    options={{
                        headerShown: true,
                        title: 'Privacy Settings',
                        headerTitleAlign: 'center',
                        headerRight: () => (
                            <View style={{ position: 'absolute', right: 18 }}>
                                <TouchableOpacity>
                                    <Image
                                        source={require('./android/app/src/main/assets/images/notification.png')}
                                        style={{ width: 15, height: 15, }}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App