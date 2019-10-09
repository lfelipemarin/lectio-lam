import Api from '@/services/Api'
const firebase = require("firebase/app")
// Required for side-effects
require("firebase/firestore")
const db = firebase.firestore()

export default {
    getTodaysGospel () {
        // let today = moment().format('YYYY-MM-DD')
        return Api().get('readings')
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
