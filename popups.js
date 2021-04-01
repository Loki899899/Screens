import React, { useState } from 'react'
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity, Button, Modal, } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LinearGradient from 'react-native-linear-gradient'

const Stack = createStackNavigator();

const styles = StyleSheet.create({
    button: {
        width: 160,
        height: 45,
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 25,
        borderColor: '#50526b',
    },
    buttonsContainer: {
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    crossIcon: {
        position: 'absolute',
        right: 8,
        top: 25,
    },
    filterHeading: {
        fontSize:18,
        fontWeight:'bold',
        color:'#50526b',
    },
    message: {
        height: '68%',
        alignItems: 'center',
    },
    messageInfo: {
        fontSize: 12.5,
        textAlign: 'center',
        color:'#50526b',
    },
    messageStatus: {
        fontWeight: 'bold',
        fontSize: 18,
        color:'#50526b',
    },
    modalMainContainer: {
        elevation: 15,
        height: '51%',
        padding: '6%',
        paddingBottom: '2%',
        paddingTop: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: 'white',
    },
    modalHeading: {
        fontSize: 15,
    },
    modalHeadingContainer: {
        borderTopWidth: 3.5,
        paddingTop: '5%',
        paddingBottom: '6%',
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    modalButton: {
        width: 100,
        height: 50,
    },
    radioButton: {
        width: 21,
        height: 21,
        borderRadius: 10,
        borderWidth: 2,
        padding: 2,
    },
    radioOption: {
        padding:'3%',
        paddingLeft:0,
    },
})

const MessageBody = (props) => {
    return (
        <View style={styles.message}>
            <Image
                source={{ uri: props.image }}
                style={{ width: 200, height: 100 }}
                resizeMode='contain'></Image>
            <View style={{ marginTop: '7%', marginBottom: '3%' }}>
                <Text style={styles.messageStatus}>{props.status}</Text>
            </View>
            <View style={{ width: '85%', justifyContent: 'center', }}>
                <Text style={styles.messageInfo}>{props.info}</Text>
            </View>
        </View>
    );
}

const Buttons = () => {
    return (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}>
                <Text
                    style={{ textAlign: 'center', color: '#50526b', fontWeight: 'bold', }}
                >button 1</Text>
            </TouchableOpacity>
            <LinearGradient
                colors={['#0fb8d6', '#73b943']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 20, }}
            >
                <TouchableOpacity style={[styles.button, { backgroundColor: 'transparent', borderWidth: 0 }]}>
                    <Text
                        style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', }}
                    >Button 2</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const GeneralModal = (props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [bgColor, setBgColor] = useState('transparent')
    return (
        <>
            <View style={styles.modalButton}>
                <Button title={props.button} onPress={() => {
                    setModalVisible(true)
                    setTimeout(() => { setBgColor('#cacbdd8F') }, 250)
                }}></Button>
            </View>
            <Modal
                animationType='slide'
                transparent={true}
                onRequestClose={() => {
                    setBgColor('transparent')
                    setTimeout(() => { setModalVisible(false) }, 50)
                }}
                visible={modalVisible}
            >
                <View style={{ backgroundColor: bgColor, justifyContent: 'flex-end', height: '100%' }}
                    onStartShouldSetResponder={() => {
                        setBgColor('transparent')
                        setTimeout(() => { setModalVisible(false) }, 50)
                    }}
                >
                    <View style={styles.modalMainContainer}
                        onStartShouldSetResponder={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <View style={[styles.modalHeadingContainer, {borderTopColor:props.borderTopColor}]}>
                            <View style={styles.crossIcon}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setBgColor('transparent')
                                        setTimeout(() => { setModalVisible(false) }, 50)
                                    }}
                                >
                                    <Image source={require('./android/app/src/main/assets/images/cross.png')} style={{ width: 13, height: 13, }}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <MessageBody 
                        image={props.image}
                        status={props.button} 
                        info={props.info} />
                        <Buttons />
                    </View>
                </View>
            </Modal>
        </>
    );
}


const RadioOptionChosen = () => {
    return (
        <LinearGradient
                colors={['#0fb8d6', '#73b943']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 20, }}
        >
            <View style={{ width: 13, height: 13, borderRadius: 10,}}></View>
        </LinearGradient>
    );
}

