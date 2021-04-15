import React from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
} from 'react-native';

export default class KeyboardDoneButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { keyboardHeight: 0, keyboardShow: false };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (event) => this.keyboardDidShow(event),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            (event) => this.keyboardDidHide(event),
        );
    }

    keyboardDidShow = (event) => {
        this.setState({
            keyboardShow: true,
            keyboardHeight:
                event.endCoordinates.height > 100
                    ? Platform.OS == 'ios'
                        ? event.endCoordinates.height
                        : 0
                    : 0,
        });
    };
    keyboardDidHide = (event) => {
        this.setState({
            keyboardShow: false,
            keyboardHeight: 0,
        });
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    hideKeyboard = () => {
        this.setState({
            keyboardShow: false,
            keyboardHeight: 0,
        });
        Keyboard.dismiss();
    };

    render() {
        marginFromBottom =
            this.state.keyboardHeight == 0 ? 0 : this.state.keyboardHeight;

        keyboardShow = this.state.keyboardShow;

        return (
            <KeyboardAvoidingView style={styles.parent}>
                {Platform.OS === 'ios' && keyboardShow ? (
                    <View
                        style={{
                            ...styles.bottomParent,
                            marginBottom: marginFromBottom,
                        }}>
                        <TouchableOpacity  onPress={() => this.hideKeyboard()}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex:100
       
        
    },

    bottomParent: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',

        backgroundColor: 'rgba(214, 216, 221, 0.8)',
        width: '100%',

    },

    doneButtonText: {
        textAlignVertical: 'center',
        textAlign: 'center',
        color: '#0000cc',
        fontSize: 16,
        fontWeight: '600',
        padding: 10,
    },
});