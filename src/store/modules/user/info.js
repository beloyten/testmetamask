/* eslint-disable no-unused-expressions */
import UserService from '@/api/user/UserService'
import Vue from 'vue'
// import LocalStorage from '@/utils/LocalStorage'
import UtilService from '@/utils/UtilService'

var actions = {
  // functions SET
  setTempEmail ({ commit }, email) {
    commit('SET_TEMP_EMAIL', email)
  },
  setUser ({ commit }, data) {
    commit('SET_USER', data)
  },
  setResetToken ({ commit }, token) {
    commit('SET_RESET_TOKEN', token)
  },
  // functions GET
  getUser ({ commit }) {
    return new Promise(async resolve => {
      // let tokenObj = LocalStorage.getToken() || {}
      // if (tokenObj.accessToken) {
      var user = {}
      if (Vue.$keycloak.authenticated && Vue.$keycloak.token) {
        var res = await UserService.getUser()
        user = res.data || {}
        commit('SET_USER', user)
      } else {
        commit('SET_USER', {})
      }

      resolve(user)
    })
  },
  getUserActivity ({ commit }, query) {
    return new Promise(async resolve => {
      var res = await UserService.getUserActivity(query)
      var list = UtilService.transformActivities(res.data || [])
      commit('SET_ACTIVITIES', list)
      resolve(list)
    })
  },
  checkReferral (__, data) {
    return new Promise(async resolve => {
      var res = await UserService.checkReferral(data)
      resolve(res.data || false)
    })
  }
}

export default { actions }
