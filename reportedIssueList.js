import React, { useState } from 'react'
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity, Button, Modal, TextInput, ScrollView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LinearGradient from 'react-native-linear-gradient'

const Stack = createStackNavigator();

const styles = StyleSheet.create({
    crossIcon: {
        position: 'absolute',
        right: -5,
        top: '20%',
    },
    inputContainer: {
        paddingBottom:'2%',
        paddingLeft: '7%',
        borderRadius: 25,
        backgroundColor: '#f4f4f4'
    },
    issueActionText: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    issueStatusText: {
        color: 'orange',
        fontWeight: 'bold',
    },
    message: {
        fontSize: 15,
    },
    messageBox: {
        padding: '6%',
        paddingTop: '7%',
        paddingBottom: '7%',
        backgroundColor: '#f4f4f4',
        borderRadius: 8,
    },
    messageBoxContainer: {
        padding: '2%',
        paddingRight: '4%',
        paddingLeft: '4%',
    },
    modalMainContainer: {
        height: '90.5%',
        marginTop: 2,
        padding: '6%',
        paddingBottom:'2%',
        paddingTop: '4%',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        backgroundColor: 'white',
    },
    modalHeading: {
        fontSize: 15,
    },
    modalHeadingContainer: {
        paddingBottom: '6%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    modalButton: {
        width: 100,
        height: 50,
    },
    noteCard: {
        padding: 1,
        paddingLeft: '4%',
        paddingRight: '4%',
        borderLeftWidth: 2,
        borderLeftColor: 'orange',
    },
    noteCardContainer: {
        borderRadius: 8,
        backgroundColor: '#fef7e5',
        padding: '2%',
        marginBottom: '3%'
    },
    triangleCorner: {
        position:'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 18,
        borderTopWidth: 18,
        borderRightColor: 'transparent',
        borderTopColor: '#f4f4f4',
        transform: [{ rotate: '270deg' }],
    },
    traingleForGradientMessageBox: {
        bottom:7,
        left:2,
        borderTopColor: '#0fb8d6',
        transform: [{ rotate: '180deg' }], 
    },
})

const NoteCard = () => {
    return (
        <View style={styles.noteCardContainer}>
            <View style={styles.noteCard}>
                <Text>
                    Your issue status is <Text style={styles.issueStatusText}>Pending</Text>.
                    Our support team will update it soon.
                <Text style={styles.issueActionText}>Close issue</Text>
                </Text>
            </View>
        </View>
    );
}

const MessageBoxWithGradient = (props) => {
    return (
        <>
        <LinearGradient
            colors={['#0fb8d6', '#73b943']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.messageBox, {backgroundColor:'transparent'}]}
        >
            <Text style={[styles.message, {color:'white'}]}>{props.message}</Text>

        </LinearGradient>
        <View style={[styles.triangleCorner, styles.traingleForGradientMessageBox]}></View>
        </>
    );
}

const MessageBoxWithoutGradient = (props) => {
    return (
        <>
            <View style={styles.messageBox}>
                <Text style={styles.message}>{props.message}</Text>
            </View>
            <View style={[styles.triangleCorner, {bottom:7, right:3,}]}></View>
        </>
    );
}

const MessageBoxContainer = (props) => {
    return (
        <View style={styles.messageBoxContainer}>
            {props.isRreply?<MessageBoxWithGradient message={props.message}/>:<MessageBoxWithoutGradient message={props.message}/>}
        </View>
    );
}

const MessagesBody = () => {
    return (
        <ScrollView style={{height:'73%'}}>
            <MessageBoxContainer 
                message='Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis'/>
            <MessageBoxContainer 
                isRreply={true}
                message='Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis'/>
            <MessageBoxContainer 
                message='Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis'/>
        </ScrollView>
    );
}

const MessageInput = () => {
    return (
        <View style={styles.inputContainer}>
            <TextInput placeholder='ENTER MESSAGE HERE'></TextInput>
            <View style={{ position: 'absolute', right: 15, top: 12 }}>
                <TouchableOpacity
                    onPress={() => {
                        //do things on pressing send
                    }}
                >
                    <Image source={require('./android/app/src/main/assets/images/send.png')} style={{ width: 25, height: 25 }}></Image>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const InteractionModal = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [bgColor, setBgColor] = useState('transparent')
    return (
        <>
            <View style={styles.modalButton}>
                <Button title='show modal' onPress={() => {
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
                >
                    <View style={styles.modalMainContainer}>
                        <View style={styles.modalHeadingContainer}>
                            <Text style={styles.modalHeading}>Interaction</Text>
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
                        <NoteCard />
                        <MessagesBody />
                        <MessageInput />
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
            <InteractionModal />
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