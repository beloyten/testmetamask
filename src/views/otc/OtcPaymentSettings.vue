<template>
  <div class="otc-payment-settings">
    <div class="otc-trade-menu menu-buy-sell">
      <ul class="clearfix">
        <li class=""
          :class="{ 'active': currentTab == 'change_fund_password' }" >
          <a @click="gotoTab('change_fund_password')"><span>{{ $t('TEXT_CHANGE_FUND_PASSWORD') }}</span></a>
        </li>
        <li class=""
          :class="{ 'active': currentTab == 'payments_setting' }">
          <a @click="gotoTab('payments_setting')"><span>{{ $t('TEXT_PAYMENTS_SETTING') }}</span></a>
        </li>
      </ul>
    </div>
    <!-- <div class="otc-create-head" v-if="kycInfo.kycLevel">
      <h2>{{ $t('TEXT_CHANGE_FUND_PASSWORD') }}</h2>
    </div> -->
    <div class="otc-trade-body" v-if="currentTab == 'change_fund_password'">
      <div class="otc-update-fun-password" v-if="user.nickname">
        <div class="otc-update-item">
          <label>{{ $t('TEXT_NICKNAME') }}</label>
          <input
            type="text"
            class="otc-nickname"
            disabled
            :placeholder="user.nickname"
            >
        </div>
        <div class="otc-update-item">
          <label>{{ $t('TEXT_CURRENT_FUND_PASSWORD') }}(*)</label>
          <input
            type="password"
            onfocus="this.removeAttribute('readonly')"
            v-model="form.oldFundPassword"
            oninput="this.value = this.value.replace(/[^a-zA-Z0-9@#$%&*]/g, '').replace(/(\..*)\./g, '$1')"
          >
          <!-- <span v-if="errorForm.oldFundPassword.error" class="item-error-tip" v-html="$t(errorForm.oldFundPassword.errorText)"></span> -->
        </div>
        <div class="otc-update-item">
          <label>{{ $t('TEXT_NEW_FUND_PASSWORD') }}(*)</label>
          <input
            type="password"
            onfocus="this.removeAttribute('readonly')"
            v-model="form.fundPassword"
            oninput="this.value = this.value.replace(/[^a-zA-Z0-9@#$%&*]/g, '').replace(/(\..*)\./g, '$1')"
            @blur="validateFundPassword"
          >
          <span v-if="errorForm.fundPassword.error" class="item-error-tip" v-html="$t(errorForm.fundPassword.errorText)"></span>
        </div>
        <div class="otc-update-item">
          <label>{{ $t('TEXT_CONFIRM_NEW_FUND_PASSWORD') }}(*)</label>
          <input
            type="password"
            autocomplete="new-password"
            onfocus="this.removeAttribute('readonly')"
            v-model="form.reFundPassword"
            oninput="this.value = this.value.replace(/[^a-zA-Z0-9@#$%&*]/g, '').replace(/(\..*)\./g, '$1')"
            @blur="validateReFundPassword"
          >
          <span v-if="errorForm.reFundPassword.error" class="item-error-tip" v-html="$t(errorForm.reFundPassword.errorText)"></span>
        </div>
        <div class="otc-update-item">
          <a class="otc-btn loading-20"
            :class="{ 'disabled': !isValidated, 'loading': isUpdating }"
            @click="update"
            href="javascript:">{{ $t('BTN_CONFIRM') }}</a>
        </div>
      </div>
    </div>
    <!-- <div class="otc-create-head">
      <h2>{{ $t('TEXT_PAYMENTS_SETTING') }}</h2>
      <p v-if="kycInfo.kycLevel">
        <a href="javascript:" class="otc-btn otc-add-bank" @click="addNew">{{ $t('BTN_ADD_BANK') }}</a>
      </p>
    </div> -->
    <div class="otc-trade-body otc-list-orders" v-if="currentTab == 'payments_setting'">
      <p v-if="user.nickname">
        <a href="javascript:" class="otc-btn otc-add-bank" @click="addNew">{{ $t('BTN_ADD_BANK') }}</a>
      </p>
      <dl>
        <dt class="clearfix">
          <div class="item-no w-10 pl-20">{{ $t('TEXT_NO') }}.</div>
          <div class="w-20">{{ $t('TITLE_BENEFITCARY') }}</div>
          <div class="w-15">{{ $t('TITLE_BANK_NAME') }}</div>
          <div class="w-20">{{ $t('TITLE_BANK_INFO') }}</div>
          <div class="w-15">{{ $t('TITLE_BANK_ACCOUNT') }}</div>
          <div class="w-20 text-right pr-20">{{ $t('TITLE_CONTROL') }}</div>
        </dt>
      </dl>
      <dl :class="{ 'loading': isLoading }">
        <dd class="clearfix" v-for="(i, index) in otcUserPayments" :key="i.id">
          <div class="item-no w-10 pl-20">
            <label class="mobile-label">{{ $t('TEXT_NO') }}</label>
            {{ index + 1 }}
          </div>
          <div class="w-20 otc-font-medium otc-buy-color">
            <label class="mobile-label">{{ $t('TITLE_BENEFITCARY') }}</label>
            {{ i.beneficiaryName }}
          </div>
          <div class="w-15">
            <label class="mobile-label">{{ $t('TITLE_BANK_NAME') }}</label>
            {{ i.bankName }}
          </div>
          <div class="w-20">
            <label class="mobile-label">{{ $t('TITLE_BANK_INFO') }}</label>
            {{ i.branchInfo }}
          </div>
          <div class="w-15 ">
            <label class="mobile-label">{{ $t('TITLE_BANK_ACCOUNT') }}</label>
            {{ i.bankAccount }}
          </div>
          <div class="w-20 text-right pr-20">
            <label class="mobile-label">{{ $t('TITLE_CONTROL') }}</label>
            <a :title="$t('TEXT_DISABLE')" class="switch-wrap"
              @click="changeState(i)">
              <span class="switch-icon" :class="{ 'on': i.active, 'off': !i.active }">
                <em>{{ i.active ? 'On' : 'Off' }}</em>
              </span>
            </a>
            <a :title="$t('BTN_EDIT')" @click="showEditModal(i)"><i class="hb_icon_edit color-blue"/></a>
            <a @click="deletePayment(i)"><i class="hb_icon_ash_can otc-sell-color"></i></a>
          </div>
        </dd>
      </dl>
      <EmptyData v-if="!otcUserPayments.length"/>
    </div>
    <PaymentMethodForm :payment="selectedPayment"/>
  </div>
