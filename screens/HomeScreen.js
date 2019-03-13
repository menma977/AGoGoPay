import React from 'react';
import { View, AsyncStorage } from 'react-native';
import {
    Spinner,
    Tab,
    Tabs,
    Container,
    Content,
    Text,
    Card,
    CardItem,
    Body,
    Icon,
    Row,
    Col,
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import HomeTab from './tab/HomeTab';

export default class HomeScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
        }
    }

    async componentDidMount () {
        this.setState( { isLoading: true } );

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
                    <Header { ...this.props } name='AGOGOGPAY' />
                    {/* load tab above header */ }
                    <Tabs>
                        <Tab heading='Home' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>
                            {/* load HomeTab */ }
                            <HomeTab { ...this.props } />
                            {/* /load HomeTab */ }
                        </Tab>
                        <Tab heading='Help' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>
                            <Tabs>
                                <Tab heading='How To Use' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>

                                </Tab>
                                <Tab heading='Criticism And Suggestions' tabStyle={ { backgroundColor: '#fbb5fd' } } activeTabStyle={ { backgroundColor: '#c658ca' } } textStyle={ { color: '#fff' } }>
                                    <Container>
                                        <Content>
                                            <Card>
                                                <CardItem style={ { backgroundColor: '#fbb5fd' } } header>
                                                    <Text style={ { color: '#fff' } }>Criticism And Suggestions</Text>
                                                </CardItem>
                                                <CardItem>
                                                    <Body>
                                                        <Row>
                                                            <Col size={ 4 }>
                                                                <Icon type='Entypo' name='email' size={ 30 } style={ { color: '#fbb5fd' } } />
                                                            </Col>
                                                            <Col size={ 8 }>
                                                                <Text>email@gmail.com</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col size={ 4 }>
                                                                <Icon type='FontAwesome' name='whatsapp' size={ 30 } style={ { color: '#fbb5fd' } } />
                                                            </Col>
                                                            <Col size={ 8 }>
                                                                <Text>082234468222</Text>
                                                            </Col>
                                                        </Row>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </Content>
                                    </Container>
                                </Tab>
                            </Tabs>
                        </Tab>
                    </Tabs>
                    {/* /load tab above header */ }
                </Container>
            );
        }
    }
}
