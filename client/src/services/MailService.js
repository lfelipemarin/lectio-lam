import Api from '@/services/Api'

export default {
    sendMail (from, subject, text) {
        let data = { from: from, subject: subject, text: text }
        return Api().post('mail', data)
    }
}