import Api from '@/services/Api'

export default {
    sendMail (mail) {
        return Api().post('mail', mail, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}