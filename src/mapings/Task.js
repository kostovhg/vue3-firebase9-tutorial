import { Timestamp } from "firebase/firestore";

export class Task {
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
        this.operations = ops;
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

    getOperations() {
        return this.operations;
    }

    setOperations(operations) {
        this.operations = operations;
    }

    convertToFirestore = () => {
        return {
            number: this.number,
            name: this.name,
            finished: this.finished,
            // created: Timestamp.fromDate(new Date(this.created)),
            cOp: "/operations/" + this.cOp,
            operations: this.operations.map(op => "/operations/" + op)
        }

    }


}

