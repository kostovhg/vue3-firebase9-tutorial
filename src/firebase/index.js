// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA3ss49ic7fOy6Bc6GDzk0hvDgLfjU39Bg',
  authDomain: 'badass-todo-20a65.firebaseapp.com',
  projectId: 'badass-todo-20a65',
  storageBucket: 'badass-todo-20a65.firebasestorage.app',
  messagingSenderId: '946461266233',
  appId: '1:946461266233:web:e5ed4b07dbc578c7c598e8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db
}