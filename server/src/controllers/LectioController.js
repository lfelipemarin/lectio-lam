const axios = require('axios')
const moment = require('moment')
const config = require('../config/config')
const { Lectio } = require('../models')

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
        err: 'an error has occured trying to fetch the readings'
      })
    }
  },
  async saveLectio (req, res) {
    try {
      const song = await Lectio.create(req.body)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the lectio'
      })
    }
  }
}
