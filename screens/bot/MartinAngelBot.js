import React from 'react';
import {
    Container,
    Content,
    Text,
    Card,
    CardItem,
    Body,
    Spinner,
    Col,
    Row,
    Button,
    Label
} from 'native-base';
import { ProgressBarAndroid } from 'react-native';
import MartinAngel from '../../components/model/MartinAngel';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Doge from '../../components/model/Doge';
import Config from '../../components/model/Config';
import HeaderBotScreen from '../../navigation/HeaderNavigationBar';

export default class MartinAngelBot extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            isBotLose: false,
            isBotStart: true,
            progressBot: 0,
            session: '',
            seed: Math.floor( Math.random() * ( +99999 - +0 ) ) + +0,
            balance: 0,
            startBalance: 0,
            stopLoseBalance: 0,
            targetBalance: 0,
            lot: 0.1,
            probability: 50,
            multiPlay: 2,
            shadowMultiPlay: 2,
            stopLose: 1000,
            target: 1,
            charts: [],
            payIn: [],
            payOut: [],
            profit: [],
        }
    }

    async componentDidMount () {
        let getSession = await Doge.prototype.getSession();
        let getBalance = await Doge.prototype.getBalance();
        let getLot = await MartinAngel.prototype.getLot();
        let getProbability = await MartinAngel.prototype.getProbability();
        let getMultiPlay = await MartinAngel.prototype.getMultiPlay();
        let getStopLose = await MartinAngel.prototype.getStopLose();
        let getTarget = await MartinAngel.prototype.getTarget();
        this.setState( {
            session: getSession,
            balance: getBalance,
            startBalance: getBalance,
            stopLoseBalance: ( getBalance * 0.00000001 ) - getStopLose,
            targetBalance: parseFloat( getBalance ) + ( ( getBalance * getTarget ) / 100 ),
            lot: getLot,
            probability: getProbability,
            multiPlay: getMultiPlay,
            shadowMultiPlay: getMultiPlay,
            stopLose: getStopLose,
            target: getTarget
        } );
        this.state.charts.push( getBalance * 0.00000001 );
        setTimeout( async () => {
            this.setState( {
                isLoading: false
            } );
            await this.onBot();
        }, 1000 );
    }

    async onBot () {
        if ( ( this.state.balance * 0.00000001 ) < ( this.state.stopLoseBalance * 0.00000001 ) - this.state.stopLose ) {
            this.setState( {
                targetBalance: null
            } )
        } else {
            var session, seed, basePlayIn, localMultiPlay, high, bodyUrl;
            session = this.state.session;
            seed = this.state.seed;
            basePlayIn = this.state.lot;
            high = this.state.probability * 10000;
            localMultiPlay = this.state.multiPlay;
            if ( this.state.isBotLose ) {
                localMultiPlay = localMultiPlay * this.state.shadowMultiPlay;
                this.setState( {
                    whenLoss: false,
                } )
            } else {
                localMultiPlay = 1;
            }
            this.setState( {
                multiPlay: localMultiPlay
            } )
            basePlayIn = parseFloat( this.state.lot * this.state.multiPlay ) * 100000000;
            bodyUrl = (
                "a=PlaceBet" +
                "&s=" + session +
                "&Low=0" +
                "&High=" + high +
                "&PayIn=" + basePlayIn +
                "&ProtocolVersion=2" +
                "&ClientSeed=" + seed +
                "&Currency=doge"
            )
            await fetch( "https://www.999doge.com/api/web.aspx", {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                } ),
                body: bodyUrl
            } ).then( ( response ) => response.json() ).then( async ( responseJson ) => {
                if ( !responseJson.error ) {
                    const localPayIn = -basePlayIn;
                    const localPayOut = responseJson.PayOut;
                    const localProfit = localPayOut + localPayIn;
                    this.setState( {
                        balance: responseJson.StartingBalance + localProfit,
                    } );
                    await Doge.prototype.setBalance( String( this.state.balance + localProfit ) );
                    if ( this.state.profit.length == 30 ) {
                        this.state.payIn.pop();
                        this.state.payOut.pop();
                        this.state.profit.pop();
                        this.state.payIn.unshift( localPayIn * 0.00000001 );
                        this.state.payOut.unshift( localPayOut * 0.00000001 );
                        this.state.profit.unshift( localProfit * 0.00000001 );
                    } else {
                        this.state.payIn.unshift( localPayIn * 0.00000001 );
                        this.state.payOut.unshift( localPayOut * 0.00000001 );
                        this.state.profit.unshift( localProfit * 0.00000001 );
                    }
                    if ( this.state.charts.length == 300 ) {
                        this.state.charts.shift();
                        this.state.charts.push( parseFloat( ( ( this.state.balance + localProfit ) * 0.00000001 ).toFixed( 2 ) ) );
                    } else {
                        this.state.charts.push( parseFloat( ( ( this.state.balance + localProfit ) * 0.00000001 ).toFixed( 2 ) ) );
                    }
                    if ( ( responseJson.PayOut - basePlayIn ) < 0 ) {
                        this.setState( {
                            isBotLose: true,
                        } );
                    } else {
                        this.setState( {
                            isBotLose: false,
                        } );
                    }
                    if ( this.state.balance < this.state.startBalance ) {
                        this.setState( {
                            startBalance: this.state.balance
                        } )
                    } else if ( this.state.balance > this.state.stopLoseBalance ) {
                        this.setState( {
                            stopLoseBalance: this.state.balance
                        } );
                    }
                    this.setState( {
                        progressBot: ( ( this.state.balance - this.state.startBalance ) * 100 ) / ( this.state.targetBalance - this.state.startBalance ),
                    } )
                    if ( this.state.balance >= this.state.targetBalance ) {
                        Config.prototype.newAlert( 1, 'You have reached the target', 0, 'bottom' );
                    } else {
                        if ( this.state.isBotStart ) {
                            await this.onBot();
                        }
                    }
                } else {
                    Config.prototype.newAlert( 3, responseJson.error, 50000, 'bottom' );
                    if ( this.state.isBotStart ) {
                        await this.onBot();
                    }
                }
            } ).catch( async ( error ) => {
                Config.prototype.newAlert( 3, error, 50000, 'bottom' );
                if ( this.state.isBotStart ) {
                    await this.onBot();
                }
            } );
        }
    }

    async stopBot () {
        await this.setState( {
            isLoading: true,
            isBotStart: false
        } );

        await MartinAngel.prototype.setLot( String( 0.1 ) );
        await MartinAngel.prototype.setProbability( String( 50 ) );
        await MartinAngel.prototype.setMultiPlay( String( 2 ) );
        await MartinAngel.prototype.setStopLose( String( 1000 ) );
        await MartinAngel.prototype.setTarget( String( 1 ) );
        setTimeout( () => {
            this.props.navigation.navigate( 'martinAngel' );
        }, 1000 );
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <Container style={ { flex: 1, justifyContent: 'center', backgroundColor: '#F9B3C3' } }>
                    <Spinner color='#fff' />
                </Container>
            );
        } else {
            const data = this.state.charts;
            return (
                <Container style={ { flex: 1, justifyContent: 'center', backgroundColor: '#F9B3C3' } }>
                    <HeaderBotScreen name='Bot MartinAngel' />
                    <Content>
                        <Row>
                            <Col>
                                <Card>
                                    <CardItem header>
                                        <Body style={ { alignItems: 'center' } }>
                                            <Text>Balance</Text>
                                        </Body>
                                    </CardItem>
                                    <CardItem>
                                        <Body style={ { alignItems: 'center' } }>
                                            <Text style={ { fontSize: 10 } }>{ this.state.balance * 0.00000001 }</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <CardItem header>
                                        <Body style={ { alignItems: 'center' } }>
                                            <Text>Stoploss</Text>
                                        </Body>
                                    </CardItem>
                                    <CardItem>
                                        <Body style={ { alignItems: 'center' } }>
                                            <Text style={ { fontSize: 10 } }>{ ( this.state.stopLoseBalance * 0.00000001 ) - this.state.stopLose }</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Col>
                        </Row>
                        <Card>
                            <CardItem header>
                                <Body style={ { alignItems: 'center' } }>
                                    <Text>Target</Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body style={ { alignItems: 'center' } }>
                                    <Text>{ this.state.targetBalance == null ? 'Stoploss' : this.state.targetBalance * 0.00000001 }</Text>
                                </Body>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                    <ProgressBarAndroid styleAttr="Horizontal" indeterminate={ false }
                                        progress={ this.state.progressBot / 100 } style={ { minWidth: 320, flex: 1, } } />
                                    <Row>
                                        <YAxis
                                            data={ data }
                                            contentInset={ { top: 30, bottom: 30 } }
                                            svg={ { fill: '#F9B3C3', fontSize: 10, } }
                                            numberOfTicks={ 10 }
                                            formatLabel={ value => `${ value }` }
                                        />
                                        <Col>
                                            <LineChart style={ { minHeight: 200, flex: 1 } } data={ data } svg={ { stroke: '#f27e95' } }
                                                contentInset={ { top: 30, bottom: 30 } } curve={ shape.curveLinear }>
                                                <Grid svg={ { stroke: '#F9B3C3' } } />
                                            </LineChart>
                                        </Col>
                                    </Row>
                                </Body>
                            </CardItem>
                        </Card>
                        <Button danger block onPress={ this.stopBot.bind( this ) }>
                            <Text>Stop</Text>
                        </Button>
                        <Card>
                            <CardItem>
                                <Body>
                                    <Row>
                                        <Col style={ { justifyContent: 'center', alignItems: 'center' } }>
                                            <Label>PayIn</Label>
                                            { this.state.payIn.map( ( value, key ) => {
                                                return ( <Text key={ key } >{ value }</Text> );
                                            } ) }
                                        </Col>
                                        <Col style={ { justifyContent: 'center', alignItems: 'center' } }>
                                            <Label>PayOut</Label>
                                            { this.state.payOut.map( ( value, key ) => {
                                                return ( <Text key={ key } >{ value }</Text> );
                                            } ) }
                                        </Col>
                                        <Col style={ { justifyContent: 'center', alignItems: 'center' } }>
                                            <Label>Profit</Label>
                                            { this.state.profit.map( ( value, key ) => {
                                                return ( <Text key={ key } >{ value }</Text> );
                                            } ) }
                                        </Col>
                                    </Row>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            );
        }
    }
}