import React from 'react';
import { View, AsyncStorage, BackHandler, KeyboardAvoidingView , StatusBar } from 'react-native';
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
} from 'native-base';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Header from '../../navigation/HeaderNavigationBar';
import Styles from '../../constants/Styles';
import LoginController from '../../components/controller/Bot/LoginController';
import ManualController from '../../components/controller/Bot/ManualController';
import Config from '../../components/model/Config';

var BUTTONS = [ "Fibonacci", "MartinAngel", "Labouchere" ];
export default class BotScreen extends React.Component {
    constructor ( props ) {
        // menma977202242
        // admin7212
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            isButtonDisabled: false,
            username: '',
            balance: 0,
            defaultPayIn: 0.1,
            payIn: 0.1,
            high: 50,
            switchBot: null,
            arrayChart: [],
            arrayPayIn: [],
            arrayPayOut: [],
            arrayProfit: [],
            arrayColor: [],
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );
        let data = await LoginController.prototype.login( await AsyncStorage.getItem( 'usernameDoge' ), await AsyncStorage.getItem( 'passwordDoge' ) );
        this.setState( {
            username: await AsyncStorage.getItem( 'username' ),
            balance: ( data.Doge.Balance * 0.00000001 ).toFixed( 8 ),
            isButtonDisabled: data.Doge.Balance > 0 ? false : true,
        } );
        this.state.arrayChart.push( data.Doge.Balance * 0.00000001 );
        AsyncStorage.setItem( 'balanceDoge', String( data.Doge.Balance ) );
        AsyncStorage.setItem( 'sessionDoge', data.SessionCookie );
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

    whenBalanceZero () {
        if ( this.state.balance > 10 ) {
            return <Button success block><Text>DOGE { this.state.balance }</Text></Button>;
        } else {
            return <Button danger block><Text style={ { textAlign: 'center' } }>Balance Anda tidak mencukupi untuk bermain game</Text></Button>;
        }
    }

