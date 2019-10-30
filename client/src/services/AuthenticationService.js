// import Api from '@/services/Api'
const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");
const axios = require('axios')
import config from '../conf'

export default {
    register (credentials) {
        return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    },
    login (credentials) {
        return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    },
    getPersonFromGoogle (account_id, fields, token) {
        try {
            return axios.get(`${config.apiConfig.googlePersonsUrl}${account_id}?personFields=${fields}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}