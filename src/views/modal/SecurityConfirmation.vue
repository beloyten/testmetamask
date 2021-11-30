
<template>
  <el-dialog
    :title="$t('ACTIVITY_' + modalData.action)"
    :visible.sync="isShowSecurityConfirm"
    :closeOnClickModal="false"
    @open="onOpen"
    center
    class="popup-small"
    >
      <div :class="{ 'loading': isProcessing }" class="popup-inner" ref="popupInner">
        <span v-if="isChangeSecurity" class="pb-2">{{ $t('MSG_SECURITY_WARNING_CHANGE') }}</span>
        <span class="withdraw-warning"
          v-if="modalData.action === CONSTANT.SECURITY.WITHDRAW"
        >{{ $t('TEXT_WITHDRAW_WARNING2') }}</span>
        <div class="popup-content">
          <div class="register-box">
            <div class="">
              <form class="login_form" autocomplete="off" @submit.prevent="confirmSecurity">
                <div class="group">
                  <div class="e_input_control">
                    <div class="e_input_field">
                      <input
                        :value="email"
                        :data-value="email"
                        growing-ignore="true"
                        type="text"
                        class="e_input"
                        disabled
                      >
                      <label class="e_label">{{ $t('TEXT_EMAIL') }}</label>
                    </div>
                  </div>
                </div>

                <!-- Email code -->
                <div class="group">
                  <div
                    :class="{ 'e_input_error': !error.emailCode.isValid }"
                    class="e_input_control input-sms-code"
                  >
                    <div class="e_input_field">
                      <input
                        id="emailCode"
                        v-model="securityForm.emailCode"
                        :data-value="securityForm.emailCode"
                        growing-ignore="true"
                        type="text"
                        autocomplete="off"
                        class="e_input"
                        required
                      >
                      <label
                              for="emailCode"
                              class="e_label"
                      >{{ $t('TEXT_EMAIL_VERIFICATION_CODE') }}</label>
                      <a
                        :class="{ 'disabled': reSendStatus.emailCode.type === 1, 'loading': reSendStatus.emailCode.isSending }"
                        :disabled="reSendStatus.emailCode.isSending"
                        href="javascript:;"
                        class="send-cms-code"
                        @click="sendCode(CONSTANT.SEND_CODE.EMAIL)"
                      >
                        <span v-if="reSendStatus.emailCode.type === 0">{{ $t('BTN_SEND') }}</span>
                        <span
                                v-if="reSendStatus.emailCode.type === 1"
                        >{{ $t('MSG_RETRY_AFTER', { remain: reSendStatus.emailCode.remain }) }}</span>
                        <span
                                v-if="reSendStatus.emailCode.type === 2"
                        >{{ $t('BTN_SEND_AGAIN') }}</span>
                      </a>
                    </div>
                    <div v-if="!error.emailCode.isValid" class="e_input_bottom_message">
                      <span class="error_message">{{ error.emailCode.msg }}</span>
                    </div>
                  </div>
                </div>

                <!-- Phone number -->
                <div
                v-if="currentUser.isUseSecurityPhone || modalData.action === CONSTANT.SECURITY.TURN_ON_PHONE"
                class="group"
                >
                  <div class="e_input_control">
                    <div class="e_input_field">
                      <input
                        :value="currentUser.phoneNumber"
                        :data-value="currentUser.phoneNumber"
                        growing-ignore="true"
                        type="text"
                        class="e_input"
                        disabled
                      >
                      <label class="e_label">{{ $t('TEXT_PHONE_NUMBER') }}</label>
                    </div>
                  </div>
                </div>

                <!-- Phone -->
                <div
                  v-if="currentUser.isUseSecurityPhone || modalData.action === CONSTANT.SECURITY.TURN_ON_PHONE"
                  class="group"
                >
                  <div
                    :class="{ 'e_input_error': !error.phoneCode.isValid }"
                    class="e_input_control input-sms-code"
                  >
                    <div class="e_input_field">
                      <input
                        id="phoneCode"
                        v-model="securityForm.phoneCode"
                        :data-value="securityForm.phoneCode"
                        growing-ignore="true"
                        type="text"
                        autocomplete="off"
                        class="e_input"
                        required
                      >
                      <label
                        for="phoneCode"
                        class="e_label"
                      >{{ $t('TEXT_SMS_VERIFICATION_CODE') }}</label>
                      <a
                        :class="{ 'disabled': reSendStatus.phoneCode.type === 1, 'loading': reSendStatus.phoneCode.isSending }"
                        :disabled="reSendStatus.phoneCode.isSending"
                        href="javascript:;"
                        class="send-cms-code"
                        @click="sendCode(CONSTANT.SEND_CODE.PHONE)"
                      >
                        <span v-if="reSendStatus.phoneCode.type === 0">{{ $t('BTN_SEND') }}</span>
                        <span
                          v-if="reSendStatus.phoneCode.type === 1"
                        >{{ $t('MSG_RETRY_AFTER', { remain: reSendStatus.phoneCode.remain }) }}</span>
                        <span
                          v-if="reSendStatus.phoneCode.type === 2"
                        >{{ $t('BTN_SEND_AGAIN') }}</span>
                      </a>
                    </div>
                    <div v-if="!error.phoneCode.isValid" class="e_input_bottom_message">
                      <span class="error_message">{{ error.phoneCode.msg }}</span>
                    </div>
                  </div>
                </div>

                <!-- Telegram -->
                <div
                  v-if="currentUser.isUseSecurityTelegram || modalData.action === CONSTANT.SECURITY.TURN_OFF_TELEGRAM"
                  class="group"
                >
                  <div
                    :class="{ 'e_input_error': !error.telegramCode.isValid }"
                    class="e_input_control input-sms-code"
                  >
                    <div class="e_input_field">
                      <input
                        id="telegramCode"
                        v-model="securityForm.telegramCode"
                        :data-value="securityForm.telegramCode"
                        growing-ignore="true"
                        type="text"
                        autocomplete="off"
                        class="e_input"
                        required
                      >
                      <label
                        for="telegramCode"
                        class="e_label"
                      >{{ $t('TEXT_TELEGRAM_VERIFICATION_CODE') }}</label>
                      <a
                        :class="{ 'disabled': reSendStatus.telegramCode.type === 1, 'loading': reSendStatus.telegramCode.isSending }"
                        :disabled="reSendStatus.telegramCode.isSending"
                        href="javascript:;"
                        class="send-cms-code"
                        @click="sendCode(CONSTANT.SEND_CODE.TELEGRAM)"
                      >
                        <span v-if="reSendStatus.telegramCode.type === 0">{{ $t('BTN_SEND') }}</span>
                        <span
                          v-if="reSendStatus.telegramCode.type === 1"
                        >{{ $t('MSG_RETRY_AFTER', { remain: reSendStatus.telegramCode.remain }) }}</span>
                        <span
                          v-if="reSendStatus.telegramCode.type === 2"
                        >{{ $t('BTN_SEND_AGAIN') }}</span>
                      </a>
                    </div>
                    <div v-if="!error.telegramCode.isValid" class="e_input_bottom_message">
                      <span class="error_message">{{ error.telegramCode.msg }}</span>
                    </div>
                  </div>
                </div>

                <!-- 2FA -->
                <div v-if="currentUser.isUseSecurity2Fa === !0" class="group">
                  <div :class="{ 'e_input_error': !error.gaCode.isValid }" class="e_input_control">
                    <div class="e_input_field">
                      <input
                        id="gaCode"
                        v-model="securityForm.gaCode"
                        :data-value="securityForm.gaCode"
                        growing-ignore="true"
                        type="text"
                        autocomplete="off"
                        class="e_input"
                        required
                      >
                      <label for="gaCode" class="e_label">{{ $t('TEXT_GA_CODE') }}</label>
                    </div>
                    <div v-if="!error.gaCode.isValid" class="e_input_bottom_message">
                      <span class="error_message">{{ error.gaCode.msg }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="group reg_button">
                  <div class="button_control">
                    <button class="button text_button" type="submit">
                    <span class="slot_box">
                      <span>{{ $t('BTN_CONFIRM') | uppercase }}</span>
                    </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  </el-dialog>
</template>
<script>
import CONSTANT from '@/configs/constant'
export default {
  data () {
    return {
      securityForm: {
        emailCode: '',
        phoneCode: '',
        gaCode: '',
        telegramCode: ''
      },
      isReSend: {
        emailCode: {
          type: 0,
          remain: 60,
          isSending: false
        },
        phoneCode: {
          type: 0,
          remain: 60,
          isSending: false
        },
        telegramCode: {
          type: 0,
          remain: 60,
          isSending: false
        }
      },
      CONSTANT,
      isProcessing: false
    }
  },
  computed: {
    modalData () {
      return this.$store.getters.modalData
    },
    isShowSecurityConfirm: {
      get () {
        return this.$store.getters.isShowSecurityConfirm
      },
      set (val) {
        this.$store.dispatch('toggleSecurityConfirm')
      }
    },
    currentUser () {
      return this.$store.getters.user
    },
    email () {
      return this.currentUser.email || this.modalData.email
    },
    reSendStatus () {
      return this.isReSend
    },
    error () {
      return {
        emailCode: {
          isValid: true,
          msg: ''
        },
        phoneCode: {
          isValid: true,
          msg: ''
        },
        gaCode: {
          isValid: true,
          msg: ''
        },
        telegramCode: {
          isValid: true,
          msg: ''
        }
      }
    },
    // Show warning when change security setting
    isChangeSecurity () {
      return (
        this.modalData.action === CONSTANT.SECURITY.RESET_PASSWORD ||
        this.modalData.action === CONSTANT.SECURITY.TURN_ON_2FA ||
        this.modalData.action === CONSTANT.SECURITY.TURN_OFF_2FA ||
        this.modalData.action === CONSTANT.SECURITY.RESET_2FA ||
        this.modalData.action === CONSTANT.SECURITY.LINK_2FA ||
        this.modalData.action === CONSTANT.SECURITY.TURN_ON_PHONE ||
        this.modalData.action === CONSTANT.SECURITY.TURN_OFF_PHONE ||
        this.modalData.action === CONSTANT.SECURITY.CHANGE_PHONE ||
        this.modalData.action === CONSTANT.SECURITY.LINK_PHONE ||
        this.modalData.action === CONSTANT.SECURITY.TURN_ON_TELEGRAM ||
        this.modalData.action === CONSTANT.SECURITY.TURN_OFF_TELEGRAM ||
        this.modalData.action === CONSTANT.SECURITY.CHANGE_TELEGRAM ||
        this.modalData.action === CONSTANT.SECURITY.RESET_TELEGRAM
      )
    }
  },
  methods: {
    onOpen () {
      // Reset form
      this.securityForm = {
        emailCode: '',
        phoneCode: '',
        gaCode: '',
        telegramCode: ''
      }
    },
    sendCode (type) {
      if (
        type === CONSTANT.SEND_CODE.EMAIL &&
        (this.reSendStatus.emailCode.type === 1 ||
          this.reSendStatus.emailCode.isSending)
      ) {
        return
      } else if (
        type === CONSTANT.SEND_CODE.PHONE &&
        (this.reSendStatus.phoneCode.type === 1 ||
          this.reSendStatus.phoneCode.isSending)
      ) {
        return
      } else if (
        type === CONSTANT.SEND_CODE.TELEGRAM &&
        (this.reSendStatus.telegramCode.type === 1 ||
          this.reSendStatus.telegramCode.isSending)
      ) {
        return
      }

      if (type === CONSTANT.SEND_CODE.EMAIL) {
        this.isReSend.emailCode.isSending = true
      } else if (type === CONSTANT.SEND_CODE.PHONE) {
        this.isReSend.phoneCode.isSending = true
      } else if (type === CONSTANT.SEND_CODE.TELEGRAM) {
        this.isReSend.telegramCode.isSending = true
      }
      let temp = {
        type: type
      }
      let data = Object.assign(temp, this.modalData)
      this.$store.dispatch('sendVerificationCode', data).then(rs => {
        if (rs) {
          if (type === CONSTANT.SEND_CODE.EMAIL) {
            this.isReSend.emailCode.remain = 60
          } else if (type === CONSTANT.SEND_CODE.PHONE) {
            this.isReSend.phoneCode.remain = 60
          } else if (type === CONSTANT.SEND_CODE.TELEGRAM) {
            this.isReSend.telegramCode.remain = 60
          }
          this.runCountDownResend(type)
        }
        if (type === CONSTANT.SEND_CODE.EMAIL) {
          this.isReSend.emailCode.isSending = false
        } else if (type === CONSTANT.SEND_CODE.PHONE) {
          this.isReSend.phoneCode.isSending = false
        } else if (type === CONSTANT.SEND_CODE.TELEGRAM) {
          this.isReSend.telegramCode.isSending = false
        }
      })
    },
    confirmSecurity () {
      if (!this.isValidateForm()) return
      this.isProcessing = true
      this.securityForm.resetToken = this.currentUser.resetToken
      let data = Object.assign(this.securityForm, this.modalData)
      this.$store.dispatch('confirmSecurity', data).then(rs => {
        this.isProcessing = false
        rs && this.handleAfterConfirm(rs)
      })
    },
    runCountDownResend (type) {
      if (type === CONSTANT.SEND_CODE.EMAIL) {
        this.isReSend.emailCode.type = 1
        this.isReSend.emailCode.remain--
        if (this.isReSend.emailCode.remain > 0) {
          setTimeout(() => {
            this.runCountDownResend(type)
          }, 1000)
        } else {
          this.isReSend.emailCode.type = 2
        }
      } else if (type === CONSTANT.SEND_CODE.PHONE) {
        this.isReSend.phoneCode.type = 1
        this.isReSend.phoneCode.remain--
        if (this.isReSend.phoneCode.remain > 0) {
          setTimeout(() => {
            this.runCountDownResend(type)
          }, 1000)
        } else {
          this.isReSend.phoneCode.type = 2
        }
      } else if (type === CONSTANT.SEND_CODE.TELEGRAM) {
        this.isReSend.telegramCode.type = 1
        this.isReSend.telegramCode.remain--
        if (this.isReSend.telegramCode.remain > 0) {
          setTimeout(() => {
            this.runCountDownResend(type)
          }, 1000)
        } else {
          this.isReSend.telegramCode.type = 2
        }
      }
    },
    handleAfterConfirm (response) {
      // Close confirm modal
      this.$store.dispatch('toggleSecurityConfirm')
      if (this.$route.name === 'two-factor-authentication' || this.$route.name === 'link-phone') {
        this.$router.push({ name: 'profile' })
      } else if (this.$route.name === 'apikey') {
        // Reset create api form
        this.$store.dispatch('setResetCreateApiFormNotify')
        this.$store.dispatch('getApiKeys')
        // Show secret key form
        if (response && response.secretKey && response.publicKey &&
          this.modalData.action === CONSTANT.SECURITY.CREATE_API_KEY) {
          this.$store.dispatch('setApiSecretKey', response)
          this.$store.dispatch('toggleAPISecretKey')
        }
      } else if (this.$route.name === 'forgot-password') { // Set reset token to recover password
        this.$store.dispatch('setResetToken', this.modalData.resetToken)
      } else if (this.$route.name === 'two-factor-authentication') { // After turn on 2 FA
        this.$router.push({ name: 'profile' })
      } else if (this.$route.name === 'profile') {
        this.$store.dispatch('getUser')
        this.$store.dispatch('getUserActivity')
        if (this.modalData.action === CONSTANT.SECURITY.RESET_2FA) {
          this.$router.push({ name: 'two-factor-authentication' })
        }
      }
    },
    isValidateForm () {
      if (this.securityForm.phoneCode && (isNaN(this.securityForm.phoneCode) ||
        this.securityForm.phoneCode.length > CONSTANT.MAX_SMS_LENGTH)) {
        this.$store.dispatch('showErrorMsg', this.$t('MSG_MUST_BE_NUMBER_AND_LOWER_12_CHAR'))
        return false
      }
      return true
    }
  }
}
</script>
