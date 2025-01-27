import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Image, AsyncStorage , StatusBar } from 'react-native';
import {
    Container,
    Content,
    Button,
    Text,
    Spinner,
    Item,
    Form,
    Input,
    Row,
    Col,
    Icon
} from 'native-base';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import LoginController from '../components/controller/LoginController';
import { SMS } from 'expo';
const Configuration = new Config();
const Login = new LoginController();

export default class LoginScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            username: '',
            password: '',
            code: '',
            switchValidate: false,
        }
    }

    async componentDidMount () {
        let code = await AsyncStorage.getItem( 'code' );
        if ( code ) {
            let username = await AsyncStorage.getItem( 'username' );
            let password = await AsyncStorage.getItem( 'password' );
            if ( username && password && code ) {
                setTimeout( () => {
                    this.props.navigation.navigate( 'Home' );
                }, 2000 );
            } else {
                await this.setState( { isLoading: false } );
            }
        } else {
            await this.setState( { isLoading: false } );
        }
    }

    async setSwitchValidate () {
        this.setState( { isLoading: true } );
        let data = await Login.DataLogin( this.state.username, this.state.password );
        if ( data.Status == 1 ) {
            this.setState( { isLoading: false } );
            Configuration.newAlert( 3, data.Pesan, 5000, "bottom" );
        } else {
            AsyncStorage.setItem( 'username', this.state.username );
            AsyncStorage.setItem( 'password', this.state.password );
            AsyncStorage.setItem( 'usernameDoge', data.user99 ? data.user99 : null );
            AsyncStorage.setItem( 'passwordDoge', data.pas99 ? data.pas99 : null );
            this.setState( { password: '', switchValidate: true, isLoading: false } );
            Configuration.newAlert( 1, data.Pesan, 5000, 'top' );
        }
    }

    async goToHome () {
        this.setState( { isLoading: true } );
        let data = await Login.FinalLogin( this.state.username, this.state.code );
        if ( data.Status == 1 ) {
            this.setState( { isLoading: false } );
            Configuration.newAlert( 3, data.Pesan, 5000, "bottom" );
        } else {
            AsyncStorage.setItem( 'code', data.IdLogin );
            setTimeout( () => {
                this.props.navigation.navigate( 'Home' );
            }, 1000 );
        }
    }

    deleteCode () {
        let code = this.state.code;
        if ( code ) {
            this.setState( { code: code.substring( 0, code.length - 1 ) } );
        }
    }

    render () {
        if ( this.state.isLoading ) {
            return ( <View style={ [ Styles.container, { backgroundColor: '#ffff' } ] }>
                <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                    <Spinner color='#4b3854ff' />
                </View>
            </View> );
        } else if ( this.state.switchValidate ) {
            return (
                <ScrollView>
                    <Container style={ { flex: 1, backgroundColor: '#ffff' } }>
                        <Content contentContainerStyle={ { flex: 1, paddingTop: 100 } }>
                            <Row>
                                <Col size={ 4 }>
                                    <Form style={ [ Styles.alignItemCenter ] }>
                                        <Item rounded style={ { width: '80%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                            <Input style={ { color: '#4b3854ff', textAlign: 'center' } } placeholderTextColor='#4b3854ff' placeholder='CODE' value={ this.state.code } onChangeText={ ( code ) => this.setState( { code } ) } disabled />
                                        </Item>
                                    </Form>
                                </Col>
                                <Col>
                                    <Button iconLeft rounded onPress={ this.deleteCode.bind( this ) } style={ { backgroundColor: '#4b3854ff', height: 55, width: 60, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 15 } }>DEL</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Text>{ '\n' }</Text>
                            <Row style={ { alignItems: 'center', left: 30, right: 30 } }>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '1' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>1</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '2' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>2</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '3' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>3</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Text>{ '\n' }</Text>
                            <Row style={ { alignItems: 'center', left: 30, right: 30 } }>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '4' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>4</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '5' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>5</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '6' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>6</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Text>{ '\n' }</Text>
                            <Row style={ { alignItems: 'center', left: 30, right: 30 } }>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '7' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>7</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '8' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>8</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '9' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>9</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Text>{ '\n' }</Text>
                            <Row style={ { alignItems: 'center', left: 30, right: 30 } }>
                                <Col size={ 0.3 }></Col>
                                <Col size={ 0.3 }>
                                    <Button rounded onPress={ () => this.setState( { code: this.state.code + '0' } ) } style={ { backgroundColor: '#fff', height: 80, width: 80, justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 50, color: '#4b3854ff' } }>0</Text>
                                    </Button>
                                </Col>
                                <Col size={ 0.3 }></Col>
                            </Row>
                            <Text>{ '\n' }</Text>
                            <Row>
                                <Col>
                                    <Button rounded block style={ { backgroundColor: '#4b3854ff', width: '80%', alignSelf: 'center' } } onPress={ () => {
                                        this.setState( { isLoading: true } );
                                        Configuration.newAlert( 3, 'Tunggu hingga 1 menit untuk login ulang', 10000, "bottom" );
                                        setTimeout( () => {
                                            AsyncStorage.clear();
                                            this.setState( { switchValidate: false, code: '' } );
                                            this.setState( { isLoading: false } );
                                        }, 10000 );
                                    } } >
                                        <Icon type='AntDesign' name='back' size={ 25 } color='#fff' />
                                        <Text>Back</Text>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button rounded block style={ { backgroundColor: '#4b3854ff', width: '80%', alignSelf: 'center' } } onPress={ this.goToHome.bind( this ) }>
                                        <Icon type='AntDesign' name='login' size={ 25 } color='#fff' />
                                        <Text>Submit</Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Content>
                    </Container>
                </ScrollView>
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={ { flex: 1 } }>
                    <ScrollView>
                        <Container style={ { backgroundColor: '#fff' } }>
                            <Content contentContainerStyle={ { flex: 1, top: 20 } }>
                                <Image source={ require( '../assets/images/icon.png' ) } style={ {
                                    height: 150,
                                    width: 150,
                                    resizeMode: 'contain',
                                    alignSelf: 'center'
                                } } />
                                <Form style={ [ Styles.alignItemCenter, { top: 100, alignItems: 'center' } ] }>
                                    <Item rounded style={ { width: '80%', alignSelf: 'center', backgroundColor: '#fff' } }>
                                        <Icon active type='EvilIcons' name='user' />
                                        <Input style={ { color: '#4b3854ff' } } placeholderTextColor='#4b3854ff' placeholder='Username' value={ this.state.username } onChangeText={ ( username ) => this.setState( { username } ) } />
                                    </Item>
                                    <Item rounded style={ { width: '80%', alignSelf: 'center', backgroundColor: '#fff', top: 30 } }>
                                        <Icon active type='MaterialCommunityIcons' name='textbox-password' />
                                        <Input style={ { color: '#4b3854ff' } } placeholderTextColor='#4b3854ff' placeholder='Password' value={ this.state.password } onChangeText={ ( password ) => this.setState( { password } ) } secureTextEntry={ true } onSubmitEditing={ this.setSwitchValidate.bind( this ) } />
                                    </Item>
                                </Form>
                                <Button rounded block style={ { top: 200, backgroundColor: '#4b3854ff', width: '80%', alignSelf: 'center' } } onPress={ this.setSwitchValidate.bind( this ) }>
                                    <Icon type='AntDesign' name='login' size={ 25 } color='#fff' />
                                    <Text>Login</Text>
                                </Button>
                            </Content>
                        </Container>
                    </ScrollView>
                </KeyboardAvoidingView>
            );
        }
    }
}
