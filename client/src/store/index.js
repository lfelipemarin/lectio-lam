import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState({
      reducer: (persistedState) => {
        const stateFilter = Object.assign({}, persistedState)
        const blackList = ['lectioDivina']

        blackList.forEach((item) => {
          delete stateFilter[item]
        })

        return stateFilter
      }
    })
  ],
  state: {
    token: null,
    user: null,
    readings: null,
    evgDetails: null,
    lectioDivina: {
      lectioText: null,
      meditatioText: null,
      oratioText: null,
      actioText: null,
      actioReminder: null
    },
    lectioArchive:null,
    isUserLoggedIn: false,
    history: 0,
    expiryDate: null
  },
  getters: {
    isExpired: state => (new Date(state.expiryDate) < new Date())
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
    },
    setReadings (state, readings) {
      state.readings = readings
    },
    setEvgDetails (state, evgDetails) {
      state.evgDetails = evgDetails
    },
    setLectioText (state, lectioText) {
      state.lectioDivina.lectioText = lectioText
    },
    setMeditatioText (state, meditatioText) {
      state.lectioDivina.meditatioText = meditatioText
    },
    setOratioText (state, oratioText) {
      state.lectioDivina.oratioText = oratioText
    },
    setActioText (state, actioText) {
      state.lectioDivina.actioText = actioText
    },
    setActioReminder (state, actioReminder) {
      state.lectioDivina.actioReminder = actioReminder
    },
    setLectioArchive (state, lectioArchive) {
      state.lectioArchive = lectioArchive
    },
    setHistory (state, history) {
      state.history = history
    },
    setExpiryDate (state) {
      // Create a date
      let date = new Date()
      // Add your delta for expiry. I am expiring in one day.
      date.setDate(date.getDate() + 1)
      // Set the state
      state.expiryDate = date
    },
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setReadings ({ commit }, readings) {
      commit('setReadings', readings)
    },
    setEvgDetails ({ commit }, evgDetails) {
      commit('setEvgDetails', evgDetails)
    },
    setLectioText ({ commit }, lectioText) {
      commit('setLectioText', lectioText)
    },
    setMeditatioText ({ commit }, meditatioText) {
      commit('setMeditatioText', meditatioText)
    },
    setOratioText ({ commit }, oratioText) {
      commit('setOratioText', oratioText)
    },
    setActioText ({ commit }, actioText) {
      commit('setActioText', actioText)
    },
    setActioReminder ({ commit }, actioReminder) {
      commit('setActioReminder', actioReminder)
    },
    setLectioArchive ({ commit }, lectioArchive) {
      commit('setLectioArchive', lectioArchive)
    },
    setHistory ({ commit }, history) {
      commit('setHistory', history)
    },
    setExpiryDate ({ commit }) {
      commit('setExpiryDate')
    },
  }
})
