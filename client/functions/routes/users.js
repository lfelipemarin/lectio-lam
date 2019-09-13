var express = require('express');
var router = express.Router();
let config = require('../conf')
let moment = require('moment')
let axios = require('axios')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let today = moment().format('YYYY-MM-DD')
  try {
    let resp = await axios.get(config.apiConfig.baseUrl + 'days/' + today)
    console.log(resp.data)
    res.send(resp.data);
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
