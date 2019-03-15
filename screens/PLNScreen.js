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
    ListItem,
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
import PLNController from '../components/controller/PNLController';

export default class PLNScreen extends React.Component {
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
            token: '',
            nominal: 'PLN20',
            dataRequest: [],
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
        } );
        this.setState( { isLoading: false } );
    }

    async sendDataRequest () {
        this.setState( { isLoading: true } );
        if ( this.state.phone >= 10 && this.state.token >= 11 && this.state.nominal != null ) {
            let setType = this.state.nominal;
            let data = await PLNController.prototype.Request( this.state.username, this.state.code, this.state.phone.replace( '-', '' ).replace( '+62', '0' ), this.state.token, setType );
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
        } else if ( this.state.phone < 10 ) {
            Config.prototype.newAlert( 2, 'Nomoar Telfon yang anda inputkan kurang dari 10 digit', 10000, "top" );
        } else if ( this.state.token < 11 ) {
            Config.prototype.newAlert( 2, 'Nomoar Token yang anda inputkan kurang dari 11 digit', 10000, "top" );
        } else {
            Config.prototype.newAlert( 3, 'Gagal Memproses di proses', 10000, "top" );
        }
        this.setState( { isLoading: false } );
    }

    async buyData () {
        this.setState( { isLoading: true } );
        let dataRequest = this.state.dataRequest;
        let setUsername = dataRequest.Username;
        let setCode = dataRequest.IdLogin;
        let setPhoneNumber = dataRequest.NoHP;
        let setPayCode = dataRequest.Kode;
        let setToken = dataRequest.IdPel;
        let setFirstBalance = dataRequest.SaldoAwal;
        let setPrice = dataRequest.Harga;
        let setRemainingBalance = dataRequest.SisaSaldo;
        let data = await PLNController.prototype.Pay( setUsername, setCode, setPhoneNumber, setPayCode, setToken, setFirstBalance, setPrice, setRemainingBalance );
        if ( data.Status == 0 ) {
            AsyncStorage.setItem( 'balance', setRemainingBalance );
            this.setState( {
                dataRequest: [],
                balance: setRemainingBalance,
                nominal: 5,
                phone: '',
                typeNumberName: 'Type Nomer tidak terdekteksi',
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
                <View style={ [ Styles.container, { backgroundColor: '#fbb5fd' } ] }>
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
                            <Header style={ { backgroundColor: '#fbb5fd' } } >
                                <Body style={ { alignItems: 'flex-start' } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                        <Icon type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#fff' } } />
                                    </Button>
                                </Body>
                                <Body style={ { alignItems: 'center' } }>
                                    <Title><Icon active type='Entypo' name='flash' style={ { color: '#fff' } } /> PLN</Title>
                                </Body>
                                <Body style={ { alignItems: 'flex-end' } }></Body>
                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Card>
                                    <CardItem header>
                                        <Text>Validasi Transaksi</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='Feather' name='smartphone' />
                                            <Text>No HP</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.NoHP }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='MaterialCommunityIcons' name='package' />
                                            <Text>No Meter</Text>
                                        </Left>
                                        <Right>
                                            <Text>{ this.state.dataRequest.IdPel }</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='money' />
                                            <Text>Harga</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.Harga ) },00</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                            <Icon active type='FontAwesome' name='balance-scale' />
                                            <Text>Saldo Awal</Text>
                                        </Left>
                                        <Right>
                                            <Text>Rp { this.setRupiah( this.state.dataRequest.SaldoAwal ) },00</Text>
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
                            <Header style={ { backgroundColor: '#fbb5fd' } } >
                                <Body style={ { alignItems: 'flex-start' } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'Home' ) } style={ { alignSelf: 'flex-start' } }>
                                        <Icon type='Ionicons' name='ios-arrow-back' size={ 20 } style={ { color: '#fff' } } />
                                    </Button>
                                </Body>
                                <Body style={ { alignItems: 'center' } }>
                                    <Title><Icon active type='Entypo' name='flash' style={ { color: '#fff' } } /> PLN</Title>
                                </Body>
                                <Body style={ { alignItems: 'flex-end' } }></Body>
                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Form style={ [ Styles.alignItemCenter ] }>
                                    <Item floatingLabel style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }
                                        error={ this.state.phone.length >= 4 && this.state.phone.length < 10 ? true : false }
                                        success={ this.state.phone.length >= 10 ? true : false }>
                                        <Icon active type='FontAwesome' name='mobile-phone' />
                                        <Label>Nomer Ponsel</Label>
                                        <Input keyboardType='numeric' value={ String( this.state.phone ) } onChangeText={ ( phone ) => this.setState( { phone } ) } />
                                    </Item>
                                    <Text>{ '\n' }</Text>
                                    <Item floatingLabel style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }
                                        error={ this.state.token.length >= 1 && this.state.token.length < 11 ? true : false }
                                        success={ this.state.token.length >= 11 ? true : false }>
                                        <Icon active type='MaterialCommunityIcons' name='scale-bathroom' />
                                        <Label>Nomer Meter</Label>
                                        <Input keyboardType='numeric' value={ String( this.state.token ) } onChangeText={ ( token ) => this.setState( { token } ) } />
                                    </Item>
                                    <Text>{ '\n' }</Text>
                                    <Text>{ '\n' }</Text>
                                    <Item style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                        <Icon active type='MaterialCommunityIcons' name='package' />
                                        <Label>Paket</Label>
                                        <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                                            <Picker.Item label="Rp 20.000" value="PLN20" />
                                            <Picker.Item label="Rp 50.000" value="PLN50" />
                                            <Picker.Item label="Rp 100.000" value="PLN100" />
                                            <Picker.Item label="Rp 200.000" value="PLN200" />
                                            <Picker.Item label="Rp 500.000" value="PLN500" />
                                            <Picker.Item label="Rp 1.000.000" value="PLN1000" />
                                        </Picker>
                                    </Item>
                                    <Text style={ { fontSize: 10 } }>Saldo anda saat ini Rp { this.state.balance },00</Text>
                                </Form>
                                <Text>{ '\n' }</Text>
                                <Text>{ '\n' }</Text>
                                <Text>{ '\n' }</Text>
                                <Button rounded block success style={ { width: '90%', alignSelf: 'center' } }
                                    onPress={ this.sendDataRequest.bind( this ) } disabled={ this.state.phone < 10 && this.state.token < 11 }>
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
