import { defineStore } from 'pinia'
import { collection, doc, onSnapshot, query, where, setDoc, serverTimestamp, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const useTaskSnapStore = defineStore('taskSnap', {
  state: () => ({
    isLoading: false,
    tasks: {},
    listeners: {}
  }),
  actions: {
    // fetch all tasks
    async fetchTasks() {
      this.isLoading = true;
      console.log('is loading true')
      const docsSnap = await getDocs(collection(db, 'tasks'));

      // console.log(docsSnap.docs)
      if (docsSnap.empty) {
        console.log("No tasks found");
      } else {
        this.tasks = docsSnap.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() };
          return acc;
        }, {});
        Object.keys(this.tasks).forEach((taskId) => {
          this.subscribeToTask(taskId);
        });
        console.log('Store tasks "this.tasks"', this.tasks)
      }
      console.log('is loading false')
      this.isLoading = false;
    },

    // subscribe to a task
    subscribeToTask(taskId) {
      if (this.listeners[taskId]) return

      const taskRef = doc(db, 'tasks', taskId)
      this.listeners[taskId] = onSnapshot(taskRef, (snapshot) => {
        if (snapshot.exists()) {
          const updatedTask = { id: snapshot.id, ...snapshot.data() };
          this.tasks[taskId] = updatedTask;
          console.log(`Task ${taskId} updated:`, updatedTask);
        } else {
          delete this.tasks[taskId];
        }
      })
    },

    unsubscribeToTask(taskId) {
      if (this.listeners[taskId]) {
        this.listeners[taskId]()
        delete this.listeners[taskId]
      }
    },

    // add a task
    async addTask(task) {
      const taskRef = doc(db, 'tasks', task.number);
      const toRecord = task.toFirestore();
      toRecord.createdAt = serverTimestamp();
      try {
        await setDoc(taskRef, toRecord);
        console.log("Document written with ID: ", task.number);
        this.tasks[task.number] = { id: task.number, ...toRecord };
      } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
      }
    },

    // update a task
    async updateTask(taskId) {
      const cTask = this.tasks[taskId];
      const taskRef = doc(db, 'tasks', taskId);
      try {
        await updateDoc(taskRef, cTask);
        console.log("Document updated with ID: ", taskId);
        this.tasks[taskId] = { id: cTask.number, ...cTask };
      } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
      }
    },

    isPaused(task, operationId) {
      return this.tasks[task.number].operations[operationId].timestamps.pause.length % 2 !== 0;
    },

    isStarted(task, operationId) {
      return task.operations[operationId].status === 'started';
    },

    isBeingWorked(task, operationId) {
      return this.isStarted(task, operationId) && !this.isPaused(task, operationId);
    },

    pauseTask(taskId, operationId) {
      this.tasks[taskId].operations[operationId].timestamps.pause.push(new Date());
      this.updateTask(taskId);
    },

    startTask(taskId, operationId) {
      const cTask = this.tasks[taskId];
      if (cTask.operations[operationId].status === 'notStarted') {
        cTask.operations[operationId].status = 'started';
        cTask.operations[operationId].timestamps.start = new Date();
      } else {
        this.pauseTask(taskId, operationId);
      }
      this.updateTask(taskId);
    },

    finishTask(taskId, operationId) {
      const cTask = this.tasks[taskId];
      cTask.operations[operationId].timestamps.finish = new Date();
      cTask.operations[operationId].status = 'finished';
      const tOps = this.getTaskOperations(taskId);
      const nextIndex = tOps.indexOf(operationId) + 1;

      if (tOps.length > nextIndex) {
        cTask.cOp = tOps[nextIndex];
      } else {
        cTask.cOp = 0;
        cTask.finished = true;
      }
      
      this.updateTask(taskId)
    }
  },
  getters: {
    getLoading: (state) => state.isLoading,
    getTasks: (state) => state.tasks,
    getTask: (state) => (taskId) => state.tasks[taskId],
    getTaskOperations: (state) => (taskId) => Object.keys(state.tasks[taskId].operations),
    /**
     * Returns a list of tasks that belong to the given operation.
     *
     * @param {string} operationId - The operation ID to filter by.
     * @returns {Task[]} - A list of tasks that belong to the given operation.
     */
    getTasksByOperation: (state) => (operationId) => {
      return Object.values(state.tasks).filter((task) => task.cOp === operationId)
    }
  }
})
