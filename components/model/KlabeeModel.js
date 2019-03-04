import React from 'react';
export default class KlabeeModel extends React.Component {
    constructor() {
        this.username     = '';
        this.password     = '';
        this.balance      = '';
        this.balanceBonus = '';
    }

    getUsername() {
        return this.username;
    }

    setUsername(value) {
        this.username = value;
    }

    getPassword() {
        return this.password;
    }

    setPassword(value) {
        this.password = value;
    }

    getBalance() {
        return this.balance;
    }

    setBalance(value) {
        this.balance = value;
    }

    getBalanceBonus() {
        return this.balanceBonus;
    }

    setBalanceBonus(value) {
        this.balanceBonus = value;
    }
}
