import CONSTANT from '@/configs/constant'
import LocalStorage from '@/utils/LocalStorage'
const actions = {
  setPagination ({ commit }, data) {
    commit('SET_PAGINATION', data || {})
  },
  setPagingByClick ({ commit }, data) {
    commit('SET_PAGING', data)
  },
  initThemMode ({ commit }) {
    var mode = (LocalStorage.getItem(CONSTANT.THEME) || 'false') === 'true'
    commit('SET_THEME_MODE', mode)
  },
  setThemeMode ({ commit }, mode) {
    LocalStorage.setItem(CONSTANT.THEME, mode)
    commit('SET_THEME_MODE', mode)
  },
  setGoogleKey ({ commit }, key) {
    commit('SET_GG_KEY', key)
  },
  showSuccessMsg (__, message) {
    this._vm.$notify.success({ message: message, duration: 1800 })
  },
  showErrorMsg (__, message) {
    this._vm.$notify.error({ message: message, duration: 1800 })
  },
  toggleShowSubMenu ({ commit }) {
    commit('TOGGLE_SHOW_SUBMENU')
  },
  setShowSubMenu ({ commit }, data) {
    commit('SET_SUBMENU', data)
  }
}

export default { actions }
