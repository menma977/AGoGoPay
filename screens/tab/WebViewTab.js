import React from 'react';
import { View, WebView, KeyboardAvoidingView, BackHandler } from 'react-native';
import {
    Spinner,
} from 'native-base';
import Styles from '../../constants/Styles';

export default class WebViewTab extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
        }
    }

    componentWillMount () {
        BackHandler.addEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    componentWillUnmount () {
        BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    handleBackButtonClick () {
        this.props.navigation.navigate( 'Home' )
        return true;
    }

    async componentDidMount () {
        setTimeout( () => {
            this.setState( { isLoading: false } );
        }, 1000 );
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <View style={ [ Styles.container, { backgroundColor: '#f27e95' } ] }>
                    <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                        <Spinner color='#fff' />
                    </View>
                </View>
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } } >
                    {/* load Web View */ }
                    <WebView source={ { uri: 'https://www.agogopay.com/' } } />
                    {/* /load Web View */ }
                </KeyboardAvoidingView>
            );
        }
    }
}
