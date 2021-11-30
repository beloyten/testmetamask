/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import i18n, { loadLanguageAsync } from '@/plugin/i18n'
import LocalStorage from '@/utils/LocalStorage'
import ConfigService from '@/api/common/ConfigService'
import router from '@/router'
import _ from 'lodash'

const actions = {
  getSystemConfigs ({ commit }) {
    return new Promise(async resolve => {
      var resConfigs = await ConfigService.getConfig()
      var languages = (resConfigs && resConfigs.data && resConfigs.data.languages) || []
      var lang = _.find(languages, { isDefault: 1 })
      var langDefault = (lang && lang.code) || ((languages[0] && languages[0].code) || 'en')
      var cacheLang = LocalStorage.getItem('language')
      cacheLang = _.find(languages, { code: cacheLang }) ? cacheLang : langDefault, LocalStorage.setItem('language', langDefault)
      var defaultLang = cacheLang || langDefault
      commit('SET_SYS_CONFIG', resConfigs.data)
      await loadLanguageAsync(defaultLang)
      commit('SET_CURRENT_LANG', defaultLang)
      // Set title with reload page, handle after load language
      let currentRoute = router.currentRoute
      let title = (this.getters.configs && this.getters.configs.siteNameOtc) || ''

      if (currentRoute && currentRoute.meta && currentRoute.meta.title) {
        document.title = '' + i18n.t(currentRoute.meta.title) + ' | ' + title
      }
      resolve(resConfigs.data || true)
    })
  },
  getGoogleKey ({ commit }) {
    return new Promise(async resolve => {
      let rs = await ConfigService.getGoogleKey()
      commit('SET_GGKEY', rs.data || {})
      resolve(rs.data || {})
    })
  },
  setLanguage ({ commit }, language) {
    LocalStorage.setItem('language', language)
    loadLanguageAsync(language).then(langKey => {
      commit('SET_CURRENT_LANG', langKey)
    })
  },
  toggleShowSubMenu ({ commit }) {
    commit('TOGGLE_SHOW_SUBMENU')
  },
  setShowSubMenu ({ commit }, showSubMenu) {
    commit('SET_SUBMENU', showSubMenu)
  }
}

export default { actions }
