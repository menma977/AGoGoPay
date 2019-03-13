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
import PhoneCodeController from '../components/controller/PhoneCodeControler';
import Config from '../components/model/Config';
import PulseController from '../components/controller/PulseController';

export default class PulseScreen extends React.Component {
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
            type: 1,
            typeNumber: 5,
            typeNumberName: 'Masukkan Nomer Ponsel',
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


    seePhoneNumber ( phone ) {
        this.setState( { phone } );
        if ( phone ) {
            let phoneNumber = phone.substring( 0, 4 );
            if ( PhoneCodeController.prototype.Telkomsel( phoneNumber ) ) {
                this.setState( { typeNumber: 1, typeNumberName: 'TEKOMSEL' } );
                this.setState( { isButton: false } );
            } else if ( PhoneCodeController.prototype.Indosat( phoneNumber ) ) {
                this.setState( { typeNumber: 2, typeNumberName: 'INDOSAT' } );
                this.setState( { isButton: false } );
            } else if ( PhoneCodeController.prototype.XL( phoneNumber ) ) {
                this.setState( { typeNumber: 3, typeNumberName: 'XL' } );
                this.setState( { isButton: false } );
            } else if ( PhoneCodeController.prototype.Axis( phoneNumber ) ) {
                this.setState( { typeNumber: 4, typeNumberName: 'AXIS' } );
                this.setState( { isButton: false } );
            } else if ( PhoneCodeController.prototype.Smart( phoneNumber ) ) {
                this.setState( { typeNumber: 5, typeNumberName: 'SMART' } );
                this.setState( { isButton: false } );
            } else if ( PhoneCodeController.prototype.Three( phoneNumber ) ) {
                this.setState( { typeNumber: 6, typeNumberName: 'THREE' } );
                this.setState( { isButton: false } );
            } else {
                this.setState( { typeNumber: 7, typeNumberName: 'Type Nomer tidak terdekteksi' } );
                this.setState( { isButton: true } );
            }
        } else {
            this.setState( { typeNumber: 7, typeNumberName: 'Type Nomer tidak terdekteksi' } );
            this.setState( { isButton: true } );
        }
    }

    async sendDataRequest () {
        this.setState( { isLoading: true } );
        if ( this.state.phone && this.state.nominal != null ) {
            let setType = this.state.type == 1 ? '' : 'DATA';
            let data = await PulseController.prototype.Request( this.state.username, this.state.code, this.state.phone.replace( '-', '' ).replace( '+62', '0' ), this.state.nominal, setType );
            if ( data.Status == 0 ) {
                this.setState( { switchView: true, dataRequest: data } );
            } else {
                Config.prototype.newAlert( 3, 'Transaksi dengan nominal no hp yang sama hanya bisa di lakukan 1x12jam. Gunakan nominal lain.', 10000, "top" );
                this.setState( { switchView: false } );
            }
        } else {
            Config.prototype.newAlert( 3, 'Nomoar yang anda inputkan gagal di proses', 10000, "top" );
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
        let data = await PulseController.prototype.Pay( setUsername, setCode, setPhoneNumber, setPayCode, setNominal, setFirstBalance, setPrice, setRemainingBalance );
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
        } else {
            Config.prototype.newAlert( 2, data.Pesan, 10000, "top" );
            this.setState( { switchView: false } );
        }
        this.setState( { isLoading: false } );
    }

    seeType () {
        if ( this.state.type == 1 ) {
            return this.setNominal();
        } else {
            return this.setData();
        }
    }

