<template>
  <!-- Switch user -->
  <section :class="{ 'loading': isProcessing }" class="register-box login">
    <div>
      <h3 class="title">{{ $t('ROUTE_AUTH_SWITCH_USER') }}</h3>
      <div class="box-body">
        <form id="form_login" class="login_form" @submit.prevent="login">
          <div class="group reg_account">
            <div class="e_input_control">
              <div class="e_input_field">
                <input
                  id="account"
                  ref="email"
                  v-model="formLogin.email"
                  :data-value="formLogin.email"
                  autocomplete="off"
                  growing-ignore="true"
                  name="account"
                  maxlength="50"
                  class="e_input"
                  type="text"
                  required
                >
                <label for="account" class="e_label">{{ $t('PLACE_EMAIL') }}</label>
              </div>
            </div>
          </div>
          <div class="group reg_account">
            <div class="e_input_control">
              <div class="e_input_field">
                <input
                  id="account"
                  ref="switch-user"
                  v-model="formLogin.userSwitch"
                  :data-value="formLogin.userSwitch"
                  autocomplete="off"
                  growing-ignore="true"
                  name="account"
                  maxlength="50"
                  class="e_input"
                  type="text"
                  required
                >
                <label for="account" class="e_label">{{ $t('PLACE_SWITCH_EMAIL') }}</label>
              </div>
            </div>
          </div>
          <div class="group reg_password">
            <div class="e_input_control">
              <div class="e_input_field">
                <input
                  id="password"
                  v-model="formLogin.password"
                  :data-value="formLogin.password"
                  growing-ignore="true"
                  type="password"
                  name="password"
                  autocomplete="off"
                  maxlength="20"
                  class="e_input"
                  required
                  :disabled="isProcessing"
                >
                <label for="password" class="e_label">{{ $t('PLACE_PASSWORD') }}</label>
              </div>
            </div>
          </div>
          <div class="group reg_button">
            <div class="button_control">
              <button type="submit" class="button text_button" :disabled="!isValidated">
                <span class="slot_box">
                  <span>{{ $t('BTN_SWITCH') }}</span>
                </span>
                <span class="icon_box"/>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
  <!-- End Login -->
</template>

<script>
import UtilService from '@/utils/UtilService'
export default {
  data () {
    return {
      isProcessing: false,
      formLogin: {
        email: '',
        userSwitch: '',
        password: ''
      }
    }
  },
  computed: {
    isValidated () {
      var form = this.formLogin
      return form.email && form.password && UtilService.checkValidateEmail(form.email) &&
        form.userSwitch && UtilService.checkValidateEmail(form.userSwitch)
    }
  },
  mounted () {
    this.$refs.email && this.$refs.email.focus()
  },
  methods: {
    async login () {
      if (!this.isValidated) return
      this.isProcessing = true
      var result = await this.$store.dispatch('switchUser', this.formLogin)
      this.isProcessing = false
      this.handleAfterLogin(result)
    },
    handleAfterLogin (result) {
      console.log('handle login with ', result)
      if (!result) return
      this.$store.dispatch('getUser')
      this.$store.dispatch('setLoggedIn', true)
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
