import { Timestamp } from "firebase/firestore";


export const taskConverter = {
    /**
     * Takes a Task object and converts it to a plain object that can be
     * written to Firestore.
     *
     * @param {Task} task - The Task to convert.
     * @returns {Object} The converted object.
     */
    toFirestore(task) {
        return {
            number: task.number,
            name: task.name,
            finished: task.finished,
            created: Timestamp.fromDate(new Date(task.created)),
            cOp: task.cOp,
            operations: task.operations.map(op => op)
        }
    },
    /**
     * Takes a Firestore snapshot and converts it to a Task object.
     *
     * @param {FirebaseFirestore.DocumentSnapshot} snapshot - The snapshot to
     *     convert.
     * @param {FirebaseFirestore.SnapshotOptions} [options] - Options for the
     *     conversion.
     * @returns {Task} The converted Task object.
     */
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return new Task(data.number, data.name, data.operations);
    }
}

/**
 * Class representing a Task.
 *
 * @export
 * @class Task
 */
export class Task {
    number = null;
    client = null;
    name = null;
    finished = false;
    created = null;
    cOp = 0;
    operations = [];

    constructor(number, client, name, ops) {
        this.number = number;
        this.client = client;
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
            client: this.client,
            name: this.name,
            finished: this.finished,
            cOp: "/operations/" + this.cOp,
            operations: this.operations.map(op => "/operations/" + op)
        };
    };
}

export class Record {
    constructor(taskID) {
        this.taskID = taskID;
        this.operations = [];
        this.created = Date.now();
        this.finished = false;
    }

    startOperation(opID) {
        this.operations.push({id: opID, started: Date.now()});
    }

    finishOperation(opID) {
        this.operations.find(op => {op.id === opID && op.started}).finished = Date.now();
    }

    finish() {
        this.finished = Date.now();
    }

    convertToFirestore = () => {
        return {
            taskID: this.taskID,
            operations: this.operations.map(op => "/operations/" + op),
            created: this.created,
            finished: this.finished
        };
    }
}