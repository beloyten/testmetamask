import Vue from 'vue'
import Vuex from 'vuex'
// Common modules
import commonModule from './modules/common/index'
// User modules
import userModule from './modules/user/index'
// Wallet modules
import walletModule from './modules/wallet/index'
// Order modules
import orderModule from './modules/order/index'
// Modals
import modalModule from './modules/modal/index'
// Otc
import otcModule from './modules/otc/index'

Vue.use(Vuex)
// const debug = process.env.NODE_ENV !== 'production'
const debug = false
const store = new Vuex.Store({
  modules: {
    // Common modules
    commonModule,
    // Order modules
    orderModule,
    userModule,
    walletModule,
    // Modal modules
    modalModule,
    // Otc module
    otcModule
  },
  strict: debug
})
export default store
