import CONFIG from '@/configs/config'
import { Get, Post, Delete } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  getUser: () => Get(`${apiUrl}/user/get-user-info`),
  verifyKyc: data => Post(`${apiUrl}/user/submit-verification`, data),
  getUserActivity: () => Get(`${apiUrl}/user/get-user-activity`),
  changePassword: data => Post(`${apiUrl}/user/change-password`, data),
  verifyTelegram: data => Post(`${apiUrl}/user/telegram-verification`, data),
  sendVerificationCode: data => Post(`${apiUrl}/user/send-verification-code`, data),
  confirmSecurity: data => Post(`${apiUrl}/auth/confirm-security`, data),
  logout: data => Delete(`${apiUrl}/user/logout`, data),
  logoutSupporter: data => Delete(`${apiUrl}/user/logout/${data.accessToken}`, data),
  logoutSSO: data => Post(`${apiUrl}/auth/logout`, data)
}

export default service
