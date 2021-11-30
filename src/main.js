import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import KeycloakJs from '@/plugin/keycloak-js'
import vuetify from '@/plugin/vuetify'
import RouterInterceptor from '@/plugin/router-interceptor'
import Vue2Filters from 'vue2-filters'
import VueMoment from 'vue-moment'
import VueClipboard from 'vue-clipboard2'

// Style
import '@/assets/less/base.less' // global less
import '@mdi/font/css/materialdesignicons.css'
// Plugin
import i18n from '@/plugin/i18n' // Internationalization
import google from '@/plugin/google'

import {
  Dialog,
  MessageBox,
  Select,
  Switch,
  Option,
  DatePicker,
  Icon,
  Pagination,
  Notification
} from 'element-ui'

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import enMessage from '@/lang/translations/en.json'

// configure language
locale.use(lang)
Vue.prototype.$google = google
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

Vue.use(KeycloakJs)

Vue.config.productionTip = false
Vue.use(Vue2Filters)
Vue.use(VueMoment)
Vue.use(RouterInterceptor)
Vue.use(VueClipboard)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Icon)
Vue.use(Pagination)
Vue.use(Switch)
Vue.prototype.$tt = (key = '', str = '', replace = '') => {
  if (!key) {
    return ''
  }
  if (i18n.te(key)) {
    return i18n.t(key, replace)
  } else if (enMessage[key]) {
    return enMessage[key]
  }
  return str
}

Vue.$keycloak.init({ checkLoginIframe: true, onLoad: 'check-sso', pkceMethod: 'S256', promiseType: 'native' })
  .then(auth => {
    new Vue({
      i18n,
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  })
