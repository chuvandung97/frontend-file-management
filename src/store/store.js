import Vue from 'vue'
import Vuex from 'vuex'
import { moduleUser } from './modules/user'

Vue.use(Vuex)

function defaultState() {
  return {
    expandDrawer: true,
    typeNoti: null,
    textNoti: null, 
    showNoti: false,
    viewFile: true,
    selectedCount: null,
    dialogDeleteTrash: false,
    restoreTrash: false,
    reloadDrive: false,
    rolegroup: null,
    showDetail: false,
    optionBar: {
      activeViewDetail: false,
      activeShare: false,
      activeDownload: false,
      activeDelete: false
    },
    searchIndexDrive: {
      selectId: null,
      selectType: null
    },
    breadcrumbs: null,
    textOptionBarForSearch: false
  }
}
export default new Vuex.Store({
  state: defaultState(),
  mutations: {
    setExpandDrawer(state, payload) {
      state.expandDrawer = payload
    },
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
    },
    setRoleGroup(state, payload) {
      state.rolegroup = payload
    },
    setShowDetail(state, payload) {
      state.showDetail = payload
    },
    setViewDetail(state, payload) {
      state.optionBar.activeViewDetail = payload
    },
    setSearchIndexDrive(state, payload) {
      state.searchIndexDrive.selectId = payload.selectId
      state.searchIndexDrive.selectType = payload.selectType
    },
    setBreadcrumbs(state, payload) {
      state.breadcrumbs = payload
    },
    setTextOptionBarForSearch(state, payload) {
      state.textOptionBarForSearch = payload
    }
  },
  actions: {

  },
  modules: {
    user: moduleUser,
  }
})
