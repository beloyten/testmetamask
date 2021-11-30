import CONFIG from '@/configs/config'
import { Post, Get } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  login: data => Post(`${apiUrl}/auth/login`, data),
  loginSSO: data => Post(`${apiUrl}/auth/login-sso`, data),
  verifyWalletAddress: params => Get(`${apiUrl}/auth/verify-wallet-addrx`, params),
  registerNewUser: data => Post(`${apiUrl}/auth/register`, data),
  verifyEmail: data => Post(`${apiUrl}/auth/user-activation-code`, data),
  requestChangePassword: data => Post(`${apiUrl}/auth/request-forgot-password`, data),
  resetPassword: data => Post(`${apiUrl}/auth/reset-password`, data),
  refreshToken: data => Post(`${apiUrl}/auth/user-refresh-token`, data),
  sendVerificationCode: data => Post(`${apiUrl}/auth/send-verification`, data),
  checkVerificationCode: data => Post(`${apiUrl}/auth/check-verification`, data),
  loginBy2FA: data => Post(`${apiUrl}/auth/login-2fa`, data),
  switchUser: data => Post(`${apiUrl}/auth/login-switch`, data),
  resendActivationCode: data => Post(`${apiUrl}/auth/resend-activation-code`, data),
  loginByCode: data => Post(`${apiUrl}/auth/login`, data),
  // checkAuth: params => Get(`${CONFIG.BASE_URL_OAUTH}/get-auth`, params),
  checkToken: headers => Get(`${CONFIG.BASE_URL_OAUTH}/realms/${CONFIG.KEYCLOAK_OPTS_REALM}/api/check-token`, null, headers),
  getJwtToken: formData => Post(`${CONFIG.BASE_URL_OAUTH}/realms/${CONFIG.KEYCLOAK_OPTS_REALM}/protocol/openid-connect/token`, formData)
}

export default service
