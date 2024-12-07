export default class OperationRecord {
    constructor(taskID) {
        this.taskID = taskID;
        this.operations = [];
        this.created = Date.now();
        this.finished = false;
    }

    static fromFirestore(doc) {
       const data = doc.data();
       return {
        ...data,
       }
    }  
}   