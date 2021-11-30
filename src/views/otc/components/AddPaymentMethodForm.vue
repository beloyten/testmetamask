<template>
  <v-dialog persistent
    v-model="openForm"
    :loading="isLoading"
    max-width="610px"
  >
    <v-card class="">
      <v-card-title class="form-title">
        {{ payment.id ? $t('TITLE_UPDATE_PAYMENT_METHOD') : $t('TEXT_NEW_PAYMENT_METHOD') }}
      </v-card-title>
      <v-card-text>
        <v-flex class="d-flex flex-row align-center yellow lighten-5 pa-2">
          <v-icon color="">mdi-information-outline</v-icon>
          <span class="ml-5">
            Please make sure you add your bank card number for instant payments. Do not include details of other banks or payment methods. You must add the payment details of the selected bank.
          </span>
        </v-flex>
      </v-card-text>
      <v-card-text>
        <v-form>
          <v-select solo flat
            label="Select Payment Method"
            background-color="#F6F8FA"
            v-model="selectedPaymentMethod"
            item-value="id"
            item-text="fullName"
            :items="otcPayments"
          />

          <v-text-field solo flat
            background-color="#F6F8FA"
            v-model="payment.beneficiaryName"
            @blur="validateBeneficiaryName"
            :placeholder="$t('TITLE_BENEFITCARY')"
          />

          <v-text-field solo flat
            background-color="#F6F8FA"
            v-model="payment.bankName"
            @blur="validateBankName"
            :placeholder="$t('TITLE_BANK_NAME')"
          />

          <v-text-field solo flat
            background-color="#F6F8FA"
            v-model="payment.branchInfo"
            @blur="validateBranchInfo"
            :placeholder="$t('TITLE_BANK_INFO')"
          />

          <v-text-field solo flat
            background-color="#F6F8FA"
            v-model="payment.bankAccount"
            @blur="validateBankAccount"
            :placeholder="$t('TITLE_BANK_ACCOUNT')"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pb-8">
        <v-spacer />
        <v-btn text
          color="primary"
          class="px-5"
          @click="closePopup()"
        >
          {{ $t('BTN_CANCEL') }}
        </v-btn>
        <v-btn
          color="primary"
          class="ml-8 px-12"
          @click="handlePaymentMethod"
        >
          {{ payment.id ? $t('BTN_UPDATE') : $t('BTN_CREATE') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONSTANT from '@/configs/constant'
import OtcService from '@/api/otc/OtcService'

export default {
  data () {
    return {
      isLoading: false,
      selectedPaymentMethod: '',
      paymentMethod: '',
      beneficiaryName: '',
      bankName: '',
      branchInfo: '',
      bankAccount: '',
      errorForm: {
        beneficiaryName: {
          error: false,
          errorText: ''
        },
        bankName: {
          error: false,
          errorText: ''
        },
        branchInfo: {
          error: false,
          errorText: ''
        },
        bankAccount: {
          error: false,
          errorText: ''
        },
        fundPassword: {
          error: false,
          errorText: ''
        }
      }
    }
  },
  props: ['payment', 'openForm'],
  computed: {
    otcPayments () {
      return this.$store.getters.otcPayments
    },
    isValidated () {
      return this.payment.beneficiaryName &&
        this.payment.bankName && this.payment.bankAccount
    },
    isVisible () {
      return this.$store.getters.isShowUserConnectFormModal
    }
  },
  created () {
    // get system payment methods
    if (!this.otcPayments) {
      this.isLoading = true
      this.$store.dispatch('getPaymentMethods')
        .then(() => {
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    }

    this.payment.paymentMethod = this.otcPayments[0]
    this.selectedPaymentMethod = this.payment.paymentMethod.id
  },
  methods: {
    handlePaymentMethod () {
      // validate the form
      const validateBankName = this.validateBankName()
      const validateBankAccount = this.validateBankAccount()
      const validateBeneficiaryName = this.validateBeneficiaryName()
      const validateBranchInfo = this.validateBranchInfo()
      if (!this.isValidated || validateBankName || validateBankAccount || validateBeneficiaryName || validateBranchInfo) {
        // this.$store.dispatch('showErrorMsg', this.$t('TITLE_SOME_FIELD_NEED_CHECK_INFO'))
        return
      }
      this.payment.paymentMethod = this.otcPayments.filter(pm => {
        return pm.id === this.selectedPaymentMethod
      })[0]
      // alert(this.selectedPaymentMethod)
      if (this.payment.id) this.updateUserPaymentMethod()
      else this.createPaymentMethod()
    },
    validateBeneficiaryName () {
      this.errorForm.beneficiaryName.error =
        (this.payment.beneficiaryName && this.payment.beneficiaryName.length > 80) || !this.payment.beneficiaryName

      if (!this.payment.beneficiaryName) this.errorForm.beneficiaryName.errorText = this.$t('MSG_FIELD_REQUIRED')
      else this.errorForm.beneficiaryName.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 80 + ' ' + this.$t('TEXT_CHARACTERS')

      return this.errorForm.beneficiaryName.error
    },
    validateBankName () {
      this.errorForm.bankName.error =
        (this.payment.bankName && this.payment.bankName.length > 80) || !this.payment.bankName

      if (!this.payment.bankName) this.errorForm.bankName.errorText = this.$t('MSG_FIELD_REQUIRED')
      else this.errorForm.bankName.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 80 + ' ' + this.$t('TEXT_CHARACTERS')

      return this.errorForm.bankName.error
    },
    validateBankAccount () {
      this.errorForm.bankAccount.error =
        (this.payment.bankAccount && this.payment.bankAccount.length > 50) || !this.payment.bankAccount

      if (!this.payment.bankAccount) this.errorForm.bankAccount.errorText = this.$t('MSG_FIELD_REQUIRED')
      else this.errorForm.bankAccount.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 50 + ' ' + this.$t('TEXT_CHARACTERS')

      return this.errorForm.bankAccount.error
    },
    validateBranchInfo () {
      this.errorForm.branchInfo.error =
        (this.payment.branchInfo && this.payment.branchInfo.length > 200)
      if (!this.payment.branchInfo) this.errorForm.branchInfo.errorText = this.$t('MSG_FIELD_REQUIRED')

      this.errorForm.branchInfo.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 200 + ' ' + this.$t('TEXT_CHARACTERS')

      return this.errorForm.branchInfo.error
    },
    updateUserPaymentMethod () {
      this.isLoading = true
      this.$google.getCaptcha('updatePaymentMethod')
        .then(token => {
          this.payment.reCaptcha = token
          OtcService.updatePaymentMethod(this.payment).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getUserPayments')
            }
            this.closePopup()
            this.isLoading = false
          })
        }).catch(e => {
          this.closePopup()
          this.isLoading = false
        })
    },
    createPaymentMethod () {
      this.isLoading = true
      this.$google.getCaptcha(CONSTANT.RECAPTCHA.OTC_CREATE_PAYMENT)
        .then(token => {
          this.payment.reCaptcha = token
          OtcService.createPaymentMethod(this.payment).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getUserPayments')
            }
            this.isLoading = false
            this.closePopup()
          })
        }).catch(e => {
          this.isLoading = false
          this.closePopup()
        })
    },
    closePopup () {
      this.payment.beneficiaryName = ''
      this.payment.bankName = ''
      this.payment.branchInfo = ''
      this.payment.bankAccount = ''
      this.payment.fundPassword = ''
      this.errorForm = {
        beneficiaryName: {
          error: false,
          errorText: ''
        },
        bankName: {
          error: false,
          errorText: ''
        },
        branchInfo: {
          error: false,
          errorText: ''
        },
        bankAccount: {
          error: false,
          errorText: ''
        },
        fundPassword: {
          error: false,
          errorText: ''
        }
      }

      // this.$emit('update:openForm', false)
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    createPayment () {
      if (this.beneficiaryName.trim() === '' || this.bankName.trim() === '' || this.bankAccount.trim() === '' || this.fundPassword.trim() === '') {
        this.$store.dispatch('showErrorMsg', 'Vui lòng điền đầy đủ thông tin.')
      } else {
        this.$store.dispatch('showSuccessMsg', 'Tạo phương thức thanh toán thành công.')
        this.closePopup()
      }
    }
  }
}
</script>
<style scoped>
  .item-error-tip {
    margin-left: calc(4.17vw);
  }
</style>