const RadioOption = (props) => {
    return (
        <View style={{ flexDirection: 'row', }}>
            <View style={[ styles.radioButton, {borderColor:props.isChosen?'#50526b':'#50526b77'} ]}>
                {props.isChosen ? <RadioOptionChosen /> : null}
            </View>
            <Text style={{ marginLeft: '4%', fontSize: 16, color:props.isChosen?'#50526b':'#50526b77' }}>{props.option}</Text>
        </View>
    );
}

const RadioButtons = () => {
    const [accept, setAccept] = useState(true)
    const [reject, setReject] = useState(false)
    const [reschedule, setReschedule] = useState(false)
    return (
        <View style={{ height: '52%', marginTop: '4%', marginLeft: '7%', }}>
            <TouchableOpacity
                onPress={() => {
                    setAccept(true)
                    setReject(false)
                    setReschedule(false)
                }}
                style={styles.radioOption}
            >
                <RadioOption isChosen={accept} option='Accept' />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setAccept(false)
                    setReject(true)
                    setReschedule(false)
                }}
                style={styles.radioOption}
            >
                <RadioOption isChosen={reject} option='Reject' />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setAccept(false)
                    setReject(false)
                    setReschedule(true)
                }}
                style={styles.radioOption}
            >
                <RadioOption isChosen={reschedule} option='Reschedule' />
            </TouchableOpacity>
        </View>
    );
}

const InteractiveModal = (props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [bgColor, setBgColor] = useState('transparent')
    return (
        <>
            <View style={styles.modalButton}>
                <Button title={props.button} onPress={() => {
                    setModalVisible(true)
                    setTimeout(() => { setBgColor('#cacbdd8F') }, 250)
                }}></Button>
            </View>
            <Modal
                animationType='slide'
                transparent={true}
                onRequestClose={() => {
                    setBgColor('transparent')
                    setTimeout(() => { setModalVisible(false) }, 50)
                }}
                visible={modalVisible}
            >
                <View style={{ backgroundColor: bgColor, justifyContent: 'flex-end', height: '100%' }}
                    onStartShouldSetResponder={() => {
                        setBgColor('transparent')
                        setTimeout(() => { setModalVisible(false) }, 50)
                    }}
                >
                    <View style={[styles.modalMainContainer, {height:'43%'}]}
                        onStartShouldSetResponder={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <View style={[styles.modalHeadingContainer, {borderTopColor:props.borderTopColor}]}>
                        <Text style={styles.filterHeading}>Select an action</Text>
                            <View style={styles.crossIcon}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setBgColor('transparent')
                                        setTimeout(() => { setModalVisible(false) }, 50)
                                    }}
                                >
                                    <Image source={require('./android/app/src/main/assets/images/cross.png')} style={{ width: 13, height: 13, }}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <RadioButtons />
                        <Buttons />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const ReportedIssueList = () => {

    return (
        //uncomment the backgroundColor to change it to white
        <SafeAreaView style={{ flex: 1, /*backgroundColor:'white'*/ }}>
            <GeneralModal 
                button='Success' 
                image='asset:/images/success.png'
                borderTopColor='#73b943'
                info='Neque porro quisquam est qui dolorem ipsum
                    quia dolor sit amet,
                    consectetur, adipisci velit...' />
            <GeneralModal 
                button='Danger' 
                image='asset:/images/danger.png'
                borderTopColor='red'
                info='Neque porro quisquam est qui dolorem ipsum
                    quia dolor sit amet,
                    consectetur, adipisci velit...' />
            <GeneralModal 
                button='Warning' 
                image='asset:/images/warning.png'
                borderTopColor='orange'
                info='Neque porro quisquam est qui dolorem ipsum
                    quia dolor sit amet,
                    consectetur, adipisci velit...' />
            <InteractiveModal button='action' borderTopColor='#50526b'/>
        </SafeAreaView>
    );
}

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='ReportedIssueList'
                    component={ReportedIssueList}
                    options={{
                        headerShown: true,
                        title: 'Reported issue List',
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