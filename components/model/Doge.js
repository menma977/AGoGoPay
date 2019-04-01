import React from 'react';
import { AsyncStorage } from 'react-native';
export default class Doge extends React.Component {
    async getUsername() {
        return await AsyncStorage.getItem('usernameDoge').then(response => { return response });
    }

    setUsername(value) {
        AsyncStorage.setItem('usernameDoge', value);
    }

    async getPassword() {
        return await AsyncStorage.getItem('passwordDoge').then(response => { return response });
    }

    setPassword(value) {
        AsyncStorage.setItem('passwordDoge', value);
    }

    async getBalance() {
        return await AsyncStorage.getItem('balance').then(response => { return response });
    }

    setBalance(value) {
        AsyncStorage.setItem('balance', value);
    }

    async getSession() {
        return await AsyncStorage.getItem('sessionDoge').then(response => { return response });
    }

    setSession(value) {
        AsyncStorage.setItem('sessionDoge', value);
    }
}