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
import { ProgressBarAndroid , StatusBar } from 'react-native';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Doge from '../../components/model/Doge';
import Config from '../../components/model/Config';
import Labouchere from '../../components/model/Labouchere';
import HeaderBotScreen from '../../navigation/HeaderNavigationBar';

export default class LabouchereBot extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            isBotLose: false,
            isBotStart: true,
            whenPayInIsWin: false,
            titleReverse: '',
            progressBot: 0,
            session: '',
            seed: Math.floor( Math.random() * ( +99999 - +0 ) ) + +0,
            balance: 0,
            startBalance: 0,
            stopLoseBalance: 0,
            targetBalance: 0,
            lot: 0.1,
            probability: 50,
            reverse: false,
            stopLose: 1000,
            target: 1,
            charts: [],
            payIn: [],
            payOut: [],
            profit: [],
            labor: [],
            rangJumFB: 0,
            rangJumFBCache: 0,
            rowFB: [ 1, 1, 2, 3, 5,
                8, 13, 21, 34, 55,
                89, 144, 233, 377, 610, 987,
                1597, 2584, 4181, 6765, 10946,
            ]
        }
    }

    async componentDidMount () {
        let getSession = await Doge.prototype.getSession();
        let getBalance = await Doge.prototype.getBalance();
        let getLot = await Labouchere.prototype.getLot();
        let getProbability = await Labouchere.prototype.getProbability();
        let getReverse = await Labouchere.prototype.getReverse();
        let getStopLose = await Labouchere.prototype.getStopLose();
        let getTarget = await Labouchere.prototype.getTarget();
        this.setState( {
            session: getSession,
            balance: getBalance,
            startBalance: getBalance,
            stopLoseBalance: ( getBalance * 0.00000001 ) - getStopLose,
            targetBalance: parseFloat( getBalance ) + ( ( getBalance * getTarget ) / 100 ),
            lot: getLot,
            probability: getProbability,
            reverse: getReverse,
            stopLose: getStopLose,
            target: getTarget
        } );
        this.state.charts.push( getBalance * 0.00000001 );
        setTimeout( async () => {
            this.setState( {
                isLoading: false
            } );
            await this.cekReverse();
        }, 1000 );
    }

    async cekReverse () {
        if ( this.state.reverse ) {
            this.setState( { titleReverse: 'Reverse' } )
            await this.onBotWhiteReverse();
        } else {
            this.setState( { titleReverse: '' } )
            await this.onBot();
        }
    }

    async onBotWhiteReverse () {
        if ( ( this.state.balance * 0.00000001 ) < ( this.state.stopLoseBalance * 0.00000001 ) - this.state.stopLose ) {
            this.setState( {
                targetBalance: null
            } )
        } else {
            var session, seed, basePlayIn, high, low, bodyUrl;
            session = this.state.session;
            seed = this.state.seed;
            basePlayIn = this.state.lot;
            low = 0;
            high = this.state.probability * 10000;
            if ( this.state.isBotLose ) {
                localLow = 250000;
                localHigh = 999999;
                this.setState( {
                    isBotLose: false
                } );
            } else {
                localLow = 0;
                localHigh = this.state.probability * 10000;
            }
            if ( ( this.state.balance * 0.00000001 ) >= ( this.state.stopLoseBalance * 0.00000001 ) ) {
                basePlayIn = this.state.lot;
                this.setState( {
                    labor: [ parseFloat( basePlayIn ).toFixed( 1 ) ],
                    stopLoseBalance: this.state.balance,
                } );
            } else {
                if ( !this.state.whenPayInIsWin ) {
                    this.state.labor.shift();
                    this.state.labor.pop();
                    if ( this.state.labor.length == 0 ) {
                        basePlayIn = this.state.lot;
                        this.state.labor.push( parseFloat( basePlayIn ).toFixed( 1 ) );
                        this.state.labor.push( parseFloat( basePlayIn * 10 ).toFixed( 1 ) );
                        this.state.labor.push( parseFloat( basePlayIn ).toFixed( 1 ) );
                    } else {
                        basePlayIn = ( parseFloat( this.state.labor[ 0 ] ) + parseFloat( this.state.labor[ this.state.labor.length - 1 ] ) );
                        this.state.labor.push( parseFloat( basePlayIn ).toFixed( 1 ) );
                    }
                } else {
                    basePlayIn = ( parseFloat( this.state.labor[ 0 ] ) + parseFloat( this.state.labor[ this.state.labor.length - 1 ] ) );
                    this.state.labor.push( parseFloat( basePlayIn ).toFixed( 1 ) );
                }
            }
            basePlayIn = parseFloat( basePlayIn * 100000000 ).toFixed( 0 );
            bodyUrl = (
                "a=PlaceBet" +
                "&s=" + session +
                "&Low=" + low +
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
                            whenPayInIsWin: false,
                        } );
                    } else {
                        this.setState( {
                            isBotLose: false,
                            whenPayInIsWin: true,
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
                            await this.onBotWhiteReverse();
                        }
                    }
                } else {
                    Config.prototype.newAlert( 3, responseJson.error, 50000, 'bottom' );
                    if ( this.state.isBotStart ) {
                        await this.onBotWhiteReverse();
                    }
                }
            } ).catch( async ( error ) => {
                Config.prototype.newAlert( 3, error, 50000, 'bottom' );
                if ( this.state.isBotStart ) {
                    await this.onBotWhiteReverse();
                }
            } );
        }
    }

    async onBot () {
        if ( ( this.state.balance * 0.00000001 ) < ( this.state.stopLoseBalance * 0.00000001 ) - this.state.stopLose ) {
            this.setState( {
                targetBalance: null
            } )
        } else {
            var session, seed, basePlayIn, high, bodyUrl;
            session = this.state.session;
            seed = this.state.seed;
            basePlayIn = this.state.lot;
            high = this.state.probability * 10000;
            if ( !this.state.isBotLose ) {
                this.state.labor.shift();
                this.state.labor.pop();
                if ( this.state.labor.length == 0 ) {
                    basePlayIn = this.state.lot;
                    this.state.labor.push( parseFloat( basePlayIn ).toFixed( 1 ) );
                    this.state.labor.push( parseFloat( basePlayIn * 10 ).toFixed( 1 ) );
                    this.state.labor.push( parseFloat( basePlayIn ).toFixed( 1 ) );
                    basePlayIn = ( parseFloat( this.state.labor[ 0 ] ) + parseFloat( this.state.labor[ this.state.labor.length - 1 ] ) );
                } else {
                    basePlayIn = ( parseFloat( this.state.labor[ 0 ] ) + parseFloat( this.state.labor[ this.state.labor.length - 1 ] ) );
                    this.state.labor.push( basePlayIn );
                }
            } else {
                basePlayIn = ( parseFloat( this.state.labor[ 0 ] ) + parseFloat( this.state.labor[ this.state.labor.length - 1 ] ) );
                this.state.labor.push( basePlayIn );
            }
            basePlayIn = parseFloat( basePlayIn * 100000000 ).toFixed( 0 );
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

        await Labouchere.prototype.setLot( String( 0.1 ) );
        await Labouchere.prototype.setProbability( String( 50 ) );
        await Labouchere.prototype.setReverse( false );
        await Labouchere.prototype.setStopLose( String( 1000 ) );
        await Labouchere.prototype.setTarget( String( 1 ) );
        setTimeout( () => {
            this.props.navigation.navigate( 'labouchere' );
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
                    <HeaderBotScreen name={ 'Bot Labouchere ' + this.state.titleReverse } />
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
                                    <Row style={ { justifyContent: 'center', alignItems: 'center', alignSelf: 'center' } }>
                                        { this.state.labor.map( ( item, key ) => {
                                            return (
                                                <Text key={ key } style={ { alignSelf: 'center', fontSize: 10 } }>{ ' [' + parseFloat( item ).toFixed( 1 ) + '] ' }</Text>
                                            )
                                        } ) }
                                    </Row>
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