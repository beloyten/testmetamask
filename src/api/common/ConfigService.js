import CONFIG from '@/configs/config'
import { Get } from '@/utils/RequestService'

var apiUrl = CONFIG.BASE_URL_API
var service = {
  getConfig: () => Get(`${apiUrl}/system/system-config`),
  getGoogleKey: () => Get(`${apiUrl}/user/new-google-key`),
  getRate: (url) => Get(url)
}

export default service
