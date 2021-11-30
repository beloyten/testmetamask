import CONFIG from '@/configs/config'
import { Get, Post } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  getApiPermissions: () => Get(`${apiUrl}/user/get-api-permissions`),
  getApiKeys: () => Get(`${apiUrl}/user/get-list-api-keys`),
  createApiKey: data => Post(`${apiUrl}/user/update-api-key`, data),
  deleteApiKey: data => Post(`${apiUrl}/user/delete-api-key`, data)
}

export default service
