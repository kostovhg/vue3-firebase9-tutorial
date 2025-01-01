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

      console.log(docsSnap.docs)
      if (docsSnap.empty) {
        console.log("No tasks found");
      } else {
        this.tasks = docsSnap.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() };
          return acc;
        }, {});
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
          this.tasks[taskId] = { id: snapshot.id, ...snapshot.data() }
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
    async updateTask(task) {
      const taskRef = doc(db, 'tasks', task.number);
      const toRecord = task.toFirestore();
      try {
        await updateDoc(taskRef, toRecord);
        console.log("Document updated with ID: ", task.number);
        this.tasks[task.number] = { id: task.number, ...toRecord };
      } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
      }
    },

    isPaused(task, operationId) {
      return task.operations[operationId].timestamps.pause.length % 2 !== 0;
    },

    isStarted(task, operationId) {
      return task.operations[operationId].status === 'started';
    }
  },
  getters: {
    getLoading: (state) => state.isLoading,
    getTasks: (state) => state.tasks,
    getTaskByOperation: (state) => (operationId) => {
      return Object.values(state.tasks).filter((task) => task.cOp === operationId)
    }
  }
})