<template>
  <v-main class="otc-create-ads-page">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title>
              <span class="text-h5">{{ isCreateMode ? $t('TITLE_CREATE_GEN_AD') : $t('TITLE_UPDATE_GEN_AD') }}</span>
            </v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-subtitle class="text-subtitle-1">
          You can post an ad if you have equivalent assets of at least 15 USD. <a href="javascript();">Help &amp; Guide</a>
        </v-card-subtitle>
        <v-card-text>
          <v-form
            ref="refAdForm"
          >
            <v-row class="mx-0 px-8 my-5">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">Ad Type</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-btn-toggle rounded borderless dense mandatory>
                  <v-btn class="buy-button" width="100" height="40" plain retain-focus-on-click @click="switchType(OTC_TYPE.BUY)">
                    <span>Buy</span>
                  </v-btn>
                  <v-btn class="sell-button" width="100" height="40" plain retain-focus-on-click @click="switchType(OTC_TYPE.SELL)">
                    <span>Sell</span>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-8 mt-10 mb-0">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">Asset &amp; Cash</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-row>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-select solo flat
                      label="Select Currency"
                      background-color="#F6F8FA"
                      item-value="currencyId"
                      @change="updateInputCurrency"
                      :value="adForm.inputCurrency.currencyId"
                      :rules="[rules.required]"
                      :items="otcCurrencies"
                    >
                      <template v-slot:selection="{item}">
                        <!-- HTML that describe how select should render selected items -->
                        {{ item.name + ' (' + item.symbol + ')' }}
                      </template>
                      <template v-slot:item="{item}">
                        <!-- HTML that describe how select should render items when the select is open -->
                        {{ item.name + ' (' + item.symbol + ')' }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-select solo flat
                      background-color="#F6F8FA"
                      item-value="fiatId"
                      label="Select fiat"
                      @change="updateOutputCurrency"
                      :value="adForm.outputCurrency.fiatId"
                      :items="otcUnitCurrencies"
                      :rules="[rules.required]"
                    >
                      <template v-slot:selection="{item}">
                        <!-- HTML that describe how select should render selected items -->
                        {{ item.name + ' (' + item.symbol + ')' }}
                      </template>
                      <template v-slot:item="{item}">
                        <!-- HTML that describe how select should render items when the select is open -->
                        {{ item.name + ' (' + item.symbol + ')' }}
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mt-2 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0"></v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                {{ $t('MOBILE_CM_MARKET_PRICE') }}: <strong>{{ beautyMarketPrice }} {{ adForm.outputCurrency.symbol }}/{{ adForm.inputCurrency.symbol }}</strong>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">{{ $t('LBL_TABLE_PRICE') }}</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-row>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-select solo flat
                      background-color="#F6F8FA"
                      label="Select Price Type"
                      item-value="id"
                      :value="adForm.priceType.id"
                      :items="priceType"
                      :rules="[rules.required]"
                      @change="updatePriceType"
                    >
                      <template slot="selection" slot-scope="data">
                        <!-- HTML that describe how select should render selected items -->
                        {{ $t(data.item.name) }}
                      </template>
                      <template slot="item" slot-scope="data">
                        <!-- HTML that describe how select should render items when the select is open -->
                        {{ $t(data.item.name) }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0">
                        <v-text-field solo flat
                          background-color="#F6F8FA"
                          v-model.number="adForm.price"
                          type="number"
                          placeholder="0"
                          class="append-item"
                          :rules="[rules.required]"
                        >
                          <template slot="append">
                            <v-flex d-flex child-flex class="">
                              <v-btn tile text plain small
                                :ripple="false"
                                class="input-item input-item-last py-4"
                              >
                                {{ adForm.priceType.id !== 'Float' ? adForm.outputCurrency.name : '%' }}
                              </v-btn>
                            </v-flex>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mt-2 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0"></v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <span>{{ $t('LBL_TABLE_PRICE') }} : </span>
                <strong v-if="adForm.priceType.id ==='Float'">{{ beautyFloatPrice || '0' }} {{ adForm.outputCurrency.name }}/{{ adForm.inputCurrency.symbol }}</strong>
                <strong v-else>{{ beautyFixedPrice  || '0' }} {{ adForm.outputCurrency.name }}/{{ adForm.inputCurrency.symbol }}</strong>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">{{ $t('TITLE_LIMITS') }}</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-row>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0 d-flex">
                        <v-text-field solo flat
                          v-model.number="adForm.available"
                          background-color="#F6F8FA"
                          type="number"
                          class="append-item"
                          :placeholder="$t('TITLE_AVAILABLE')"
                          :rules="[rules.required]"
                        >
                          <template slot="append">
                            <v-flex d-flex child-flex class="fill-height">
                              <v-btn tile text plain small
                                :ripple="false"
                                color="primary"
                                class="input-item py-4"
                              >
                                All
                              </v-btn>
                            </v-flex>
                            <v-flex d-flex child-flex>
                              <v-btn tile text plain small
                                :ripple="false"
                                class="input-item input-item-last py-4"
                              >
                                {{adForm.inputCurrency.symbol}}
                              </v-btn>
                            </v-flex>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0 d-flex">
                        <v-text-field solo flat
                          background-color="#F6F8FA"
                          v-model.number="adForm.minLimit"
                          class="append-item"
                          type="number"
                          :placeholder="$t('COMMON_OTC_MIN_LIMIT')"
                          :rules="[rules.required]"
                        >
                          <template slot="append">
                            <v-flex d-flex child-flex>
                              <v-btn tile text plain small
                                :ripple="false"
                                class="input-item input-item-last py-4"
                              >
                                {{adForm.outputCurrency.symbol}}
                              </v-btn>
                            </v-flex>
                          </template>
                        </v-text-field>
                        <div class="unit"></div>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0 d-flex">
                        <v-text-field solo flat
                          background-color="#F6F8FA"
                          v-model.number="adForm.maxLimit"
                          class="append-item"
                          type="number"
                          :placeholder="$t('COMMON_OTC_MAX_LIMIT')"
                          :rules="[rules.required]"
                        >
                          <template slot="append">
                            <v-flex d-flex child-flex class="fill-height">
                              <v-btn tile text plain small
                                :ripple="false"
                                color="primary"
                                class="input-item py-4"
                              >
                                All
                              </v-btn>
                            </v-flex>
                            <v-flex d-flex child-flex>
                              <v-btn tile text plain small
                                :ripple="false"
                                class="input-item input-item-last py-4"
                              >
                                {{adForm.inputCurrency.symbol}}
                              </v-btn>
                            </v-flex>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">{{ $t('TITLE_PAYMENT_WINDOW') }}</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-row>
                  <v-col cols="12" md="4" lg="4" class="">
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0 d-flex">
                        <v-text-field solo flat
                          background-color="#F6F8FA"
                          v-model.number="adForm.paymentWindow"
                          type="number"
                          class="append-item"
                          :placeholder="$t('TITLE_PAYMENT_WINDOW')"
                          :rules="[rules.required]"
                        >
                          <template slot="append">
                            <v-flex d-flex child-flex>
                              <v-btn tile text plain small
                                :ripple="false"
                                class="input-item input-item-last py-4"
                              >
                                Mins
                              </v-btn>
                            </v-flex>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-card flat color="transparent">
                    <v-card-subtitle>
                      <v-flex class="d-flex">
                        <v-icon color="info">mdi-information-outline</v-icon>
                        <span class="ml-5 info--text">Payment window is the time to buyer need to execute payment action.</span>
                      </v-flex>
                    </v-card-subtitle>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-5" v-if="showPaymentWindowHelpText">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0"></v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <span class="hint"></span>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">{{ $t('TITLE_PAYMENTS') }}</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-row v-if="!filterPayments.length" class="ma-0 flex-column">
                  <v-card tile flat>
                    <v-card-text>
                      {{ $t('TITLE_ACTIVE_PAYMENT') }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn plain text tile
                        :ripple="false"
                        @click="refreshPaymentMethods"
                      >
                        <i class="el-icon-refresh-left" />
                        {{ $t('BTN_REFRESH') }}
                      </v-btn>
                      <v-btn plain text tile
                        :ripple="false"
                        @click="openPaymentMethodForm"
                      >
                        {{ $t('TEXT_NEW_PAYMENT_METHOD') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-row>
                <v-row v-else :key="countSelectedPaymentMethod" class="ma-0 flex-column">
                  <v-card tile flat>
                    <v-card-text>
                      <v-list flat tile>
                        <v-list-item
                          v-for="(i, index) in filterPayments"
                          :key="index"
                        >
                          <v-switch class="mt-0" dense
                            v-model="filterPayments[index].isOn"
                            :label="`${i.bankAccount} - ${i.bankName}`"
                            @change="switchStatus(i, index)"
                          />
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text tile
                        color="primary"
                        :ripple="false"
                        @click="refreshPaymentMethods"
                      >
                        <i class="el-icon-refresh-left" />
                        {{ $t('BTN_REFRESH') }}
                      </v-btn>
                    </v-card-actions>
                    <v-card-subtitle>
                      <v-flex class="d-flex">
                        <v-icon color="info">mdi-information-outline</v-icon>
                        <span class="ml-5 info--text">{{ $t('COMMON_OTC_PAYMENT_BUYER_GUIDE') }}</span>
                      </v-flex>
                    </v-card-subtitle>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">Auto-Reply</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-textarea
                  v-model="adForm.autoReply"
                  :placeholder="$t('TITLE_AUTO_SENT')"
                  solo
                  flat
                  background-color="#F6F8FA"
                  @blur="validateAutoReply"
                >
                </v-textarea>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">Terms and Conditions of trades</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-textarea
                  v-model="adForm.terms"
                  :placeholder="$t('TITLE_TRADING_TERM')"
                  solo
                  flat
                  background-color="#F6F8FA"
                  @blur="validateTerms"
                >
                </v-textarea>
              </v-col>
            </v-row>

            <v-row class="ma-0 px-lg-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
                <label class="text-uppercase">{{ $t('TITLE_ADVANCE_FILTER') }}</label>
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-row class="ma-0">
                  <v-col cols="12" class="pa-0 mb-3">
                    <span>{{ $t('TITLE_TRADES') }}</span>
                  </v-col>
                  <v-col cols="12" lg="4" class="pa-0">
                    <v-text-field
                      v-model.number="adForm.filterNumberOrderComplete"
                      type="number"
                      placeholder="0"
                      solo
                      flat
                      background-color="#F6F8FA"
                    />
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="12" class="pa-0">
                    <v-switch class="mt-0 font-weight-regular"
                      v-model="doNotTrade"
                      label="Do not trade with other advertisers."
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="ma-0 px-8 mb-10">
              <v-col cols="12" md="4" lg="3" xl="2" class="pa-0">
              </v-col>
              <v-col cols="12" md="8" lg="9" xl="10" class="pa-0">
                <v-checkbox
                  @click="adForm.agreeTerms = !adForm.agreeTerms"
                >
                  <template slot="label">
                    {{ $t('TITLE_AGREE_TERM') }} <a class="ml-1" href="#">{{ $t('TITLE_TERM_OF_TRADE') }}</a>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-0 px-8">
            <v-col cols="12" class="d-flex justify-end">
              <v-btn text
                :ripple="false"
                color="primary"
                @click="adForm.agreeTerms = !adForm.agreeTerms"
              >
                {{$t('BTN_CANCEL')}}
              </v-btn>
              <v-btn
                class="ml-10 px-8"
                color="primary"
                @click="createAd"
              >
              {{ isCreateMode ? $t('TITLE_CREATE_GEN_AD') : $t('TITLE_UPDATE_GEN_AD') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </section>
    <AddPaymentMethodForm v-if="isShowOtcPaymentMethod" :openForm="isShowOtcPaymentMethod" :payment="{}" />
  </v-main>
</template>
<script>
import AddPaymentMethodForm from './components/AddPaymentMethodForm'
import CONSTANT from '@/configs/constant'
import OtcService from '@/api/otc/OtcService'
import UtilService from '@/utils/UtilService'
import BigNumber from 'bignumber.js'
import _ from 'lodash'

export default {
  components: {
    AddPaymentMethodForm
  },
  data () {
    return {
      password: '',
      OTC_TYPE: CONSTANT.OTC_TYPE,
      showLimitHelpText: false,
      showPriceHelpText: false,
      showPaymentWindowHelpText: false,
      isLoading: false,
      paymentSelect: false,
      whetherPayment: true,
      passAdvanced: false,
      bindMobileNumber: true,
      doNotTrade: true,
      agree: false,
      countSelectedPaymentMethod: 0,
      selectedPaymentMethod: 0,
      tradeStatus: CONSTANT.OTC.ADS_TYPE,
      priceType: CONSTANT.OTC.ADS_PRICE,
      window: CONSTANT.OTC.PAYMENT_WINDOW,
      initAdForm: {
        available: '',
        inputCurrency: {},
        outputCurrency: {},
        agreeTerms: false,
        referenceID: true,
        filterNumberOrderComplete: null,
        filterPassAdvancedVerification: false,
        filterBindMobileNumber: false,
        filterNotTradeOtherAdvertisers: false,
        priceType: {},
        adType: CONSTANT.OTC_TYPE.BUY,
        maxLimit: null,
        minLimit: null,
        country: {},
        price: null,
        terms: '',
        autoReply: ''
      },
      adForm: {
        available: '',
        inputCurrency: {},
        outputCurrency: {},
        agreeTerms: false,
        referenceID: true,
        filterPassAdvancedVerification: false,
        filterBindMobileNumber: false,
        filterNotTradeOtherAdvertisers: false,
        priceType: {},
        adType: '',
        maxLimit: null,
        minLimit: null,
        country: {},
        price: null,
        terms: '',
        autoReply: ''
      },
      errorForm: {
        price: {
          error: false,
          errorText: ''
        },
        window: {
          error: false,
          errorText: ''
        },
        volume: {
          error: false,
          errorText: ''
        },
        minLimit: {
          error: false,
          errorText: ''
        },
        maxLimit: {
          error: false,
          errorText: ''
        },
        fundPassword: {
          error: false,
          errorText: ''
        },
        filterNumberOrderComplete: {
          error: false,
          errorText: ''
        },
        terms: {
          error: false,
          errorText: ''
        },
        autoReply: {
          error: false,
          errorText: ''
        }
      },
      rules: {
        required: value => !!value || 'This field is required.',
        min: v => (v != null && v.length >= 6) || 'Min 8 characters',
        max: v => (v != null && v.length <= 32) || 'Max 32 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Email is not valid.'
        },
        passMatch: v => v === this.formData.password || `The email and password you entered don't match`
      }
    }
  },
  computed: {
    isShowOtcPaymentMethod: {
      get  () {
        return this.$store.getters.isShowOtcPaymentMethod
      }
    },
    isCreateMode () {
      return this.$route.name === 'post-new-ad'
    },
    currentOtcBalance () {
      let obj = {}
      obj = this.otcBalances.find(temp => {
        return temp.symbol === this.adForm.inputCurrency.symbol
      })
      return obj || {}
    },
    otcBalances () {
      return JSON.parse(JSON.stringify(this.$store.getters.otcBalances))
    },
    otcCurrencies () {
      return this.$store.getters.otcCurrencies
    },
    otcUserPayments () {
      return this.$store.getters.otcUserPayments
    },
    filterPayments () {
      return _.filter(this.otcUserPayments, (temp) => {
        return temp.active
      })
    },
    otcPayments () {
      return this.$store.getters.otcPayments
    },
    otcCountries () {
      return this.$store.getters.otcCountries
    },
    otcUnitCurrencies () {
      return this.$store.getters.otcUnitCurrencies
    },
    userPaymentMethods () {
      return _.filter(this.filterPayments, (temp) => {
        return temp.isOn
      })
    },
    marketPrice () {
      return new BigNumber(this.adForm.inputCurrency.rate).multipliedBy(this.adForm.outputCurrency.rate).toFixed(2)
    },
    beautyMarketPrice () {
      return UtilService.numberWithCommas(this.marketPrice)
    },
    fixedRange () {
      return UtilService.calculateMinMaxPrice(this.marketPrice)
    },
    beautyMinLimit () {
      const result = CONSTANT.OTC.MIN_LIMIT * this.adForm.outputCurrency.rate
      if (result) return UtilService.numberWithCommas(parseFloat(result.toFixed(2)))
      return 0
    },
    minLimit () {
      const result = CONSTANT.OTC.MIN_LIMIT * this.adForm.outputCurrency.rate
      if (result) return parseFloat(result.toFixed(2, BigNumber.ROUND_UP))
      return 0
    },
    minAmountLimit () {
      if (!this.adForm.minLimit) return 0
      return new BigNumber(this.adForm.minLimit).dividedBy(this.adForm.outputCurrency.rate).dp(CONSTANT.OTC.COIN_PRECISION, 1)
    },
    minVolume () {
      let result = 0
      let initNumber = null
      if (!this.adForm.minLimit) {
        initNumber = CONSTANT.OTC.MIN_LIMIT
      } else if (this.adForm.minLimit >= this.minLimit) {
        initNumber = this.minAmountLimit
      }
      if (this.adForm.priceType.id === 'Float' && this.adForm.price > 0 && this.adForm.adType === 'Buy') {
        let price = this.adForm.inputCurrency.rate - (this.adForm.inputCurrency.rate * this.adForm.price) / 100
        result = initNumber / price
      } else if (this.adForm.priceType.id === 'Float' && this.adForm.price < 0 && this.adForm.adType === 'Sell') {
        let price = this.adForm.inputCurrency.rate + (this.adForm.inputCurrency.rate * this.adForm.price) / 100
        result = initNumber / price
      } else if (this.adForm.priceType.id === 'Fixed' && this.adForm.price < this.adForm.outputCurrency.rate) {
        result = (this.adForm.outputCurrency.rate * initNumber) / this.adForm.price
      } else {
        result = new BigNumber(initNumber)
          .dividedBy(this.adForm.inputCurrency.rate)
          .decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
      }
      return new BigNumber(result).decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
    },
    volumeFiat () {
      if (this.adForm.available) {
        let result = new BigNumber(this.adForm.available).multipliedBy(this.adForm.inputCurrency.rate)
          .multipliedBy(this.adForm.outputCurrency.rate).decimalPlaces(CONSTANT.OTC.OTC_FIAT_PRECISION, BigNumber.ROUND_UP)
        return result
      }
      return 0
    },
    isMinOverVolume () {
      let result = new BigNumber(this.minVolume).comparedTo(this.adForm.available) > 0
      return result
    },
    maxLimit () {
      return this.fixedRange.max * this.adForm.available
    },
    beautyFixedPrice () {
      if (!this.adForm.price) {
        return UtilService.numberWithCommas(new BigNumber(this.marketPrice).decimalPlaces(CONSTANT.OTC.OTC_FIAT_PRECISION).toNumber())
      } else {
        return UtilService.numberWithCommas(new BigNumber(this.adForm.price).decimalPlaces(CONSTANT.OTC.OTC_FIAT_PRECISION).toNumber())
      }
    },
    beautyFloatPrice () {
      return UtilService.numberWithCommas(this.floatPrice)
    },
    floatPrice () {
      return UtilService.calculateFloatPrice(this.marketPrice, this.adForm.price, this.adForm.adType)
    },
    maxLimitPrice () {
      return UtilService.calculateMaxLimitPrice(this.adForm.price, this.floatPrice, this.adForm.available, this.adForm.priceType.id)
    },
    isValidated () {
      return this.adForm.minLimit && this.adForm.maxLimit && this.adForm.agreeTerms &&
        this.selectedPaymentMethod && this.adForm.fundPassword &&
        this.adForm.available && this.adForm.paymentWindow && this.user.nickname
    },
    maxAvaiable () {
      if (!this.currentOtcBalance || !this.currentOtcBalance.balanceOtc || !this.adForm.inputCurrency.otcMaxBuy) return 0
      let amount
      if (this.adForm.adType.toLowerCase() === CONSTANT.OTC_TYPE.BUY) {
        amount = this.adForm.inputCurrency.otcMaxBuy
      } else {
        amount = this.currentOtcBalance.balanceOtc >= this.adForm.inputCurrency.otcMaxBuy
          ? this.adForm.inputCurrency.otcMaxBuy : this.currentOtcBalance.balanceOtc
      }
      return amount
    },
    user () {
      return this.$store.getters.user
    }
  },
  async created () {
    // init asset selection
    // if (!this.$route.query.fiatId) {
    //   this.$router.push({ name: this.$route.name, query: { fiatId: this.otcUnitCurrencies[0].fiatId } })
    // }

    await this.loadData()
  },
  methods: {
    async loadData () {
      this.isLoading = true

      await this.$store.dispatch('getUserPayments')
      // await this.$store.dispatch('getFiat')
      let countries = await this.$store.dispatch('getCountries')
      let currencies = await this.$store.dispatch('getOtcCurrencies')
      await this.$store.dispatch('getPaymentMethods')
      this.$store.dispatch('getUserBalance')

      // Init form data
      let adId = this.$route.query.id
      if (!adId) {
        this.initCreateFormData(countries, currencies)
      } else {
        this.initUpdateFormData(countries, currencies, adId)
      }

      this.isLoading = false
    },
    checkUserPayment (payment, userPayments) {
      let result = userPayments.find(temp => {
        return temp.id === payment.id
      })
      return Boolean(result)
    },
    initCreateFormData (countries, currencies) {
      this.adForm = JSON.parse(JSON.stringify(this.initAdForm))

      this.adForm.adType = this.tradeStatus[0].id
      this.adForm.priceType = this.priceType[0]

      if (countries && countries.length) {
        this.adForm.country = countries[0]
        this.adForm.outputCurrency = this.otcUnitCurrencies.find(fiat => {
          return fiat.code === this.adForm.country.defaultFiatCode
        })
      }

      if (currencies && currencies.length) {
        this.adForm.inputCurrency = currencies[0]
      }
    },
    async initUpdateFormData (countries, currencies, adId) {
      let rs = await OtcService.getOtcAd(adId)
      if (rs.status === CONSTANT.SUCCESS) {
        let ad = rs.data
        if (ad.inviteCode !== this.user.inviteCode) {
          this.$router.push({ name: 'otc-ads' })
          return
        }
        Object.assign(this.adForm, ad)
        this.adForm.country = countries.find(temp => {
          return temp.name === ad.countryCode
        })
        this.adForm.adType = this.tradeStatus.find(temp => {
          return temp.id === ad.type
        }).id
        this.adForm.priceType = this.priceType.find(temp => {
          return temp.id === ad.priceType
        })
        this.adForm.outputCurrency = this.otcUnitCurrencies.find(temp => {
          return temp.code === ad.fiatCode
        })
        this.adForm.inputCurrency = currencies.find(temp => {
          return temp.symbol === ad.currencyCode
        })
        this.filterPayments.map(temp => {
          temp.isOn = this.checkUserPayment(temp, ad.paymentMethods)
        })
        if (ad.priceType === 'Float') this.adForm.price = ad.priceFloat
      }
    },
    openHelpText (canshow) {
      if (canshow === 'limit') this.showLimitHelpText = !this.showLimitHelpText
      if (canshow === 'price') this.showPriceHelpText = !this.showPriceHelpText
      if (canshow === 'paymentw') this.showPaymentWindowHelpText = !this.showPaymentWindowHelpText
    },
    refreshPaymentMethods () {
      this.$store.dispatch('getUserPayments')
    },
    switchStatus (i, index) {
      const temp = JSON.parse(JSON.stringify(i))
      // temp.active = !temp.active
      // temp.isOn = !temp.isOn
      this.filterPayments[index] = temp
      this.countSelectedPaymentMethod = this.countSelectedPaymentMethod + 1
      this.selectedPaymentMethod = this.filterPayments.filter(temp => {
        return temp.active && temp.isOn
      }).length
    },
    updateOutputCountry (country) {
      this.adForm.country = country
      this.openCountry = false
      this.adForm.outputCurrency = this.otcUnitCurrencies.find(temp => {
        return temp.fiatId === country.defaultFiatId
      })
    },
    updateOutputCurrency (currencyId) {
      //
      let fiat = this.otcUnitCurrencies.find(temp => {
        return temp.fiatId === currencyId
      })
      this.adForm.outputCurrency = fiat
      this.openOutputCurr = false
    },
    updateInputCurrency (currencyId) {
      console.log('----->', currencyId)
      this.adForm.inputCurrency = this.otcCurrencies.find(temp => {
        return temp.currencyId === currencyId
      })
      this.openInputCurr = false
      if (this.errorForm.volume.error) {
        this.validateVolume()
      }
    },
    updatePriceType (typeId) {
      this.adForm.priceType = this.priceType.find(tp => tp.id === typeId)

      this.validatePrice()
    },
    switchType (type) {
      if (this.isCreateMode) {
        this.adForm.adType = type
      }
    },
    openPaymentMethodForm () {
      this.$store.dispatch('toggleOtcPaymentMethod')
    },
    validateFilterNumberOrderComplete () {
      this.errorForm.filterNumberOrderComplete.error =
        !this.adForm.filterNumberOrderComplete ||
        (this.adForm.filterNumberOrderComplete && this.adForm.filterNumberOrderComplete < 0) ||
        (this.adForm.filterNumberOrderComplete && this.adForm.filterNumberOrderComplete.length > 10)

      if (this.adForm.filterNumberOrderComplete === 0) {
        this.errorForm.filterNumberOrderComplete.error = false
      }

      if (this.adForm.filterNumberOrderComplete && this.adForm.filterNumberOrderComplete < 0) {
        this.errorForm.filterNumberOrderComplete.errorText = this.$t('TITLE_AT_LEAST') + ' ' + 0
      } else if (this.adForm.filterNumberOrderComplete && this.adForm.filterNumberOrderComplete.length > 10) {
        this.errorForm.filterNumberOrderComplete.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 10 + ' ' + this.$t('TEXT_CHARACTERS')
      }

      return this.errorForm.filterNumberOrderComplete.error
    },
    validateFundPassword () {
      this.errorForm.fundPassword.error = !this.adForm.fundPassword
      this.errorForm.fundPassword.errorText = this.$t('MSG_FIELD_REQUIRED')
      return this.errorForm.fundPassword.error
    },
    validateMinLimit () {
      if (this.adForm.minLimit) {
        this.adForm.minLimit = new BigNumber(this.adForm.minLimit).decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
      }
      let isMinOverMax = new BigNumber(this.adForm.minLimit).comparedTo(this.adForm.maxLimit) > 0
      this.errorForm.minLimit.error = !this.adForm.minLimit ||
        this.adForm.minLimit < this.minLimit || (this.adForm.maxLimit && isMinOverMax)
      if (!this.adForm.minLimit || this.adForm.minLimit < this.minLimit) {
        this.errorForm.minLimit.errorText = this.$t('TITLE_MIN_LIMIT_IS', { value: this.minLimit })
      }
      if (this.adForm.maxLimit && isMinOverMax) {
        this.errorForm.minLimit.errorText = this.$t('TITLE_MIN_OVER_MAX')
      }
      return this.errorForm.minLimit.error
    },
    validateMaxLimit () {
      if (this.adForm.maxLimit) {
        this.adForm.maxLimit = new BigNumber(this.adForm.maxLimit).decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
      }
      let isMinOverMax = new BigNumber(this.adForm.minLimit).comparedTo(this.adForm.maxLimit) > 0
      this.errorForm.maxLimit.error = !this.adForm.maxLimit ||
        this.adForm.maxLimit > this.maxLimitPrice ||
        this.adForm.maxLimit < this.minLimit ||
        (this.adForm.maxLimit && isMinOverMax)
      if (!this.adForm.maxLimit) {
        this.errorForm.maxLimit.errorText = this.$t('MSG_FIELD_REQUIRED')
      } else if (!this.adForm.price || !this.adForm.available) {
        this.errorForm.maxLimit.errorText = this.$t('TITLE_VOLUME_PRICE_EMPTY')
      } else if (this.adForm.maxLimit && isMinOverMax) {
        this.errorForm.maxLimit.errorText = this.$t('TITLE_MIN_OVER_MAX')
      } else if (this.adForm.maxLimit > this.maxLimitPrice || this.adForm.maxLimit < this.minLimit) {
        this.errorForm.maxLimit.errorText = this.$t('TITLE_MAX_LIMIT', { min: this.adForm.minLimit || this.minLimit, max: this.maxLimitPrice, code: this.adForm.outputCurrency.code })
      }
      return this.errorForm.maxLimit.error
    },
    validateVolume () {
      this.errorForm.volume.errorText = this.$t('MSG_FIELD_REQUIRED')
      if (this.adForm.available) {
        this.adForm.available = new BigNumber(this.adForm.available).decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
      }
      this.errorForm.volume.error = !this.adForm.available ||
        this.adForm.available < 0 ||
        this.adForm.available > this.adForm.inputCurrency.otcMaxBuy ||
        this.isMinOverVolume ||
        (this.adForm.adType === CONSTANT.OTC_TYPE.SELL && this.adForm.available > this.currentOtcBalance.balanceFiat)
      if (this.adForm.available > this.adForm.inputCurrency.otcMaxBuy) {
        this.errorForm.volume.errorText = this.$t('TITLE_VOLUME_LIMIT', { max: this.adForm.inputCurrency.otcMaxBuy, symbol: this.adForm.inputCurrency.symbol })
      } else if (this.adForm.adType === CONSTANT.OTC_TYPE.SELL && this.adForm.available > this.currentOtcBalance.balanceFiat) {
        this.errorForm.volume.errorText = this.$t('TITLE_AVAI_AMOUNT', { balance: this.currentOtcBalance.balanceFiat })
      } else if (this.isMinOverVolume) {
        this.errorForm.volume.errorText = this.$t('TITLE_MIN_OVER_VOLUME', { volume: this.minVolume, symbol: this.adForm.inputCurrency.symbol })
      }
      return this.errorForm.volume.error
    },
    validateWindow () {
      if (this.adForm.paymentWindow) {
        this.adForm.paymentWindow = new BigNumber(this.adForm.paymentWindow).decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
      }
      this.errorForm.window.error = !this.adForm.paymentWindow || this.adForm.paymentWindow < this.window.min ||
        this.adForm.paymentWindow > this.window.max

      this.errorForm.window.errorText = this.$t('TITLE_PAYMENT_WINDOW_RANGE', { min: this.window.min, max: this.window.max })
      return this.errorForm.window.error
    },
    validatePrice () {
      if (this.adForm.price) {
        this.adForm.price = new BigNumber(this.adForm.price).decimalPlaces(CONSTANT.OTC.COIN_PRECISION, BigNumber.ROUND_UP)
      }
      if (this.adForm.priceType.id === 'Fixed') {
        this.errorForm.price.error = !this.adForm.price ||
          this.adForm.price < this.fixedRange.min || this.adForm.price > this.fixedRange.max
        this.errorForm.price.errorText = this.$t('TITLE_FIXED_PRICE_LIMIT', { min: this.fixedRange.min, max: this.fixedRange.max })
      } else {
        this.errorForm.price.error = !this.adForm.price ||
          this.adForm.price < -1 * CONSTANT.OTC.PERCENT_FLOAT ||
          this.adForm.price > CONSTANT.OTC.PERCENT_FLOAT
        this.errorForm.price.errorText = this.$t('TITLE_FLOAT_PRICE_LIMIT', { min: -1 * CONSTANT.OTC.PERCENT_FLOAT, max: CONSTANT.OTC.PERCENT_FLOAT })
      }
      return this.errorForm.price.error
    },
    available () {
      let amount
      if (this.adForm.adType.toLowerCase() === CONSTANT.OTC_TYPE.BUY.toLowerCase()) {
        amount = this.adForm.inputCurrency.otcMaxBuy
      } else {
        amount = this.currentOtcBalance.balanceFiat >= this.adForm.inputCurrency.otcMaxBuy
          ? this.adForm.inputCurrency.otcMaxBuy : this.currentOtcBalance.balanceFiat
      }
      this.adForm.available = amount
      this.errorForm.volume.error = false
    },
    availableMaxLimit () {
      if (this.maxLimitPrice >= this.minLimit) {
        this.adForm.maxLimit = this.maxLimitPrice
        this.errorForm.maxLimit.error = false
      } else {
        this.adForm.maxLimit = this.maxLimitPrice
        this.errorForm.maxLimit.error = true
        this.errorForm.maxLimit.errorText = this.$t('TITLE_MIN_OVER_MAX')
      }
    },
    validateTerms () {
      this.errorForm.terms.error =
        (this.adForm.terms && this.adForm.terms.length > 300)
      this.errorForm.terms.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 300 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.terms.error
    },
    validateAutoReply () {
      this.errorForm.autoReply.error =
        (this.adForm.autoReply && this.adForm.autoReply.length > 300)
      this.errorForm.autoReply.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 300 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.autoReply.error
    },
    updateOrderType (item) {
      this.adForm.adType = item.id
      this.openType = false
    },
    createAd () {
      const isInvalidMinLimit = this.validateMinLimit()
      const isInvalidMaxLimit = this.validateMaxLimit()
      // const isInvalidFundPassword = this.validateFundPassword()
      const isInvalidPrice = this.validatePrice()
      const isInvalidVolume = this.validateVolume()
      const isInvalidWindow = this.validateWindow()
      const isInvalidTerms = this.validateTerms()
      const isInvalidAutoReply = this.validateAutoReply()
      const isInvalidFilterNumberOrderComplete = this.validateFilterNumberOrderComplete()
      let userPaymentMethods = this.filterPayments.filter(temp => {
        return temp.isOn
      })
      this.selectedPaymentMethod = userPaymentMethods.length

      if (isInvalidMinLimit ||
        isInvalidVolume || isInvalidWindow ||
        isInvalidPrice || isInvalidMaxLimit || isInvalidFilterNumberOrderComplete || isInvalidAutoReply || isInvalidTerms
      ) {
        this.$store.dispatch('showErrorMsg', this.$t('TITLE_ALL_FIELDS'))
        return
      }

      if (!this.selectedPaymentMethod) {
        this.$store.dispatch('showErrorMsg', this.$t('COMMON_OTC_TITLE_PAYMENT'))
        return
      }
      if (!this.adForm.agreeTerms) {
        this.$store.dispatch('showErrorMsg', this.$t('TITLE_TERMS_MESS'))
        return
      }
      const bodyObj = JSON.parse(JSON.stringify(this.adForm))
      bodyObj.id = this.$route.query.id
      bodyObj.countryCode = this.adForm.country.name
      bodyObj.fiatCode = this.adForm.outputCurrency.code
      bodyObj.currencyCode = this.adForm.inputCurrency.symbol
      bodyObj.priceType = this.adForm.priceType.id
      bodyObj.userPaymentMethods = userPaymentMethods
      bodyObj.price = this.adForm.priceType.id === 'Float' ? this.floatPrice : this.adForm.price
      bodyObj.floatPricePercent = this.adForm.priceType.id === 'Float' ? this.adForm.price : 0
      bodyObj.fiatRate = this.adForm.outputCurrency.rate
      bodyObj.currencyRate = this.adForm.inputCurrency.rate
      if (!bodyObj.filterNumberOrderComplete) bodyObj.filterNumberOrderComplete = 0
      UtilService.convertDataType(bodyObj)
      this.isLoading = true
      this.$google.getCaptcha(CONSTANT.RECAPTCHA.OTC_CREATE_AD)
        .then(token => {
          bodyObj.reCaptcha = token
          this.submitAdForm(bodyObj)
        }).catch(e => {
          this.isLoading = false
        })
    },
    submitAdForm (bodyObj) {
      OtcService.submitAdForm(bodyObj)
        .then(rs => {
          this.isLoading = false
          if (rs.status === CONSTANT.SUCCESS) {
            this.$router.push({ name: 'otc-my-ads' })
          }
        })
        .catch(e => {
          this.isLoading = false
        })
    },
    cancelAd () {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
  .el-input__suffix {
    right: 16px;
    top: 4px;
  }
</style>
