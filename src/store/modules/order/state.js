var state = {
  exchangeMyOpenOrders: [],
  exchangeMyCloseOrders: [],
  exchangeOrderTemp: {},
  openOrders: [],
  historyOrders: [],
  closeOrders: [],
  exchangeLimitOrders: []
}

var getters = {
  exchangeMyOpenOrders: state => state.exchangeMyOpenOrders,
  exchangeMyCloseOrders: state => state.exchangeMyCloseOrders,
  exchangeOrderTemp: state => state.exchangeOrderTemp,
  openOrders: state => state.openOrders,
  historyOrders: state => state.historyOrders,
  closeOrders: state => state.closeOrders,
  exchangeLimitOrders: state => state.exchangeLimitOrders
}

var mutations = {
  SET_EXCHANGE_MY_OPEN_ORDER: (state, data) => {
    state.exchangeMyOpenOrders = data
  },
  SET_EXCHANGE_MY_CLOSE_ORDER: (state, data) => {
    state.exchangeMyCloseOrders = data
  },
  SET_EXCHANGE_ORDER_TEMP: (state, data) => {
    state.exchangeOrderTemp = data
  },
  SET_OPEN_ORDERS: (state, data) => {
    state.openOrders = data
  },
  SET_HISTORY_ORDERS: (state, data) => {
    state.historyOrders = data
  },
  SET_CLOSE_ORDERS: (state, data) => {
    state.closeOrders = data
  },
  SET_EXCHANGE_LIMIT_ORDER: (state, data) => {
    state.exchangeLimitOrders = data
  }
}

export default { state, getters, mutations }
