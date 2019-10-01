import Api from '@/services/Api'

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
    saveLectio (lectio) {
        return Api().post('lectios', lectio)
    },
    getAllLectios (page, pageSize) {
        return Api().get('lectios', {
            params: {
                page: page,
                pageSize: pageSize
            }
        })
    }
}
