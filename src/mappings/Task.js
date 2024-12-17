export default class Task {

    /**
     * Constructs a new Task instance with the provided data.
     * 
     * @param {Object} data - The data to initialize the Task with.
     * @throws Will throw an error if required data is missing or operations format is invalid.
     */
    constructor(data) {

        try {
            this.dataCheck(data); // Validate the input data
        } catch (error) {
            throw error; // Rethrow the error if data validation fails
        }

        // Initialize Task properties
        this.number = data.number;
        this.projectNumber = data.number.split('-')[0];
        this.client = data.client;
        this.name = data.name;
        this.createdAt = data.createdAt || 'to be filled in firebase/index.js';
        this.cOp = data.cOp || '1';
        this.finished = data.finished || false;


        // Initialize operations
        if (Array.isArray(data.operations) && data.operations.length > 0) {
            this.operations = {};
            data.operations.forEach(op => {
                this.operations[op] = {
                    status: 'notStarted',
                    timestamps: { start: null, pause: [], finish: null }
                };
            });
        } else if (typeof data.operations === 'object' && data.operations !== null) {
            this.operations = data.operations;
        } else {
            throw new Error('Invalid operations format');
        }
    }

    /**
     * Validates the input data for the Task class.
     *
     * @private
     * @static
     * @param {Object} data - The data to validate.
     * @throws Will throw an error if required data is missing.
     * @memberof Task
     */
    dataCheck(data) {
        if (!data.number) throw new Error('Missing number');
        if (!data.client) throw new Error('Missing client');
        if (!data.name) throw new Error('Missing name');
        if (!data.operations) throw new Error('Missing operations');

    }


    startOperation(opID, time) {
        if (!this.operations[opID]) {
            throw new Error(`Operation with opID ${opID} does not exist`);
        }
        if (this.operations[opID].timestamps.start) {
            this.operations[opID].timestamps.pause.push(time);
        } else {
            this.operations[opID].timestamps.start = time;
            this.operations[opID].status = 'started';
        }
    }

    /**
     * It should pause the operation trough creating finish property with current time
     * 
     * @param {String} opID 
     * @param {serverTimestamp} time 
     * @returns {void}
     */
    pauseOperation(opID, time) {
        // console.log(time)
        this.operations[opID].timestamps.pause.push(time);
    }

    finishOperation(opID) {
        // todo: check if there is a start before adding finnish
        const opIndex = Object.keys(this.operations).indexOf(opID);
        const ops = Object.keys(this.operations);
        this.operations[opID].timestamps.finish = Date.now();
        if (ops.length > opIndex + 1) {
            this.cOp = ops[opIndex + 1];
            // console.log(this.cOp)
            this.operations[opID].status = 'finished'
        } else {
            this.finished = true;
        }
    }

    isStarted(opID) {
        return this.operations[opID].timestamps.start !== null;
    }

    isFinished(opID) {
        return this.operations[opID].timestamps.finish !== null;
    }

    isPaused(opID) {
        const pauses = this.operations[opID].timestamps.pause;
        return pauses !== null && pauses.length % 2 !== 0;
    }

    toFirestore() {
        return {
            number: this.number,
            name: this.name,
            finished: this.finished,
            client: this.client,
            createdAt: this.createdAt,
            projectNumber: this.projectNumber,
            cOp: this.cOp,
            operations: this.operations
        }
    }

    updateOperations() {
        this.cOp = Object.keys(this.operations).length;
    }
}

// // Example usage:
// const task = new Task();
// const serverTimestamp = new Date().toISOString();

// try {
//     task.addStart('1', serverTimestamp);
//     console.log(task.operations); // { '1': { start: '2023-10-05T14:48:00.000Z' } }
//     task.addStart('2', serverTimestamp);
//     console.log(task.operations); // { '1': { start: '2023-10-05T14:48:00.000Z' }, '2': { start: '2023-10-05T14:48:00.000Z' } }
//     task.addStart('1', serverTimestamp); // Error: Operation with opID 1 already has a start property.
// } catch (error) {
//     console.error(error.message);
// }
