import Vue from 'vue'
import Keycloak from 'keycloak-js'
import CONFIG from '@/configs/config'
import store from '@/store'

const options = {
  url: CONFIG.KEYCLOAK_OPTS_URL,
  realm: CONFIG.KEYCLOAK_OPTS_REALM,
  clientId: CONFIG.KEYCLOAK_OPTS_CLIENT_ID
}

const _keycloak = Keycloak(options)

_keycloak.onAuthSuccess = function () {
  console.log('Auth OK.')
  store.dispatch('setLoggedIn', true)
}

_keycloak.onAuthError = function () {
  console.log('Auth Error.')
}

_keycloak.onAuthRefreshSuccess = function () {
  console.log('Auth Refresh OK.')
}

_keycloak.onAuthRefreshError = function () {
  console.log('Auth Refresh Error.')
}

_keycloak.onAuthLogout = function () {
  console.log('Auth Logged Out.')
  store.dispatch('setLoggedIn', false)
  store.dispatch('startConnectWalletProcess', true)
}

const KeycloakJs = {
  install (Vue) {
    Vue.$keycloak = _keycloak
  }
}

KeycloakJs.install = Vue => {
  Vue.$keycloak = _keycloak
  Object.defineProperties(Vue.prototype, {
    $keycloak: {
      get () {
        return _keycloak
      }
    }
  })
}

Vue.use(KeycloakJs)

export default KeycloakJs

export function createNewKeycloak () {
  return Keycloak(options)
}
