import CONFIG from '@/configs/config'
import { Get, Post } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  createOrder: data => Post(`${apiUrl}/order/create-order`, data),
  cancelOrder: data => Post(`${apiUrl}/order/cancel-order`, data),
  myOpenOrders: query => Get(`${apiUrl}/order/open-order-week`, query),
  getOpenOrders: query => Get(`${apiUrl}/order/open-order`, query),
  getHistoryOrder: query => Get(`${apiUrl}/order/history-order`, query),
  getTransactionHistory: query => Get(`${apiUrl}/order/list-transaction`, query),
  myCloseOrders: query => Get(`${apiUrl}/order/history-order-week`, query),
  limitOrder: () => Get(`${apiUrl}/order/limit-order`),
  getOrderDetail: query => Get(`${apiUrl}/order/detail-order-transaction`, query),
  createMarketOrder: data => Post(`${apiUrl}/order/create-market-order`, data),
  createStopLimitOrder: data => Post(`${apiUrl}/order/create-stop-order`, data),
  cancelStopLimitOrder: data => Post(`${apiUrl}/order/cancel-stop-limit-order`, data)
}

export default service
