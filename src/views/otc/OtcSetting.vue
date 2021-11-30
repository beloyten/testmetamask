<template>
<v-main class="otc-setting-page">
  <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
    <v-card flat class="pa-5">
      <v-card-title>
        <v-toolbar flat tile>
          <v-toolbar-title><span class="text-h5">{{ $t('TEXT_OTC_SETTINGS') }}</span></v-toolbar-title>
          <v-spacer />
          <v-btn outlined v-if="selected === 'payment-setting'"
            color="primary"
            class="shrink"
            :ripple="false"
            @click="addNew"
          >
            {{ $t('BTN_ADD_BANK') }}
          </v-btn>
          <v-text-field solo flat hide-details rounded
            v-if="selected === 'payment-setting'"
            background-color="#F8F9F9"
            color="#0000001f"
            v-model="search"
            placeholder="Input search"
            class="shrink ml-6"
            append-icon="mdi-magnify"
          />
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-row class="ma-0">
          <v-col cols="12" md="6" lg="6" xl="4" class="pa-0">
            <v-tabs grow
              v-model="selected"
              class=""
            >
              <v-tab :href="`#user-info`" class="px-0 justify-start mr-15">{{ $t('TEXT_TITLE_USER_INFO') }}</v-tab>
              <v-tab :href="`#payment-setting`" class="px-0 justify-start">{{ $t('TEXT_PAYMENTS_SETTING') }}</v-tab>
            </v-tabs>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="body-item">
        <v-tabs-items v-model="selected">
          <v-tab-item :value="`user-info`">
            <v-card flat tile
              class="change-fund-password"
              color="transparent"
            >
              <v-row class="ma-0">
                <v-col cols="12" md="4" class="pa-0">
                  <v-form class="my-15">
                    <v-text-field solo flat filled
                      v-model="nickname"
                      background-color="#F6F8FA"
                      placeholder="Nickname..."
                      class="shrink"
                    />
                    <v-text-field solo flat filled
                      v-model="currentFundPassword"
                      background-color="#F6F8FA"
                      placeholder="Current Fund Password..."
                      type="password"
                      class="shrink"
                    />
                    <v-text-field solo flat filled
                      v-model="newFundPassword"
                      background-color="#F6F8FA"
                      placeholder="New Fund Password..."
                      type="password"
                      class="shrink"
                    />
                    <v-text-field solo flat filled
                      v-model="confirmNewFundPassword"
                      background-color="#F6F8FA"
                      placeholder="Confirm New Fund Password..."
                      type="password"
                      class="shrink"
                    />
                  </v-form>
                  <v-row class="ma-0 pt-10">
                    <v-col cols="12" md="6" class="pa-0 pr-5">
                      <v-btn outlined plain block
                        depressed
                        color="primary"
                        :ripple="false"
                        @click="clearData()"
                      >
                        {{ $t('BTN_CANCEL') }}
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-0">
                      <v-btn block depressed
                        color="primary"
                        @click="submit()"
                      >
                        {{ $t('BTN_CONFIRM') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="8" class="pa-0 d-flex justify-center align-center">
                  <img src="/assets/images/change-fund-password-image.svg" alt="" />
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="`payment-setting`">
            <v-card flat tile
              color="transparent"
            >
              <v-card-text>
                <v-data-table hide-default-footer disable-sort
                  :headers="dataTableHeaders"
                  :items="otcUserPayments"
                >
                  <template v-slot:no-data>
                    <no-data message="No data to display."/>
                  </template>
                  <template slot="item.no" slot-scope="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template slot="item.ctrl" slot-scope="{ item }">
                    <v-flex class="d-flex flex-row justify-space-around">
                    <v-switch flat
                      v-model="item.active"
                      @click.native.prevent.stop.capture="changeState($event, item)"
                    />
                    <v-btn icon
                      color="primary"
                      class="mt-4"
                      :ripple="false"
                      @click="showEditModal(item)"
                    >
                      <v-icon size="24">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon
                      color="accent"
                      class="mt-4"
                      @click="deletePayment(item)"
                    >
                      <v-icon size="24">mdi-trash-can-outline</v-icon>
                    </v-btn>
                    </v-flex>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

    </v-card>
  </section>
  <AddPaymentMethodForm v-if="isShowOtcPaymentMethod" :openForm="isShowOtcPaymentMethod" :payment="selectedPayment" />
</v-main>
</template>
<script>
import AddPaymentMethodForm from './components/AddPaymentMethodForm'
import OtcService from '@/api/otc/OtcService'
import CONSTANT from '@/configs/constant'
import _ from 'lodash'
import NoData from './components/NoData.vue'

export default {
  components: {
    AddPaymentMethodForm,
    NoData
  },
  computed: {
    otcUserPayments () {
      return this.$store.getters.otcUserPayments
    },
    isShowOtcPaymentMethod: {
      get  () {
        return this.$store.getters.isShowOtcPaymentMethod
      }
    },
    isValidated () {
      return this.form.oldFundPassword && true
    }
  },
  data () {
    return {
      selected: 'user-info',
      search: '',
      selectedPayment: {},
      nickname: '',
      currentFundPassword: '',
      newFundPassword: '',
      confirmNewFundPassword: '',
      isUpdating: false,
      dataTableHeaders: [
        {
          text: this.$t('TEXT_NO'),
          align: 'start',
          value: 'no',
          width: '8%'
        },
        {
          text: this.$t('TITLE_BENEFITCARY'),
          value: 'beneficiaryName',
          width: '20%'
        },
        {
          text: this.$t('TITLE_BANK_NAME'),
          value: 'bankName',
          width: '20%'
        },
        {
          text: this.$t('TITLE_BANK_INFO'),
          value: 'branchInfo',
          width: '20%'
        },
        {
          text: this.$t('TITLE_BANK_ACCOUNT'),
          value: 'bankAccount',
          width: '15%'
        },
        {
          text: this.$t('TITLE_CONTROL'),
          value: 'ctrl',
          width: '17%'
        }
      ],
      form: {
        oldFundPassword: '',
        fundPassword: '',
        reFundPassword: ''
      },
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
      }
    }
  },
  async created () {
    this.isLoading = true
    await this.$store.dispatch('getUserPayments')
    await this.$store.dispatch('getPaymentMethods')

    // this.$store.dispatch('getKycInfo')
    if (this.$route.query.act) {
      this.selected = this.$route.query.act
    } else {
      this.selected = 'user-info'
    }
  },
  methods: {
    select (selector) {
      this.selected = selector
    },
    addNew () {
      this.selectedPayment = {}
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    showEditModal (item) {
      this.selectedPayment = JSON.parse(JSON.stringify(item))
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    clearData () {
      this.nickname = ''
      this.currentFundPassword = ''
      this.newFundPassword = ''
      this.confirmNewFundPassword = ''
    },
    changeState (ev, i) {
      let activePayments = this.otcUserPayments.filter(temp => {
        return temp.active
      })
      if (!i.active && activePayments.length >= CONSTANT.OTC.LIMIT_PAYMENT_METHOD) {
        this.$store.dispatch('showErrorMsg', this.$t('TEXT_OVER_LIMIT_PAYMENT_METHOD'))
        return
      }
      let obj = _.clone(i)
      let data = {
        message: this.$t('Do you want to On/Off payment method ' + obj.bankName + ' - ' + obj.bankAccount),
        data: obj,
        action: 'togglePaymentStatus'
      }
      if ((obj.active && activePayments.length > 1) || !obj.active) {
        this.$store.dispatch('toggleConfirmModal', data)
      } else {
        this.$store.dispatch('showErrorMsg', this.$t('COMMON_OTC_TITLE_PAYMENT'))
      }
    },
    deletePayment (payment) {
      let activePayments = this.otcUserPayments.filter(temp => {
        return temp.active
      })
      let data = {
        data: payment,
        message: this.$t('CONFIRM_DELETE_PAYMENT', { 'bankName': payment.bankName, 'bankAccount': payment.bankAccount }),
        action: 'deletePaymentMethod'
      }
      if (activePayments.length > 1 || !payment.active) {
        this.$store.dispatch('toggleConfirmModal', data)
      } else {
        this.$store.dispatch('showErrorMsg', this.$t('COMMON_OTC_TITLE_PAYMENT'))
      }
    },
    submit () {
      if (!this.isValidated) return
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

      // if (this.nickname.trim() !== '' && this.currentFundPassword.trim() !== '' && this.newFundPassword.trim() !== '' && this.confirmNewFundPassword.trim() !== '') {
      //   if (this.newFundPassword === this.confirmNewFundPassword) {
      //     this.$store.dispatch('showSuccessMsg', 'Cập nhật thành công!')
      //   } else {
      //     this.$store.dispatch('showErrorMsg', 'Mật khẩu không trùng khớp.')
      //   }
      // } else {
      //   this.$store.dispatch('showErrorMsg', 'Vui lòng điền đầy đủ thông tin.')
      // }
    }
  }
}
</script>
