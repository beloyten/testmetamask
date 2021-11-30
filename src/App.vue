<template>
  <v-app>
    <v-main class="pt-0">
      <v-overlay fixed opacity="0.5" :value="isLoading">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        />
      </v-overlay>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import SecurityConfirmation from '@/views/modal/SecurityConfirmation'
import Title from '@/mixin/title'
import Web3Obj from '@/plugin/web3-obj'

export default {
  data () {
    return {
      isLoading: true
    }
  },
  computed: {
    needToWait () {
      return this.$store.getters.needToWaitApp
    },
    logged () {
      // return LocalStorage.getItem('isLoggedIn')
      return this.$keycloak.authenticated
    }
  },
  mixins: [ Title ],
  watch: {
    needToWait (val) {
      this.isLoading = val
    }
  },
  created () {
    this.$store.dispatch('getSystemConfigs')
    this.$store.dispatch('initThemMode')
    // Check token and get user if exist
    this.$store.dispatch('getUser').then(() => {
      this.$store.dispatch('setNeedToWaitApp', false)

      if (this.$store.getters.isLoggedIn) {
        Web3Obj.connect().then(web3 => {
          // check status
          if (web3.currentProvider.connected || (web3.currentProvider._state && web3.currentProvider._state.isConnected)) {
            // success auto connect
            console.log('web3 connect success')
          }
        })
      }
    })
  }
}
</script>
