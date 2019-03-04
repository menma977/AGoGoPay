import React from 'react';
import { View, Image } from 'react-native';
import {
  Container,
  Content,
  Spinner,
  Text,
  Label,
  Card,
  CardItem,
  Body,
  Row,
  Col,
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';

export default class HomeScreen extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      isLoading: true,
    }
  }

  async componentDidMount () {
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
          <Header { ...this.props } name='HOME' />
          <Content>
            <Card>
              <CardItem style={ { backgroundColor: '#d5df6c' } } header>
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
                            <Image source={ require( '../assets/images/icon/pulsa.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />

                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/wifi.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/listrik.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/pln.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                  </Row>
                  {/* /Line 1 */ }
                  {/* Line 2 */ }
                  <Row>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/play_game.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/gojek.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/grab.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/etoll.png' ) }
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
                            <Image source={ require( '../assets/images/icon/telkom.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/finan.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/bpjs.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/pdam.png' ) }
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
                            <Image source={ require( '../assets/images/icon/gas.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/pascabayar.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/tv.png' ) }
                              style={ { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' } } />
                          </Body>
                        </CardItem>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <CardItem>
                          <Body>
                            <Image source={ require( '../assets/images/icon/katalog.png' ) }
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
