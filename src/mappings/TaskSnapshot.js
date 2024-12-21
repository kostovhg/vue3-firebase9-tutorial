import { doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default class TaskSnapshot {

    constructor(docSnapshot) {

        this.data = docSnapshot.data();
        this.id = docSnapshot.data().number;
        this.docRef = doc(db, 'tasks', this.id);

        // Set up real-time listener for updates
        onSnapshot(this.docRef, (snapshot) => {
            if (snapshot.exists()) {
                this.data = snapshot.data();
                this.emitChange(); // Notify listeners of changes
            } else {
                console.log('Document does not exist');
            }
        })
    }

    async update(newData) {
        try {
            await updateDoc(this.docRef, newData);
            this.data = { ...this.data, ...newData }; // update local data
            this.emitChange();
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    // Method to emit change events (you'll need to implement this)
    emitChange() {
        // Example using a simple event emitter
        if (this.onChange) {
            this.onChange();
        }
    }

    startOperation(opID, time) {
        if (!this.data.operations[opID]) {
            throw new Error(`Operation with opID ${opID} does not exist`);
        }
        if (this.data.operations[opID].timestamps.start) {
            // this.data.operations[opID].timestamps.pause.push(time);
            // push timestamp for resume operation
            this.pauseOperation(opID, time);
        } else {
            this.data.operations[opID].timestamps.start = time;
            this.data.operations[opID].status = 'started';
        }
    }
    pauseOperation(opID, time) {
        this.data.operations[opID].timestamps.pause.push(time);
    }

    finishOperation(opID) {
        if (this.data.operations[opID].timestamps.start){
            throw new Error(`Operation with opID ${opID} has not started yet`);
        }
        const ops = Object.keys(this.data.operations);
        const opIndex = ops.indexOf(opID);
        // this.data.operations[opID].timestamps.finish = Date.now();
        this.data.operations[opID].timestamps.finish = serverTimestamp();
        this.data.operations[opID].status = 'finished'
        if (ops.length > opIndex + 1) {
            this.data.cOp = ops[opIndex + 1];
        } else {
            this.data.finished = true;
        }
    }

    isStarted(opID) {
        return this.data.operations[opID].timestamps.start !== null;
    }

    isFinished(opID) {
        return this.data.operations[opID].timestamps.finish !== null;
    }

    isPaused(opID) {
        return this.data.operations[opID].timestamps.pause.length % 2 !== 0;
    }
}