    async inBot () {
        this.setState( { isButtonDisabled: true } );
        let setSession = await AsyncStorage.getItem( 'sessionDoge' );
        let setPayIn = ( this.state.payIn / 0.00000001 ).toFixed( 0 );
        let setHigh = this.state.high * 10000;
        if ( !setPayIn ) {
            Config.prototype.newAlert( 3, 'Lot tidak boleh kosong', 5000, 'top' );
        } else if ( !setHigh ) {
            Config.prototype.newAlert( 3, 'Probability tidak boleh kosong', 5000, 'top' );
        } else {
            let data = await ManualController.prototype.bot( setSession, setHigh, setPayIn );
            if ( data.Status == 200 ) {
                let balance = ( this.state.balance / 0.00000001 ) + data.profit;
                let newBalance = balance * 0.00000001;
                await this.setState( { balance: ( newBalance ).toFixed( 8 ) } );
                await this.state.arrayChart.push( newBalance );
                await this.state.arrayPayIn.unshift( ( data.payIn * 0.00000001 ).toFixed( 8 ) );
                await this.state.arrayPayOut.unshift( ( data.payOut * 0.00000001 ).toFixed( 8 ) );
                await this.state.arrayProfit.unshift( ( data.profit * 0.00000001 ).toFixed( 8 ) );
                if ( data.profit < 0 ) {
                    await this.state.arrayColor.unshift( 'red' );
                } else {
                    await this.state.arrayColor.unshift( 'green' );
                }
                if ( this.state.arrayChart.length >= 30 ) {
                    await this.state.arrayChart.shift();
                    await this.state.arrayPayIn.pop();
                    await this.state.arrayPayOut.pop();
                    await this.state.arrayProfit.pop();
                }
                await AsyncStorage.setItem( 'balanceDoge', String( this.state.balance ) );
            } else if ( data.Status == 505 ) {
                Config.prototype.newAlert( 2, data.error, 5000, 'top' );
            } else {
                Config.prototype.newAlert( 3, data.error, 5000, 'top' );
            }
        }
        this.setState( { isButtonDisabled: false } );
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
            let data = this.state.arrayChart;
            return (
                <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } }>
                    <Container>
                        <Header { ...this.props } name='BOT DOGE' />
                        <Content padder>
                            <Button info block onPress={ () =>
                                ActionSheet.show(
                                    {
                                        options: BUTTONS,
                                        title: "ROBOT yang tersedia"
                                    },
                                    buttonIndex => {
                                        if ( buttonIndex == 0 ) {
                                            this.props.navigation.navigate( 'fibonacci' );
                                        } else if ( buttonIndex == 1 ) {
                                            this.props.navigation.navigate( 'martinAngel' );
                                        } else {
                                            this.props.navigation.navigate( 'labouchere' );
                                        }
                                    }
                                ) }>
                                <Icon type='AntDesign' name='android1' />
                                <Text>BOT</Text>
                            </Button>
                            <Card>
                                <CardItem header style={ { backgroundColor: '#4b3854ff' } }>
                                    <Body>
                                        <Title>Manual</Title>
                                    </Body>
                                    <Right>
                                        <Title>{ this.state.username }</Title>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Row>
                                            <YAxis
                                                data={ data }
                                                contentInset={ { top: 30, bottom: 30 } }
                                                svg={ { fill: '#F9B3C3', fontSize: 10, } }
                                                numberOfTicks={ 10 }
                                                formatLabel={ value => `${ value }` }
                                            />
                                            <Col>
                                                <LineChart style={ { minHeight: 200, flex: 1 } } data={ data } svg={ { stroke: '#4b3854ff' } }
                                                    contentInset={ { top: 30, bottom: 30 } } curve={ shape.curveLinear }>
                                                    <Grid svg={ { stroke: '#F9B3C3' } } />
                                                </LineChart>
                                            </Col>
                                        </Row>
                                        { this.whenBalanceZero() }
                                        <Text>{ '\n' }</Text>
                                        <Row>
                                            <Col>
                                                <Item floatingLabel>
                                                    <Label>Lot</Label>
                                                    <Input value={ String( this.state.payIn ) }
                                                        onChangeText={ ( value ) => { this.setState( { defaultPayIn: value, payIn: value } ) } }
                                                        keyboardType='numeric' />
                                                </Item>
                                            </Col>
                                            <Col>
                                                <Item floatingLabel>
                                                    <Label>Probability(%)</Label>
                                                    <Input value={ String( this.state.high ) }
                                                        onChangeText={ ( high ) => { this.setState( { high } ) } }
                                                        keyboardType='numeric' />
                                                </Item>
                                            </Col>
                                        </Row>
                                        <Text>{ '\n' }</Text>
                                        <Row>
                                            <Col>
                                                <Button danger block onPress={ () => {
                                                    this.setState( {
                                                        payIn: this.state.payIn * 2
                                                    } )
                                                } }>
                                                    <Text>Double</Text>
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button warning block onPress={ () => {
                                                    this.setState( {
                                                        payIn: this.state.payIn / 2
                                                    } )
                                                } }>
                                                    <Text>Half</Text>
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button primary block onPress={ () => {
                                                    this.setState( {
                                                        payIn: this.state.defaultPayIn
                                                    } )
                                                } }>
                                                    <Text>Reset</Text>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Text>{ '\n' }</Text>
                                        <Button success block onPress={ this.inBot.bind( this ) } disabled={ this.state.isButtonDisabled }>
                                            <Text>Trade</Text>
                                        </Button>
                                        <Text>{ '\n' }</Text>
                                        <Row>
                                            <Col style={ { justifyContent: 'center', alignItems: 'center' } }>
                                                <Label>PayIn</Label>
                                                { this.state.arrayPayIn.map( ( value, key ) => {
                                                    return ( <Text key={ key } style={ { color: this.state.arrayColor[ key ] } } >{ value }</Text> );
                                                } ) }
                                            </Col>
                                            <Col style={ { justifyContent: 'center', alignItems: 'center' } }>
                                                <Label>PayOut</Label>
                                                { this.state.arrayPayOut.map( ( value, key ) => {
                                                    return ( <Text key={ key } style={ { color: this.state.arrayColor[ key ] } } >{ value }</Text> );
                                                } ) }
                                            </Col>
                                            <Col style={ { justifyContent: 'center', alignItems: 'center' } }>
                                                <Label>Profit</Label>
                                                { this.state.arrayProfit.map( ( value, key ) => {
                                                    return ( <Text key={ key } style={ { color: this.state.arrayColor[ key ] } } >{ value }</Text> );
                                                } ) }
                                            </Col>
                                        </Row>
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
