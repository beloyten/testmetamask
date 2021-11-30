import OtcService from '@/api/otc/OtcService'
import Constant from '@/configs/constant'
import UtilService from '@/utils/UtilService'
import GateSignalR from '@/utils/GateSignalR'
import CONFIG from '@/configs/config'
import LocalStorage from '@/utils/LocalStorage'
import router from '@/router'
var otcWs = new GateSignalR()

const otc = {
  state: {
    currentOtc: {
      type: '',
      currency: ''
    },
    otcCurrencies: [],
    otcCurrentUsers: [],
    otcCountries: [],
    otcPayments: [],
    otcUserPayments: [],
    otcUnitCurrencies: [],
    otcBalances: [],
    currentOtcBalancePair: [],
    otcBalancesHistory: [],
    otcTransactionHistory: [],
    otcAds: {
      listData: [],
      total: 0
    },
    myAds: {
      listData: [],
      total: 0
    },
    myOrders: {
      listData: [],
      total: 0
    },
    orderDetail: {
      adv: {},
      order: {},
      typeObj: {}
    },
    traderInfo: {
      data: {
        Buy: [],
        Sell: []
      },
      user: {}
    },
    messages: [],
    kycInfo: {},
    followers: [],
    blacklist: [],
    onlineUsers: [],
    otcNotifications: []
  },
  getters: {
    currentOtc: state => state.currentOtc,
    otcCurrencies: state => state.otcCurrencies,
    otcCurrentUsers: state => state.otcCurrentUsers,
    otcCountries: state => state.otcCountries,
    otcUserPayments: state => state.otcUserPayments,
    otcUnitCurrencies: state => state.otcUnitCurrencies,
    otcPayments: state => state.otcPayments,
    otcBalances: state => state.otcBalances,
    currentOtcBalancePair: state => state.currentOtcBalancePair,
    otcBalancesHistory: state => state.otcBalancesHistory,
    otcTransactionHistory: state => state.otcTransactionHistory,
    otcAds: state => state.otcAds,
    myAds: state => state.myAds,
    myOrders: state => state.myOrders,
    orderDetail: state => state.orderDetail,
    traderInfo: state => state.traderInfo,
    messages: state => state.messages,
    kycInfo: state => state.kycInfo,
    followers: state => state.followers,
    blacklist: state => state.blacklist,
    onlineUsers: state => state.onlineUsers,
    otcNotifications: state => state.otcNotifications
  },
  mutations: {
    SET_MESSAGE: (state, data) => {
      state.messages = data
    },
    SET_OTC: (state, data) => {
      state.currentOtc = data
    },
    SET_OTC_CURRENCIES: (state, data) => {
      state.otcCurrencies = data
    },
    SET_OTC_CURRENT_USERS: (state, data) => {
      state.otcCurrentUsers = data
    },
    SET_OTC_COUNTRIES: (state, data) => {
      state.otcCountries = data
    },
    SET_OTC_PAYMENTS: (state, data) => {
      state.otcPayments = data
    },
    SET_OTC_UNIT_CURRENCIES: (state, data) => {
      state.otcUnitCurrencies = data
    },
    SET_OTC_USER_PAYMENTS: (state, data) => {
      state.otcUserPayments = data
    },
    SET_OTC_BALANCES: (state, data) => {
      state.otcBalances = data
    },
    SET_CURRENT_OTC_BALANCE_PAIR: (state, data) => {
      state.currentOtcBalancePair = data
    },
    SET_OTC_BALANCES_HISTORY: (state, data) => {
      state.otcBalancesHistory = data
    },
    SET_OTC_TRANSACTION_HISTORY: (state, data) => {
      state.otcTransactionHistory = data
    },
    SET_OTC_ADS: (state, data) => {
      state.otcAds = data
    },
    SET_MY_ADS: (state, data) => {
      state.myAds = data
    },
    SET_MY_ORDERS: (state, data) => {
      state.myOrders = data
    },
    SET_ORDER_DETAIL: (state, data) => {
      state.orderDetail = data
    },
    SET_TRADER_INFO: (state, data) => {
      state.traderInfo = data
    },
    SET_KYC_INFO: (state, data) => {
      state.kycInfo = data
    },
    SET_FOLLOWERS: (state, data) => {
      state.followers = data
    },
    SET_BLACKLIST: (state, data) => {
      state.blacklist = data
    },
    SET_ONLINE_USERS: (state, data) => {
      state.onlineUsers = data
    },
    ADD_OTC_NOTIFICATIONS: (state, data) => {
      data.notifyType = UtilService.mapOtcNotificationType(data.type)
      state.otcNotifications.unshift(data)
    },
    REMOVE_OTC_NOTIFICATIONS: (state, index) => {
      state.otcNotifications.splice(index, 1)
    }
  },
  actions: {
    async getMessages ({ commit }, orderId) {
      await OtcService.getMessages(orderId).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformMessages(rs.data)
          commit('SET_MESSAGE', result)
        }
      })
    },
    async getTraderInfo ({ commit }, traderId) {
      await OtcService.getTraderInfo(traderId).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformTraderInfo(rs.data)
          commit('SET_TRADER_INFO', result)
        }
      })
    },
    setOrderDetail ({ commit }, order) {
      commit('SET_ORDER_DETAIL', order)
    },
    async getOrder ({ commit }, id) {
      let result = await OtcService.getOrder(id).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformOrder(rs.data)
          commit('SET_ORDER_DETAIL', result)
          return result
        } else {
          let temp = {
            order: {},
            typeObj: {}
          }
          this.$store.dispatch('showErrorMsg', rs.message)
          commit('SET_ORDER_DETAIL', temp)
          return temp
        }
      })
      return result
    },
    async getMyOrders ({ commit }, queryObj) {
      await OtcService.getOrders(queryObj).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformOrders(rs.data)
          commit('SET_MY_ORDERS', result)
          let total = UtilService.buildTotalPage(result.total, queryObj.paging.size)
          let paging = queryObj.paging
          paging.total = total
          this.dispatch('setPagination', paging)
        }
      })
    },
    async getMyAds ({ commit }, pagination) {
      await OtcService.getMyAds(pagination).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformAds(rs.data)
          commit('SET_MY_ADS', result)
          let total = UtilService.buildTotalPage(result.total, pagination.size)
          pagination.total = total
          this.dispatch('setPagination', pagination)
        }
      })
    },
    async getOtcAds ({ commit }, query) {
      await OtcService.getOtcAds(query).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformAds(rs.data)
          commit('SET_OTC_ADS', result)
          let pagination = query.paging
          pagination.total = UtilService.buildTotalPage(result.total, pagination.size)
          this.dispatch('setPagination', pagination)
        } else {
          router.push({ name: 'home' })
        }
      })
    },
    async getOtcBalancesHistory ({ commit }, pagination) {
      await OtcService.getBalancesHistory(pagination).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformOtcBalancesHistory(rs.data)
          commit('SET_OTC_BALANCES_HISTORY', result)
          let total = UtilService.buildTotalPage(result.total, pagination.size)
          pagination.total = total
          this.dispatch('setPagination', pagination)
        }
      })
    },
    async getOtcTransactionsHistory ({ commit }, pagination) {
      await OtcService.getTransactionHistory(pagination).then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformOtcTransactionHistory(rs.data)
          commit('SET_OTC_TRANSACTION_HISTORY', result)
          let total = UtilService.buildTotalPage(result.total, pagination.size)
          pagination.total = total
          this.dispatch('setPagination', pagination)
        }
      })
    },
    getUserBalance ({ commit }) {
      OtcService.getBalances().then(rs => {
        if (rs.status === Constant.SUCCESS) {
          let result = UtilService.transformOtcWalletPairs(rs.data)
          commit('SET_OTC_BALANCES', result)
        }
      })
    },
    setOtcBalancePair ({ commit }, wallet) {
      commit('SET_CURRENT_OTC_BALANCE_PAIR', UtilService.buildOtcBalancePair(wallet))
    },
    setOtcBalancePairBySwap ({ commit }, arr) {
      commit('SET_CURRENT_OTC_BALANCE_PAIR', arr)
    },
    async setCurrentOtc ({ commit }, data) {
      let currency = this.state.otc.otcCurrencies.find(temp => {
        return temp.symbol.toLowerCase() === data.currency.toLowerCase()
      })
      let type = Constant.OTC_TYPE
      const paging = {
        page: this.state.pagination.paging.page || Constant.DEFAULT_PAGE_NUMBER,
        size: this.state.pagination.paging.size || Constant.DEFAULT_PAGE_SIZE
      }
      let filter = {
        tadType: data.type === type.BUY ? type.SELL : type.BUY,
        currencyId: currency.id
      }
      let queryObj = {
        filter: filter,
        paging: paging
      }
      commit('SET_OTC', data)
      await this.dispatch('getOtcAds', queryObj)
    },
    setOtcCurrencies ({ commit }, data) {
      commit('SET_OTC_CURRENCIES', data)
    },
    setOtcCurrentUsers ({ commit }, data) {
      commit('SET_OTC_CURRENT_USERS', data)
    },
    async getOtcCurrencies ({ commit }) {
      let rs = await OtcService.getOtcCurrencies()
      let data = rs.data
      if (rs.status === Constant.SUCCESS) {
        commit('SET_OTC_CURRENCIES', data)
      }
      return data || []
    },
    async getOtcUsers ({ commit }, data) {
      await OtcService.getOtcUsers(data).then(rs => {
        commit('SET_OTC_CURRENT_USERS', rs)
      })
    },
    async getCountries ({ commit }) {
      let rs = await OtcService.getCountries()
      let data = rs.data
      if (rs.status === Constant.SUCCESS) {
        commit('SET_OTC_COUNTRIES', rs.data)
        return rs.data || []
      }
      return data
    },
    async getPaymentMethods ({ commit }) {
      let rs = await OtcService.getPaymentMethods()
      if (rs.status === Constant.SUCCESS) {
        let result = UtilService.transformPaymentMethod(rs.data)
        commit('SET_OTC_PAYMENTS', result)
        return result
      } else return []
    },
    async getFiat ({ commit }) {
      let rs = await OtcService.getFiat()
      let data = rs.data
      if (rs.status === Constant.SUCCESS) {
        data = UtilService.transformFiat(data)
        commit('SET_OTC_UNIT_CURRENCIES', data)
      }
      return data
    },
    async getUserPayments ({ commit }) {
      let rs = await OtcService.getUserPayments()
      if (rs.status === Constant.SUCCESS) {
        // let result = UtilService.transformUserPayment(rs.data)
        commit('SET_OTC_USER_PAYMENTS', rs.data)
      }
      return rs.data
    },
    async getKycInfo ({ commit }) {
      let rs = await OtcService.getKycInfo()
      if (rs.status === Constant.SUCCESS) {
        let result = UtilService.transformKycInfo(rs.data)
        commit('SET_KYC_INFO', result)
        return result
      }
    },
    setKycInfo ({ commit }, data) {
      commit('SET_KYC_INFO', data)
    },
    async getFollowers ({ commit }) {
      let rs = await OtcService.followers()
      if (rs.status === Constant.SUCCESS) {
        commit('SET_FOLLOWERS', rs.data)
        return rs.data
      }
    },
    async getBlacklist ({ commit }) {
      let rs = await OtcService.blacklist()
      if (rs.status === Constant.SUCCESS) {
        commit('SET_BLACKLIST', rs.data)
        return rs.data
      }
    },
    setOnlineUsers ({ commit }, data) {
      commit('SET_ONLINE_USERS', data)
    },
    addOtcNotifications ({ commit }, data) {
      commit('ADD_OTC_NOTIFICATIONS', data)
    },
    removeOtcNotifications ({ commit }, data) {
      commit('REMOVE_OTC_NOTIFICATIONS', data)
    },
    connectOtcWs (__) {
      // connect signalR
      const cfgs = this.state.commonModule.configs
      let tokenObj = LocalStorage.getToken() || {}
      let token = tokenObj.accessToken || ''
      if (cfgs.isUseWsNotify === !0 && otcWs._state !== otcWs.STATE.OPEN) {
        otcWs.connect('Send', CONFIG.BASE_URL_SIGNALR_OTC_SOCKET, token).then(rs => {
          if (rs) otcWs.send(Constant.OTC.SOCKET_METHODS._I_AM_ONLINE, 'i am online')
        })
      }
    },
    closeOtcWs (__) {
      if (otcWs && otcWs._state === otcWs.STATE.OPEN) {
        otcWs.close()
      }
    }
  }
}

export default otc
