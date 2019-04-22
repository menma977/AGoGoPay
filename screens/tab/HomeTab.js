import React from 'react';
import { View, Image, AsyncStorage, ImageBackground, StatusBar } from 'react-native';
import {
    Container,
    Content,
    Spinner,
    Text,
    Card,
    CardItem,
    Body,
    Row,
    Col,
    Button,
    Icon,
    Left,
    ListItem,
    List,
    Label,
    Item,
    Input,
    H2,
} from 'native-base';
import BalanceController from '../../components/controller/BalanceController';
import Styles from '../../constants/Styles';


/**
 *
 *
 * @export
 * @class HomeTab
 * @extends {React.Component}
 */
export default class HomeTab extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            balance: 0,
            username: '',
            usernameDoge: null,
            idBanner: 0,
            banner: require( '../../assets/images/banner/banner1.jpg' ),
            dataBanner: [
                { id: 0, name: require( '../../assets/images/banner/banner1.jpg' ) },
                { id: 1, name: require( '../../assets/images/banner/banner2.jpg' ) },
            ]
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );
        let setUsername = await AsyncStorage.getItem( 'username' );
        let setUsernameDoge = await AsyncStorage.getItem( 'usernameDoge' );
        let setCode = await AsyncStorage.getItem( 'code' );
        let data = await BalanceController.prototype.GetBalance( setUsername, setCode );
        if ( data.Status == 0 ) {
            AsyncStorage.setItem( 'balance', String( data.Saldo ? data.Saldo : 0 ) );
        } else if ( data.Status == 2 ) {
            setTimeout( () => {
                Configuration.newAlert( 2, 'Sesi Login anda telah berakir tolong login lagi', 10000, 'top' );
            }, 10000 );
            AsyncStorage.clear();
            Expo.Updates.reload();
            this.props.navigation.navigate( 'Login' );
        } else {
            AsyncStorage.setItem( 'balance', '0' );
        }
        this.intervalManager( this );
        this.setState( { balance: await AsyncStorage.getItem( 'balance' ), username: setUsername, usernameDoge: setUsernameDoge } );
        this.setState( { isLoading: false } );
    }

    intervalManager () {
        let loopBanner = setInterval( () => {
            try {
                if ( this.state.idBanner == 1 ) {
                    clearInterval( loopBanner );
                    this.setState( {
                        idBanner: this.state.dataBanner[ 0 ].id,
                        banner: this.state.dataBanner[ 0 ].name,
                    } );
                    this.intervalManager( this );
                } else {
                    clearInterval( loopBanner );
                    this.setState( {
                        idBanner: this.state.dataBanner[ 1 ].id,
                        banner: this.state.dataBanner[ 1 ].name,
                    } );
                    this.intervalManager( this );
                }
            } catch ( error ) {
                clearInterval( loopBanner );
            }
        }, 5000 );
    }

    componentWillUnmount () {
        this.state = [];
    }

    gameDoge () {
        if ( this.state.usernameDoge ) {
            return (
                <Col>
                    <Card style={ { height: 40 } } onTouchEnd={ () => this.props.navigation.navigate( 'bot' ) }>
                        <CardItem style={ { height: 40 } } >
                            <Image source={ require( '../../assets/images/icon/game_doge.png' ) }
                                style={ { width: 20, height: 30, resizeMode: 'contain' } } />
                            <Text style={ { color: '#4b3854ff' } }>{ '\t' }Game</Text>
                        </CardItem>
                    </Card>
                </Col>
            );
        } else {
            return;
        }
    }

    topUpDoge () {
        if ( this.state.usernameDoge ) {
            return (
                <Col style={ { alignItems: 'center', justifyContent: 'center' } }>
                    <Button transparent onPress={ () => this.props.navigation.navigate( 'topUpDoge' ) }>
                        <Body style={ { alignItems: 'center', justifyContent: 'center' } }>
                            <Icon type='AntDesign' name='medicinebox'
                                style={ { fontSize: 30, width: 30, height: 30, color: '#4b3854ff' } } />
                            <Text style={ { color: '#4b3854ff', fontSize: 10, alignSelf: 'center' } }>Top Up Doge</Text>
                        </Body>
                    </Button>
                </Col>
            );
        } else {
            return;
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
                <Container>
                    <Content>
                        <List style={ { height: 150 } }>
                            <ImageBackground source={ require( '../../assets/images/icon/ungu.png' ) }
                                style={ { width: '100%', height: 105 } }
                                imageStyle={ { resizeMode: 'cover', width: '100%', height: '100%' } }>
                                <ListItem noBorder avatar>
                                    <Body style={ { height: 70 } }>
                                        <Item floatingLabel style={ { borderColor: 'transparent', width: '90%' } } >
                                            <Label note style={ { color: '#fff' } }> Balance</Label>
                                            <Input style={ { fontSize: 20, color: '#fff' } } editable={ false }
                                                value={ 'Rp ' + this.state.balance + ',00' } />
                                            <Icon type='MaterialCommunityIcons' name='reload'
                                                onPress={ this.componentDidMount.bind( this ) } style={ { color: '#fff' } } />
                                        </Item>
                                    </Body>
                                </ListItem>
                            </ImageBackground>
                            <Card style={ { borderRadius: 40, width: '100%', height: 60, top: '-15%' } }>
                                <CardItem style={ { borderRadius: 40, height: 60 } } >
                                    <Row style={ { width: '100%', height: 60 } }>
                                        <Col style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button transparent onPress={ () => this.props.navigation.navigate( 'topUpPPOB' ) }>
                                                <Body style={ { alignItems: 'center', justifyContent: 'center' } }>
                                                    <Icon type='AntDesign' name='pluscircleo'
                                                        style={ { fontSize: 30, width: 30, height: 30, color: '#4b3854ff' } } />
                                                    <Text style={ { color: '#4b3854ff', fontSize: 10 } }>Top Up PPOB</Text>
                                                </Body>
                                            </Button>
                                        </Col>
                                        { this.topUpDoge() }
                                        <Col style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button transparent onPress={ () => this.props.navigation.navigate( 'Logger' ) }>
                                                <Body style={ { alignItems: 'center', justifyContent: 'center' } }>
                                                    <Icon type='AntDesign' name='clockcircleo'
                                                        style={ { fontSize: 30, width: 30, height: 30, color: '#4b3854ff' } } />
                                                    <Text style={ { color: '#4b3854ff', fontSize: 10, alignSelf: 'center' } }>History</Text>
                                                </Body>
                                            </Button>
                                        </Col>
                                        <Col style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button transparent onPress={ () => this.props.navigation.navigate( 'WebViewTab' ) }>
                                                <Body style={ { alignItems: 'center', justifyContent: 'center' } }>
                                                    <Icon type='MaterialCommunityIcons' name='web'
                                                        style={ { fontSize: 30, width: 30, height: 30, color: '#4b3854ff' } } />
                                                    <Text style={ { color: '#4b3854ff', fontSize: 10 } }>Web</Text>
                                                </Body>
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardItem>
                            </Card>
                        </List>
                        <Card transparent>
                            <CardItem cardBody>
                                <Image style={ { resizeMode: 'contain', width: '100%', height: 120 } }
                                    source={ this.state.banner } />
                            </CardItem>
                        </Card>
                        <Card >
                            <CardItem header bordered>
                                <Text style={ { color: '#000' } }>Hiburan</Text>
                            </CardItem>
                            <CardItem>
                                <Row>
                                    <Col>
                                        <Card style={ { height: 40 } } onTouchEnd={ () => this.props.navigation.navigate( 'move' ) }>
                                            <CardItem style={ { height: 40 } } >
                                                <Image source={ require( '../../assets/images/icon/film.png' ) }
                                                    style={ { width: 20, height: 30, resizeMode: 'contain' } } />
                                                <Text style={ { color: '#4b3854ff' } }>{ '\t' }Film</Text>
                                            </CardItem>
                                        </Card>
                                    </Col>
                                    { this.gameDoge() }
                                </Row>
                            </CardItem>
                        </Card>
                        <Card >
                            <CardItem header bordered>
                                <Text style={ { color: '#000' } }>Pembayaran dan Top Up</Text>
                            </CardItem>
                            <CardItem>
                                {/* Line 1 */ }
                                <Row>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'pulse' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 0 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/pulsa.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Pulsa Prabayar</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'pulsePasca' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/pascabayar.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Pulsa Pascabayar</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'PLN' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/token_listrik.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Token</Text>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Listrik</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'PLNPasca' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/taglis.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Tagihan</Text>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Listrik</Text>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* /Line 1 */ }
                            </CardItem>
                            <CardItem>
                                {/* Line 2 */ }
                                <Row>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'ovo' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/ovo.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>OVO</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'grab' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/grap.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>GRAB</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'gojek' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/gopay.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>GoPay</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'PDAM' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/pdam.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>PDAM</Text>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* /Line 2 */ }
                            </CardItem>
                            <CardItem>
                                {/* Line 3 */ }
                                <Row>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'multyF' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/finance.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Multi</Text>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Finance</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'eMoneyBNI' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/tapcash.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>TapCash</Text>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>BNI</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'eMoneyMandiri' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/emoney.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>e-Money</Text>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Mandiri</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'wifi' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/internet.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Internet &</Text>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>TV Kabel</Text>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* /Line 3 */ }
                            </CardItem>
                            <CardItem>
                                {/* Line 4 */ }
                                <Row>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'bpjs' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/bpjs.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>BPJS</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'insuren' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/asuransi.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Asuransi</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button onPress={ () => this.props.navigation.navigate( 'payment' ) }
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/payment.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>Payment</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card transparent style={ { alignItems: 'center', justifyContent: 'center' } }>
                                            <Button
                                                style={ { width: 70, height: 70, backgroundColor: '#ffff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' } }
                                                disabled={ this.state.balance.replace( '.', '' ) == 25000 ? true : false }>
                                                <Image source={ require( '../../assets/images/icon/more.png' ) }
                                                    style={ { width: '60%', height: '60%', resizeMode: 'contain' } } />
                                            </Button>
                                            <Text style={ { color: '#4b3854ff', fontSize: 12, top: 8, textAlign: 'center' } }>More</Text>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* /Line 4 */ }
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            );
        }
    }
}
