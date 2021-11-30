import Vue from 'vue'
import Router from 'vue-router'
// Routing modules
import authRoutes from './auth'
import walletRoutes from './wallet'
import errorRoutes from './error'
import externalPages from './external-page'
import otcPages from './otc'
import user from './user'

// Router catch exception
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location)
    .catch(() => console.log('Routing is not changed'))
}
Vue.use(Router)
let defaultRoutes = [
  {
    path: '/',
    name: 'home',
    redirect: () => {
      return { name: 'otc-trade', params: { type_pair: 'buy' } }
    }
  }
]
let allRoutes = defaultRoutes.concat(walletRoutes, errorRoutes, externalPages, otcPages, authRoutes, user)
export default new Router({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: allRoutes
})
