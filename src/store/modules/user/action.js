/* eslint-disable no-unused-expressions */
import AuthService from '@/api/user/AuthService'
import UserService from '@/api/user/UserService'
import LocalStorage from '@/utils/LocalStorage'
import CONSTANT from '@/configs/constant'
import router from '@/router'

var actions = {
  // function SET
  setJwt ({ commit }, jwt) {
    // LocalStorage.setToken(jwt)
    commit('SET_JWT', jwt)
  },
  setLoggedIn ({ commit }, isLoggedIn) {
    // LocalStorage.setItem(CONSTANT.IS_LOGGED, isLoggedIn)
    commit('SET_LOGGED_IN', isLoggedIn)
  },
  setImages ({ commit }, data) {
    commit('SET_TICKET_IMAGE', data)
  },
  setNeedToWaitApp ({ commit }, data) {
    commit('SET_NEED_TO_WAIT_APP', data)
  },
  // functions POST
  refreshToken (context) {
    return new Promise(async resolve => {
      let tokenObj = LocalStorage.getToken() || {}
      let isValid = tokenObj && tokenObj.accessToken && tokenObj.refreshToken
      if (!isValid) {
        context.dispatch('setUser', {})
        LocalStorage.removeToken()
        router.push({ name: 'home' })
        resolve(true)
        return
      }
      var res = await AuthService.refreshToken(tokenObj)
      var jwt = res.data || false
      if (res.status === CONSTANT.SUCCESS) {
        context.dispatch('setJwt', jwt)
        window.location.reload()
      } else {
        context.dispatch('setUser', {})
        LocalStorage.removeToken()
        router.push({ name: 'home' })
      }
      resolve(jwt)
    })
  },
  verifyWalletAddrx (context, addrx) {
    return new Promise(async resolve => {
      var res = await AuthService.verifyWalletAddress({ addrx: addrx })
      if (res.status === CONSTANT.SUCCESS) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
  },
  registerAccount (context, formData) {
    return new Promise(async resolve => {
      this._vm.$google.getCaptcha('registerAccount').then(async token => {
        formData.reCaptcha = token
        var res = await AuthService.registerNewUser(formData)
        if (res.status === CONSTANT.SUCCESS) {
          resolve(res)
        } else {
          resolve(false)
        }
      })
    })
  },
  loginSSO (context, loginForm) {
    return new Promise(resolve => {
      this._vm.$google.getCaptcha('loginSSO').then(async token => {
        loginForm.reCaptcha = token
        var res = await AuthService.loginSSO(loginForm)
        if (res.status === CONSTANT.SUCCESS) {
          context.dispatch('setJwt', res.data)
          resolve(res)
        } else resolve(false)
      })
    })
  },
  logOut (context) {
    return new Promise(async resolve => {
      context.dispatch('setJwt', null)
      LocalStorage.removeToken()
      resolve(true)
    })
  },
  sendVerificationCode (context, formVerifyCode) {
    return new Promise(async resolve => {
      let isAuthenticated = this.getters.jwt && this.getters.jwt.accessToken
      console.log(isAuthenticated, 'send code verification with check authen or not')
      var token = await this._vm.$google.getCaptcha('sendVerificationCode')
      formVerifyCode.reCaptcha = token
      var res = isAuthenticated
        ? await UserService.sendVerificationCode(formVerifyCode)
        : await AuthService.sendVerificationCode(formVerifyCode)
      res && res.status === CONSTANT.SUCCESS
        ? (context.dispatch('setLoggedIn', true), resolve(true))
        : resolve(false)
    })
  },
  confirmSecurity (__, data) {
    return new Promise(async resolve => {
      let isAuthenticated = this.getters.jwt && this.getters.jwt.accessToken
      var token = await this._vm.$google.getCaptcha('confirmSecurity')
      data.reCaptcha = token
      var res = isAuthenticated
        ? await UserService.confirmSecurity(data)
        : await AuthService.checkVerificationCode(data)
      var confirmed = res.data || res.status === CONSTANT.SUCCESS
      resolve(confirmed)
    })
  },
  switchUser (context, loginForm) {
    return new Promise(async resolve => {
      var token = await this._vm.$google.getCaptcha('switchUser')
      token && (loginForm.reCaptcha = token)
      var res = await AuthService.switchUser(loginForm)
      if (res && res.status === CONSTANT.SUCCESS) {
        var jwt = res.data
        context.dispatch('setJwt', jwt)
        resolve(jwt)
      } else resolve(false)
    })
  },
  forceLogout (context) {
    LocalStorage.removeToken()
    router.push({ name: 'home' })
  },
  resendActivationCode (__, email) {
    return new Promise(async resolve => {
      var reCaptcha = await this._vm.$google.getCaptcha('resendActivationCode')
      let data = {
        reCaptcha: reCaptcha,
        email: email
      }
      AuthService.resendActivationCode(data)
      resolve()
    })
  },
  oauthCheckToken (context, token) {
    return new Promise(async (resolve, reject) => {
      var headers = { 'Authorization': 'Bearer ' + token }
      var res = await AuthService.checkToken(headers)
      if (res.status === CONSTANT.SUCCESS) {
        resolve(true)
      } else {
        reject(res.status)
      }
    })
  },
  oauthGetToken (context, requestForm) {
    return new Promise(async (resolve, reject) => {
      var res = await AuthService.getJwtToken(requestForm)
      if (res.status === CONSTANT.SUCCESS) {
        // context.dispatch('setJwt', res.data)
        resolve(true)
      } else {
        reject(res.status)
      }
    })
  }
}

export default { actions }
