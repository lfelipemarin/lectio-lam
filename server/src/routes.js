const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
// const SongsController = require('./controllers/SongsController')
const BookmarksController = require('./controllers/BookmarksController')
// const HistoriesController = require('./controllers/HistoriesController')
const LectioController = require('./controllers/LectioController')

const isAuthenticated = require('./policies/isAuthenticated')

module.exports = (app) => {
  // Registration & Login
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login',
    AuthenticationController.login)

  // app.get('/songs',
  //   SongsController.index)
  // app.get('/songs/:songId',
  //   SongsController.show)
  // app.put('/songs/:songId',
  //   SongsController.put)
  // app.post('/songs',
  //   SongsController.post)

  // Bookmarks
  app.get('/bookmarks',
    isAuthenticated,
    BookmarksController.index)
  app.post('/bookmarks',
    isAuthenticated,
    BookmarksController.post)
  app.delete('/bookmarks/:bookmarkId',
    isAuthenticated,
    BookmarksController.remove)

  // app.get('/histories',
  //   isAuthenticated,
  //   HistoriesController.index)
  // app.post('/histories',
  //   isAuthenticated,
  //   HistoriesController.post)
  app.get('/readings',
    LectioController.getReadings)
  app.get('/date-readings',
    LectioController.getDateReadings)
  app.get('/saints',
    LectioController.getSaintsByDate)
  app.get('/saints/:id',
    LectioController.getSaintById)

  // Lectio
  app.post('/lectios',
    LectioController.saveLectio)
  app.get('/lectios',
    LectioController.getAllLectios)
}
