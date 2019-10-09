// import Api from '@/services/Api'
const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");

export default {
    register (credentials) {
        return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    },
    login (credentials) {
        return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    }
}
