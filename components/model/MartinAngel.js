import React from 'react';
export default class MartinAngel extends React.Component {
    constructor() {
        this.lot = '';
        this.probability = '';
        this.multiPlay = '';
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

    getMultiPlay() {
        return this.multiPlay;
    }

    setMultiPlay(value) {
        this.multiPlay = value
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