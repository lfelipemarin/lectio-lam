import Api from '@/services/Api'

export default {
    register (credentials) {
        return Api().post('register', credentials)
    },
    login (credentials) {
        return Api().post('login', credentials)
    },
    getTodaysGospel () {
        // let today = moment().format('YYYY-MM-DD')
        return Api().get('readings')
    }
}
