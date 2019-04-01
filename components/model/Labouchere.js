import React from 'react';
export default class Labouchere extends React.Component {
    constructor() {
        this.lot = '';
        this.probability = '';
        this.reverse = false;
        this.stopLose = '';
        this.target = '';
    }

    getLot() {
        return this.lot;
    }

    setLot(value) {
        this.lot = value
    }

    getProbability() {
        return this.probability;
    }

    setProbability(value) {
        this.probability = value
    }

    getReverse() {
        return this.reverse;
    }

    setReverse(value) {
        this.reverse = value
    }

    getStopLose() {
        return this.stopLose;
    }

    setStopLose(value) {
        this.stopLose = value
    }

    getTarget() {
        return this.target;
    }

    setTarget(value) {
        this.target = value
    }
}