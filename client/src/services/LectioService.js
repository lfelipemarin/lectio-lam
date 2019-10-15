import Api from '@/services/Api'
const firebase = require("firebase/app")
// Required for side-effects
require("firebase/firestore")
const db = firebase.firestore()

export default {
    getTodaysReadings (today) {
        return Api().get('readings', {
            params: {
                date: today
            }
        })
    },
    getDateReadings (date, lang, type) {
        return Api().get('date-readings', {
            params: {
                date: date,
                lang: lang,
                type: type
            }
        })
    },
    saveLectio (lectio, user) {
        return db.collection('users').doc(user.email).collection('lectios').doc(`lectio-${lectio.createdAt}`).set(lectio)
        // return Api().post('lectios', lectio)
    },
    getAllLectios (user) {
        let docRef = db.collection('users').doc(user.email).collection('lectios').orderBy('createdAt')
        return docRef.get()

        // return Api().get('lectios', {
        //     params: {
        //         page: page,
        //         pageSize: pageSize
        //     }
        // })
    },
    getLectioByCreatedDate (user, date) {
        let docRef = db.collection('users').doc(user.email).collection('lectios').where('createdAt', '==', date)
        return docRef.get()
    },
    getSaintsByDate (date) {
        return Api().get('saints', {
            params: {
                date: date
            }
        })
    },
    getSaintById (id) {
        return Api().get(`saints/${id}`)
    }
}
