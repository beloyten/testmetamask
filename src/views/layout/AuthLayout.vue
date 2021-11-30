<template>
  <v-app>
    <v-main class="main">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    configs () {
      return this.$store.getters.configs
    },
    user () {
      return this.$store.getters.user
    },
    isLockedWithdraw () {
      return (
        !this.configs.isAllowWithdraw ||
        !this.user.isAllowWithdraw ||
        this.user.isLockedMoneyOut
      )
    }
  }
}
</script>
