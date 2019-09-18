import Api from '@/services/Api'

export default {
    getTodaysGospel () {
        // let today = moment().format('YYYY-MM-DD')
        return Api().get('readings')
    },
    saveLectio (lectio) {
        return Api().post('lectios', lectio)
    },
    getAllLectios (userId) {
        return Api().get('lectios', userId)
    }

}
