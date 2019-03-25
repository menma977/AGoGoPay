import React from 'react';
import { View, Image, AsyncStorage, ImageBackground } from 'react-native';
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
    Right
} from 'native-base';
import BalanceController from '../../components/controller/BalanceController';
import Styles from '../../constants/Styles';

export default class HomeTab extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            balance: 0,
            username: '',
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );
        let setUsername = await AsyncStorage.getItem( 'username' );
        let setCode = await AsyncStorage.getItem( 'code' );
        let data = await BalanceController.prototype.GetBalance( setUsername, setCode );
        if ( data.Status == 0 ) {
            AsyncStorage.setItem( 'balance', String( data.Saldo ) );
        } else if ( data == 2 ) {
            AsyncStorage.clear();
            Expo.Updates.reload();
            this.props.navigation.navigate( 'Login' );
        } else {
            AsyncStorage.setItem( 'balance', '0' );
        }
        this.setState( { balance: await AsyncStorage.getItem( 'balance' ), username: setUsername } );
        this.setState( { isLoading: false } );
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
            return (
                <Container>
                    <Content style={ { backgroundColor: '#F9B3C3' } }>
                        <List style={ { backgroundColor: '#f27e95' } }>
                            <ListItem avatar>
                                <Left>
                                    <Icon type='MaterialIcons' name='account-balance-wallet'
                                        style={ { color: '#fff', fontSize: 45, height: 50, width: 50, alignSelf: 'center' } } />
                                </Left>
                                <Body style={ { height: 70 } }>
                                    <Text note style={ { color: '#fff', fontSize: 10 } }> SALDO</Text>
                                    <Text style={ { fontSize: 20, color: '#fff' } }>Rp { this.state.balance },00</Text>
                                </Body>
                                <Right>
                                    <Button transparent onPress={ this.componentDidMount.bind( this ) }
                                        style={ { alignSelf: 'center' } }>
                                        <Icon type='MaterialCommunityIcons' name='reload'
                                            style={ { color: '#fff', fontSize: 45, height: 50, width: 50, alignSelf: 'center' } } />
                                    </Button>
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Row>
                                    {/* Open Web View */ }
                                    <Col>
                                        <Card>
                                            <CardItem>
                                                <Body style={ { alignContent: 'center' } }>
                                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'WebViewTab' ) }
                                                        style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }>
                                                        <Icon type='MaterialCommunityIcons' name='web'
                                                            style={ { fontSize: 45, width: 50, height: 50, alignSelf: 'center', color: '#f27e95' } } />
                                                    </Button>
                                                    <Text style={ { color: '#f27e95', fontSize: 10, alignSelf: 'center' } }>WEB</Text>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </Col>
                                    {/* /Open Web View */ }
                                    {/* Open Deposit */ }
                                    <Col>
                                        <Card style={ { borderColor: '#f27e95' } }>
                                            <CardItem>
                                                <Body style={ { alignContent: 'center' } }>
                                                    <Button transparent
                                                        style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }>
                                                        <Icon type='MaterialCommunityIcons' name='finance'
                                                            style={ { fontSize: 45, width: 50, height: 50, alignSelf: 'center', color: '#f27e95' } } />
                                                    </Button>
                                                    <Text style={ { color: '#f27e95', fontSize: 10, alignSelf: 'center' } }>Deposit</Text>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </Col>
                                    {/* /Open Deposit */ }
                                    {/* Open Game */ }
                                    <Col>
                                        <Card style={ { borderColor: '#f27e95' } }>
                                            <CardItem>
                                                <Body style={ { alignContent: 'center' } }>
                                                    <Button transparent
                                                        style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }>
                                                        <Icon type='FontAwesome' name='gamepad'
                                                            style={ { fontSize: 45, width: 50, height: 50, alignSelf: 'center', color: '#f27e95' } } />
                                                    </Button>
                                                    <Text style={ { color: '#f27e95', fontSize: 10, alignSelf: 'center' } }> Game</Text>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </Col>
                                    {/* /Open Game */ }
                                </Row>
                            </ListItem>
                        </List>
                        <Row>
                            {/* Open financial*/ }
                            <Col>
                                <Card style={ { borderColor: '#f27e95' } }>
                                    <CardItem style={ { backgroundColor: '#F9B3C3' } }>
                                        <Body style={ { alignContent: 'center' } }>
                                            <Button transparent onPress={ () => this.props.navigation.navigate( 'Financial' ) }
                                                style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }
                                                disabled={ this.state.balance == 0 ? true : false }>
                                                <Icon type='AntDesign' name='areachart'
                                                    style={ { fontSize: 45, width: 50, height: 50, alignSelf: 'center', color: '#fff' } } />
                                            </Button>
                                            <Text style={ { color: '#fff', fontSize: 10, alignSelf: 'center' } }>Financial</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Col>
                            {/* /Open financial */ }
                            {/* Open Logger */ }
                            <Col>
                                <Card style={ { borderColor: '#f27e95' } }>
                                    <CardItem style={ { backgroundColor: '#F9B3C3' } }>
                                        <Body style={ { alignContent: 'center' } }>
                                            <Button transparent onPress={ () => this.props.navigation.navigate( 'Logger' ) }
                                                style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } }
                                                disabled={ this.state.balance == 0 ? true : false }>
                                                <Icon type='FontAwesome' name='bank'
                                                    style={ { fontSize: 45, width: 50, height: 50, alignSelf: 'center', color: '#fff' } } />
                                            </Button>
                                            <Text style={ { color: '#fff', fontSize: 10, alignSelf: 'center' } }>Logger</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Col>
                            {/* /Open Logger */ }
                        </Row>
                        {/* Line 1 */ }
                        <Row>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'pulse' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/pulsa.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'PLN' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/token_listrik.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'wifi' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/wifi_modem.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'PLNPasca' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/pln_pasca.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        {/* /Line 1 */ }
                        {/* Line 2 */ }
                        <Row>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'ovo' ) }
                                        style={ { width: '100%', height: '100%' } }
                                        disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/ovo.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'gojek' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/gojek.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'grab' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/grab.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'eMoneyMandiri' ) }
                                        style={ { width: '100%', height: '100%' } }
                                        disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/emoney_mandiri.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        {/* /Line 2 */ }
                        {/* Line 3 */ }
                        <Row>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'eMoneyBNI' ) }
                                        style={ { width: '100%', height: '100%' } }
                                        disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/emoney_bni.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'tv' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/tv_kabel.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'bpjs' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/bpjs.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={ { borderColor: '#f27e95', height: 80 } }>
                                    <Button transparent onPress={ () => this.props.navigation.navigate( 'payment' ) }
                                        style={ { width: '100%', height: '100%' } } disabled={ this.state.balance == 0 ? true : false }>
                                        <Image source={ require( '../../assets/images/icon/payment.jpg' ) }
                                            style={ { flex: 1, width: '100%', height: '120%', resizeMode: 'stretch' } } />
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                        {/* /Line 3 */ }
                    </Content >
                </Container >
            );
        }
    }
}
