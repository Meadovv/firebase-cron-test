import { initializeApp } from "firebase/app";
import { getFirestore, collection, serverTimestamp, addDoc } from "firebase/firestore";

class Firebase {
    firebase = null;
    firestore = null;
    constructor() {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };
        this.firebase = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.firebase);
    }

    writeToFirebase = async (collectionName, data) => {
        try {
            const collectionRef = collection(this.firestore, collectionName);
            const dataToWrite = {
                ...data,
                timestamp: serverTimestamp()
            };
            const docRef = await addDoc(collectionRef, dataToWrite);
            console.log('Data written to Firebase with ID: ', docRef.id);
        } catch (error) {
            console.error('Error writing to Firebase', error);
        }
    }
}

export default Firebase;