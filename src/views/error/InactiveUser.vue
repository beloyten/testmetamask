<template>
  <div class="page-error-404 table">
    <div class="table-cell">
      <div class="error-content">
        <h1 class="small">Oops</h1>
        <h2 v-text="$t('MSG_USER_INACTIVE')"></h2>
        <p v-text="$t('TEXT_SEND_EMAIL_ACTIVATION_CODE')"></p>
        <a class="btn-link" @click.prevent="resend" v-text="$t('BTN_SEND_AGAIN')"></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    tempEmail () {
      return this.$store.getters.tempEmail
    }
  },
  methods: {
    resend () {
      let tempEmail = this.$route.query.email
      this.$store.dispatch('resendActivationCode', tempEmail).then(() => {
        setTimeout(function () {
          window.close()
        }, 1500)
      })
    }
  }
}
</script>
