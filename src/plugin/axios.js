import axios from 'axios'
import Vue from 'vue'
import i18n from '@/plugin/i18n'
import store from '@/store/index'
import CONSTANT from '@/configs/constant'
import UtilService from '@/utils/UtilService'
import CONFIG from '@/configs/config'

// create an axios instance
const http = axios.create({
})
export default http

http.interceptors.request.use(
  async config => {
    // Do something before request is sent
    if (Vue.$keycloak.token) {
      await Vue.$keycloak.updateToken(15)
        .then(() => {
          let publicApis = CONSTANT.PUBLIC_API
          let isPublicApi = publicApis.some(api => config.url.indexOf(api) !== -1)
          if (!isPublicApi) config.headers['Authorization'] = 'Bearer ' + Vue.$keycloak.token
        })
        .catch(() => {
          // Vue.$keycloak.login()
          store.dispatch('startConnectWalletProcess', true)
        })
    }
    let JCookieId = UtilService.getCookie('JSESSIONID')
    JCookieId && (config.headers['JCookieId'] = JCookieId)
    if (config.url.indexOf(CONFIG.BASE_URL_OAUTH) !== -1) {
      config.withCredentials = true
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
    }
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)
// let isRefreshRequestPending = false
http.interceptors.response.use(
  response => {
    var data = response.data
    if (!data.status) return data
    var storeAction = data.status.toLowerCase() === CONSTANT.SUCCESS.toLowerCase() ? 'showSuccessMsg' : 'showErrorMsg'
    data && data.message && store.dispatch(storeAction, i18n.t(data.message))
    return data
  },
  async error => {
    // Refresh token
    let rs = error.response
    if (rs && rs.status === CONSTANT.UNAUTHORIZED_CODE) {
      store.dispatch('logOut')
      // OidcService.signinRedirect()
    } else if (rs && rs.status === CONSTANT.INVALID_TOKEN) {
      store.dispatch('logOut')
      // OidcService.signinRedirect()
    } else if (rs && rs.status === CONSTANT.INVALID_ROLE) {
      store.dispatch('showErrorMsg', i18n.t('MSG_NOT_HAVE_PERMISSION'))
      return Promise.resolve(rs)
    } else if (rs && rs.config && rs.config.params && (rs.config.params.isLanguageRequest)) {
      console.log('can not load json file, use default language')
      return Promise.resolve(rs.data)
    }
    return Promise.reject(error)
  }
)
