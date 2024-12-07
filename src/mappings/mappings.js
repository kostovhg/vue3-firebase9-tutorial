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
            client: task.client,
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
    number = null; // should be in format "J.YY.NNN-nn" or "J.SP.YY.NNN-nn-nn"
    client = null; // client name
    name = null; // task name or desciption
    finished = false;   // only when ready for shipping
    created = null; // should be serverTimestamp
    cOp = "1"; // current state of operations 
    operations = []; // list of operations in format:
    // [ 
    //     {opID: [
    //         {start: timestamp, stop: timestamp}, 
    //         {start: timestamp, stop: timestamp}
    //     ]}, 
    //     {opID: [
    //         {start: timestamp, stop:timestamp}]}
    // ]
    // that should allow different intervals for each operation to be recorded
    // in case of pause in some of the operations.

    constructor(number, name, client, ops) {
        this.number = number;
        this.projectNumber = number.split('-')[0];
        this.client = client;
        this.name = name;
        this.created = Date.now();
        this.setOperations(ops);
    }

    getOperations() {
        return this.operations;
    }

    setOperations( ops){
        const theObj = {};

        ops.forEach(op => {
            theObj[op] = null;
        });
        this.operations = theObj;
    }

    // getOperationsAsObject(ops) {
    //     const theObj = {};

    //     ops.forEach(op => {
    //         theObj.push({ op: [null, null]});
    //     });
    //     console.log(theObj.value)
    //     return theObj.value;
    // }

    convertToFirestore = () => {
        const forRecord = {
            number: this.number,
            client: this.client,
            name: this.name,
            finished: this.finished,
            cOp:  this.cOp,
            projectNumber: this.number.split('-')[0],
            operations: this.operations       
        };
        console.log('Print from Task/convertToFirestore()',forRecord);
        return forRecord
    };
}

const templateTask = {
    number: "J.24.021-02",
    name: "Conveying trough 2 pcs",
    finished: false,
    client: "EL SABOR",
    created: 1733419608,
    cOp: 1,
    operations: {}
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
        this.operations.find(op => op.id === opID && op.started).finished = Date.now();
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

class operationInterval {
    start = null;
    stop = null;

    constructor(start, stop) {
        this.start = start;
        this.stop = stop;
    }
}
