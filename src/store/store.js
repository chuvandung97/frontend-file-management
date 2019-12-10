import Vue from 'vue'
import Vuex from 'vuex'
import { moduleUser } from './modules/user'

Vue.use(Vuex)

function defaultState() {
  return {
    typeNoti: null,
    textNoti: null, 
    showNoti: false,
    viewFile: true,
    selectedCount: null,
    dialogDeleteTrash: false,
    restoreTrash: false,
    reloadDrive: false
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
    setViewFile(state, payload) {
      state.viewFile = payload.viewFile
    },
    setSelectedTrash(state, payload) {
      state.selectedCount = payload.selectedCount
    },
    setDialogDeleteTrash(state, payload) {
      state.dialogDeleteTrash = payload
    },
    setRestoreTrash(state, payload) {
      state.restoreTrash = payload
    },
    setReloadIndexDrive(state, payload) {
      state.reloadDrive = payload
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
