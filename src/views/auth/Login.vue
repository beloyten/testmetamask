<template>
  <div class="login">
    <div class="login-left">
      <div class="login-logo">
        <img src="/assets/images/logo.svg" alt="" />
      </div>
      <div class="login-image">
        <img src="/assets/images/login-image.svg" alt="" />
      </div>
    </div>
    <div class="login-form">
      <div class="form-title">
        Welcome to Hesman!
      </div>
      <div class="form-description">
        Log in and enjoy our services.
      </div>
      <form @submit.prevent="login()">
        <input type="text" v-model="email" placeholder="Your email..." class="email" :class="errorEmail ? 'error-input' : ''" />
        <input type="password" v-model="password" placeholder="Password..." class="password" :class="errorPassword ? 'error-input' : ''" />
        <div class="form-funtion">
          <div class="remember-me">
            <img src="/assets/icons/checkbox.svg" id="checkbox" />
            <img src="/assets/icons/checkbox-selected.svg" id="checkbox-selected" />
            <label id="label-checkbox">Remember me</label>
          </div>
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button class="signin">Sign in now</button>
        <a class="register-link" href="/signup">Create a new account</a>
      </form>
    </div>
  </div>
</template>
<script>
import LocalStorage from '@/utils/LocalStorage'
export default {
  data () {
    return {
      email: '',
      password: '',
      rememberMe: false,
      errorEmail: false,
      errorPassword: false
    }
  },
  computed: {},
  methods: {
    login () {
      this.errorEmail = false
      this.errorPassword = false
      if (this.email.trim() !== '' && this.password.trim() !== '') {
        LocalStorage.setItem('isLoggedIn', true)
        this.$router.push({ name: 'otc-trade', params: { type_pair: 'buy' } })
      } else {
        if (this.email.trim() === '') {
          this.errorEmail = true
        }
        if (this.password.trim() === '') {
          this.errorPassword = true
        }
        this.$store.dispatch('showErrorMsg', 'Vui lòng điền đầy đủ email và mật khẩu.')
      }
    }
  }
}
window.onload = function () {
  let checkbox = document.getElementById('checkbox')
  let checkboxSelected = document.getElementById('checkbox-selected')
  let labelCheckbox = document.getElementById('label-checkbox')
  labelCheckbox.addEventListener('click', function () {
    if (!checkboxSelected.style.display || checkboxSelected.style.display === 'none') {
      checkboxSelected.style.display = 'block'
      checkbox.style.display = 'none'
    } else {
      checkboxSelected.style.display = 'none'
      checkbox.style.display = 'block'
    }
  })
  checkbox.addEventListener('click', function () {
    checkbox.style.display = 'none'
    checkboxSelected.style.display = 'block'
  })
  checkboxSelected.addEventListener('click', function () {
    checkboxSelected.style.display = 'none'
    checkbox.style.display = 'block'
  })
}
</script>
