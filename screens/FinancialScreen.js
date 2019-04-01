import React from 'react';
import { View, WebView, KeyboardAvoidingView, BackHandler, AsyncStorage, RefreshControl, ScrollView } from 'react-native';
import {
    Spinner, Card, CardItem,
} from 'native-base';
import Styles from '../constants/Styles';

export default class FinancialScreen extends React.Component {
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
                <View style={ [ Styles.container, { backgroundColor: '#ffffffff' } ] }>
                    <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                        <Spinner color='#4b3854ff' />
                    </View>
                </View>
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={ { flex: 1, backgroundColor: '#ffffffff' } } >
                    <ScrollView style={ { backgroundColor: '#ffffffff', flex: 1, top: 20, } }
                        showsHorizontalScrollIndicator={ true }
                        refreshControl={ <RefreshControl refreshing={ this.state.isLoading } onRefresh={ this.onRefresh.bind( this ) } /> }>
                        {/* load Web View */ }
                        <WebView style={ { minHeight: 1000, height: '100%', flex: 1 } }
                            scalesPageToFit={ true }
                            source={ { uri: 'https://agogopay.com/api/financial.php?a=Financial&idlogin=' + this.state.code + '&username=' + this.state.username } } />
                        {/* /load Web View */ }
                    </ScrollView>
                </KeyboardAvoidingView>
            );
        }
    }
}
