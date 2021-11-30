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
        Sign up your account
      </div>
      <div class="form-description">
        Create your account to be able to log in.
      </div>
      <form class="signup">
        <input type="text" v-model="email" placeholder="Your email..." class="email" :class="errorEmail ? 'error-input' : ''"/>
        <input type="password" v-model="password" placeholder="Password..." class="password"  :class="errorPassword ? 'error-input' : ''"/>
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password..." class="confirm-password"  :class="errorConfirmPassword ? 'error-input' : ''"/>
        <input type="text" v-model="invitationCode" placeholder="Invitation code..." class="invitation"  :class="errorInvitationCode ? 'error-input' : ''"/>
        <div class="form-funtion">
          <img src="/assets/icons/checkbox.svg" id="checkbox" />
          <img src="/assets/icons/checkbox-selected.svg" id="checkbox-selected" />
          <label id="label-checkbox">I agree to <a>Terms of Use</a></label>
        </div>
        <button class="signin signup-button" :disabled="!selected" @click.prevent="signup()">Sign up now</button>
        <a class="register-link" href="/login">Back to login</a>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      invitationCode: '',
      selected: false,
      errorEmail: false,
      errorPassword: false,
      errorConfirmPassword: false,
      errorInvitationCode: false
    }
  },
  computed: {},
  methods: {
    signup () {
      this.errorEmail = false
      this.errorPassword = false
      this.errorConfirmPassword = false
      this.errorInvitationCode = false
      if (this.email.trim() !== '' && this.password.trim() !== '' && this.confirmPassword.trim() !== '' && this.invitationCode.trim() !== '') {
        if (this.password !== this.confirmPassword) {
          this.$store.dispatch('showErrorMsg', 'Mật khẩu không trùng khớp.')
          this.errorConfirmPassword = true
        } else {
          this.$store.dispatch('showSuccessMsg', 'Đăng ký thành công.')
          this.$router.push({ name: 'login' })
        }
      } else {
        if (this.email.trim() === '') {
          this.errorEmail = true
        }
        if (this.password.trim() === '') {
          this.errorPassword = true
        }
        if (this.confirmPassword.trim() === '') {
          this.errorConfirmPassword = true
        }
        if (this.invitationCode.trim() === '') {
          this.errorInvitationCode = true
        }
        this.$store.dispatch('showErrorMsg', 'Vui lòng điền đầy đủ thông tin.')
      }
    }
  }
}
window.onload = function () {
  let checkbox = document.getElementById('checkbox')
  let checkboxSelected = document.getElementById('checkbox-selected')
  let labelCheckbox = document.getElementById('label-checkbox')
  if (labelCheckbox) {
    labelCheckbox.addEventListener('click', function () {
      if (!checkboxSelected.style.display || checkboxSelected.style.display === 'none') {
        checkboxSelected.style.display = 'block'
        checkbox.style.display = 'none'
      } else {
        checkboxSelected.style.display = 'none'
        checkbox.style.display = 'block'
      }
    })
  }
  if (checkbox) {
    checkbox.addEventListener('click', function () {
      checkbox.style.display = 'none'
      checkboxSelected.style.display = 'block'
    })
  }
  if (checkboxSelected) {
    checkboxSelected.addEventListener('click', function () {
      checkboxSelected.style.display = 'none'
      checkbox.style.display = 'block'
    })
  }
}
</script>
