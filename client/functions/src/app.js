const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
// const { sequelize } = require('./models')
const config = require('./config/config')
const functions = require('firebase-functions')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./passport')

require('./routes')(app)

// sequelize.sync({ force: false })
//   .then(() => {
//     app.listen(config.port)
//     console.log(`Server started on port ${config.port}`)
//   })

app.listen(config.port)
console.log(`Server started on port ${config.port}`)

// For google functions
// const api = functions.https.onRequest(app)

// exports.widgets = api
