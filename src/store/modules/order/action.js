import OrderService from '@/api/order/OrderService'
import UtilService from '@/utils/UtilService'
import CONSTANT from '@/configs/constant'
var actions = {
  getOrderDetail (__, data) {
    return new Promise(async resolve => {
      let params = { orderId: data.orderId }
      let rs = await OrderService.getOrderDetail(params)
      let result = UtilService.transformOpenOrders(rs.data)
      resolve(result)
    })
  },
  createOrder (__, data) {
    return new Promise(async resolve => {
      let rs = await OrderService.createOrder(data)
      resolve(rs.status === CONSTANT.SUCCESS)
    })
  },
  cancelOrder (__, data) {
    return new Promise(async resolve => {
      let rs = await OrderService.cancelOrder(data)
      resolve(rs.status === CONSTANT.SUCCESS)
    })
  },
  // Market action
  createMarketOrder (__, data) {
    return new Promise(async resolve => {
      let rs = await OrderService.createMarketOrder(data)
      resolve(rs.status === CONSTANT.SUCCESS)
    })
  },
  // Stop limit action
  createStopLimitOrder (__, data) {
    return new Promise(async resolve => {
      let rs = await OrderService.createStopLimitOrder(data)
      resolve(rs.status === CONSTANT.SUCCESS)
    })
  },
  cancelStopLimitOrder (__, data) {
    return new Promise(async resolve => {
      let rs = await OrderService.cancelStopLimitOrder(data)
      resolve(rs.status === CONSTANT.SUCCESS)
    })
  }
}

export default { actions }
