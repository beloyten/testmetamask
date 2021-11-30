import LocalStorage from '@/utils/LocalStorage'
import CONSTANT from '@/configs/constant'

var state = {
  user: {},
  activities: [],
  resetToken: '',
  images: {
    nationalIdSelfieImage: '',
    nationalIdImage: '',
    nationalIdImage2: ''
  },
  isLoggedIn: LocalStorage.getItem(CONSTANT.IS_LOGGED) || !1,
  jwt: LocalStorage.getToken() || null,
  apiPermissions: [],
  apiKeys: [],
  secretObj: {
    publicKey: '',
    secretKey: ''
  },
  currentApiKey: {
    permissions: []
  },
  tempEmail: '',
  needToWaitApp: true
}

var getters = {
  user: state => state.user,
  activities: state => state.activities,
  resetToken: state => state.resetToken,
  apiPermissions: state => state.apiPermissions,
  apiKeys: state => state.apiKeys,
  secretObj: state => state.secretObj,
  currentApiKey: state => state.currentApiKey,
  images: state => state.images,
  isLoggedIn: state => state.isLoggedIn,
  jwt: state => state.jwt,
  tempEmail: state => state.tempEmail,
  needToWaitApp: state => state.needToWaitApp
}

var mutations = {
  SET_USER: (state, data) => { state.user = data },
  SET_ACTIVITIES: (state, data) => { state.activities = data },
  SET_RESET_TOKEN: (state, data) => { state.resetToken = data },
  SET_API_PERMISSIONS: (state, data) => { state.apiPermissions = data },
  SET_API_KEYS: (state, data) => { state.apiKeys = data },
  SET_SECRET_KEY: (state, data) => { state.secretObj = data },
  SET_CURRENT_API_KEY: (state, data) => { state.currentApiKey = data },
  SET_TICKET_IMAGE: (state, data) => { data && (state.images[data.key] = data.base64Img) },
  SET_LOGGED_IN: (state, isLoggedIn) => { state.isLoggedIn = isLoggedIn },
  SET_JWT: (state, jwt) => { state.jwt = jwt },
  SET_TEMP_EMAIL: (state, email) => { state.tempEmail = email },
  SET_NEED_TO_WAIT_APP: (state, isNeedWait) => { state.needToWaitApp = isNeedWait }
}

export default { state, getters, mutations }
