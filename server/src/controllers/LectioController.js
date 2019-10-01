const axios = require('axios')
const moment = require('moment')
const config = require('../config/config')
const { Lectio } = require('../models')
const dbHelper = require('../helpers/dbHelper')

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
  async getDateReadings (req, res) {
    try {
      let readings = await axios.get('http://feed.evangelizo.org/v2/reader.php', {
        params: { date: req.query.date, lang: req.query.lang, type: req.query.type }
      })
      res.send(readings.data)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        err: 'an error has occured trying to fetch the readings'
      })
    }
  },
  async getSaintsByDate (req, res) {
    let day = moment(req.query.date).format('DD')
    let month = moment(req.query.date).format('MM')
    try {
      let saints = await axios.get(config.apiConfig.baseUrl + 'saints', {
        params: { day: day, month: month }
      })
      console.log(saints.data)
      res.send(saints.data)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        err: 'an error has occured trying to fetch the saints'
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
      let page = req.query.page
      let pageSize = req.query.pageSize
      const lectios = await Lectio.findAll(
        dbHelper.paginate(
          {
            where: where
          },
          { page, pageSize }
        )
      ).map(lectio => lectio.toJSON())
      res.send(lectios)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the lectios'
      })
    }
  }
}
