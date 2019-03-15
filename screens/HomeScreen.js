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
    Accordion,
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
            const howToUse = [
                {
                    title: "Cara membuka web",
                    content: "1.tekan tombol dengan nama username anda yang berwana hijou di menu Home \n\n"
                }, {
                    title: "Cara cek saldo",
                    content: "1.Tekan tombol yang berwanra biru muda dengan gambar dompet \n\n"
                }, {
                    title: "Pulsa dan Data Internet",
                    content: "1.Pilih Type Reguler atau DATA \n\n" +
                        "2.Masukan Nomer ponsel, Pastikan nomer telfon benar dan muncul logo provider telfon \n\n" +
                        "3.Pilih Paket yang tertera \n\n" +
                        "4.Setelah sema sudah benar tekan tombol LANJUT KE PEMBELIAN \n\n" +
                        "5.Akan muncul verivikasi pembayaran jika sudah benar tekan tombol BELI \n\n"
                }, {
                    title: "Pulsa Listrik",
                    content: "1.Pilih Type Reguler atau DATA \n\n" +
                        "2.Masukan Nomer ponsel \n\n" +
                        "3.Masukan Nomer Meter \n\n" +
                        "4.Pilih Paket yang tertera \n\n" +
                        "5.Setelah semua sudah benar tekan tombol LANJUT KE PEMBELIAN \n\n" +
                        "6.Akan muncul verivikasi pembayaran jika sudah benar tekan tombol BELI \n\n"
                },
            ];
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
                                    <Container>
                                        <Content padder>
                                            <Accordion dataArray={ howToUse } icon="add" expandedIcon="remove" iconStyle={ { color: '#fff' } }
                                                expandedIconStyle={ { color: '#c658ca' } } headerStyle={ { backgroundColor: '#fbb5fd' } }
                                                contentStyle={ { backgroundColor: '#fff' } } />
                                        </Content>
                                    </Container>
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
