import CONFIG from '@/configs/config'
import { Get } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  getInvitationCommission: query => Get(`${apiUrl}/user/get-invitation-commission`, query),
  getRebateHistory: query => Get(`${apiUrl}/user/get-invitation-rebates`, query),
  getInviteHistory: query => Get(`${apiUrl}/user/get-invitation-history`, query),
  getTopReferral: query => Get(`${apiUrl}/user/get-invitation-top`, query)
}

export default service
