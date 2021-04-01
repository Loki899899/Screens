import React from 'react'
import { SafeAreaView, Text, StyleSheet, View, Image, ImageBackground, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
    sectionHeader: {
        color: 'grey'
    },
    infoSection: {
        margin: '2%',
        borderRightWidth: 1,
        borderRightColor:'#f4f4f4',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    buttonsContainer: {
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        width: 160,
        height: 45,
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#50526b',
    },
    topCard: {
        flex: 4.8, 
        backgroundColor: 'white', 
        padding: '6%', 
        paddingBottom: 0, 
        paddingTop: '3%', 
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20, 
        elevation: 8 
    },
    topCardSectionThree: {
        flexDirection: 'row',
        backgroundColor: '#f4f4f4',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: '7%',
        paddingTop: '2%',
        paddingBottom: '2%',
        marginTop: '3%',
    },
    sectionTwoInfo: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center' ,
    },
    shareButton: {
        textAlign: 'center',
        color: '#50526b',
        fontWeight: 'bold',
    },
    applyButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold', 
    },
})

const Section = (props) => {
    return (
        <View style={props.style}>
            <Text style={styles.sectionHeader}>{props.header}</Text>
            <Text style={{ fontWeight: 'bold', color: '#50526b' }}>{props.info}</Text>
        </View>
    );
}

const TopCard = () => {
    return (
        <View style={styles.topCard}>
            <View style={{ flexDirection: 'row', paddingLeft: '3%' }}>
                <Image
                    source={require('./android/app/src/main/assets/images/logo.png')}
                    style={{ width: 60, height: 60, }}
                    resizeMode='contain'
                ></Image>
                <View style={{ justifyContent: 'center', paddingLeft: '4%' }}>
                    <Text style={{ color: '#50526b' }}>Quality Assurance Engineer</Text>
                    <Text>Hiring for <Text style={{ fontWeight: 'bold', color: '#50526b' }}>Select Source International,</Text></Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Section header='LOCATION' info='Gurgaon, Haryana' style={styles.infoSection} />
                <Section header='JOB TYPE' info='Full Time' style={styles.infoSection} />
                <Section header='SALARY' info='Negotiable' style={[styles.infoSection, { borderRightWidth: 0 }]} />
            </View>
            <View style={styles.topCardSectionThree}>
                <Section header='POSTED ON' info='12/24/2020' />
                <Section header='JOB EXPIRATION' info='12/24/2020' />
            </View>
        </View>
    );
}

const SectionTwo = () => {
    return (
        <View style={{ flex: 1.8, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ marginTop: '4%' }}>
                            <Text style={{ color: 'white', padding: 0, margin: 0 }}>EXPIRENCE</Text>
                            <Text style={[styles.sectionTwoInfo, {padding: 0, margin: 0 }]}>4 years</Text>
                        </View>
                        <View style={{ marginTop: '4%' }}>
                            <Text style={{ color: 'white', }}>AVAILABLE AFTER</Text>
                            <Text style={styles.sectionTwoInfo}>Immediate</Text>
                        </View>
                    </View>
    );
}

const SectionThree = () => {
    return (
        <View style={{ flex: 6, padding: '5%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Section header='FUNCTIONAL AREA' info='Engineering' />
                    <Section header='INDUSTRY' info='Architechture/Designing' />
                </View>
                <Section header='SKILLS' info='Designing, Creativity, UI, HTML, CSS' style={{padding: '5%', paddingBottom: 0}}/>
                <Section 
                    header='DESCRIPTION' 
                    info='Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit' 
                    style={{padding: '5%'}}/>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Text style={styles.shareButton}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#50526b', borderWidth: 0 }]}
                    >
                        <Text style={styles.applyButton}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
}

const Description = () => {
    return (
        <SafeAreaView style={{ flex: 2, }}>
            <View style={{ flex: 5, }}>
                <ImageBackground
                    source={require('./android/app/src/main/assets/images/bg-blue-gradient.png')}
                    style={{ width: '100%', height: '100%', }}
                    imageStyle={{ borderBottomLeftRadius: 35, borderBottomRightRadius: 35 }}
                >
                    <TopCard />
                    <SectionTwo />
                </ImageBackground>
            </View>
            <SectionThree />
        </SafeAreaView>
    );
}

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Description'
                    component={Description}
                    options={{
                        headerShown: true,
                        title: 'Description',
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