import React from 'react';
import { View, KeyboardAvoidingView, AsyncStorage, BackHandler, Image } from 'react-native';
import {
    Spinner,
    Body,
    Title,
    Header,
    Icon,
    Button,
    Container,
    Content,
    Left,
    Radio,
    Right,
    Text,
    Row,
    Col,
    Card,
    CardItem,
    Form,
    Item,
    Label,
    Input,
    Picker
} from 'native-base';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import PulseController from '../components/controller/PulseController';
import HLRController from '../components/controller/HLRController';
import ProductController from '../components/controller/ProductController';
import OvoController from '../components/controller/OvoController';
import GrabController from '../components/controller/GrabController';

export default class GrabScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            isButton: true,
            switchView: false,
            username: '',
            code: '',
            balance: 0,
            phone: '',
            nominal: 5,
            typeNumber: 7,
            typeNumberName: null,
            dataRequest: [],
            HLR: [],
            product: []
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
        this.setState( { isLoading: true } );
        this.setState( {
            username: await AsyncStorage.getItem( 'username' ),
            code: await AsyncStorage.getItem( 'code' ),
            balance: await AsyncStorage.getItem( 'balance' ),
            HLR: await HLRController.prototype.Request( await AsyncStorage.getItem( 'username' ), await AsyncStorage.getItem( 'code' ) ),
            product: await ProductController.prototype.Request( await AsyncStorage.getItem( 'username' ), await AsyncStorage.getItem( 'code' ) ),
        } );
        this.setState( { isLoading: false } );
    }


    seePhoneNumber ( phone ) {
        this.setState( { phone } );
        let found = this.state.HLR.find( function ( element ) {
            return element.Hlr == phone.replace( /-/g, '' ).replace( '+62', '0' ).replace( ' ', '' ).substring( 0, 4 );
        } );
        if ( found ) {
            if ( found.Operator == 'TELKOMSEL' ) {
                this.setState( { typeNumber: 1, typeNumberName: 'TELKOMSEL' } );
                this.setState( { isButton: false } );
            } else if ( found.Operator == 'INDOSAT' ) {
                this.setState( { typeNumber: 2, typeNumberName: 'INDOSAT' } );
                this.setState( { isButton: false } );
            } else if ( found.Operator == 'XL' ) {
                this.setState( { typeNumber: 3, typeNumberName: 'XL' } );
                this.setState( { isButton: false } );
            } else if ( found.Operator == 'AXIS' ) {
                this.setState( { typeNumber: 4, typeNumberName: 'AXIS' } );
                this.setState( { isButton: false } );
            } else if ( found.Operator == 'SMART' ) {
                this.setState( { typeNumber: 5, typeNumberName: 'SMART' } );
                this.setState( { isButton: false } );
            } else if ( found.Operator == 'THREE' ) {
                this.setState( { typeNumber: 6, typeNumberName: 'THREE' } );
                this.setState( { isButton: false } );
            } else {
                this.setState( { typeNumber: 7, typeNumberName: null } );
                this.setState( { isButton: true } );
            }
        } else {
            this.setState( { typeNumber: 7, typeNumberName: null } );
            this.setState( { isButton: true } );
        }
    }

    async sendDataRequest () {
        this.setState( { isLoading: true } );
        if ( this.state.phone.length >= 10 && this.state.nominal != null ) {
            let setType = 'GRAB';
            let data = await GrabController.prototype.Request( this.state.username, this.state.code, this.state.phone.replace( /-/g, '' ).replace( '+62', '0' ).replace( ' ', '' ), this.state.nominal, setType );
            if ( data.Status == 0 ) {
                this.setState( { switchView: true, dataRequest: data } );
            } else if ( data.Status == 1 ) {
                Config.prototype.newAlert( 3, data.Pesan, 10000, 'top' );
                this.setState( { switchView: false } );
            } else {
                AsyncStorage.clear();
                Expo.Updates.reload();
                this.props.navigation.navigate( 'Login' );
            }
        } else if ( this.state.phone.length < 10 ) {
            Config.prototype.newAlert( 2, 'Nomoar Telfon yang anda inputkan kurang dari 10 digit', 10000, 'top' );
        } else {
            Config.prototype.newAlert( 3, 'Provider tidak di temukan', 10000, 'top' );
        }
        this.setState( { isLoading: false } );
    }

    async buyData () {
        this.setState( { isLoading: true } );
        let dataRequest = this.state.dataRequest;
        let setUsername = dataRequest.Username;
        let setCode = dataRequest.IdLogin;
        let setPhoneNumber = dataRequest.NoHP;
        let setPayCode = dataRequest.Kode
        let setNominal = dataRequest.Nominal;
        let setFirstBalance = dataRequest.SaldoAwal;
        let setPrice = dataRequest.Harga;
        let setRemainingBalance = dataRequest.SisaSaldo;
        let data = await GrabController.prototype.Pay( setUsername, setCode, setPhoneNumber, setPayCode, setNominal, setFirstBalance, setPrice, setRemainingBalance );
        if ( data.Status == 0 ) {
            AsyncStorage.setItem( 'balance', setRemainingBalance );
            this.setState( {
                dataRequest: [],
                balance: setRemainingBalance,
                nominal: 5,
                phone: '',
                typeNumberName: null,
            } );
            Config.prototype.newAlert( 1, data.Pesan, 10000, 'top' );
            this.setState( { switchView: false } );
            this.componentDidMount();
        } else if ( data.Status == 1 ) {
            Config.prototype.newAlert( 2, data.Pesan, 10000, 'top' );
            this.setState( { switchView: false } );
        } else {
            AsyncStorage.clear();
            Expo.Updates.reload();
            this.props.navigation.navigate( 'Login' );
        }
        this.setState( { isLoading: false } );
    }

    setNominal () {
        let data = [];
        if ( this.state.typeNumber != 7 ) {
            this.state.product[ 'GRAB' ].map( function ( item, key ) {
                if ( item[ 'type' ] == 'PENUMPANG' ) {
                    data.push( { code: item[ 'code' ].replace( 'GRAB ', '' ), name: item[ 'name' ] } );
                }
            } );
            return (
                <Picker note mode="dropdown" style={ { width: 395 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    { data.map( function ( item, key ) {
                        return (
                            <Picker.Item key={ key } label={ item[ 'name' ] } value={ item[ 'code' ] } />
                        );
                    } ) }
                </Picker>
            );
        } else {
            data = [];
            return (
                <Picker note mode="dropdown" style={ { width: 395 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Provider tidak di temukan" value={ null } />
                </Picker>
            );
        }
    }

    setImage () {
        if ( this.state.typeNumberName ) {
            let url = null;
            if ( this.state.typeNumber == 1 ) {
                url = require( '../assets/images/provider/TEKOMSEL.png' );
            } else if ( this.state.typeNumber == 2 ) {
                url = require( '../assets/images/provider/INDOSAT.png' );
            } else if ( this.state.typeNumber == 3 ) {
                url = require( '../assets/images/provider/XL.png' );
            } else if ( this.state.typeNumber == 4 ) {
                url = require( '../assets/images/provider/AXIS.png' );
            } else if ( this.state.typeNumber == 5 ) {
                url = require( '../assets/images/provider/SMART.png' );
            } else {
                url = require( '../assets/images/provider/THREE.png' );
            }
            return (
                <Image source={ url }
                    style={ { flex: 1, width: '100%', height: 55, resizeMode: 'contain', alignSelf: 'center' } } />
            );
        } else {
            return (
                <Image source={ require( '../assets/images/icon.png' ) } style={ { flex: 1, width: '100%', height: 55, resizeMode: 'contain', alignSelf: 'center' } } />
            );
        }
    }

    setRupiah ( value ) {
        let balance = String( value );
        leftovers = balance.length % 3;
        rupiah = balance.substr( 0, leftovers );
        thousand = balance.substr( leftovers ).match( /\d{3}/g );
        if ( thousand ) {
            separator = leftovers
                ? '.'
                : '';
            rupiah += separator + thousand.join( '.' );
        }
        return rupiah;
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
            if ( this.state.switchView ) {
                return (
                    <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } } >
                        {/* set keyboard avoid view */ }
                        <Container>
                            <Header style={ { backgroundColor: '#ffffffff' } } >
                                <Body style={ { alignItems: 'flex-start' } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                        <Icon active type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#4b3854ff' } } />
                                    </Button>
                                </Body>
                                <Body style={ { alignItems: 'center' } }>
                                    <Title style={ { color: '#4b3854ff' } }>GRAB</Title>
                                </Body>

                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Card>
                                    <CardItem header>
                                        <Text>Validasi Transaksi</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='Feather' name='smartphone' size={ 25 } />
                                            <Text>No Ponsel</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.NoHP }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='money' size={ 25 } />
                                            <Text>Harga</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.Harga ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='balance-scale' size={ 25 } />
                                            <Text>Saldo Awal</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.SaldoAwal ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='MaterialIcons' name='account-balance-wallet' size={ 25 } />
                                            <Text>Sisa Saldo</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.SisaSaldo ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem footer>
                                        <Left>
                                            <Button rounded block success style={ { alignSelf: 'center' } } onPress={ () => { this.setState( { switchView: false } ) } }>
                                                <Icon active type='Entypo' name='back' size={ 25 } color='#fff' />
                                                <Text>Kembali</Text>
                                            </Button>
                                        </Left>
                                        <Right>
                                            <Button rounded block success style={ { alignSelf: 'center' } } onPress={ this.buyData.bind( this ) }>
                                                <Icon active type='Entypo' name='shopping-cart' size={ 25 } color='#fff' />
                                                <Text>Beli</Text>
                                            </Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                                <Text>{ '\n' }</Text>
                            </Content>
                        </Container>
                        {/* /set keyboard avoid view */ }
                    </KeyboardAvoidingView>
                );
            } else {
                return (
                    <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } } >
                        {/* set keyboard avoid view */ }
                        <Container>
                            <Header style={ { backgroundColor: '#fff' } } >
                                <Body style={ { alignItems: 'flex-start' } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                        <Icon active type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#4b3854ff' } } />
                                    </Button>
                                </Body>
                                <Body style={ { alignItems: 'center' } }>
                                    <Title style={ { color: '#4b3854ff' } }>GRAB</Title>
                                </Body>

                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Text>{ '\n' }</Text>
                                { this.setImage() }
                                <Text>{ '\n' }</Text>
                                <Form style={ [ Styles.alignItemCenter ] }>
                                    <Item floatingLabel style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }
                                        error={ this.state.phone.length >= 4 && this.state.phone.length < 10 ? true : false }
                                        success={ this.state.phone.length >= 10 ? true : false }>
                                        <Icon active type='FontAwesome' name='mobile-phone' />
                                        <Label>Nomor Ponsel</Label>
                                        <Input keyboardType='numeric' value={ String( this.state.phone ) }
                                            onChangeText={ ( phone ) => this.seePhoneNumber( phone ) } />
                                    </Item>
                                    <Text>{ '\n' }</Text>
                                    <Text>{ '\n' }</Text>
                                    <Item style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                        <Icon active type='MaterialCommunityIcons' name='package' />
                                        <Label>Paket</Label>
                                        { this.setNominal() }
                                    </Item>
                                    <Text style={ { fontSize: 10 } }>Saldo anda saat ini Rp { this.state.balance },00</Text>
                                </Form>
                                <Text>{ '\n' }</Text>
                                <Text>{ '\n' }</Text>
                                <Text>{ '\n' }</Text>
                                <Button rounded block success style={ { width: '90%', alignSelf: 'center' } } disabled={ this.state.isButton } onPress={ this.sendDataRequest.bind( this ) }>
                                    <Icon type='Entypo' name='shopping-cart' size={ 25 } color='#fff' />
                                    <Text>Lajut Ke Pembelian</Text>
                                </Button>
                                <Text>{ '\n' }</Text>
                            </Content>
                        </Container>
                        {/* /set keyboard avoid view */ }
                    </KeyboardAvoidingView>
                );
            }
        }
    }
}
