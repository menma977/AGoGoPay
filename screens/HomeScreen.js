import React from 'react';
import { View, WebView, KeyboardAvoidingView } from 'react-native';
import {
    Container,
    Spinner,
    Tab,
    Tabs
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';

import HomeTab from './tab/HomeTab';

export default class HomeScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: false } );
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <View style={ [ Styles.container, { backgroundColor: '#fbb5fd' } ] }>
                    <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                        <Spinner color='#fff' />
                    </View>
                </View>
            );
        } else {
            return (
                <Container>
                    <Header { ...this.props } name='AGOGOGPAY' />
                    <Tabs>
                        <Tab heading='Home' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>
                            <HomeTab { ...this.props } />
                        </Tab>
                        <Tab heading='Help' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>
                            <Tabs>
                                <Tab heading='How To Use' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>

                                </Tab>
                                <Tab heading='Criticism And Suggestions' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>

                                </Tab>
                            </Tabs>
                        </Tab>
                    </Tabs>
                </Container>
            );
        }
    }
}
