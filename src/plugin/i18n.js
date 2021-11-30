// i18n-setup.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'

Vue.use(VueI18n)
const i18n = new VueI18n({
  fallbackLocale: 'en',
  silentTranslationWarn: true
})

export default i18n

const loadedLanguages = [] // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }
  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }
  // let language = _.find(store.getters.configs.languages, { code: lang }) || {}
  lang = lang || 'en'

  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }
  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }
  // let language = _.find(store.getters.configs.languages, { code: lang }) || {}
  lang = lang || 'en'
  // let url = `${window.location.origin}/assets/lang/translations/${lang}.json`
  // If the language hasn't been loaded yet
  return import(`@/lang/translations/${lang}.json`).then(messages => {
    i18n.setLocaleMessage(lang, messages)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}
