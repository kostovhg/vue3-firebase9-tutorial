export default class OperationsRecord {
    constructor(taskID) {
        this.taskID = taskID;
        this.operations = [];
        this.created = Date.now();
        this.finished = false;
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