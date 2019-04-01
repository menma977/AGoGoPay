import React from 'react';
export default class Fibonacci extends React.Component {
    constructor() {
        this.lot = '';
        this.probability = '';
        this.reset = false;
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

    getReset() {
        return this.reset;
    }

    setReset(value) {
        this.reset = value
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