import { Timestamp } from "firebase/firestore";

export default class Task {
    number = null;
    name = null;
    finished = false;
    created = null;
    cOp = 0;
    operations = []
    constructor(number, name, ops) {
        this.number = number;
        this.name = name;
        this.created = Date.now();
        operations = ops;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getNumber() {
        return this.number;
    }

    setNumber(number) {
        this.number = number;
    }

    isFinished() {
        return this.finished;
    }

    finish() {
        this.finished = Date.now();
    }

    getCreated() {
        return this.created;    
    }

    getCurrentOp() {
        return this.cOp;
    }

    setCurrentOp(opId) {
        this.cOp = opId;
    }


    
}