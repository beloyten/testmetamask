<template>
  <el-dialog
    :title="payment.id ? $t('TITLE_UPDATE_PAYMENT_METHOD') : $t('TEXT_NEW_PAYMENT_METHOD')"
    :visible.sync="isShowOtcPaymentMethod"
    :before-close="handleClose"
    :closeOnClickModal="false"
    :custom-class="'popup'">
    <div class="popup-content" :class="{ 'loading': isLoading }">
      <div class="box-body">
        <form autocomplete="off">
          <div class="modal-field" v-if="otcPayments.length">
            <label>{{ $t('TITLE_PAYMENTS') }}(*)</label>
            <wber-dropdown-list :lists="otcPayments" :disable-search="true"
                                @input="updatePaymentMethod"/>
          </div>
          <div class="modal-field">
            <label for="beneficiary-name">{{ $t('TITLE_BENEFITCARY') }}(*)</label>
            <input id="beneficiary-name" type="text" name="beneficiary-name"
                   v-model="payment.beneficiaryName" @blur="validateBeneficiaryName">
            <span v-if="errorForm.beneficiaryName.error" class="item-error-tip">{{ errorForm.beneficiaryName.errorText }}</span>
          </div>
          <div class="modal-field">
            <label for="bank-name">{{ $t('TITLE_BANK_NAME') }}(*)</label>
            <input id="bank-name" type="text" name="bank-name"
                   v-model="payment.bankName" @blur="validateBankName">
            <span v-if="errorForm.bankName.error" class="item-error-tip">{{ errorForm.bankName.errorText }}</span>
          </div>
          <div class="modal-field">
            <label for="branch-info">{{ $t('TITLE_BANK_INFO') }}</label>
            <input id="branch-info" type="text" name="branch-info"
                   v-model="payment.branchInfo" @blur="validateBranchInfo">
            <span v-if="errorForm.branchInfo.error" class="item-error-tip">{{ errorForm.branchInfo.errorText }}</span>
          </div>
          <div class="modal-field">
            <label for="bank-account">{{ $t('TITLE_BANK_ACCOUNT') }}(*)</label>
            <input
              id="bank-account"
              type="text"
              name="bank-account"
              v-model="payment.bankAccount"
              @blur="validateBankAccount">
            <span v-if="errorForm.bankAccount.error" class="item-error-tip">{{ errorForm.bankAccount.errorText }}</span>
          </div>
          <div class="modal-field">
            <label for="fund-password">{{ $t('TITLE_FUND_PASSWORD') }}(*)</label>
            <input
              id="fund-password"
              type="password"
              name="fund-password"
              onfocus="this.removeAttribute('readonly');"
              v-model="payment.fundPassword"
              @blur="validateFundPassword">
            <span v-if="errorForm.fundPassword.error" class="item-error-tip">{{ errorForm.fundPassword.errorText }}</span>
          </div>
        </form>
      </div>
      <div class="popup-footer-box">
        <a class="popup-btn btn-cancel btn" href="javascript:;" @click="close">{{ $t('BTN_CANCEL') }}</a>
        <a class="popup-btn btn" @click="handlePaymentMethod" style="color: #ffffff;"
        >{{ payment.id ? $t('BTN_UPDATE') : $t('BTN_CREATE') }}</a>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import OtcService from '@/api/otc/OtcService'
import wberDropdownList from '@/components/DropdownList.vue'
import CONSTANT from '@/configs/constant'
export default {
  components: {
    wberDropdownList
  },
  props: ['payment'],
  data () {
    return {
      paymentsMethod: {
      },
      isLoading: false,
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
  computed: {
    otcPayments () {
      return this.$store.getters.otcPayments
    },
    isValidated () {
      return this.payment.beneficiaryName &&
        this.payment.bankName && this.payment.bankAccount
    },
    isShowOtcPaymentMethod: {
      get  () {
        return this.$store.getters.isShowOtcPaymentMethod
      },
      set (val) {
        this.$store.dispatch('toggleOtcPaymentMethod')
      }
    }
  },
  methods: {
    updatePaymentMethod (method) {
      this.payment.paymentMethod = method
    },
    handlePaymentMethod () {
      const validateBankName = this.validateBankName()
      const validateBankAccount = this.validateBankAccount()
      const validateBeneficiaryName = this.validateBeneficiaryName()
      const validateBranchInfo = this.validateBranchInfo()
      // const validateFundPassword = this.validateFundPassword()
      if (!this.isValidated || validateBankName || validateBankAccount || validateBeneficiaryName || validateBranchInfo) {
        this.$store.dispatch('showErrorMsg', this.$t('TITLE_SOME_FIELD_NEED_CHECK_INFO'))
        return
      }
      if (this.payment.id) this.updateUserPaymentMethod()
      else this.createPaymentMethod()
    },
    updateUserPaymentMethod () {
      this.isLoading = true
      this.$google.getCaptcha('updatePaymentMethod')
        .then(token => {
          this.payment.reCaptcha = token
          OtcService.updatePaymentMethod(this.payment).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('toggleOtcPaymentMethod')
              this.$store.dispatch('getUserPayments')
            }
            this.isLoading = false
          })
        }).catch(e => {
          this.isLoading = false
          this.close()
        })
    },
    createPaymentMethod () {
      this.isLoading = true
      this.$google.getCaptcha(CONSTANT.RECAPTCHA.OTC_CREATE_PAYMENT)
        .then(token => {
          this.payment.reCaptcha = token
          OtcService.createPaymentMethod(this.payment).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('toggleOtcPaymentMethod')
              this.$store.dispatch('getUserPayments')
            }
            this.isLoading = false
          })
        }).catch(e => {
          this.isLoading = false
          this.$store.dispatch('toggleOtcPaymentMethod')
        })
    },
    close () {
      this.handleClose()
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    validateBankName () {
      this.errorForm.bankName.error =
        (this.payment.bankName && this.payment.bankName.length > 80)
      this.errorForm.bankName.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 80 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.bankName.error
    },
    validateBeneficiaryName () {
      this.errorForm.beneficiaryName.error =
        (this.payment.beneficiaryName && this.payment.beneficiaryName.length > 80)
      this.errorForm.beneficiaryName.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 80 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.beneficiaryName.error
    },
    validateBankAccount () {
      this.errorForm.bankAccount.error =
        (this.payment.bankAccount && this.payment.bankAccount.length > 50)
      this.errorForm.bankAccount.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 50 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.bankAccount.error
    },
    validateFundPassword () {
      this.errorForm.fundPassword.error =
        (this.payment.fundPassword && this.payment.fundPassword.length > 20)
      this.errorForm.fundPassword.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 20 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.fundPassword.error
    },
    validateBranchInfo () {
      this.errorForm.branchInfo.error =
        (this.payment.branchInfo && this.payment.branchInfo.length > 200)
      this.errorForm.branchInfo.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 200 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.branchInfo.error
    },
    handleClose (done) {
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
      done && done()
    }
  }
}
</script>
