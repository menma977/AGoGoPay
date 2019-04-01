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
import Fibonacci from '../../components/model/Fibonacci';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Doge from '../../components/model/Doge';
import Config from '../../components/model/Config';
import HeaderBotScreen from '../../navigation/HeaderNavigationBar';

export default class FibonacciBot extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            isBotLose: false,
            isBotStart: true,
            titleReset: '',
            progressBot: 0,
            session: '',
            seed: Math.floor( Math.random() * ( +99999 - +0 ) ) + +0,
            balance: 0,
            startBalance: 0,
            stopLoseBalance: 0,
            targetBalance: 0,
            lot: 0.1,
            probability: 50,
            reset: false,
            stopLose: 1000,
            target: 1,
            charts: [],
            payIn: [],
            payOut: [],
            profit: [],
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
        let getLot = await Fibonacci.prototype.getLot();
        let getProbability = await Fibonacci.prototype.getProbability();
        let getReset = await Fibonacci.prototype.getReset();
        let getStopLose = await Fibonacci.prototype.getStopLose();
        let getTarget = await Fibonacci.prototype.getTarget();
        await this.state.charts.push( getBalance * 0.00000001 );
        await this.setState( {
            session: getSession,
            balance: getBalance,
            targetBalance: parseFloat( getBalance ) + ( ( parseFloat( getBalance ) * parseFloat( getTarget ) ) / 100 ),
            stopLoseBalance: parseFloat( getBalance ) - ( parseFloat( getStopLose ) / 0.00000001 ),
            startBalance: getBalance,
            lot: getLot,
            probability: getProbability,
            reset: getReset,
            stopLose: getStopLose,
            target: getTarget
        } );
        await this.setState( { isLoading: false } );
        await this.cekReset();
    }

    async cekReset () {
        if ( this.state.reset ) {
            this.setState( { titleReset: 'Reset' } )
            await this.onBotWhiteReset();
        } else {
            this.setState( { titleReset: '' } )
            await this.onBot();
        }
    }

    async onBotWhiteReset () {
        if ( ( this.state.balance * 0.00000001 ) < ( this.state.stopLoseBalance * 0.00000001 ) - this.state.stopLose ) {
            this.setState( {
                targetBalance: null
            } )
        } else {
            var session, seed, basePlayIn, high, low, bodyUrl, jumpFB;
            session = this.state.session;
            seed = this.state.seed;
            basePlayIn = this.state.lot;
            low = 0;
            high = this.state.probability * 10000;
            jumpFB = parseInt( this.state.rangJumFB );
            if ( this.state.balance > this.state.stopLoseBalance ) {
                jumpFB = 0;
                this.setState( {
                    stopLoseBalance: this.state.balance
                } )
            } else {
                if ( this.state.isBotLose ) {
                    jumpFB = ( jumpFB >= ( this.state.rowFB.length - 1 ) ? ( this.state.rowFB.length - 1 ) : parseInt( jumpFB ) + 1 );
                    this.setState( {
                        isBotLose: false,
                    } )
                    this.setState( {
                        rangJumFBCache: jumpFB
                    } )
                } else {
                    jumpFB = 0;
                }
            }
            this.setState( {
                rangJumFB: jumpFB
            } )
            basePlayIn = parseFloat( ( this.state.lot * this.state.rowFB[ jumpFB ] ) * 100000000 ).toFixed( 0 );
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
                            await this.onBotWhiteReset();
                        }
                    }
                } else {
                    Config.prototype.newAlert( 3, responseJson.error, 50000, 'bottom' );
                    if ( this.state.isBotStart ) {
                        await this.onBotWhiteReset();
                    }
                }
            } ).catch( async ( error ) => {
                Config.prototype.newAlert( 3, error, 50000, 'bottom' );
                if ( this.state.isBotStart ) {
                    await this.onBotWhiteReset();
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
            jumpFB = parseInt( this.state.rangJumFB );
            if ( this.state.balance > this.state.stopLoseBalance ) {
                jumpFB = 0;
                this.setState( {
                    stopLoseBalance: this.state.balance
                } );
            }
            if ( this.state.isBotLose ) {
                jumpFB = ( jumpFB >= ( this.state.rowFB.length - 1 ) ? ( this.state.rowFB.length - 1 ) : parseInt( jumpFB ) + 3 );
                this.setState( {
                    isBotLose: false,
                } )
                this.setState( {
                    rangJumFBCache: jumpFB
                } )
            } else {
                jumpFB = jumpFB == 0 ? 0 : parseInt( jumpFB ) - 1;
            }
            this.setState( {
                rangJumFB: jumpFB
            } )
            basePlayIn = parseFloat( ( this.state.lot * this.state.rowFB[ jumpFB ] ) * 100000000 ).toFixed( 0 );
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
                    } else
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

        await Fibonacci.prototype.setLot( String( 0.1 ) );
        await Fibonacci.prototype.setProbability( String( 50 ) );
        await Fibonacci.prototype.setReset( String( 2 ) );
        await Fibonacci.prototype.setStopLose( String( 1000 ) );
        await Fibonacci.prototype.setTarget( String( 1 ) );
        this.state = null;
        setTimeout( () => {
            this.props.navigation.navigate( 'fibonacci' );
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
                    <HeaderBotScreen name={ 'Bot Fibonacci ' + this.state.titleReset } />
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