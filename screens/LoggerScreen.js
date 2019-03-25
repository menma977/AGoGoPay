import React from 'react';
import { View, WebView, KeyboardAvoidingView, BackHandler, AsyncStorage, RefreshControl, ScrollView } from 'react-native';
import {
    Spinner,
} from 'native-base';
import Styles from '../constants/Styles';

export default class LoggerScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            username: '',
            code: ''
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
        this.setState( {
            username: await AsyncStorage.getItem( 'username' ),
            code: await AsyncStorage.getItem( 'code' )
        } );
        this.setState( { isLoading: false } );
    }

    onRefresh () {
        this.setState( { isLoading: true } );
        fetch( 'https://agogopay.com/api/logger.php?a=Logger&idlogin=' + this.state.code + '&username=' + this.state.username )
            .then( ( responseXBot ) => this.setState( { isLoading: false } ) ).catch( ( error ) => {
                this.onRefresh();
            } );
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
                <KeyboardAvoidingView behavior="padding" style={ { flex: 1, backgroundColor: '#f27e95' } } >
                    <ScrollView style={ { backgroundColor: '#f27e95', flex: 1, top: 20 } }
                        refreshControl={ <RefreshControl
                            refreshing={ this.state.isLoading } onRefresh={ this.onRefresh.bind( this ) } /> }>
                        {/* load Web View */ }
                        <WebView style={ { minHeight: 10000, width: '100%', height: '100%', flex: 1 } }
                            source={ { uri: 'https://agogopay.com/api/logger.php?a=Logger&idlogin=' + this.state.code + '&username=' + this.state.username } } />
                        {/* /load Web View */ }
                    </ScrollView>
                </KeyboardAvoidingView>
            );
        }
    }
}
