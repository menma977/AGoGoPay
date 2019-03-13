import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Header, Body, Title, Button, Icon, Text } from 'native-base';

export default class HeaderNavigationBar extends Component {
  onLogout () {
    AsyncStorage.clear();
    Expo.Updates.reload();
    this.props.navigation.navigate( 'Login' );
  }

  render () {
    return (
      <Header style={ { backgroundColor: '#fbb5fd' } } hasTabs >
        <Body style={ { alignItems: 'flex-start' } }>
          <Title>
            {/* <Icon.MaterialCommunityIcons name='view-list' size={ 20 } /> */ }
          </Title>
        </Body>
        <Body style={ { alignItems: 'center' } }>
          <Title>{ this.props.name }</Title>
        </Body>
        <Body style={ { alignItems: 'flex-end' } }>
          <Button transparent iconRight style={ { width: '100%' } } onPress={ this.onLogout.bind( this ) }>
            <Text style={ { color: '#fff' } }>Logout</Text>
            <Icon type='Entypo' name='log-out' size={ 30 } style={ { color: '#fff' } } />
          </Button>
        </Body>
      </Header>
    );
  }
}