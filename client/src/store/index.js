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
    lectioDivina: {
      lectioText: null,
      meditatioText: null,
      oratioText: null,
      contemplatioText: null,
    },
    isUserLoggedIn: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
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
    setContemplatioText (state, contemplatioText) {
      state.lectioDivina.contemplatioText = contemplatioText
    },
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
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
    setContemplatioText ({ commit }, contemplatioText) {
      commit('setContemplatioText', contemplatioText)
    },
  }
})
