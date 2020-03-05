import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    // Use if do not need to persist a state
    // createPersistedState({
    //   reducer: (persistedState) => {
    //     const stateFilter = Object.assign({}, persistedState)
    //     const blackList = ['lectioDivina']

    //     blackList.forEach((item) => {
    //       delete stateFilter[item]
    //     })

    //     return stateFilter
    //   }
    // })
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    readings: null,
    evgDetails: null,
    saints: null,
    lectioDivina: {
      lectioText: null,
      meditatioText: null,
      oratioText: null,
      actioText: null,
      actioReminder: null
    },
    lectioArchive: null,
    allMortifications: [],
    weeklyMortifications: {},
    isUserLoggedIn: false,
    history: 0,
    expiryDate: null,
    interfaceColor: false,
    isLoadingData: true
  },
  getters: {
    isExpired: state => (new Date(state.expiryDate) < new Date()),
    getWeeklyMortifications: state => state.weeklyMortifications,
    getAllMortifications: state => state.allMortifications
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
    setSaints (state, saints) {
      state.saints = saints
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
    setLectioArchive (state, lectioArchiveParams) {
      if (lectioArchiveParams.letPush) {
        state.lectioArchive.push(lectioArchiveParams.lectioArchive)
      } else {
        state.lectioArchive = lectioArchiveParams.lectioArchive
      }
    },
    setWeeklyMortifications (state, weeklyMortifications) {
      state.weeklyMortifications = weeklyMortifications
    },
    setAllMortifications (state, allMortifications) {
      state.allMortifications = allMortifications
    },
    setHistory (state, history) {
      state.history = history
    },
    setExpiryDate (state) {
      // Create a date
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      // Add your delta for expiry. I am expiring in one day.
      date.setDate(date.getDate() + 1)
      // Set the state
      state.expiryDate = date
    },
    resetExpiryDate (state, date) {
      state.expiryDate = date
    },
    setInterfaceColor (state, color) {
      state.interfaceColor = color
    },
    setIsLoadingData (state, loading) {
      state.isLoadingData = loading
    }
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
    setSaints ({ commit }, saints) {
      commit('setSaints', saints)
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
    setLectioArchive ({ commit }, lectioArchiveParams) {
      commit('setLectioArchive', lectioArchiveParams)
    },
    setWeeklyMortifications ({ commit }, weeklyMortifications) {
      commit('setWeeklyMortifications', weeklyMortifications)
    },
    setAllMortifications ({ commit }, allMortifications) {
      commit('setAllMortifications', allMortifications)
    },
    setHistory ({ commit }, history) {
      commit('setHistory', history)
    },
    setExpiryDate ({ commit }) {
      commit('setExpiryDate')
    },
    resetExpiryDate ({ commit }, date) {
      commit('resetExpiryDate', date)
    },
    setInterfaceColor ({ commit }, color) {
      commit('setInterfaceColor', color)
    },
    setIsLoadingData ({ commit }, loading) {
      commit('setIsLoadingData', loading)
    },
  }
})
