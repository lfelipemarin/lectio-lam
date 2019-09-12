import axios from 'axios'
import config from '../conf'
// let moment = require('moment')

export default {
    getTodaysGospel () {
        // let today = moment().format('YYYY-MM-DD')
        return axios.get(config.apiConfig.baseUrl + 'users')
    }
}