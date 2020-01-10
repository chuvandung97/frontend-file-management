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
      activeRename: false,
      activeDownload: false,
      activeDelete: false,
      activeMove: false,
      activeShare: false,
      activeUpload: false,
      activeVersionManagement: false,
      activeUpdateStar: false
    },
    searchIndexDrive: {
      selectId: null,
      selectType: null
    },
    breadcrumbs: null,
    textOptionBarForSearch: false,
    optionShowVersionManagement: false, //hiển thị nút quản lý phiên bản 
    optionChangeStar: false //thay đổi trạng thái sao (thêm/ xóa bỏ)
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
    setRename(state, payload) {
      state.optionBar.activeRename = payload
    },
    setDownload(state, payload) {
      state.optionBar.activeDownload = payload
    },
    setDelete(state, payload) {
      state.optionBar.activeDelete = payload
    },
    setMove(state, payload) {
      state.optionBar.activeMove = payload
    },
    setShare(state, payload) {
      state.optionBar.activeShare = payload
    },
    setUpload(state, payload) {
      state.optionBar.activeUpload = payload
    },
    setVersionManagement(state, payload) {
      state.optionBar.activeVersionManagement = payload
    },
    setUpdateStar(state, payload) {
      state.optionBar.activeUpdateStar = payload
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
    },
    setShowVersionManagement(state, payload) {
      state.optionShowVersionManagement = payload
    },
    setChangeStar(state, payload) {
      state.optionChangeStar = payload
    }
  },
  actions: {

  },
  modules: {
    user: moduleUser,
  }
})
