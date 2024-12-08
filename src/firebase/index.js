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
  const reference = doc(db, str);
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

  console.log(typeof (opId.value), opId.value)
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

  try {
    const docRef = await setDoc(doc(db, "tasks", toRecord.number), toRecord);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function getDocRef(id) {
  return doc(db, 'tasks', `${id}`);
}

async function startWorking(id, oId) {
  /* Old code - needs fixes and optimization */
  // try {
  //   var docRef = doc(db, 'tasks', `${id}`);
  //   const docSnap = await getDoc(docRef);
  //   var startRecord = { start: serverTimestamp(), stop: null };

  //   if (docSnap.exists()) {
  //     const data = docSnap.data();
  //     console.log('print from index.js/startWorking data', JSON.stringify(data))
  //     const dataOperations = data.operations;
  //     console.log('print from index.js/startWorking operations', dataOperations)
  //     const operationIndex = dataOperations.findIndex(op => Object.keys(op)[0] === oId);
  //     console.log('print from index.js/startWorking operationIndex', operationIndex)
  //     const intervalIndex = dataOperations
  //     console.log('print from index.js/startWorking intervalIndex', intervalIndex)
  //     if (operationIndex !== -1) {
  //       console.log('Operations for data')
  //       const lastTimestampIndex = dataOperations[operationIndex][oId].length - 1;
  //       console.log('pront from index.js/startWorking operations[operationIndex][oId].length - 1', lastTimestampIndex)

  //       dataOperations[operationIndex][oId][lastTimestampIndex].append(startRecord);

  //       await updateDoc(docRef, {
  //         operations: dataOperations,
  //         modifiedAt: serverTimestamp()
  //       });
  //     } else {
  //       console.log('Operation not found');
  //     }
  //   } else {
  //     console.log('Document not Found')
  //   }
  //   console.log("Document updated with ID: ", id);
  // } catch (e) {
  //   console.error("Error adding document: ", e);
  //   throw e;
  // }

  /* testing code */
  //   const currentTaskRef = await getDoc(doc(db, 'tasks', id));
  //   const currentTaskOperationsRef = currentTaskRef.data().operations;

  //   console.log('print from index.js/startWorking currentOperationRef', currentTaskRef.data())
  //   currentTaskOperationsRef.forEach((element, index) => {
  //     // if (element[oId]) {
  //       console.log('element: ', element );
  //       console.log('element records', Object.keys(element)[0])
  //     // }
  //   });
  //   const currentOp = currentTaskOperationsRef
  //     .find(element => Object.keys(element)[0] === oId)[oId];
  //     console.log('record for current operation is started' , currentOp[0].start !== null) && currentOp[0].stop === null;
  //   console.log('print from index.js/startWorking currentTaskOperationsArr', currentTaskOperationsRef)   
  //   if (currentTaskRef.exists()) {
  //     console.log('print from index.js/startWorking currentOperationRef.exists()', currentTaskRef.exists())
  //     const data = currentTaskRef.data();
  //     console.log('print from index.js/startWorking data', data)
  // }

  /* Another testing code*/
  const docRef = doc(db, 'tasks', `${id}`);
  const collectionOpRef = collection(db, 'tasks', `${id}`, 'operations');
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  console.log('print from index.js/startWorking data', data)
  const collectionOpSnap = await getDocs(collectionOpRef);
  collectionOpSnap.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    const recs = Object.keys(doc.data());
    if (recs.length > 0) {
      console.log('  Records for that operation: ', recs.length)
      const lastStart = recs[recs.length - 1];
      console.log('  Last start: ', lastStart)
      if (doc.data()[lastStart] === null) {
        console.log('   Operation is currently being worked on');
      } else {
        console.log('   Operation is finished');
      }
    } else {
      console.log(`  No records for that operation - > Operation ${doc.id}has not been started`)
    }
    
  })
  // const firstEmptyOperIndex = (dOps) => {
  //   for (let prop in dOps) {
  //     console.log('print before hasOwnProperty', prop)
  //     if (Object.prototype.hasOwnProperty.call(dOps, prop)) {
  //       console.log(dOps[prop])
  //       if (dOps[prop] === null) {
  //         return prop
  //       }
  //     }
  //   }
  // }
  // const firstEmptyOperIndex = (dOps) => {
  //   return Object.keys(dOps).find((key) => dOps[key] !== null);
  // }
  // const someResult = firstEmptyOperIndex(dataOperations);
  // console.log(someResult)

  // while(Object.keys(dataOperations)-- && !dataOperations[someResult]) {

  // }
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

const getClientTimestamp = () => {
  const now = Date.now();
  return { seconds: now / 1000, nanoseconds: (now % 1000) * 1000000 };
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