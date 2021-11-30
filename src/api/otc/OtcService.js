import CONFIG from '@/configs/config'
import { Get, Post } from '@/utils/RequestService'
import UtilService from '@/utils/UtilService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  getOtcCurrencies: () => Get(`${apiUrl}/system/get-list-currencies`),
  getPaymentMethods: () => Get(`${apiUrl}/system/get-payment-methods`),
  getCountries: () => Get(`${apiUrl}/system/get-list-countries`),
  getFiat: () => Get(`${apiUrl}/system/get-list-fiats`),
  getUserPayments: () => Get(`${apiUrl}/user/get-all-payment-methods`),
  getBalances: () => Get(`${apiUrl}/user/get-balance`),
  getMyAds: pagination => Get(`${apiUrl}/user/get-list-ads`, UtilService.buildOffsetLimitFromPagination(pagination)),
  getBalancesHistory: pagination => Get(`${apiUrl}/user/fiat/transfer-log`, UtilService.buildOffsetLimitFromPagination(pagination)),
  getTransactionHistory: pagination => Get(`${apiUrl}/user/get-transaction-history`, UtilService.buildOffsetLimitFromPagination(pagination)),
  getOtcAds: filterObj => Get(`${apiUrl}/tad/get-all-tads`, UtilService.buildFilterQuery(filterObj)),
  getOtcAd: id => Get(`${apiUrl}/tad/get-tad-detail?id=${id}`),
  getOrders: filterObj => Get(`${apiUrl}/user/get-list-orders`, UtilService.buildFilterQuery(filterObj)),
  getOrder: id => Get(`${apiUrl}/order/${id}/detail`),
  getTraderInfo: inviteCode => Get(`${apiUrl}/user/${inviteCode}/get-info`),
  disputeTypes: () => Get(`${apiUrl}/order/get-dispute-types`),
  getMessages: (id) => Get(`${apiUrl}/order/${id}/get-all-msg`),
  getKycInfo: () => Get(`${apiUrl}/user/get-kycinfo`),
  followers: () => Get(`${apiUrl}/user/follow-list`),
  blacklist: () => Get(`${apiUrl}/user/block-list`),

  createPaymentMethod: data => Post(`${apiUrl}/user/create-payment-method`, data),
  transfer: data => Post(`${apiUrl}/user/transfer`, data),
  createOrder: data => Post(`${apiUrl}/order/create-new-order`, data),
  submitAdForm: data => Post(`${!data.id ? `${apiUrl}/tad/create-new-tad` : `${apiUrl}/tad/update`}`, data),
  cancelOrder: (id, data) => Post(`${apiUrl}/order/${id}/cancel`, data),
  cancelAd: (id, data) => Post(`${apiUrl}/tad/${id}/cancel`, data),
  payOrder: (id, data) => Post(`${apiUrl}/order/${id}/paid`, data),
  confirmOrder: (id, data) => Post(`${apiUrl}/order/${id}/confirmed`, data),
  releaseOrder: (id, data) => Post(`${apiUrl}/order/${id}/released`, data || {}),
  dispute: (id, data) => Post(`${apiUrl}/order/${id}/make-dispute`, data),
  cancelDispute: (id, data) => Post(`${apiUrl}/order/${id}/cancel-dispute`, data),
  chat: (id, data) => Post(`${apiUrl}/order/${id}/add-msg`, data),
  setupAccount: data => Post(`${apiUrl}/user/setup-account`, data),
  updateFundPassword: data => Post(`${apiUrl}/user/update-fund-password`, data),
  updateAdStatus: (id, data) => Post(`${apiUrl}/tad/${id}/set-tad-state`, data),
  updatePaymentMethod: data => Post(`${apiUrl}/user/update-payment-method`, data),
  changePaymentStatus: (id, data) => Post(`${apiUrl}/user/set-payment-method-state/${id}`, Object.assign(data, { active: !data.active })),
  deletePayment: (id, data) => Post(`${apiUrl}/user/delete-payment-method/${id}`, data),
  followUser: (inviteCode, data) => Post(`${apiUrl}/user/follow/${inviteCode}`, data),
  unFollowUser: (inviteCode, data) => Post(`${apiUrl}/user/remove-follow/${inviteCode}`, data),
  blockUser: (inviteCode, data) => Post(`${apiUrl}/user/block/${inviteCode}`, data),
  unBlockUser: (inviteCode, data) => Post(`${apiUrl}/user/remove-block/${inviteCode}`, data),
  uploadBankImage: data => Post(`${apiUrl}/user/upload-otc-kyc`, data)
}
export default service
