const axios = require('axios');
// const moment = require('moment')
const config = require('../config/config');
const { Lectio } = require('../models');
const dbHelper = require('../helpers/dbHelper');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports = {
  async getReadings(req, res) {
    let today = req.query.date;
    try {
      let readings = await axios.get(`${config.apiConfig.baseUrl}days/${today}?include=readings,commentary`, {
        httpsAgent: agent,
      });
      res.send(readings.data);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        err: 'an error has occured trying to fetch the readings',
      });
    }
  },
  async getDateReadings(req, res) {
    try {
      let readings = await axios.get('http://feed.evangelizo.org/v2/reader.php', {
        params: {
          date: req.query.date,
          lang: req.query.lang,
          type: req.query.type,
        },
        httpsAgent: agent,
      });
      res.send(readings.data);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        err: 'an error has occured trying to fetch the readings',
      });
    }
  },
  async getSaintsByDate(req, res) {
    let day = req.query.day;
    let month = req.query.month;
    try {
      let saints = await axios.get(config.apiConfig.baseUrl + 'saints', {
        params: { day: day, month: month },
        httpsAgent: agent,
      });
      res.send(saints.data);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        err: 'an error has occured trying to fetch the saints',
      });
    }
  },
  async getSaintById(req, res) {
    let id = req.params.id;
    try {
      let saint = await axios.get(`${config.apiConfig.baseUrl}saints/${id}`, {
        httpsAgent: agent,
      });
      res.send(saint.data);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        err: 'an error has occured trying to fetch the saints',
      });
    }
  },
  async saveLectio(req, res) {
    try {
      const lectio = await Lectio.create(req.body);
      res.send(lectio);
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the lectio',
      });
    }
  },
  async getAllLectios(req, res) {
    try {
      const userId = req.user.id;
      const where = {
        UserId: userId,
      };
      let page = req.query.page;
      let pageSize = req.query.pageSize;
      const lectios = await Lectio.findAll(
        dbHelper.paginate(
          {
            where: where,
          },
          { page, pageSize }
        )
      ).map(lectio => lectio.toJSON());
      res.send(lectios);
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the lectios',
      });
    }
  },
};
