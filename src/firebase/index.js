// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';
import {
  getFirestore,
  collection, onSnapshot, getDoc,
  doc, addDoc, deleteDoc, updateDoc,
  query, orderBy, limit
} from "firebase/firestore";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// in this case it is imported from ./config wich will be in gitignore
// export const firebaseConfig = {
//   apiKey: 'your-api-key',
//   authDomain: 'your-auth-domain.firebaseapp.com',
//   projectId: 'your-project-id',
//   storageBucket: 'your-storage-bucket.firebasestorage.app',
//   messagingSenderId: 'your-messaging-sender-id',
//   appId: 'your-app-id'
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const todosCollectionRef = collection(db, "todos");
const operationCollectionRef = collection(db, "operations");
const todosCollectionQuery = query(todosCollectionRef, orderBy("date", "desc"), limit(10));
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

async function getOperations(callback) {
  try {
    const querySnapshot = operationCollectionRef;

    const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
      const operations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // console.log(operations)
      callback(operations);
    });
    return unsubscribe;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  } finally {
    console.log("finally")
  }
}

async function addTodo(data) {
  try {
    const docRef = await addDoc(todosCollectionRef, data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function addTask(data) {
  console.log("converted to plant object: ", data.convertToFirestore());

  const toRecord = data.convertToFirestore();

  try {
    const docRef = await addDoc(todosCollectionRef, toRecord);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function delTodo(id) {
  try {
    const docRef = doc(todosCollectionRef, id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function updateTodo(id, data) {
  try {
    const docRef = doc(todosCollectionRef, id);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export {
  db,
  addTask as addNew,
  getTodos,
  delTodo,
  updateTodo,
  getOperations
}