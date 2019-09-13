const axios = require('axios')
const moment = require('moment')
const config = require('../config/config')

module.exports = {
  async getReadings (req, res) {
    let today = moment().format('YYYY-MM-DD')
    try {
      let readings = await axios.get(config.apiConfig.baseUrl + 'days/' + today)
      console.log(readings.data)
      res.send(readings.data)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        err: 'an error has occured trying to fetch the bookmark'
      })
    }
  }
}