</template>
<script>
import PaymentMethodForm from './components/PaymentMethodForm'
import CONSTANT from '@/configs/constant'
import EmptyData from '@/components/EmptyData'
import OtcService from '@/api/otc/OtcService'
import UtilService from '@/utils/UtilService'
import _ from 'lodash'
export default {
  components: {
    PaymentMethodForm,
    EmptyData
  },
  data () {
    return {
      openModalBank: false,
      selectedPayment: {},
      isLoading: false,
      form: {
        oldFundPassword: '',
        fundPassword: '',
        reFundPassword: ''
      },
      isUpdating: false,
      errorForm: {
        oldFundPassword: {
          error: false,
          errorText: ''
        },
        fundPassword: {
          error: false,
          errorText: ''
        },
        reFundPassword: {
          error: false,
          errorText: ''
        }
      },
      currentTab: 'change_fund_password'
    }
  },
  computed: {
    otcUserPayments () {
      return this.$store.getters.otcUserPayments
    },
    kycInfo () {
      return this.$store.getters.kycInfo
    },
    user () {
      return this.$store.getters.user
    },
    isValidated () {
      return this.form.oldFundPassword && this.form.fundPassword && this.form.reFundPassword &&
        this.form.fundPassword === this.form.reFundPassword
    }
  },
  watch: {
    openModalBank: function () {
      this.$store.dispatch('toggleOtcPaymentMethod')
    }
  },
  async created () {
    this.isLoading = true
    await this.$store.dispatch('getUserPayments')
    setTimeout(() => {
      this.isLoading = false
    }, 300)
    this.$store.dispatch('getPaymentMethods')
    this.$store.dispatch('getKycInfo')
    if (this.$route.query.currentTab) {
      this.currentTab = this.$route.query.currentTab
    } else {
      this.currentTab = 'change_fund_password'
    }
  },
  methods: {
    deletePayment (i) {
      let activePayments = this.otcUserPayments.filter(temp => {
        return temp.active
      })
      let data = {
        data: i,
        action: 'deletePaymentMethod'
      }
      if (activePayments.length > 1 || !i.active) {
        this.$store.dispatch('toggleConfirmFundPasswordModal', data)
      } else {
        this.$store.dispatch('showErrorMsg', this.$t('COMMON_OTC_TITLE_PAYMENT'))
      }
    },
    async gotoTab (key) {
      this.currentTab = key
      this.$router.push({
        name: 'otc-payment-settings',
        query: { currentTab: key }
      })
    },
    changeState (i) {
      let activePayments = this.otcUserPayments.filter(temp => {
        return temp.active
      })
      if (!i.active && activePayments.length >= CONSTANT.OTC.LIMIT_PAYMENT_METHOD) {
        this.$store.dispatch('showErrorMsg', this.$t('TEXT_OVER_LIMIT_PAYMENT_METHOD'))
        return
      }
      let obj = _.clone(i)
      let data = {
        data: obj,
        action: 'togglePaymentStatus'
      }
      if ((obj.active && activePayments.length > 1) || !obj.active) {
        this.$store.dispatch('toggleConfirmFundPasswordModal', data)
      } else {
        this.$store.dispatch('showErrorMsg', this.$t('COMMON_OTC_TITLE_PAYMENT'))
      }
    },
    showEditModal (i) {
      this.selectedPayment = JSON.parse(JSON.stringify(i))
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    addNew () {
      this.selectedPayment = {}
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    update () {
      // const validateOldFundPassword = this.validateOldFundPassword()
      const validateFundPassword = this.validateFundPassword()
      const validateReFundPassword = this.validateReFundPassword()
      if (!this.isValidated || validateFundPassword || validateReFundPassword) return
      this.isUpdating = true
      let obj = this.form
      this.$google.getCaptcha('updateNewFundPassword')
        .then(async token => {
          obj.reCaptcha = token
          let rs = await OtcService.updateFundPassword(this.form)
          this.isUpdating = false
          if (rs.status === CONSTANT.SUCCESS) {
            this.form = {
              oldFundPassword: '',
              fundPassword: '',
              reFundPassword: ''
            }
          }
        })
    },
    // validateOldFundPassword () {
    //   this.errorForm.oldFundPassword.error = UtilService.validatePassword(this.form.oldFundPassword)
    //   if (UtilService.validatePassword(this.form.oldFundPassword)) {
    //     this.errorForm.oldFundPassword.errorText = this.$t('TEXT_POLICY_PASSWORD')
    //   }
    //   return this.errorForm.oldFundPassword.error
    // },
    validateFundPassword () {
      this.errorForm.fundPassword.error = UtilService.validatePassword(this.form.fundPassword)
      if (UtilService.validatePassword(this.form.fundPassword)) {
        this.errorForm.fundPassword.errorText = this.$t('TEXT_POLICY_PASSWORD')
      }
      return this.errorForm.fundPassword.error
    },
    validateReFundPassword () {
      this.errorForm.reFundPassword.error = (this.form.fundPassword !== this.form.reFundPassword)
      if (this.form.fundPassword !== this.form.reFundPassword) {
        this.errorForm.reFundPassword.errorText = this.$t('TEXT_RECONFIRM_PASSWORD')
      }
      return this.errorForm.reFundPassword.error
    },
    openSetupInfo () {
      this.$store.dispatch('toggleOtcFundPasswordForm')
    }
  }
}
</script>
