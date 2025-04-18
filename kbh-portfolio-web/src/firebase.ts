import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDvGhapVYuMd_0zi-uIPhh9YigAw0PTJnQ",
  authDomain: "meetingdetecting.firebaseapp.com",
  projectId: "meetingdetecting",
  storageBucket: "meetingdetecting.appspot.com",
  messagingSenderId: "989824025939",
  appId: "1:989824025939:web:7896d7523ea5050ae50da6",
  measurementId: "G-L1JSNRW553"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
