// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: data['apiKey'],
    authDomain: data['authDomain'],
    projectId: data['projectId'],
    storageBucket: data['storageBucket'],
    messagingSenderId: data['messagingSenderId'],
    appId: data["appId"],
    measurementId: data["measurementId"]
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const auth = firebase.auth();
const db = firebase.firestore();
