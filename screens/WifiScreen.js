import React from 'react';
import { View, KeyboardAvoidingView, AsyncStorage, BackHandler } from 'react-native';
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
    Right,
    Text,
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
import PaymentController from '../components/controller/PaymentController';

export default class WifiScreen extends React.Component {
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
            nominal: 'SPEEDY;2',
            idClient: '',
            dataRequest: [],
            product: [],
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
            product: [
                { name: 'SPEEDY', code: 'SPEEDY;2' },
                { name: 'TELEPON Contoh = 0351-455460', code: 'TELEPON;2' },
            ],
        } );
        this.setState( { isLoading: false } );
    }

    async sendDataRequest () {
        this.setState( { isLoading: true } );
        if ( this.state.phone.length >= 10 && this.state.idClient.length >= 8 && this.state.nominal != null ) {
            let setType = this.state.nominal;
            let setIdClient = this.state.idClient;
            let data = await PaymentController.prototype.Request( this.state.username, this.state.code, this.state.phone.replace( /-/g, '' ).replace( '+62', '0' ).replace( ' ', '' ), setIdClient, this.state.balance, setType );
            if ( data.Status == 0 ) {
                this.setState( { switchView: true, dataRequest: data } );
            } else if ( data.Status == 1 ) {
                Config.prototype.newAlert( 3, data.Pesan, 10000, "top" );
                this.setState( { switchView: false } );
            } else {
                AsyncStorage.clear();
                Expo.Updates.reload();
                this.props.navigation.navigate( 'Login' );
            }
        } else if ( this.state.phone.length < 10 ) {
            Config.prototype.newAlert( 2, 'Nomor ponsel yang anda masukkan kurang dari 10 digit', 10000, "top" );
        } else if ( this.state.idClient.length < 8 ) {
            Config.prototype.newAlert( 2, 'Nomor meter yang anda masukkan kurang dari 11 digit', 10000, "top" );
        } else {
            Config.prototype.newAlert( 3, 'Transaksi gagal diproses', 10000, "top" );
        }
        this.setState( { isLoading: false } );
    }

    async buyData () {
        this.setState( { isLoading: true } );
        let dataRequest = this.state.dataRequest;
        let setUsername = this.state.username;
        let setCode = this.state.code;
        let setType = dataRequest.Type;
        let setClientID = dataRequest.IdPel;
        let setClientName = dataRequest.NamaPelanggan;
        let setPrice = dataRequest.JmlTagih;
        let setAdmin = dataRequest.AdminBank;
        let setTotalPrice = dataRequest.TotalTagihan;
        let setPhoneNumber = dataRequest.NoHP;
        let setRemainingBalance = dataRequest.SisaSaldo;
        let setRef = dataRequest.Ref;
        let setPeriodic = dataRequest.PeriodeTagihan;
        let data = PaymentController.prototype.Pay( setUsername, setCode, setType, setClientID, setClientName, setPrice, setAdmin, setTotalPrice, setPhoneNumber, setRemainingBalance, setRef, setPeriodic )
        if ( data.Status == 0 ) {
            AsyncStorage.setItem( 'balance', setRemainingBalance );
            this.setState( {
                dataRequest: [],
                balance: setRemainingBalance,
                nominal: 5,
                phone: '',
            } );
            Config.prototype.newAlert( 1, data.Pesan, 10000, "top" );
            this.setState( { switchView: false } );
            this.componentDidMount();
        } else if ( data.Status == 1 ) {
            Config.prototype.newAlert( 2, data.Pesan, 10000, "top" );
            this.setState( { switchView: false } );
        } else {
            AsyncStorage.clear();
            Expo.Updates.reload();
            this.props.navigation.navigate( 'Login' );
        }
        this.setState( { isLoading: false } );
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
                <View style={ [ Styles.container, { backgroundColor: '#f27e95' } ] }>
                    <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                        <Spinner color='#fff' />
                    </View>
                </View>
            );
        } else {
            if ( this.state.switchView ) {
                return (
                    <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } } >
                        {/* set keyboard avoid view */ }
                        <Container>
                            <Header style={ { backgroundColor: '#f27e95' } } >
                                <Body style={ { alignItems: 'flex-start' } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                        <Icon type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#fff' } } />
                                    </Button>
                                </Body>
                                <Body style={ { alignItems: 'center' } }>
                                    <Title>Modem</Title>
                                </Body>
                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Card>
                                    <CardItem header>
                                        <Text>Validasi Transaksi</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='Feather' name='smartphone' />
                                            <Text>Nomor Ponsel</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.NoHP }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='AntDesign' name='idcard' />
                                            <Text>ID Pelanggan</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.IdPel }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='user-o' />
                                            <Text>Nama Pelanggan</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.NamaPelanggan }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='MaterialCommunityIcons' name='package' />
                                            <Text>Jenis Pemeblian</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.Type }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='money' />
                                            <Text>Biyaya Admin</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.AdminBank ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='money' />
                                            <Text>Harga</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.JmlTagih ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='balance-scale' />
                                            <Text>Saldo Awal</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.SaldoMember ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='balance-scale' />
                                            <Text>Total Tagihan</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.TotalTagihan ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='MaterialIcons' name='account-balance-wallet' />
                                            <Text>Sisa Saldo</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.SisaSaldo ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem footer>
                                        <Left>
                                            <Button rounded block success style={ { alignSelf: 'center' } } onPress={ () => { this.setState( { switchView: false } ) } }>
                                                <Icon type='Entypo' name='back' size={ 25 } color='#fff' />
                                                <Text>Kembali</Text>
                                            </Button>
                                        </Left>
                                        <Right>
                                            <Button rounded block success style={ { alignSelf: 'center' } } onPress={ this.buyData.bind( this ) }>
                                                <Icon type='Entypo' name='shopping-cart' size={ 25 } color='#fff' />
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
                            <Header style={ { backgroundColor: '#f27e95' } } >
                                <Body style={ { alignItems: 'flex-start' } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                        <Icon type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#fff' } } />
                                    </Button>
                                </Body>
                                <Body style={ { alignItems: 'center' } }>
                                    <Title>Modem</Title>
                                </Body>
                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Form style={ [ Styles.alignItemCenter ] }>
                                    <Item floatingLabel style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }
                                        error={ this.state.phone.length >= 4 && this.state.phone.length < 10 ? true : false }
                                        success={ this.state.phone.length >= 10 ? true : false }>
                                        <Icon active type='FontAwesome' name='mobile-phone' />
                                        <Label>Nomor Ponsel</Label>
                                        <Input keyboardType='numeric' value={ String( this.state.phone ) } onChangeText={ ( phone ) => this.setState( { phone } ) } />
                                    </Item>
                                    <Text>{ '\n' }</Text>
                                    <Item floatingLabel style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }
                                        error={ this.state.idClient.length >= 1 && this.state.idClient.length < 8 ? true : false }
                                        success={ this.state.idClient.length >= 8 ? true : false }>
                                        <Icon active type='FontAwesome' name='user-o' />
                                        <Label>ID Pelanggan</Label>
                                        <Input keyboardType='numeric' value={ String( this.state.idClient ) } onChangeText={ ( idClient ) => this.setState( { idClient } ) } />
                                    </Item>
                                    <Text>{ '\n' }</Text>
                                    <Text>{ '\n' }</Text>
                                    <Item style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                        <Icon active type='MaterialCommunityIcons' name='package' />
                                        <Label>Produk</Label>
                                        <Picker note mode="dropdown" style={ { width: 395 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                                            { this.state.product.map( function ( item, key ) {
                                                return (
                                                    <Picker.Item key={ key } label={ item[ 'name' ] } value={ item[ 'code' ] } />
                                                );
                                            } ) }
                                        </Picker>
                                    </Item>
                                    <Text style={ { fontSize: 10 } }>Saldo anda saat ini Rp { this.state.balance },00</Text>
                                </Form>
                                <Text>{ '\n' }</Text>
                                <Text>{ '\n' }</Text>
                                <Text>{ '\n' }</Text>
                                <Button rounded block success style={ { width: '90%', alignSelf: 'center' } }
                                    onPress={ this.sendDataRequest.bind( this ) } disabled={ this.state.phone < 10 && this.state.idClient < 11 }>
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
