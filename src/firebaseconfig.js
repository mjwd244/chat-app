  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";

  import { getFirestore } from 'firebase/firestore';
  import { getAuth } from "firebase/auth";
  import { doc, getDoc, setDoc, serverTimestamp  } from 'firebase/firestore';

  import { getStorage } from "firebase/storage";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {
    apiKey: 'AIzaSyCzUIpXzG2eBLo3OJBU5x9sP2xNn1UV4oQ',
    authDomain: 'my-chat-84cdb.firebaseapp.com',
    projectId: 'my-chat-84cdb',
    storageBucket:' my-chat-84cdb.appspot.com',
    messagingSenderId: '621275167908',
    appId: '1:621275167908:web:e6ff2e50da6b62360c3a31',
    measurementId: 'G-1R4Y0XHYY9',
  };

  // Initialize Firebase
  const apps = initializeApp(firebaseConfig);
  export const storage = getStorage(apps, "gs://my-chat-84cdb.appspot.com");
  
  export const auth = getAuth(apps);
  export const firestore = getFirestore(apps);
  export const createUserDocument = async (user, additionalData) => {
    if (!user) return;

    const userRef = doc(firestore,`users/${user.uid}`);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists) {
      const { email } = user;
      const { displayName } = additionalData;

      try {
        await setDoc(userRef, {
          displayName,
          email,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log('Error in creating user', error);
      }
    }
  };
  export default apps;
