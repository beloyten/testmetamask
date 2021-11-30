<template>
  <div class="otc-create-ad" :key="forceUpdate">
    <div class="otc-create-head">
      <h2>{{ isCreateMode ? $t('TITLE_CREATE_GEN_AD') : $t('TITLE_UPDATE_GEN_AD') }}</h2>
      <p>{{ $t('TITLE_MIN_GUIDE') }} {{ beautyMinLimit }} {{ adForm.outputCurrency.name }},
        {{ $t('TITLE_MIN_GUIDE') }} {{ maxAvaiable }} {{ adForm.inputCurrency.symbol }}.
        <a href="#">{{ $t('TITLE_BECOME_VERIFY_USER') }}</a>
          {{ $t('TITLE_INCREASE_LIMIT') }}
        <a href="#">{{ $t('TITLE_BEFORE_CREATE_AD') }}</a>
      </p>
    </div>
    <div class="otc-create-body">
      <div class="otc-field field-require clearfix" :class="{ 'disabled': !isCreateMode }">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_CREATE_AD_IN') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item w-25" v-click-outside="onClickOutsideCountry"
            :class="{ 'loading': !otcCountries.length }">
            <div class="otc-dropdown cursor-pointer" :class="{'active': openCountry}">
              <div class="otc-dropdown-selected clearfix" @click="openCountry = !openCountry">
                <span>{{ adForm.country.name }}</span>
                <i class="hb_icon_arrow_down text-center"></i>
              </div>
              <ul class="otc-dropdown-list ">
                <li v-for="i in otcCountries"
                    :class="{ 'active': i.id === adForm.country.id }"
                    :key="i.id" class="otc-dropdown-option clearfix cursor-pointer" @click="updateOutputCountry(i)">
                  <span>{{ i.name }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="otc-item w-25" v-click-outside="onClickOutsideOutputCurr"
            :class="{ 'loading': !otcUnitCurrencies.length }">
            <div class="otc-dropdown cursor-pointer" :class="{'active': openOutputCurr}">
              <div class="otc-dropdown-selected clearfix" @click="openOutputCurr = !openOutputCurr">
                <span>{{ adForm.outputCurrency.name }}</span>
                <i class="hb_icon_arrow_down text-center"></i>
              </div>
              <ul class="otc-dropdown-list ">
                <li v-for="i in otcUnitCurrencies"
                    :class="{ 'active': i.fiatId === adForm.outputCurrency.fiatId }"
                    :key="i.id" class="otc-dropdown-option clearfix cursor-pointer" @click="updateOutputCurrency(i)">
                  <span>{{ i.name }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="otc-item w-25" v-click-outside="onClickOutsideAdtype"
            :class="{ 'loading': !adForm.adType }">
            <div class="otc-dropdown cursor-pointer" :class="{'active': openType}">
              <div class="otc-dropdown-selected clearfix" @click="openType = !openType">
                <span>{{ $t('BTN_' + adForm.adType.toUpperCase()) }}</span>
                <i class="hb_icon_arrow_down text-center"></i>
              </div>
              <ul class="otc-dropdown-list">
                <li v-for="i in tradeStatus"
                    :class="{ 'active': i.id === adForm.adType }"
                    :key="i.id" class="otc-dropdown-option clearfix cursor-pointer" @click="updateOrderType(i)">
                  <span>{{ $t(i.name) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="otc-item w-25" v-click-outside="onClickOutsideInputCurr"
            :class="{ 'loading': !otcCurrencies.length }">
            <div class="otc-dropdown cursor-pointer" :class="{'active': openInputCurr}">
              <div class="otc-dropdown-selected clearfix" @click="openInputCurr = !openInputCurr">
                <span>{{ adForm.inputCurrency.name }}</span>
                <i class="hb_icon_arrow_down text-center"></i>
              </div>
              <ul class="otc-dropdown-list ">
                <li v-for="i in otcCurrencies"
                    :class="{ 'active': i.currencyId === adForm.inputCurrency.currencyId }"
                    :key="i.id" class="otc-dropdown-option clearfix cursor-pointer" @click="updateInputCurrency(i)">
                  <span>{{ i.name }}</span>
                </li>
              </ul>
            </div>
            <em class="fee" v-if="false">
              <a href="#">Fee: 0.7%</a> Use Point Card to deduct fees by default
            </em>
          </div>
        </div>
      </div>
      <div class="otc-field field-require clearfix">
        <div class="otc-field-label w-20"><span>{{ $t('LBL_TABLE_PRICE') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item w-25">
            <span>{{ $t('TITLE_PRICE_TYPE') }}</span>
            <div class="" v-click-outside="onClickOutsidePriceType">
              <div class="otc-dropdown cursor-pointer" :class="{'active': openPriceType}">
                <div class="otc-dropdown-selected clearfix" @click="openPriceType = !openPriceType">
                  <span>{{ $t(adForm.priceType.name) }}</span>
                  <i class="hb_icon_arrow_down text-center"></i>
                </div>
                <ul class="otc-dropdown-list ">
                  <li v-for="i in priceType"
                      :class="{ 'active': i.id === adForm.priceType.id }"
                      :key="i.id" class="otc-dropdown-option clearfix cursor-pointer" @click="updatePriceType(i)">
                    <span>{{ $t(i.name) }}</span>
                  </li>
                </ul>
              </div>
              <em class="fee" v-if="false">
                <a href="#">Fee: 0.7%</a> Use Point Card to deduct fees by default
              </em>
            </div>
          </div>
          <div class="otc-item w-25">
            <span>{{ $t(adForm.priceType.name) }}</span>
            <div class="otc-input">
              <input
                v-model="adForm.price"
                :class="{ 'item-error': errorForm.price.error }"
                type="number"
                placeholder="0"
                class="pr-40"
                @blur="validatePrice">
              <span class="small">{{ adForm.priceType.id !== 'Float' ? adForm.outputCurrency.name : '%' }}</span>
            </div>
            <span v-if="errorForm.price.error" class="item-error-tip">{{ errorForm.price.errorText }}</span>
          </div>
          <div class="otc-item w-50">
            <span>{{ $t('LBL_TABLE_PRICE') }}</span>
            <span v-if="adForm.priceType.id ==='Float'" class="otc-item-price">{{ beautyFloatPrice || '0' }} {{ adForm.outputCurrency.name }}/{{ adForm.inputCurrency.symbol }}</span>
            <span v-else class="otc-item-price">{{ beautyFixedPrice }} {{ adForm.outputCurrency.name }}/{{ adForm.inputCurrency.symbol }}</span>
          </div>
          <div class="otc-item otc-field-description">
            <p>
              {{ $t('MOBILE_CM_MARKET_PRICE') }}: {{ beautyMarketPrice }} {{ adForm.outputCurrency.name }}/{{ adForm.inputCurrency.symbol }}
            </p>
            <p>
              {{ $t('TITLE_FIXED_PRICE_GUIDE') }}
            </p>
          </div>
        </div>
      </div>
      <div class="otc-field field-require clearfix">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_LIMITS') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item w-25">
            <span>{{ $t('TITLE_VOLUME') }} <em @click="available" class="color-blue cursor-pointer">{{ $t('TITLE_AVAILABLE') }}</em></span>
            <div class="otc-input">
              <input
                v-model="adForm.available"
                :class="{ 'item-error': errorForm.volume.error }"
                type="number"
                :placeholder="$t('TITLE_AVAILABLE') + `: ${currentOtcBalance.beautyBalanceOtc}`"
                @blur="validateVolume">
              <span class="small">{{ adForm.inputCurrency.symbol }}</span>
            </div>
            <span v-if="errorForm.volume.error" class="item-error-tip">{{ errorForm.volume.errorText }}</span>
          </div>
          <div class="otc-item w-25">
            <span>{{ $t('COMMON_OTC_MIN_LIMIT') }}</span>
            <div class="otc-input">
              <input
                v-model="adForm.minLimit"
                :placeholder="`${$t('TITLE_AT_LEAST')} ${beautyMinLimit}`"
                :class="{ 'item-error': errorForm.minLimit.error }"
                type="number"
                @blur="validateMinLimit">
              <span class="small">{{ adForm.outputCurrency.name }}</span>
            </div>
            <span v-if="errorForm.minLimit.error" class="item-error-tip">{{ errorForm.minLimit.errorText }}</span>
          </div>
          <div class="otc-item w-25">
            <span>{{ $t('COMMON_OTC_MAX_LIMIT') }} <em @click="availableMaxLimit" class="color-blue cursor-pointer">{{ $t('TITLE_AVAILABLE') }}</em></span>
            <div class="otc-input">
              <input
                v-model="adForm.maxLimit"
                :class="{ 'item-error': errorForm.maxLimit.error }"
                type="number"
                :placeholder="`${$t('TITLE_AT_MOST')} ${maxLimitPrice}`"
                @blur="validateMaxLimit">
              <span class="small">{{ adForm.outputCurrency.name }}</span>
            </div>
            <span v-if="errorForm.maxLimit.error" class="item-error-tip">{{ errorForm.maxLimit.errorText }}</span>
          </div>
          <div class="otc-item w-25">
            <span>{{ $t('TITLE_PAYMENT_WINDOW') }}</span>
            <div class="otc-input payment-window">
              <input
                v-model="adForm.paymentWindow"
                :placeholder="$t('TITLE_FROM_TO', { from: window.min, to: window.max })"
                :class="{ 'item-error': errorForm.window.error }"
                type="number"
                @blur="validateWindow">
              <span class="small small-large">{{ $t('COMMON_MIN_BTN') }}</span>
            </div>
            <span v-if="errorForm.window.error" class="item-error-tip">{{ errorForm.window.errorText }}</span>
          </div>

          <div class="otc-item otc-field-description" v-if="false">
            <p>
              {{$t('TEXT_OTC_FIELD_DESCRIPTION')}}
            </p>
            <p>
              <a href="#"> {{$t('TEXT_VIEW_POINT_CARDS')}}</a>
            </p>
          </div>
        </div>

      </div>
      <div class="otc-field field-require clearfix">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_PAYMENTS') }}</span></div>
        <div class="otc-items w-80">
          <div v-if="!filterPayments.length" class="otc-item otc-item-full">
            <p>{{ $t('TITLE_ACTIVE_PAYMENT') }}</p>
            <span class="refresh otc-button" @click="refresh"><i class="hb_icon_refresh"/>{{ $t('BTN_REFRESH') }}</span>
          </div>
          <div v-else :key="count" class="otc-item otc-item-full">
            <p v-for="(i, index) in filterPayments" :key="i.id" class="switch-wrap">
              <span :class="{'on' : i.isOn, 'off' : !i.isOn}" class="switch-icon" @click="switchStatus(i, index)">
                <em>{{ i.isOn ? 'ON' : 'OFF' }}</em>
              </span>
              <span>{{ i.bankAccount }} - {{ i.bankName }}</span>
            </p>
          </div>
          <div class="otc-item otc-field-description">
            <p>{{ $t('COMMON_OTC_PAYMENT_BUYER_GUIDE') }} <a href="javascript:;" @click="openPaymentMethodForm">{{ $t('BTN_CLICK_HERE') }}.</a></p>
            <p class="switch-wrap">
              <span :class="{'on' : adForm.referenceID, 'off' : !adForm.referenceID}" class="switch-icon" @click="adForm.referenceID = !adForm.referenceID">
                <em>{{ adForm.referenceID ? 'ON' : 'OFF' }}</em>
              </span>
            <span>{{ $t('TITLE_SHOW_PAYMENT') }}</span></p>
          </div>
        </div>
        <PaymentMethodForm :payment="{}"/>
      </div>
      <div class="otc-field clearfix">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_AUTO_REPLY') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item">
            <textarea
              v-model="adForm.autoReply"
              class="w-100"
              :placeholder="$t('TITLE_AUTO_SENT')"
              @blur="validateAutoReply"/>
            <span v-if="errorForm.autoReply.error" class="item-error-tip">{{ errorForm.autoReply.errorText }}</span>
          </div>
        </div>
      </div>
      <div class="otc-field clearfix">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_TERMS') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item">
            <textarea
              v-model="adForm.terms"
              class="w-100"
              :placeholder="$t('TITLE_TRADING_TERM')"
              @blur="validateTerms"/>
            <span v-if="errorForm.terms.error" class="item-error-tip">{{ errorForm.terms.errorText }}</span>
          </div>
        </div>
      </div>
      <div class="otc-field clearfix">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_ADVANCE_FILTER') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item">
            <span>{{ $t('TITLE_TRADES') }}</span>
            <div class="otc-input w-25">
              <input v-model="adForm.filterNumberOrderComplete" type="number" placeholder="0" class="pr-10"
              :class="{ 'item-error': errorForm.filterNumberOrderComplete.error }"
              @blur="validateFilterNumberOrderComplete">
              <span v-if="errorForm.filterNumberOrderComplete.error" class="item-error-tip">{{ errorForm.filterNumberOrderComplete.errorText }}</span>
            </div>
          </div>
          <div class="otc-item w-100 mt-20">
            <p class="switch-wrap">
              <span :class="{ 'on' : adForm.filterPassAdvancedVerification, 'off' : !adForm.filterPassAdvancedVerification }" class="switch-icon" @click="adForm.filterPassAdvancedVerification = !adForm.filterPassAdvancedVerification">
                <em>{{ adForm.filterPassAdvancedVerification ? 'ON' : 'OFF' }}</em>
              </span>
              <span>{{ $t('TITLE_VERIFICATION') }}</span>
            </p>
            <p class="switch-wrap">
              <span :class="{ 'on' : adForm.filterBindMobileNumber, 'off' : !adForm.filterBindMobileNumber }" class="switch-icon" @click="adForm.filterBindMobileNumber = !adForm.filterBindMobileNumber">
                <em>{{ adForm.filterBindMobileNumber ? 'ON' : 'OFF' }}</em>
              </span>
              <span>{{ $t('TITLE_MOBILE_NUMBER') }}</span>
            </p>
            <p class="switch-wrap">
              <span :class="{ 'on' : adForm.filterNotTradeOtherAdvertisers, 'off' : !adForm.filterNotTradeOtherAdvertisers }" class="switch-icon" @click="adForm.filterNotTradeOtherAdvertisers = !adForm.filterNotTradeOtherAdvertisers">
                <em>{{ adForm.filterNotTradeOtherAdvertisers ? 'ON' : 'OFF' }}</em>
              </span>
              <span>{{ $t('TITLE_DONOT_TRADE') }}</span>
            </p>
          </div>
          <div class="otc-item otc-field-description">
            <p>{{ $t('TITLE_CREATE_AD_DESC') }}</p>
          </div>
        </div>
      </div>
      <div class="otc-field field-require">
        <div class="otc-field-label w-20"><span>{{ $t('TITLE_FUND_PASSWORD') }}</span></div>
        <div class="otc-items w-80">
          <div class="otc-item w-25">
            <div class="otc-input">
              <input
                v-model="adForm.fundPassword"
                :class="{ 'item-error': errorForm.fundPassword.error }"
                type="password"
                :placeholder="$t('TITLE_FUND_PASSWORD')"
                class="pr-10"
                @blur="validateFundPassword">
              <span v-if="errorForm.fundPassword.error" class="item-error-tip">{{ errorForm.fundPassword.errorText }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="otc-field otc-field-agree">
        <div @click="adForm.agreeTerms = !adForm.agreeTerms">
          <img :src="adForm.agreeTerms ? '/assets/images/icon-active.png' : '/assets/images/icon-deactivate.png'">
          <span>{{ $t('TITLE_AGREE_TERM') }} <a href="javascript:;" @click.stop=""> ({{ $t('TITLE_TERM_OF_TRADE') }}) </a></span>
        </div>
        <div class="otc-field-description">
          <span
            class="otc-button create-ad"
            :class="{ 'loading': isLoading }"
            @click="createAd">{{ isCreateMode ? $t('TITLE_CREATE_GEN_AD') : $t('TITLE_UPDATE_GEN_AD') }}
          </span>
          <span class="otc-button cancel-ad " @click="cancelAd">{{$t('BTN_CANCEL')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PaymentMethodForm from './components/PaymentMethodForm'
import CONSTANT from '@/configs/constant'
import OtcService from '@/api/otc/OtcService'
import UtilService from '@/utils/UtilService'
import ClickOutside from '@/directives/VueClickOutside'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
export default {
  components: {
    PaymentMethodForm
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      isLoading: false,
      openCountry: false,
      openOutputCurr: false,
      openInputCurr: false,
      openType: false,
      openPriceType: false,
      count: 0,
      initAdForm: {
        available: '',
        inputCurrency: {},
        outputCurrency: {},
        agreeTerms: false,
        referenceID: true,
        filterPassAdvancedVerification: false,
        filterBindMobileNumber: false,
        filterNotTradeOtherAdvertisers: false,
        priceType: {},
        adType: null,
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
      tradeStatus: CONSTANT.OTC.ADS_TYPE,
      selectedPaymentMethod: 0,
      priceType: CONSTANT.OTC.ADS_PRICE,
      window: CONSTANT.OTC.PAYMENT_WINDOW,
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
      defaultCountry: {},
      forceUpdate: 0
    }
  },
  computed: {
    isCreateMode () {
      return this.$route.name === 'otc-create-ad'
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
  watch: {
    $route (val) {
      this.loadData()
      this.forceUpdate++
    }
  },
  async created () {
  },
  methods: {
    refresh () {
      this.$store.dispatch('getUserPayments')
    },
    onClickOutsidePriceType () {
      this.openPriceType = false
    },
    onClickOutsideCountry () {
      this.openCountry = false
    },
    onClickOutsideInputCurr () {
      this.openInputCurr = false
    },
    onClickOutsideOutputCurr () {
      this.openOutputCurr = false
    },
    onClickOutsideAdtype () {
      this.openType = false
    },
    validateFilterNumberOrderComplete () {
      this.errorForm.filterNumberOrderComplete.error =
        (this.adForm.filterNumberOrderComplete && this.adForm.filterNumberOrderComplete < 0) ||
        (this.adForm.filterNumberOrderComplete && this.adForm.filterNumberOrderComplete.length > 10)
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
        (this.adForm.adType === 'Sell' && this.adForm.available > this.currentOtcBalance.balanceFiat)
      if (this.adForm.available > this.adForm.inputCurrency.otcMaxBuy) {
        this.errorForm.volume.errorText = this.$t('TITLE_VOLUME_LIMIT', { max: this.adForm.inputCurrency.otcMaxBuy, symbol: this.adForm.inputCurrency.symbol })
      } else if (this.adForm.adType === 'Sell' && this.adForm.available > this.currentOtcBalance.balanceFiat) {
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
      if (this.adForm.adType.toLowerCase() === CONSTANT.OTC_TYPE.BUY) {
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
    switchStatus (i, index) {
      const temp = JSON.parse(JSON.stringify(i))
      temp.active = !temp.active
      temp.isOn = !temp.isOn
      this.filterPayments[index] = temp
      this.count = this.count + 1
      this.selectedPaymentMethod = this.filterPayments.filter(temp => {
        return temp.active && temp.isOn
      }).length
    },
    async loadData () {
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
    },
    updateOutputCurrency (currency) {
      this.adForm.outputCurrency = currency
      this.openOutputCurr = false
    },
    updateInputCurrency (currency) {
      this.adForm.inputCurrency = currency
      this.openInputCurr = false
      if (this.errorForm.volume.error) {
        this.validateVolume()
      }
    },
    updateOutputCountry (country) {
      this.adForm.country = country
      this.openCountry = false
      this.adForm.outputCurrency = this.otcUnitCurrencies.find(temp => {
        return temp.fiatId === country.defaultFiatId
      })
    },
    updatePriceType (type) {
      this.adForm.priceType = type
      this.openPriceType = false
      this.validatePrice()
    },
    createAd () {
      const validateMinLimit = this.validateMinLimit()
      const validateMaxLimit = this.validateMaxLimit()
      const validateFundPassword = this.validateFundPassword()
      const validatePrice = this.validatePrice()
      const validateVolume = this.validateVolume()
      const validateWindow = this.validateWindow()
      const validateTerms = this.validateTerms()
      const validateAutoReply = this.validateAutoReply()
      const validateFilterNumberOrderComplete = this.validateFilterNumberOrderComplete()
      let userPaymentMethods = this.filterPayments.filter(temp => {
        return temp.isOn
      })
      this.selectedPaymentMethod = userPaymentMethods.length

      if (validateMinLimit || validateFundPassword ||
        validateVolume || validateWindow ||
        validatePrice || validateMaxLimit || validateFilterNumberOrderComplete || validateAutoReply || validateTerms
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
    cancelAd () {
      this.$router.back()
    },
    submitAdForm (bodyObj) {
      OtcService.submitAdForm(bodyObj).then(rs => {
        this.isLoading = false
        if (rs.status === CONSTANT.SUCCESS) {
          this.$router.push({ name: 'otc-ads' })
        }
      })
    },
    checkUserPayment (payment, userPayments) {
      let result = userPayments.find(temp => {
        return temp.id === payment.id
      })
      return Boolean(result)
    },
    initCreateFormData (countries, currencies) {
      this.adForm = JSON.parse(JSON.stringify(this.initAdForm))
      if (countries && countries.length) {
        let selectedFiat = this.$route.query.fiatId
        let temp = null
        let country = null
        // Check fiat default from url
        if (selectedFiat) {
          temp = this.otcUnitCurrencies.find(fiat => {
            return fiat.fiatId === selectedFiat
          })
          country = countries.find(country => {
            return country.defaultFiatId === selectedFiat
          })
        }
        // Init data if can not found country from url
        if (!country || !temp) {
          country = countries[0]
          temp = this.otcUnitCurrencies.find(fiat => {
            return fiat.id === countries[0].defaultFiatId
          })
        }
        this.adForm.country = country
        this.adForm.outputCurrency = temp
      }

      // Init ad type
      this.adForm.adType = this.tradeStatus[0].id

      // Init currency from url
      if (currencies && currencies.length) {
        let selectedCurrency = this.$route.query.currencyId
        let temp = null
        if (selectedCurrency) {
          temp = currencies.find(cur => {
            return cur.currencyId === selectedCurrency
          })
        }
        if (!temp) {
          temp = currencies[0]
        }
        this.adForm.inputCurrency = temp
      }

      // Init price type
      this.adForm.priceType = this.priceType[0]
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
    openPaymentMethodForm () {
      this.$store.dispatch('toggleOtcPaymentMethod')
    }
  }
}
</script>
