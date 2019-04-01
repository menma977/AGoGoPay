import React, { Component } from 'react';
import { AsyncStorage, Image, StatusBar } from 'react-native';
import { Header, Body, Title, Button, Icon, Text } from 'native-base';

export default class HeaderNavigationBar extends Component {
  onLogout () {
    AsyncStorage.clear();
    Expo.Updates.reload();
    this.props.navigation.navigate( 'Login' );
  }

  render () {
    return (
      <Header style={ { backgroundColor: '#fff', top: 5 } } hasTabs >
        <StatusBar barStyle='dark-content' />
        <Body style={ { alignItems: 'flex-start' } }>
          <Image source={ require( '../assets/images/icon/logo.png' ) }
            style={ { flex: 1, width: '100%', resizeMode: 'contain', alignSelf: 'center', left: 20 } } />
        </Body>
        <Body style={ { alignItems: 'center' } }>
          <Title>
            {/* <Icon.MaterialCommunityIcons name='view-list' size={ 20 } /> */ }
          </Title>
        </Body>
        <Body style={ { alignItems: 'flex-end' } }>
          <Button transparent iconRight style={ { width: '100%' } } onPress={ this.onLogout.bind( this ) }>
            <Text style={ { color: '#4b3854ff' } }>Logout</Text>
            <Icon type='Entypo' name='log-out' size={ 30 } style={ { color: '#4b3854ff' } } />
          </Button>
        </Body>
      </Header>
    );
  }
}