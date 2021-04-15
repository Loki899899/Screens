<View style={{ flex: 1, justifyContent: 'flex-end', }}>
    {/* <KeyboardDoneButton style={{flex:1, borderRadius: 10,}} /> */}

    <View style={{ width: Scales.deviceWidth * 1, height: Scales.deviceHeight * 0.60, backgroundColor: "#52526c", borderRadius: 20, marginTop: '5%' }}>

        {/* CROSS ICON FOR MODAL */}
        <TouchableOpacity
            onPress={() => this.setState({ send_reminder_modal: false, selected_date: this.props.data.jobma_invitation_expire_date })}
        >
            <View style={{ alignItems: 'flex-end', padding: '5%' }}>
                <Image
                    source={require('../../assets/JobmaIcons/close.png')}
                    style={{ width: 30, height: 30, marginRight: '2%' }}
                ></Image>
            </View>
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 26, textAlign: 'center', marginBottom: '5%' }}>SEND REMINDER</Text>

        {/* DATE PICKING INPUT FOR MODAL */}
        <View style={{ alignItems: 'center' }}>
            <TextInput placeholderTextColor='#8b8b8b' placeholder='Interview Link Expiration Date' style={{ width: '86%', marginTop: '3%', marginBottom: '7%', borderBottomWidth: 1, borderBottomColor: '#8b8b8b', padding: '2%', paddingBottom: 0 }}></TextInput>
        </View>

        {/* MESSAGE TEXT INPUT FOR MODAL */}
        <View style={{ alignItems: 'center' }}>
            <TextInput placeholderTextColor='#8b8b8b' placeholder='Message' style={{ width: '86%', marginTop: '3%', marginBottom: '7%', borderBottomWidth: 1, borderBottomColor: '#8b8b8b', padding: '2%', paddingBottom: 0 }}></TextInput>
        </View>

        {/* CLOSE AND SEND BUTTON IN MODAL */}
        <View style={{ marginTop: '4%', width: Scales.deviceWidth * 0.80, height: Scales.deviceHeight * 0.07, alignSelf: "center", flexDirection: "row", alignItems: "flex-end", justifyContent: "center" }}>
            <TouchableOpacity activeOpacity={0.1} onPress={() => this.setState({ send_reminder_modal: false, selected_date: this.props.data.jobma_invitation_expire_date })}>
                <View style={{ width: Scales.deviceWidth * 0.20, borderRadius: 5, height: Scales.deviceHeight * 0.05, backgroundColor: 'white', justifyContent: "center" }}>
                    <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#52526c" }}>Close</Text>
                </View>
            </TouchableOpacity>
            <View style={{ paddingLeft: Scales.deviceWidth * 0.01 }}>
                <TouchableOpacity activeOpacity={0.1} disabled={this.state.show_loader} onPress={() => this.SendReminder()}>
                    <View style={{ width: Scales.deviceWidth * 0.30, borderRadius: 5, height: Scales.deviceHeight * 0.05, justifyContent: "center", backgroundColor: '#13d7a6' }}>
                        <Text style={{ textAlign: 'center', fontFamily: "roboto-medium", color: "#52526c" }}>Send</Text>
                    </View></TouchableOpacity>
            </View>
        </View>
    </View>

</View>