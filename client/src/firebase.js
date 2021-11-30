import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore";

const app = firebase.initializeApp({
    apiKey: "AIzaSyBCT0eGeNefdZ0Fm-30ExY2ez5K4E-iYMQ",
    authDomain: "stocks-gamification.firebaseapp.com",
    projectId: "stocks-gamification",
    storageBucket: "stocks-gamification.appspot.com",
    messagingSenderId: "1097466445837",
    appId: "1:1097466445837:web:0998ebf27c38b799fad544"
})



export const auth = app.auth()
export default app
export const db = firebase.firestore();
