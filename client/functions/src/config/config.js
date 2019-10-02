const path = require('path')

module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'lectioDb',
    user: process.env.DB_USER || 'lectioDb',
    password: process.env.DB_PASS || 'lectioDb',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: path.resolve(__dirname, '../../lectioDb.sqlite')
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  },
  apiConfig: {
    baseUrl: 'https://publication.evangelizo.ws/SP/'
  }
}
