import { initializeApp } from "firebase/app";
import { getFirestore, collection, serverTimestamp, addDoc, getDocs, doc } from "firebase/firestore";

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

    readFromFirebase = async (collectionName) => {
        try {
            const collectionRef = collection(this.firestore, collectionName);
            const snapshot = await getDocs(collectionRef);
            const docs = snapshot.docs;
            // for (const doc of snapshot.docs) {
            //     let docData = doc.data();
            //     if (subCollectionName) {
            //         const subCollectionData = await this.readFromDoc(doc.ref, subCollectionName);
            //         docData[subCollectionName] = subCollectionData;
            //     }
            //     data.push({ id: doc.id, ...docData });
            // }
            return docs;
        } catch (error) {
            console.error('Error reading from Firebase', error);
            throw error;
        }
    }

    readFromDoc = async (docRef, subCollectionName) => {
        try {
            const subCollectionRef = collection(docRef, subCollectionName);
            const subCollectionSnapshot = await getDocs(subCollectionRef);
            const docs = subCollectionSnapshot.docs;
            return docs;
        } catch (error) {
            console.error('Error reading sub collection from Firebase', error);
            throw error;
        }
    }
}

export default Firebase;