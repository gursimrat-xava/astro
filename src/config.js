import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
export var firebaseConfig = {
    apiKey: "AIzaSyADyirg5En8h_Vi_z2vyUn8vbLzWBdhunU",
    authDomain: "astroplus-c0e60.firebaseapp.com",
    projectId: "astroplus-c0e60",
    storageBucket: "astroplus-c0e60.appspot.com",
    messagingSenderId: "252660985769",
    appId: "1:252660985769:web:c17edb919e637cba351eb8",
    measurementId: "G-JP1DGH4C23"
}
export default firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ ignoreUndefinedProperties: true });
// export const auth0Config = {
//     client_id: 'XmminWIs0S8gR3gIRBydYLWbF58x81vK',
//     domain: 'matx.us.auth0.com',
// }
