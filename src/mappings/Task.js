import OperationsRecord from "./OperationsRecord";

export default class Task {
    constructor(number, name, client, ops) {
        this.number = number;
        this.projectNumber = number.split('-')[0];
        this.client = client;
        this.name = name;
        this.created = Date.now();

        this.setOperations(ops);
    }

    /**
     * Create this.operations object with keys from provided array of operations IDs
     * and values set to null. This object will be used to store the start and stop
     * times of each operation.
     * @param {array} ops - array of operations IDs
     */
    setOperations(ops) {
        const theObj = {};

        ops.forEach(op => {
            theObj[op] = null;
        });
        this.operations = theObj;
    }

    /**
     * Should create start property with current time.
     * If there is already start property with the same opID, it should return error.
     * It should be possible to add new start property, if the opID is the next
     * from available opID's
     *
     * @param {String} opID
     * @param {serverTimestamp} time
     * @memberof Task
     */
    startOperation(opID, time) {
        if (this.operations[opID] && this.operations[opID].start) {
            throw new Error(`Operation with opID ${opID} already has a start property.`);
        }

        // Check if opID is the next from available opIDs
        const opIDs = Object.keys(this.operations).map(id => parseInt(id, 10)).sort((a, b) => a - b);
        const nextOpID = opIDs.length > 0 ? Math.max(...opIDs) + 1 : 1;

        if (parseInt(opID, 10) !== nextOpID) {
            throw new Error(`Operation with opID ${opID} is not the next available opID. Expected ${nextOpID}.`);
        }

        // Add the start property with the current time
        this.operations[opID] = { start: time };
    }
    /**
     * It should pause the operation trough creating finish property with current time
     * 
     * @param {String} opID 
     * @param {serverTimestamp} time 
     * @returns {void}
     */
    pauseOperation(opID, time) {
        this.operations.find(op => { op.id === opID }).paused = Date.now();
    }

    finishOperation(opID) {
        this.operations.find(op => { op.id === opID }).finished = Date.now();
    }

    toFirestore() {
        return {
            number: this.number,
            name: this.name,
            finished: this.finished,
            client: this.client,
            created: Timestamp.fromDate(new Date(this.created)),
            cOp: this.cOp,
            operations: this.operations.map(op => op)
        }
    }

    updateOperations() {
        this.cOp = Object.keys(this.operations).length;
    }
}

// Example usage:
const task = new Task();
const serverTimestamp = new Date().toISOString();

try {
    task.addStart('1', serverTimestamp);
    console.log(task.operations); // { '1': { start: '2023-10-05T14:48:00.000Z' } }
    task.addStart('2', serverTimestamp);
    console.log(task.operations); // { '1': { start: '2023-10-05T14:48:00.000Z' }, '2': { start: '2023-10-05T14:48:00.000Z' } }
    task.addStart('1', serverTimestamp); // Error: Operation with opID 1 already has a start property.
} catch (error) {
    console.error(error.message);
}
