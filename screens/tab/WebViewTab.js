import React from 'react';
import { View, WebView, KeyboardAvoidingView } from 'react-native';
import {
    Spinner,
    Body,
    Title,
    Header,
    Icon,
    Button
} from 'native-base';
import Styles from '../../constants/Styles';

export default class WebViewTab extends React.Component {
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
                <View style={ [ Styles.container ] }>
                    <Header style={ { backgroundColor: '#fbb5fd' } } >
                        <Body style={ { alignItems: 'flex-start' } }>
                            <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                <Icon type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#fff' } } />
                            </Button>
                        </Body>
                        <Body style={ { alignItems: 'center' } }>
                            <Title>WEB</Title>
                        </Body>
                        <Body style={ { alignItems: 'flex-end' } }></Body>
                    </Header>
                    {/* set keyboard avoid view */ }
                    <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } } >
                        {/* load Web View */ }
                        <WebView source={ { uri: 'https://www.agogopay.com/login' } } />
                        {/* /load Web View */ }
                    </KeyboardAvoidingView>
                    {/* /set keyboard avoid view */ }
                </View>
            );
        }
    }
}
