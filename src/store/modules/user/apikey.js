/* eslint-disable no-unused-expressions */
import ApiKeyService from '@/api/user/ApiKeyService'
import UtilService from '../../../utils/UtilService'

var actions = {
  // functions SET
  setApiSecretKey ({ commit }, key) {
    commit('SET_SECRET_KEY', key)
  },
  setCurrentApiKey ({ commit }, data) {
    return new Promise(resolve => {
      commit('SET_CURRENT_API_KEY', data)
      resolve(true)
    })
  },
  // functions GET
  getApiPermissions ({ commit }) {
    return new Promise(async resolve => {
      var res = await ApiKeyService.getApiPermissions()
      var permission = res.data || {}
      commit('SET_API_PERMISSIONS', permission)
      resolve(permission)
    })
  },
  getApiKeys ({ commit }) {
    return new Promise(async resolve => {
      var res = await ApiKeyService.getApiKeys()
      let result = UtilService.transformApiKeys(res.data)
      commit('SET_API_KEYS', result)
      resolve(result)
    })
  }
}

export default { actions }
