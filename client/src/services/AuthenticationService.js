// import Api from '@/services/Api'
const firebase = require("firebase");

export default {
    register (credentials) {
        return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    },
    login (credentials) {
        return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    }
}
