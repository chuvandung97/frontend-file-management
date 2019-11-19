import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: null
  },
  mutations: {
    setDrawer(state, payload) {
      state.drawer = payload
    }
  },
  actions: {

  }
})
