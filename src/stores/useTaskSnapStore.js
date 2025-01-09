import { defineStore } from 'pinia'
import { useLocalStorage } from "@vueuse/core";
import { collection, doc, onSnapshot, query, where, setDoc, serverTimestamp, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

export const useTaskSnapStore = defineStore('taskSnap', {
  state: () => ({
    isLoading: false,
    // tasks: {},
    tasks: useLocalStorage('tasks', () => ({})),
    operation: 0,
    listeners: {},
  }),
  persist: true,
  actions: {
    async fetchTasks() {
      if (Object.keys(this.tasks).length > 0) {
        return; // Tasks already fetched
      }
      if (localStorage.getItem('tasks')) {
        return;
      }
      console.log('Fetching tasks (isLoading == true) ...')
      this.isLoading = true;
      const docsSnap = await getDocs(collection(db, 'tasks'));
      if (docsSnap.empty) {
        console.log("No tasks found");
      } else {
        this.tasks = docsSnap.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() };
          return acc;
        }, {});

      }
      console.log('Finish fetching tasks (isLoading == false). Tasks: ', this.tasks)
      this.isLoading = false;
    },

    subscribeToTask(taskId) {
      if (this.listeners[taskId]) return

      const taskRef = doc(db, 'tasks', taskId)
      this.listeners[taskId] = onSnapshot(taskRef, (snapshot) => {
        if (snapshot.exists()) {
          const updatedTask = { id: snapshot.id, ...snapshot.data() };
          this.tasks[taskId] = updatedTask;
          console.log(`Subscribed to ${taskId} :`, updatedTask);
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

    subscribeToPrecedingTasks(operationId) {
      Object.values(this.tasks).forEach(task => {
        if (task.cOp < operationId) {
          this.subscribeToTask(task.id);
        }
      });
    },

    // add a task
    async addTask(task) {
      const taskRef = doc(db, 'tasks', task.number);
      // const toRecord = task.toFirestore();
      task.finished = false;
      task.projectNumber = task.number.split('-')[0];
      task.cOp = "1";
      const operationsList = task.operations.sort((a, b) => a - b);

      if (Array.isArray(task.operations) && operationsList.length > 0) {
        task.operations = {};
        operationsList.forEach(op => {
          task.operations[op] = {
            status: 'notStarted',
            timestamps: { start: null, pause: [], finish: null }
          };
        });
      } else if (typeof task.operations === 'object' && task.operations !== null) {
        this.operations = data.operations;
      } else {
        throw new Error('Invalid operations format');
      }
      const toRecord = task;
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
      //this.notify(`Task ${taskId} paused with operation ${operationId}!`, 'warning');
    },

    startTask(taskId, operationId) {
      const cTask = this.tasks[taskId];
      if (cTask.operations[operationId].status === 'notStarted') {
        cTask.operations[operationId].status = 'started';
        cTask.operations[operationId].timestamps.start = new Date();
        //this.notify(`Task ${cTask.number} started with operation ${operationId}!`, 'success');
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
      this.notify(`Task ${cTask.number} finish with operation ${operationId}!`, 'success');
    },

    // unsubscribeToTasks(tasksArray) {
    //   tasksArray.forEach(task => {
    //     this.unsubscribeToTask(task.id);
    //   });
    // },

    notify(msg, msgType = 'info') {
      switch (msgType) {
        case 'info':
          this.toast.info(msg);
          break;
        case 'success':
          this.toast.success(msg);
          break;
        case 'error':
          this.toast.error(msg);
          break;
        case 'warning':
          this.toast.warning(msg);
          break;
        default:
          this.toast.info(msg);
          break;
      }
    }
  },
  getters: {
    getLoading: (state) => state.isLoading,
    getTasks: (state) => state.tasks,
    getTask: (state) => (taskId) => state.tasks[taskId],
    getTasksByOperation: (state) => (operationId) => {
      console.log('getTasksByOperation', operationId)
      return Object.values(state.tasks).filter((task) => task.cOp === operationId).sort((a, b) => a.cOp - b.cOp)
    },
    getPrecedingTasks: (state) => (operationId) => {
      return Object.values(state.tasks).filter((task) => task.cOp <= operationId).sort((a, b) => a.cOp - b.cOp)
    },
    toast: () => useToast(),
  }
})
