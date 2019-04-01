import React from 'react';
import { KeyboardAvoidingView, AsyncStorage, BackHandler } from 'react-native';
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
    Item,
    Input,
    Button,
    Label,
    Picker,
    ListItem,
    CheckBox
} from 'native-base';
import { Icon } from 'expo';
import Header from '../../navigation/HeaderNavigationBar';
import Labouchere from '../../components/model/Labouchere';
import Config from '../../components/model/Config';

export default class LabouchereScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            isBotLodging: false,
            username: '',
            balance: 0,
            lot: 0.1,
            probability: 75,
            reverse: false,
            stopLose: 1000,
            target: 1,
        }
    }

    componentWillMount () {
        BackHandler.addEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    componentWillUnmount () {
        BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    handleBackButtonClick () {
        this.props.navigation.navigate( 'bot' );
        return true;
    }

    async componentDidMount () {
        let getUsername = await AsyncStorage.getItem( 'username' );
        let getBalance = await AsyncStorage.getItem( 'balanceDoge' );
        this.setState( { balance: getBalance, username: getUsername } )
        setTimeout( () => {
            this.setState( { isLoading: false } );
        }, 1000 );
    }

    goToBot () {
        this.setState( { isLoading: true } );
        if ( this.state.lot < -1 || !this.state.lot ) {
            Config.prototype.newAlert( 2, 'lot should not be less than 0', 50000, 'bottom' );
            this.setState( { isLoading: false } );
        } else if ( this.state.probability <= -1 && this.state.probability >= 100 || !this.state.probability ) {
            Config.prototype.newAlert( 2, 'Probability should not be less than 0 and should not be more than 100', 50000, 'bottom' );
            this.setState( { isLoading: false } );
        } else if ( this.state.stopLose <= -1 || !this.state.stopLose ) {
            Config.prototype.newAlert( 2, 'Stoploss should not be less than 0', 50000, 'bottom' );
            this.setState( { isLoading: false } );
        } else {
            Labouchere.prototype.setLot( this.state.lot );
            Labouchere.prototype.setProbability( this.state.probability );
            Labouchere.prototype.setReverse( this.state.reverse );
            Labouchere.prototype.setStopLose( this.state.stopLose );
            Labouchere.prototype.setTarget( this.state.target );
            setTimeout( () => {
                this.props.navigation.navigate( 'labouchereBot' );
            }, 1000 );
        }
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <Container style={ { flex: 1, justifyContent: 'center', backgroundColor: '#F9B3C3' } }>
                    <Spinner color='#fff' />
                </Container>
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" enabled style={ { flex: 1 } }>
                    <Container style={ { flex: 1, justifyContent: 'center', backgroundColor: '#F9B3C3' } }>
                        <Header { ...this.props } name='Labouchere' />
                        <Content>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardItem>
                                            <Body style={ { alignItems: 'center' } }>
                                                <Label>Username</Label>
                                                <Item>
                                                    <Text style={ { fontSize: 12 } }>{ this.state.username }</Text>
                                                </Item>
                                            </Body>
                                        </CardItem>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <CardItem>
                                            <Body style={ { alignItems: 'center' } }>
                                                <Label>Balance</Label>
                                                <Item>
                                                    <Text style={ { fontSize: 12 } }>{ this.state.balance * 0.00000001 }</Text>
                                                </Item>
                                            </Body>
                                        </CardItem>
                                    </Card>
                                </Col>
                            </Row>
                            <Card>
                                <CardItem>
                                    <Body>
                                        <Row>
                                            <Col>
                                                <Label>Lot</Label>
                                                <Item>
                                                    <Input placeholder='Lot' defaultValue={ String( this.state.lot ) }
                                                        onChangeText={ ( value ) => { this.setState( { lot: value } ) } } keyboardType='numeric' />
                                                </Item>
                                            </Col>
                                            <Col>
                                                <Label>Probability(%)</Label>
                                                <Item>
                                                    <Input placeholder='Probability' defaultValue={ String( this.state.probability ) }
                                                        onChangeText={ ( value ) => { this.setState( { probability: value } ) } } keyboardType='numeric' />
                                                </Item>
                                            </Col>
                                        </Row>
                                        <Text>{ '\n' }</Text>
                                        <Row>
                                            <Col>
                                                <Label>Activation Reverse</Label>
                                                <ListItem>
                                                    <CheckBox checked={ this.state.reverse } onPress={ () => {
                                                        if ( this.state.reverse ) {
                                                            this.setState( { reverse: false } )
                                                        } else {
                                                            this.setState( { reverse: true } )
                                                        }
                                                    } } />
                                                    <Body>
                                                        <Text>Reverse</Text>
                                                    </Body>
                                                </ListItem>
                                            </Col>
                                            <Col>
                                                <Label>Stoploss</Label>
                                                <Item>
                                                    <Input placeholder='Stoploss' defaultValue={ String( this.state.stopLose ) }
                                                        onChangeText={ ( value ) => { this.setState( { stopLose: value } ) } } keyboardType='numeric' />
                                                </Item>
                                            </Col>
                                        </Row>
                                        <Text>{ '\n' }</Text>
                                        <Button danger block>
                                            <Picker mode="dropdown" iosHeader="Target" style={ { color: '#fff' } }
                                                selectedValue={ this.state.target } onValueChange={ ( value ) => { this.setState( { target: value } ) } }
                                                iosIcon={ <Icon.Ionicons name="md-arrow-dropdown-circle" style={ { color: '#fff', fontSize: 25 } } /> }>
                                                <Picker.Item label="Target 1%" value="1" />
                                                <Picker.Item label="Target 2%" value="2" />
                                                <Picker.Item label="Target 3%" value="3" />
                                            </Picker>
                                        </Button>
                                        <Text>{ '\n' }</Text>
                                        <Button success block onPress={ this.goToBot.bind( this ) }>
                                            <Text>Start</Text>
                                        </Button>
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