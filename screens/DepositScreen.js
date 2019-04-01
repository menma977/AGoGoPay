import React from 'react';
import { View, AsyncStorage, BackHandler, KeyboardAvoidingView, Clipboard, ToastAndroid } from 'react-native';
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
export default class DepositScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            isButtonDisabled: false,
            username: '',
            code: '',
            nominal: '',
            nominalDoge: '',
            walletUser: '',
            walletDoge: '',
            switchWDDoge: false,
            codeDoge: '',
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );
        let dataDOGE = await DepositWithdrawController.prototype.getWalletDoge( await AsyncStorage.getItem( 'username' ) );
        this.setState( {
            username: await AsyncStorage.getItem( 'username' ),
            code: await AsyncStorage.getItem( 'code' ),
            walletDoge: dataDOGE.WalletDeposit,
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

    async sendEmailCode () {
        this.setState( { isLoading: true } );
        let setUsername = this.state.username;
        let setNominal = this.state.nominalDoge;
        let setWallet = this.state.walletUser;
        if ( setNominal < 100 ) {
            Config.prototype.newAlert( 2, 'nominal anda kurang dari 100 DOGE', 10000, 'top' );
        } else if ( !setWallet ) {
            Config.prototype.newAlert( 2, 'cek wallet anda dan tidak boleh kosong', 10000, 'top' );
        } else {
            let data = await DepositWithdrawController.prototype.wdDoge( setUsername, setNominal, setWallet );
            if ( data.Status == 0 ) {
                Config.prototype.newAlert( 1, 'silahkan cek email anda', 10000, 'top' );
                this.setState( { switchWDDoge: true } );
            } else {
                Config.prototype.newAlert( 2, data.Pesan, 10000, 'top' );
            }
        }
        this.setState( { isLoading: false } );
    }

    async finalWD () {
        this.setState( { isLoading: true } );
        let setUsername = this.state.username;
        let setNominal = this.state.nominalDoge;
        let setWallet = this.state.walletUser;
        let setCode = this.state.codeDoge;
        if ( !setCode ) {
            Config.prototype.newAlert( 1, 'code tidak boleh kosong', 10000, 'top' );
        } else {
            let data = await DepositWithdrawController.prototype.finalWD( setUsername, setNominal, setWallet, setCode );
            if ( data.Status == 0 ) {
                Config.prototype.newAlert( 1, data.Pesan, 10000, 'top' );
                this.setState( { switchWDDoge: true } );
            } else {
                Config.prototype.newAlert( 2, data.Pesan, 10000, 'top' );
            }
        }
        this.setState( { isLoading: false } );
    }

    switchWD () {
        if ( this.state.switchWDDoge ) {
            return (
                <Card>
                    <CardItem header style={ { backgroundColor: '#f27e95' } }>
                        <Body>
                            <Title>Code Unik</Title>
                        </Body>
                        <Right>
                            <Title>{ this.state.username }</Title>
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Item floatingLabel>
                                <Label>Code Unik</Label>
                                <Input keyboardType='number-pad' defaultValue={ this.state.codeDoge }
                                    onChangeText={ ( codeDoge ) => this.setState( { codeDoge } ) } />
                            </Item>
                            <Text>{ '\n' }</Text>
                            <Button rounded block success style={ { width: '90%', alignSelf: 'center' } }
                                onPress={ this.finalWD.bind( this ) } >
                                <Text>Kirim Code</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            );
        } else {
            return (
                <Card>
                    <CardItem header style={ { backgroundColor: '#f27e95' } }>
                        <Body>
                            <Title>Withdraw DOGE</Title>
                        </Body>
                        <Right>
                            <Title>{ this.state.username }</Title>
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Item floatingLabel>
                                <Label>Wallet Anda</Label>
                                <Input keyboardType='number-pad' defaultValue={ this.state.walletUser }
                                    onChangeText={ ( walletUser ) => this.setState( { walletUser } ) } />
                            </Item>
                            <Text>{ '\n' }</Text>
                            <Item floatingLabel>
                                <Label>Nominal</Label>
                                <Input keyboardType='number-pad' defaultValue={ this.state.nominalDoge }
                                    onChangeText={ ( nominalDoge ) => this.setState( { nominalDoge } ) } />
                            </Item>
                            <Text>{ '\n' }</Text>
                            <Button rounded block success style={ { width: '90%', alignSelf: 'center' } }
                                onPress={ this.sendEmailCode.bind( this ) } >
                                <Text>Kirim Email</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            );
        }
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
                                <CardItem header style={ { backgroundColor: '#f27e95' } }>
                                    <Body>
                                        <Title>Deposit PPOB</Title>
                                    </Body>
                                    <Right>
                                        <Title>{ this.state.username }</Title>
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
                            <Card>
                                <CardItem header style={ { backgroundColor: '#f27e95' } }>
                                    <Body>
                                        <Title>Deposit DOGE</Title>
                                    </Body>
                                    <Right>
                                        <Title>{ this.state.username }</Title>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Item floatingLabel>
                                            <Label>Wallet</Label>
                                            <Input keyboardType='number-pad' value={ this.state.walletDoge } editable={ false } />
                                        </Item>
                                        <Text>{ '\n' }</Text>
                                        <Button rounded block success style={ { width: '90%', alignSelf: 'center' } } onPress={ () => {
                                            Clipboard.setString( this.state.walletDoge );
                                            ToastAndroid.show( 'Copy in clipboard', ToastAndroid.SHORT );
                                        } } >
                                            <Text>Copy Wallet</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Card>
                            { this.switchWD() }
                        </Content>
                    </Container>
                </KeyboardAvoidingView>
            );
        }
    }
}
