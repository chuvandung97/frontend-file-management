import Vue from 'vue'
import Vuex from 'vuex'
import { moduleUser } from './modules/user'

Vue.use(Vuex)

function defaultState() {
  return {
    typeNoti: null,
    textNoti: null, 
    showNoti: false
  }
}
export default new Vuex.Store({
  state: defaultState(),
  mutations: {
    setNoti(state, payload) {
      state.typeNoti = payload.typeNoti
      state.textNoti = payload.textNoti
      state.showNoti = payload.showNoti
    },

    updateShowNoti(state, payload) {
      state.showNoti = payload
    }
  },
  actions: {

  },
  modules: {
    user: moduleUser,
  }
})
