import UtilService from '@/utils/UtilService'
import WalletService from '@/api/wallet/WalletService'
import ConfigService from '@/api/common/ConfigService'
import CONSTANT from '@/configs/constant'

var actions = {
  getWallets ({ commit }) {
    return new Promise(async resolve => {
      var res = await WalletService.getWallets()
      var result = UtilService.transformWallets(res.data || [])
      for (let i = 0; i < result.length; i++) {
        let element = result[i]
        if (element.rateLink && element.balance) {
          let rs = await ConfigService.getRate(element.rateLink)
          if (rs.data && rs.data.close) element.rate = rs.data.close
        }
      }
      commit('SET_WALLET', result)
      resolve(result)
    })
  },
  getWalletTransactionHistory ({ commit, dispatch }, query) {
    return new Promise(async resolve => {
      var res = await WalletService.getTransactionHistory(query)
      var result = UtilService.transformTransactionHistory(res.data || [])
      commit('SET_TRANSACTION', result)
      dispatch('setPagination', res.pagination)
      resolve(result.status === CONSTANT.SUCCESS)
    })
  },
  createWallet (__, symbol) {
    return new Promise(async resolve => {
      var res = await WalletService.createWallet(symbol)
      console.log(res)
      resolve(res.data || [])
    })
  },
  getExchangeWallets ({ commit }) {
    return new Promise(async resolve => {
      let res = await WalletService.getExchangeWallets()
      var result = UtilService.transformExchangeWallets(res.data || [])
      commit('SET_EXCHANGE_WALLETS', result)
      resolve(result)
    })
  },
  transfer (__, data) {
    return new Promise(async resolve => {
      var token = await this._vm.$google.getCaptcha('transfer')
      data.reCaptcha = token
      let res = await WalletService.transfer(data)
      resolve(res.status === CONSTANT.SUCCESS)
    })
  }
}

export default { actions }
