import React, { Component } from 'react';
import { Container, Header, Body, Title } from 'native-base';
import { Icon } from 'expo';

export default class HeaderNavigationBar extends Component {
  onLogout () {
    AsyncStorage.clear();
    this.props.navigation.navigate( 'Login' );
  }

  render () {
    return (
      <Header style={ { backgroundColor: '#fbb5fd' } }>
        <Body style={ { alignItems: 'flex-start' } }>
          <Title>
            <Icon.MaterialCommunityIcons name='view-list' size={ 20 } />
          </Title>
        </Body>
        <Body style={ { alignItems: 'center' } }>
          <Title>{ this.props.name }</Title>
        </Body>
        <Body style={ { alignItems: 'flex-end' } }>
          <Title>
            <Icon.Entypo name='log-out' size={ 20 } />
          </Title>
        </Body>
      </Header>
    );
  }
}