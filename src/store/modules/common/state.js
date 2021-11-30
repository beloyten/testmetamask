const state = {
  paging: {
    totalPage: 0
  },
  pagination: {},
  googleRecaptchaKey: '',
  configs: {},
  themeMode: null,
  currentLang: null,
  ggKey: {},
  showSubMenu: false
}

const getters = {
  paging: state => state.paging,
  pagination: state => state.pagination,
  googleRecaptchaKey: state => state.googleRecaptchaKey,
  configs: state => state.configs,
  themeMode: state => state.themeMode,
  currentLang: state => state.currentLang,
  ggKey: state => state.ggKey,
  showSubMenu: state => state.showSubMenu
}

const mutations = {
  SET_PAGING: (state, data) => {
    state.paging = data
  },
  SET_PAGINATION: (state, data) => {
    state.pagination = data
  },
  SET_CURRENT_LANG (state, val) {
    state.currentLang = val
  },
  SET_GG_KEY (state, val) {
    state.googleKey = val
  },
  SET_THEME_MODE: (state, mode) => {
    state.themeMode = mode
  },
  SET_SYS_CONFIG: (state, data) => {
    state.configs = data
    state.googleRecaptchaKey = data.googleReCaptchaKey
  },
  SET_GGKEY: (state, data) => {
    state.ggKey = data
  },
  TOGGLE_SHOW_SUBMENU: (state) => {
    state.showSubMenu = !state.showSubMenu
  },
  SET_SUBMENU: (state, data) => {
    state.showSubMenu = data
  }
}

export default { state, getters, mutations }
