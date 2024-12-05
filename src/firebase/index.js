// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';
import {
  getFirestore, serverTimestamp,
  collection, onSnapshot, getDoc, getDocs,
  doc, addDoc, setDoc, deleteDoc, updateDoc,
  query, orderBy, limit, where
} from "firebase/firestore";
import { taskConverter, Task, } from '@/mappings/mappings';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCollectionRef = collection(db, "tasks");
const operationCollectionRef = collection(db, "operations")
const todosCollectionQuery = query(tasksCollectionRef, orderBy("date", "desc"), limit(10));
const getReference = async (str) => {
  const reference = doc(db, `str`);
  return reference
}

async function getTodos(callback) {
  try {
    const querySnapshot = todosCollectionQuery;

    const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
      const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(todos);
    });
    return unsubscribe;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// async function getOperations(callback) {
//   try {
//     const querySnapshot = operationCollectionRef;

//     const unsubscribe = get(querySnapshot, (snapshot) => {
//       const operations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       console.log('Printing operations from firebase/index/getOperations() - snapshot', operations)
//       // callback(operations);
//     });
//     console.log('Printing operations from firebase/index/getOperations() - unsubscribe', unsubscribe)
//     return unsubscribe;
//   } catch (e) {
//     console.error("Error adding document: ", e);
//     throw e;
//   } finally {
//     console.log("finally")
//   }
// }

async function getTasks(opId) {

  console.log(typeof(opId.value), opId.value)
  const q = query(tasksCollectionRef,
    where("cOp", "==", opId.value));

  console.log('Log from passing query in getTasks - q', q)
  try {
    const docsSnap = await getDocs(q);
    const tasks = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks
  } catch (e) {
    console.error("Error fetching tasks document: ", e);
    return [];
  }
}




async function fetchOperations() {
  console.log("fetching operations");
  const docsSnap = await getDocs(operationCollectionRef);
  if (docsSnap.empty) {
    // console.log("No operations found");
    return []
  } else {
    const operations = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // console.log('Printing operations from firebase/index/fetchOperations() - operations', operations)
    return operations
  }
}

async function addTodo(data) {
  try {
    const docRef = await addDoc(tasksCollectionRef, data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function addTask(task) {
  console.log("converted to plant object: ", task.convertToFirestore());

  const toRecord = task.convertToFirestore();
  toRecord.createdAt = serverTimestamp();
  // const toRecord = doc(db, "tasks").withConverter(taskConverter);

  try {
    // const docRef = await addDoc(tasksCollectionRef, toRecord);
    // console.log("Document written with ID: ", docRef.id);
    // return docRef.id;
    const docRef = await setDoc(doc(db, "tasks", toRecord.number), toRecord);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function getDocRef(id){

  return doc(db, 'tasks', id);
}

async function startWorking(id, oId) {
  
  try {
    const docRef = {}
    getDocRef(id).then((docSnap) => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap);
        docRef = docSnap;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });

    console.log('pront from index.js/startWorking',docRef)
    await updateDoc(docRef, { started: true });
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function pauseWorking(id, oId) {
  // todo: implement pauseWorking
}

async function finishWorking(id, oId) {
  // todo: implement finishWorking
}

async function delTodo(id) {
  try {
    const docRef = doc(tasksCollectionRef, id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function updateTodo(id, data) {
  try {
    const docRef = doc(tasksCollectionRef, id);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export {
  db,
  addTask,
  getTasks,
  delTodo,
  updateTodo,
  fetchOperations,
  startWorking,
  pauseWorking,
  finishWorking
}