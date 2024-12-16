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
