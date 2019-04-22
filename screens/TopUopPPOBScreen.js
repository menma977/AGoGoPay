import React from 'react';
import { View, AsyncStorage, BackHandler, KeyboardAvoidingView, Clipboard, ToastAndroid , StatusBar } from 'react-native';
import {
    Spinner,
    Container,
    Text,
    Card,
    CardItem,
    Body,
    Icon,
    Row,
    Col,
    Button,
    Content,
    Title,
    Item,
    Label,
    Input,
    ActionSheet,
    Right,
    Form,
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import DepositWithdrawController from '../components/controller/DepositWithdrawController';
import Config from '../components/model/Config';
export default class TopUpPPOBScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            isButtonDisabled: false,
            username: '',
            code: '',
            nominal: '',
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );
        this.setState( {
            username: await AsyncStorage.getItem( 'username' ),
            code: await AsyncStorage.getItem( 'code' ),
        } );
        this.setState( { isLoading: false } );
    }

    componentWillMount () {
        BackHandler.addEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    componentWillUnmount () {
        BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    handleBackButtonClick () {
        this.props.navigation.navigate( 'Home' );
        return true;
    }

    async depositPPOB () {
        this.setState( { isLoading: true } );
        let setUsername = this.state.username;
        let setCodeLogin = this.state.code;
        let setNominal = this.state.nominal;
        let data = await DepositWithdrawController.prototype.depositPPOB( setUsername, setCodeLogin, setNominal );
        if ( data.Status == 0 ) {
            Config.prototype.newAlert( 1, data.Pesan, 10000, 'top' );
        } else {
            Config.prototype.newAlert( 2, data.Pesan, 10000, 'top' );
        }
        this.setState( { isLoading: false } );
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
                <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } }>
                    <Container>
                        <Header { ...this.props } name='AGOGOPAY' />
                        <Content padder>
                            <Card>
                                <CardItem header style={ { backgroundColor: '#ffffffff' } }>
                                    <Body>
                                        <Title style={ { color: '#4b3854ff' } }>Deposit PPOB</Title>
                                    </Body>
                                    <Right>
                                        <Title style={ { color: '#4b3854ff' } }>{ this.state.username }</Title>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Item floatingLabel>
                                            <Label>Nominal</Label>
                                            <Input keyboardType='number-pad' value={ this.state.nominal } onChangeText={ ( nominal ) => { this.setState( { nominal } ) } } />
                                        </Item>
                                        <Text>{ '\n' }</Text>
                                        <Button rounded block success style={ { width: '90%', alignSelf: 'center' } }
                                            disabled={ this.state.nominal ? false : true } onPress={ this.depositPPOB.bind( this ) }>
                                            <Text>Proses Deposit</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                    </Container>
                </KeyboardAvoidingView>
            );
        }
    }
}