    setNominal () {
        if ( this.state.typeNumber == 1 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Rp 5.000" value="5" />
                    <Picker.Item label="Rp 10.000" value="10" />
                    <Picker.Item label="Rp 20.000" value="20" />
                    <Picker.Item label="Rp 25.000" value="25" />
                    <Picker.Item label="Rp 50.000" value="50" />
                    <Picker.Item label="Rp 100.000" value="100" />
                    <Picker.Item label="Rp 200.000" value="200" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 2 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Rp 5.000" value="5" />
                    <Picker.Item label="Rp 10.000" value="10" />
                    <Picker.Item label="Rp 20.000" value="20" />
                    <Picker.Item label="Rp 25.000" value="25" />
                    <Picker.Item label="Rp 30.000" value="30" />
                    <Picker.Item label="Rp 50.000" value="50" />
                    <Picker.Item label="Rp 100.000" value="100" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 3 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Rp 5.000" value="5" />
                    <Picker.Item label="Rp 10.000" value="10" />
                    <Picker.Item label="Rp 25.000" value="25" />
                    <Picker.Item label="Rp 50.000" value="50" />
                    <Picker.Item label="Rp 100.000" value="100" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 4 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Rp 5.000" value="5" />
                    <Picker.Item label="Rp 10.000" value="10" />
                    <Picker.Item label="Rp 25.000" value="25" />
                    <Picker.Item label="Rp 50.000" value="50" />
                    <Picker.Item label="Rp 100.000" value="100" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 5 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Rp 5.000" value="5" />
                    <Picker.Item label="Rp 10.000" value="10" />
                    <Picker.Item label="Rp 20.000" value="20" />
                    <Picker.Item label="Rp 50.000" value="50" />
                    <Picker.Item label="Rp 100.000" value="100" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 6 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Rp 1.000" value="1" />
                    <Picker.Item label="Rp 5.000" value="5" />
                    <Picker.Item label="Rp 10.000" value="10" />
                    <Picker.Item label="Rp 20.000" value="20" />
                    <Picker.Item label="Rp 30.000" value="30" />
                    <Picker.Item label="Rp 50.000" value="50" />
                    <Picker.Item label="Rp 100.000" value="100" />
                </Picker>
            );
        } else {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Type Nomer tidak terdekteksi" value={ null } />
                </Picker>
            );
        }
    }

    setData () {
        if ( this.state.typeNumber == 1 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="TELKOMSEL 1200MB 30HR" value="50" />
                    <Picker.Item label="TELKOMSEL 3500MB 30HR" value="100" />
                    <Picker.Item label="TELKOMSEL 35MB 7 HR" value="5" />
                    <Picker.Item label="TELKOMSEL 420MB 7HR" value="20" />
                    <Picker.Item label="TELKOMSEL 550MB 30HR" value="25" />
                    <Picker.Item label="TELKOMSEL 90MB 7HR" value="10" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 2 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="ISAT 1GB 24JAM 30HR" value="10" />
                    <Picker.Item label="ISAT 2GB 24JAM 30HR" value="20" />
                    <Picker.Item label="ISAT 3GB 30HR" value="30" />
                    <Picker.Item label="ISAT 7GB 30HR" value="70" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 3 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Xl Data 1.5 GB 60 Hr" value="50" />
                    <Picker.Item label="Xl Data 3 GB 60 Hr" value="60" />
                    <Picker.Item label="Xl Data 50 MB 7 Hr" value="5" />
                    <Picker.Item label="Xl Data 800 Mb 30 Hr" value="30" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 4 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="AXIS 1GB" value="1" />
                    <Picker.Item label="AXIS 2GB" value="2" />
                    <Picker.Item label="AXIS 3GB" value="3" />
                </Picker>
            );
        } else if ( this.state.typeNumber == 5 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Tidak memiliki paket" value={ null } />
                </Picker>
            );
        } else if ( this.state.typeNumber == 6 ) {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="THREEDATA 1GB" value="1" />
                    <Picker.Item label="THREEDATA 2GB" value="2" />
                    <Picker.Item label="THREEDATA 3GB" value="3" />
                </Picker>
            );
        } else {
            return (
                <Picker note mode="dropdown" style={ { width: 120 } } selectedValue={ this.state.nominal } onValueChange={ ( nominal ) => this.setState( { nominal } ) }>
                    <Picker.Item label="Type Nomer tidak terdekteksi" value={ null } />
                </Picker>
            );
        }
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
                                    <Title>Pulsa</Title>
                                </Body>
                                <Body style={ { alignItems: 'flex-end' } }></Body>
                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Card>
                                    <CardItem header>
                                        <Text>Validasi Transaksi</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Text>No HP: { this.state.dataRequest.NoHP }</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Text>Harga: { this.state.dataRequest.Harga }</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Text>Saldo Awal: { this.state.dataRequest.SaldoAwal }</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Text>Sisa Saldo: { this.state.dataRequest.SisaSaldo }</Text>
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
                                    <Title>Pulsa</Title>
                                </Body>
                                <Body style={ { alignItems: 'flex-end' } }></Body>
                            </Header>
                            <Content style={ { flex: 1 } }>
                                <Text>{ '\n' }</Text>
                                <Text style={ { textAlign: 'center' } }>{ this.state.typeNumberName }</Text>
                                <Text>{ '\n' }</Text>
                                <Card>
                                    <CardItem>
                                        <Row>
                                            <Col>
                                                <Button transparent block onPress={ () => { this.setState( { type: 1 } ) } }>
                                                    <Row>
                                                        <Col size={ 2 }><Radio selected={ this.state.type == 1 ? true : false } /></Col>
                                                        <Col size={ 8 }><Text>Reguler</Text></Col>
                                                    </Row>
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button transparent block onPress={ () => { this.setState( { type: 2 } ) } }>
                                                    <Row>
                                                        <Col size={ 2 }><Radio selected={ this.state.type == 2 ? true : false } /></Col>
                                                        <Col size={ 8 }><Text>DATA</Text></Col>
                                                    </Row>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardItem>
                                </Card>
                                <Text>{ '\n' }</Text>
                                <Form style={ [ Styles.alignItemCenter ] }>
                                    <Text>{ '\n' }</Text>
                                    <Item floatingLabel style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                        <Label>Nomer Ponsel</Label>
                                        <Input keyboardType='numeric' value={ String( this.state.phone ) } onChangeText={ ( phone ) => this.seePhoneNumber( phone ) } />
                                    </Item>
                                    <Text>{ '\n' }</Text>
                                    <Text>{ '\n' }</Text>
                                    <Item style={ { width: '85%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                        <Label>Paket</Label>
                                        { this.seeType() }
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