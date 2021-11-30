import Vue from 'vue'
// import LocalStorage from '@/utils/LocalStorage'
import router from '@/router'
import store from '@/store'

const RouterInterceptor = {
  install () {
    router.beforeEach((to, from, next) => {
      // Close all modal when change router
      store.dispatch('closeAllModal')

      // Check page is required authenticated
      if (to.matched.some(record => record.meta.requiresAuth)) {
        // The user was not logged in
        if (!Vue.$keycloak.authenticated) {
          // The page is protected and the user is not authenticated. Force a login.
          // const basePath = window.location.origin
          // Vue.$keycloak.login({ redirectUri: basePath + to.path })
          store.dispatch('startConnectWalletProcess', true)
        } else if (to.matched.some(record => record.meta.requireRole) && Vue.$keycloak.hasResourceRole(to.meta.requireRole)) {
          // The user was authenticated, and has the app role
          this.checkToken(() => next(), () => Vue.$keycloak.login())
        } else {
          if (!to.matched.some(record => record.meta.requireRole)) {
            // check token for no require role
            this.checkToken(() => next(), () => Vue.$keycloak.logout())
          } else {
            // logout by invalid role
            Vue.$keycloak.logout()
          }
        }
      } else {
        // Page is not required authenticated
        // check the authentication and token if user already logged in
        if (Vue.$keycloak.authenticated) {
          this.checkToken(() => next(), () => Vue.$keycloak.logout())
        } else {
          next()
        }
      }
    })
  },
  checkToken (successCallback, failCallback) {
    Vue.$keycloak.updateToken(15)
      .then(() => {
        successCallback()
      })
      .catch(() => {
        failCallback()
      })
  }
}
export default RouterInterceptor
