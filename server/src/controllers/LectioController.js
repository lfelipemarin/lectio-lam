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
      const lectio = await Lectio.create(req.body)
      res.send(lectio)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the lectio'
      })
    }
  },
  async getAllLectios (req, res) {
    try {
      const userId = req.user.id
      const where = {
        UserId: userId
      }
      const lectios = await Lectio.findAll({
        where: where
      }).map(lectio => lectio.toJSON())
      res.send(lectios)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the lectios'
      })
    }
  }
}
