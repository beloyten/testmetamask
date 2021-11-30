<template>
  <div class="body-content otc-fund-password" :class="{ 'loading': isLoading }">
    <div class="body-title">
      Setup Account
      <h5 class="sub-title">Enter your nickname and wallet address</h5>
    </div>
    <div class="body-detail">
      <div class="form">
        <div class="modal-field">
          <label>Nickname(*)</label>
          <input
            type="text"
            placeholder="Your nickname"
            onfocus="this.removeAttribute('readonly');"
            v-model="form.nickname"
            :class="{ 'disabled': isLoading }"
            @blur="validateNickName">
          <span v-if="errorForm.nickname.error" class="item-error-tip">{{ errorForm.nickname.errorText }}</span>
        </div>
        <div class="modal-field">
          <label>Wallet Address(*)</label>
          <input
            type="text"
            onfocus="this.removeAttribute('readonly');"
            placeholder="Start with 0x..."
            v-model="form.walletAddress"
            oninput="this.value = this.value.replace(/[^a-zA-Z0-9!@#$%&*]/g, '').replace(/(\..*)\./g, '$1')"
            :class="{ 'disabled': isLoading }"
            @blur="validateWalletAddress"
          >
        </div>
      </div>
      <div class="form-action">
        <a class="btn" :class="{ 'disabled': isLoading }" @click="confirmModal">Confirm</a>
      </div>
    </div>
  </div>
</template>

<script>
import OtcService from '@/api/otc/OtcService'
import CONSTANT from '@/configs/constant'
// import UtilService from '@/utils/UtilService'
export default {
  data  () {
    return {
      form: {
        nickname: '',
        walletAddress: ''
      },
      isLoading: false,
      errorForm: {
        nickname: {
          error: false,
          errorText: ''
        },
        walletAddress: {
          error: false,
          errorText: ''
        }
      }
    }
  },
  computed: {
    isValidated () {
      return this.form.nickname && this.form.walletAddress
    },
    isShowOtcFundPassForm: {
      get  () {
        return this.$store.getters.isShowOtcFundPassForm
      },
      set (val) {
        this.$store.dispatch('toggleOtcFundPasswordForm')
      }
    }
  },
  mounted () {
    // check user on mounted
    if (this.$keycloak.authenticated) {
      if (this.$store.getters.user && this.$store.getters.user.nickname) {
        this.$router.push({ name: 'home' })
      }
    } else {
      this.$router.push({ name: 'home' })
    }
  },
  methods: {
    async confirmModal () {
      // this.$store.dispatch('toggleOtcFundPasswordForm')
      // this.$router.push({ name: 'home' })
      const isValidNickName = this.validateNickName()
      const isValidWalletAddress = this.validateWalletAddress()
      if (!this.isValidated || !isValidNickName || !isValidWalletAddress) return
      this.isLoading = true
      let obj = this.form
      this.$google.getCaptcha('updateFundPassword')
        .then(async token => {
          obj.reCaptcha = token
          let rs = await OtcService.setupAccount(this.form)
          if (rs.status === CONSTANT.SUCCESS) {
            // this.$store.dispatch('setKycInfo', rs.data)
            this.$store.dispatch('getUser').then(() => {
              this.isLoading = false
              this.$router.push({ name: 'home' })
            })
            // this.$store.dispatch('toggleOtcFundPasswordForm')
          } else {
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    validateNickName () {
      return true
    },
    validateWalletAddress () {
      return true
    }
  }
}
</script>
