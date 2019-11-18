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
    updateLectio (lectio, user, value) {
        return db.collection('users').doc(user.email).collection('lectios').doc(`lectio-${lectio.createdAt}`).update(value)
    },
    getAllLectios (user) {
        let docRef = db.collection('users').doc(user.email).collection('lectios')
        return docRef.get()
    },
    getLectioByCreatedDate (user, date) {
        let docRef = db.collection('users').doc(user.email).collection('lectios').where('createdAt', '==', date)
        return docRef
    },
    getSaintsByDate (month, day) {
        return Api().get('saints', {
            params: {
                month: month,
                day: day
            }
        })
    },
    getSaintById (id) {
        return Api().get(`saints/${id}`)
    },
    getAllFavoriteReadings (user) {
        let docRef = db.collection('users').doc(user.email).collection('favorite-readings')
        return docRef
    },
    saveFavoriteReading (reading, user) {
        return db.collection('users').doc(user.email).collection('favorite-readings').doc(`${reading.id}`).set(reading)
    },
    deleteFavoriteReading (reading, user) {
        return db.collection('users').doc(user.email).collection('favorite-readings').doc(`${reading.id}`).delete()
    },
    getAllFavoriteSaints (user) {
        let docRef = db.collection('users').doc(user.email).collection('favorite-saints')
        return docRef
    },
    saveFavoriteSaint (saint, user) {
        return db.collection('users').doc(user.email).collection('favorite-saints').doc(`${saint.id}`).set(saint)
    },
    deleteFavoriteSaint (saint, user) {
        return db.collection('users').doc(user.email).collection('favorite-saints').doc(`${saint.id}`).delete()
    }

}
