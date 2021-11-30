<template>
  <div class="login forgot-password">
    <div class="login-left">
      <div class="login-logo">
        <img src="/assets/images/logo.svg" alt="" />
      </div>
      <div class="login-image">
        <img src="/assets/images/forgot-password-image.svg" alt="" />
      </div>
    </div>
    <div class="login-form">
      <div class="form-title">
        You forgot your password!
      </div>
      <div class="form-description">
        Please enter your email to retrieve it.
      </div>
      <form>
        <input type="text" v-model="email" placeholder="Your email..." class="email" :class="errorEmail ? 'error-input' : ''"/>
        <button class="signin" @click.prevent="sendMail()">Sent</button>
        <a class="register-link" href="/signup">Sign up new account</a>
        <a class="register-link" href="/login">Go back to login</a>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      email: '',
      errorEmail: false
    }
  },
  methods: {
    sendMail () {
      this.errorEmail = false
      if (this.email.trim() !== '') {
        this.$store.dispatch('showSuccessMsg', 'Vui lòng check mail')
      } else {
        this.errorEmail = true
        this.$store.dispatch('showErrorMsg', 'Vui lòng nhập mail')
      }
    }
  }
}
</script>
