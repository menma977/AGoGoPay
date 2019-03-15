import React from 'react';
import { View, Image, AsyncStorage } from 'react-native';
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
    Icon
} from 'native-base';
import BalanceController from '../../components/controller/BalanceController';
import Styles from '../../constants/Styles';

export default class HomeTab extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            balance: 0,
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );
        let setUsername = await AsyncStorage.getItem( 'username' );
        let setCode = await AsyncStorage.getItem( 'code' );
        let data = await BalanceController.prototype.GetBalance( setUsername, setCode );
        if ( data.Status == 0 ) {
            AsyncStorage.setItem( 'balance', String( data.Saldo ) );
        } else {
            AsyncStorage.setItem( 'balance', '0' );
        }
        this.setState( { balance: await AsyncStorage.getItem( 'balance' ) } );
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
                    <Content>
                        <Text>{ '\n' }</Text>
                        {/* open Web View */ }
                        <Button iconLeft success block onPress={ () => this.props.navigation.navigate( 'WebViewTab' ) }
                            style={ { width: '85%', alignSelf: 'center' } }>
                            <Icon type='MaterialIcons' name='account-circle' />
                            <Text>My Account</Text>
                        </Button>
                        {/* /open Web View */ }
                        <Text>{ '\n' }</Text>
                        <Button info block style={ { width: '85%', alignSelf: 'center', textAlign: 'center' } }
                            onPress={ this.componentDidMount.bind( this ) }>
                            <Icon type='MaterialIcons' name='account-balance-wallet' />
                            <Text style={ { fontSize: 20 } }>Rp { this.state.balance },00</Text>
                        </Button>
                        <Text>{ '\n' }</Text>
                        <Row>
                            <Col>
                                <Body>
                                    <Button iconLeft info>
                                        <Icon type='MaterialCommunityIcons' name='finance' />
                                        <Text>Deposit</Text>
                                    </Button>
                                </Body>
                            </Col>
                            <Col>
                                <Body>
                                    <Button iconLeft primary>
                                        <Icon type='FontAwesome' name='gamepad' />
                                        <Text>Game</Text>
                                    </Button>
                                </Body>
                            </Col>
                        </Row>
                        <Text>{ '\n' }</Text>
                        <Card>
                            <CardItem style={ { backgroundColor: '#fbb5fd' } } header>
                                <Text style={ { color: '#fff' } }>PPOB</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    {/* Line 1 */ }
                                    <Row>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Button transparent onPress={ () => this.props.navigation.navigate( 'pulse' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }
                                                            disabled={ this.state.balance == 0 ? true : false }>
                                                            <Image source={ require( '../../assets/images/icon/pulsa.png' ) }
                                                                style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                        </Button>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Button transparent onPress={ () => this.props.navigation.navigate( 'PLN' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }
                                                            disabled={ this.state.balance == 0 ? true : false }>
                                                            <Image source={ require( '../../assets/images/icon/pln.png' ) }
                                                                style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                        </Button>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/wifi.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/listrik.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {/* /Line 1 */ }
                                    {/* Line 2 */ }
                                    <Row>
                                        {/* <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/play_game.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col> */}
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/gojek.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/grab.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/etoll.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {/* /Line 2 */ }
                                    {/* Line 3 */ }
                                    <Row>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/telkom.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/finan.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/bpjs.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/pdam.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {/* /Line 3 */ }
                                    {/* Line 4 */ }
                                    <Row>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/gas.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/pascabayar.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/tv.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <Image source={ require( '../../assets/images/icon/katalog.png' ) }
                                                            style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {/* /Line 4 */ }
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            );
        }
    }
}
