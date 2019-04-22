import React from 'react';
import { View, Linking , StatusBar } from 'react-native';
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
    Button,
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
                <View style={ [ Styles.container, { backgroundColor: '#ffffffff' } ] }>
                    <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                        <Spinner color='#4b3854ff' />
                    </View>
                </View>
            );
        } else {
            const howToUse = [
                {
                    title: "Cara Mengunjungi Website",
                    content: "Tekan ikon Web yang ada pada halaman Home\n\n"
                }, {
                    title: "Cara Cek Saldo",
                    content: "1. Jumlah saldo anda akan ditampilkan pada halaman Home \n\n" +
                        "2. Tekan ikon Reload untuk memuat ulang nilai saldo anda"
                }, {
                    title: "Pulsa dan Data Internet",
                    content: "1. Klik ikon Pulsa dan Internet \n\n" +
                        "2. Pilih tipe pulsa REGULER atau DATA \n\n" +
                        "3. Masukan nomor ponsel, maka akan muncul logo provider yang digunakan \n\n" +
                        "4. Pilih paket yang tersedia \n\n" +
                        "5. Cek dan pastikan kembali nomor ponsel yang anda masukkan sudah benar, lalu tekan tombol LANJUT KE PEMBELIAN \n\n" +
                        "6. Tekan BELI pada verifikasi pembayaran \n\n"
                }, {
                    title: "Pulsa Listrik",
                    content: "1. Klik ikon PLN \n\n" +
                        "2. Masukkan nomor ponsel anda\n\n" +
                        "3. Masukan nomor meter \n\n" +
                        "4. Pilih paket yang tersedia \n\n" +
                        "5. Cek dan pastikan kembali nomor ponsel dan nomor meter yang anda masukkan sudah benar, lalu tekan tombol LANJUT KE PEMBELIAN \n\n" +
                        "6. Tekan BELI pada verifikasi pembayaran \n\n"
                },
            ];
            return (
                <Container>
                    <Header { ...this.props } />
                    {/* load tab above header */ }
                    <Tabs tabContainerStyle={ { height: 30 } }>
                        <Tab heading='Home' tabStyle={ { backgroundColor: '#ffffffff' } } activeTabStyle={ { backgroundColor: '#ffffffff' } } textStyle={ { color: '#f0edf1ff' } } activeTextStyle={ { color: '#4b3854ff' } }>
                            {/* load HomeTab */ }
                            <HomeTab { ...this.props } />
                            {/* /load HomeTab */ }
                        </Tab>
                        <Tab heading='Financial' tabStyle={ { backgroundColor: '#ffffffff' } } activeTabStyle={ { backgroundColor: '#ffffffff' } } textStyle={ { color: '#f0edf1ff' } } activeTextStyle={ { color: '#4b3854ff' } }>
                            <Button info block onPress={ () => this.props.navigation.navigate( 'Financial' ) }>
                                <Text>Financial</Text>
                            </Button>
                        </Tab>
                        <Tab heading='Help' tabStyle={ { backgroundColor: '#ffffffff' } } activeTabStyle={ { backgroundColor: '#ffffffff' } } textStyle={ { color: '#f0edf1ff' } } activeTextStyle={ { color: '#4b3854ff' } }>
                            <Tabs>
                                <Tab heading='How To Use' tabStyle={ { backgroundColor: '#ffffffff' } } activeTabStyle={ { backgroundColor: '#ffffffff' } } textStyle={ { color: '#f0edf1ff' } } activeTextStyle={ { color: '#4b3854ff' } }>
                                    <Container>
                                        <Content padder>
                                            <Accordion dataArray={ howToUse } icon="add" expandedIcon="remove" iconStyle={ { color: '#4b3854ff' } }
                                                expandedIconStyle={ { color: '#4b3854ff' } } headerStyle={ { backgroundColor: '#ffffffff' } }
                                                contentStyle={ { backgroundColor: '#ffffffff' } } style={ { color: '#4b3854ff' } } />
                                        </Content>
                                    </Container>
                                </Tab>
                                <Tab heading='Criticism And Suggestions' tabStyle={ { backgroundColor: '#ffffffff' } } activeTabStyle={ { backgroundColor: '#ffffffff' } } textStyle={ { color: '#f0edf1ff' } } activeTextStyle={ { color: '#4b3854ff' } }>
                                    <Container>
                                        <Content>
                                            <Card>
                                                <CardItem style={ { backgroundColor: '#ffffffff' } } header>
                                                    <Text style={ { color: '#4b3854ff' } }>Criticism And Suggestions</Text>
                                                </CardItem>
                                                <CardItem>
                                                    <Body>
                                                        <Row>
                                                            <Col size={ 4 }>
                                                                <Icon type='Entypo' name='email' size={ 30 } style={ { color: '#4b3854ff' } } />
                                                            </Col>
                                                            <Col size={ 8 }>
                                                                <Button transparent onPress={ () => Linking.openURL( 'mailto:email@gmail.com' ) } title="email@gmail.com">
                                                                    <Text>email@gmail.com</Text>
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col size={ 4 }>
                                                                <Icon type='FontAwesome' name='whatsapp' size={ 30 } style={ { color: '#4b3854ff' } } />
                                                            </Col>
                                                            <Col size={ 8 }>
                                                                <Button transparent onPress={ () => Linking.openURL( 'whatsapp://send?phone=+6282234468232' ) }>
                                                                    <Text>082234468222</Text>
                                                                </Button>
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
