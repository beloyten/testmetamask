import UtilService from '@/utils/UtilService'
import OrderService from '@/api/order/OrderService'

var actions = {
  // function SET
  setExchangeOrderTemp ({ commit }, data) {
    commit('SET_EXCHANGE_ORDER_TEMP', data)
  },

  // function GET
  getLimitOrder ({ commit }) {
    return new Promise(async resolve => {
      let rs = await OrderService.limitOrder()
      let result = rs.data || []
      commit('SET_EXCHANGE_LIMIT_ORDER', result)
      resolve(result)
    })
  },
  myOpenOrders ({ commit }, query) {
    return new Promise(async resolve => {
      let rs = await OrderService.myOpenOrders(query)
      let result = UtilService.transformOpenOrders(rs.data)
      commit('SET_EXCHANGE_MY_OPEN_ORDER', result)
      resolve(result)
    })
  },
  getOpenOrders ({ commit }, query) {
    return new Promise(async resolve => {
      let rs = await OrderService.getOpenOrders(query)
      let result = UtilService.transformOpenOrders(rs.data)
      commit('SET_OPEN_ORDERS', result)
      this.dispatch('setPagination', rs.pagination)
      resolve(result)
    })
  },
  myCloseOrders ({ commit }, query) {
    return new Promise(async resolve => {
      let rs = await OrderService.myCloseOrders(query)
      let result = UtilService.transformOpenOrders(rs.data)
      commit('SET_EXCHANGE_MY_CLOSE_ORDER', result)
      resolve(result)
    })
  },
  getHistoryOrder ({ commit }, query) {
    return new Promise(async resolve => {
      let rs = await OrderService.getHistoryOrder(query)
      let result = UtilService.transformOpenOrders(rs.data)
      commit('SET_HISTORY_ORDERS', result)
      this.dispatch('setPagination', rs.pagination)
      resolve(result)
    })
  },
  getTransactionHistory ({ commit }, query) {
    return new Promise(async resolve => {
      let rs = await OrderService.getTransactionHistory(query)
      let result = UtilService.transformTransactionsOrder(rs.data)
      commit('SET_CLOSE_ORDERS', result)
      this.dispatch('setPagination', rs.pagination)
      resolve(result)
    })
  }
}

export default { actions }
