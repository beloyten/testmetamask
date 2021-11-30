import CONFIG from '@/configs/config'
import { Get, Post } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  getWallets: () => Get(`${apiUrl}/wallet/main/get-wallet-info`),
  getTransactionHistory: query => Get(`${apiUrl}/wallet/get-transaction-history`, query),
  createWallet: symbol => Get(`${apiUrl}/wallet/generate-new-address?currencyCode=${symbol}`),
  getExchangeWallets: () => Get(`${apiUrl}/wallet/exchange/my-balance-all`),
  transfer: data => Post(`${apiUrl}/user/fiat/transfer-out-fiat`, data)
}

export default service
