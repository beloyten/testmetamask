<template>
<v-card color="transparent" class="">
  <v-card-text>
    <v-row class="">
      <v-col cols="12" sm="6">
        <v-card flat tile color="transparent">
          <v-card-title>
            <v-avatar size="24" color="primary">
              <span class="white--text">{{currentAd.nickname.charAt(0).toUpperCase()}}</span>
            </v-avatar>
            <span class="ml-2">{{currentAd.nickname}}</span>
          </v-card-title>
          <v-card-subtitle>
            <span class="ml-2">1 orders, 0.00% completion</span>
          </v-card-subtitle>
          <v-card-text>
            <v-row class="px-5">
              <v-col cols="12" sm="6">
                <span class="mr-1">Price</span>
                <span
                  class="text-body-1"
                  :class="isBuyForm? 'primary--text':'accent--text'"
                >
                  {{ currentAd.beauty_price }}  {{ currentAd.fiatCode }}
                </span>
                <span class="ml-3">
                  <vue-countdown v-if="remainingTime" :time="remainingTime" @end="handleCountdownEnd">
                    <template slot-scope="props"><span class="text--small">{{  props.seconds }}s</span></template>
                  </vue-countdown>
                </span>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="mr-1">Available</span>
                <span
                  class="text-body-1"
                  :class="isBuyForm? 'primary--text':'accent--text'"
                >
                  {{ currentAd.beauty_available }} {{ currentAd.currencyCode }}
                </span>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="mr-1">Payment windows </span>
                <span class="text-body-1">{{ currentAd.paymentWindow }} minutes</span>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="mr-1">
                  Payment Methods
                </span>
                <span v-for="(i, index) in paymentMethods" :key="index" class="text-body-1">
                  <strong>{{ i }}</strong>
                </span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="px-5">
              <v-col cols="12">
                <p>Advertiser's terms and conditions:</p>
                <p class="text-body-2 black--text">{{ currentAd.terms }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card flat tile class="" color="transparent">
          <!-- START BUY FORM -->
          <v-card-text v-if="isBuyForm">
            <v-form ref="refOrderForm">
              <v-row class="">
                <v-col cols="12">
                  <label class="text-subtitle-2 mb-2">
                    I want to pay
                  </label>
                  <v-text-field solo flat clearable
                    ref="volumeFiatRef"
                    type="number"
                    background-color="#F6F8FA"
                    v-model="order.volumeFiat"
                    :placeholder="currentAd.beauty_minLimit + ' - ' + currentAd.beauty_maxLimit"
                    :rules="[rules.required, rules.validateFiat]"
                    @focus="focus(true)"
                  >
                    <template slot="prepend-inner">
                      <span class="text-caption mr-5">
                        {{ currentAd.fiatCode }}
                      </span>
                    </template>
                    <template slot="append">
                      <v-btn tile text small
                        color="primary"
                        :ripple="false"
                        @click="fillAll"
                      >
                        All
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <label class="text-subtitle-2 mb-2">
                    I will receive
                  </label>
                  <v-text-field solo flat clearable
                    ref="volumeRef"
                    type="number"
                    background-color="#F6F8FA"
                    v-model="order.volume"
                    placeholder="0.00"
                    :rules="[rules.required, rules.validateVolume]"
                    @focus="focus(false)"
                  >
                    <template slot="prepend-inner">
                      <span class="text-caption mr-5">
                        {{ currentAd.currencyCode }}
                      </span>
                    </template>
                    <template slot="append">
                      <v-btn tile text small
                        color="primary"
                        :ripple="false"
                        @click="fillAll"
                      >
                        All
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <!-- END BUY FORM -->
          <!-- START SELL FORM -->
          <v-card-text v-else>
            <v-form ref="refOrderForm">
              <v-row class="">
                <v-col cols="12">
                  <label class="text-subtitle-2 mb-2">
                    I want to sell
                  </label>
                  <v-text-field solo flat clearable
                    ref="volumeRef"
                    type="number"
                    background-color="#F6F8FA"
                    placeholder="0.00"
                    v-model="order.volume"
                    :rules="[rules.required, rules.validateVolume]"
                    @focus="focus(false)"
                  >
                    <template slot="prepend-inner">
                      <span class="text-caption mr-5">
                        {{ currentAd.currencyCode }}
                      </span>
                    </template>
                    <template slot="append">
                      <v-btn tile text small
                        color="primary"
                        :ripple="false"
                        @click="fillAll"
                      >
                        All
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <label class="text-subtitle-2 mb-2">
                    I will receive
                  </label>
                  <v-text-field solo flat clearable
                    ref="volumeFiatRef"
                    type="number"
                    background-color="#F6F8FA"
                    v-model="order.volumeFiat"
                    :placeholder="currentAd.beauty_minLimit + ' - ' + currentAd.beauty_maxLimit"
                    :rules="[rules.required, rules.validateFiat]"
                    @focus="focus(true)"
                  >
                    <template slot="prepend-inner">
                      <span class="text-caption mr-5">
                        {{ currentAd.fiatCode }}
                      </span>
                    </template>
                    <template slot="append">
                      <v-btn tile text small
                        color="primary"
                        :ripple="false"
                        @click="fillAll"
                      >
                        All
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <!-- END SELL FORM -->
          <v-card-actions class="">
            <v-spacer></v-spacer>
            <v-btn title text
              class="px-6"
              color="primary"
              :disabled="isLoading"
              :ripple="false"
              @click="cancel"
            >
              {{ $t('BTN_CANCEL') }}
            </v-btn>
            <v-btn
              class="px-8"
              :color="isBuyForm ? 'primary' : 'accent'"
              :loading="isLoading"
              :ripple="false"
              @click="confirm"
            >
              {{ isBuyForm? $t('Buy') : $t('Sell') }} {{ currentAd.currencyCode }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>

<script>
import CONSTANT from '@/configs/constant'
import UtilService from '@/utils/UtilService'
import OtcService from '@/api/otc/OtcService'
import BigNumber from 'bignumber.js'
import VueCountdown from '@chenfengyuan/vue-countdown'
export default {
  components: {
    VueCountdown
  },
  props: ['ad', 'wallet'],
  data () {
    return {
      OTC_TYPE: CONSTANT.OTC_TYPE,
      currentAd: this.ad,
      currentOtcWallet: {},
      order: {
        volume: '',
        volumeFiat: '',
        fundPassword: ''
      },
      isLoading: false,
      isInputVolume: false,
      isInputVolumeFiat: false,
      remainingTime: 0,
      time: 30,
      countdown: null,
      rules: {
        required: val => !!val || 'This field is required.',
        validateVolume: this.validateVolume,
        validateFiat: this.validateFiat
      }
    }
  },
  computed: {
    changeInputVolume () {
      return { 'volume': this.order.volume, 'volumeFiat': this.order.volumeFiat }
    },
    paymentMethods () {
      let pms = []
      this.currentAd.paymentMethods.map(p => {
        if (pms.indexOf(p.paymentMethod.name) >= 0) return
        pms.push(p.paymentMethod.name)
      })

      return pms
    },
    otcBalances () {
      return this.$store.getters.otcBalances
    },
    isBuyForm () {
      return this.currentAd.type.toUpperCase() === this.OTC_TYPE.SELL.toUpperCase()
    },
    isSellForm () {
      return this.currentAd.type.toUpperCase() === this.OTC_TYPE.BUY.toUpperCase()
    }
  },
  watch: {
    changeInputVolume (newOrder, oldOrder) {
      // update fiat volume
      if (newOrder.volume === oldOrder.volume && !this.isInputVolume) {
        let val = newOrder.volumeFiat
        let tempVolume = (isNaN(val) || !val) ? null : new BigNumber(1).dividedBy(new BigNumber(this.currentAd.price)).multipliedBy(val).toFixed(6, 1)
        this.order.volume = tempVolume
      }
      // update volume
      if (newOrder.volumeFiat === oldOrder.volumeFiat && !this.isInputVolumeFiat) {
        let val = newOrder.volume
        this.order.volumeFiat = (isNaN(val) || !val) ? null : new BigNumber(val).multipliedBy(this.currentAd.price).toFixed(CONSTANT.OTC.OTC_FIAT_PRECISION, 1)
      }
    },
    time () {
      if (this.time === 0) {
        clearInterval(this.countdown)
      }
    }
  },
  created () {
    console.log('open form ', CONSTANT.OTC.ORDER_FORM_OPEN_TIME)
    this.remainingTime = 300000 // CONSTANT.OTC.ORDER_FORM_OPEN_TIME
    this.countdown = setInterval(() => {
      this.time = this.time - 1
    }, 1000)
    this.currentOtcWallet = this.otcBalances.find(temp => {
      return temp.coinCode === this.currentAd.currencyCode
    })
  },
  methods: {
    handleCountdownEnd () {
      this.remainingTime = 0
      this.cancel()
    },
    fillAll () {
      if (this.isBuyForm) {
        this.focus(true)
        this.order.volumeFiat = this.currentAd.maxLimit
        console.log(this.order.volumeFiat, ' buy')
      } else {
        let maxAmount = new BigNumber(this.currentAd.maxLimit).dividedBy(this.currentAd.price).toNumber()
        console.log(maxAmount, ' sell')
        this.focus(false)
        if (this.currentOtcWallet.balanceFiat > maxAmount) {
          this.order.volume = maxAmount > this.currentAd.available ? this.currentAd.available : maxAmount
        } else {
          this.order.volume = this.currentOtcWallet.balanceFiat > this.currentAd.available ? this.currentAd.available : this.currentOtcWallet.balanceFiat
        }
      }
    },
    focus (isOnFiat) {
      if (isOnFiat) {
        this.isInputVolumeFiat = true
        this.isInputVolume = false
      } else {
        this.isInputVolumeFiat = false
        this.isInputVolume = true
      }
    },
    validate () {
      return this.$refs.refOrderForm.validate()
    },
    validateVolume (val) {
      // validate volume field
      if (this.isSellForm && this.order.volume > this.currentOtcWallet.balanceFiat) {
        return this.$t('WITHDRAW_BALANCE_NOT_ENOUGH')
      }
      if (new BigNumber(val).toNumber() > this.currentAd.available) {
        return this.$t('TITLE_VOLUME_LIMIT', { max: this.currentAd.available, symbol: this.currentAd.currencyCode })
      }

      return true
    },
    validateFiat (val) {
      if (new BigNumber(val).toNumber() < this.currentAd.minLimit) {
        return this.$t('TITLE_MIN_LIMIT_FORM', { min: this.currentAd.minLimit, fiat: this.currentAd.fiatCode })
      }
      if (new BigNumber(val).toNumber() > this.currentAd.maxLimit) {
        return this.$t('TITLE_MAX_LIMIT_FORM', { max: this.currentAd.maxLimit, fiat: this.currentAd.fiatCode })
      }

      return true
    },
    confirm () {
      if (this.isLoading) {
        return
      }
      if (!this.validate()) {
        // this.$store.dispatch('showErrorMsg', this.$t('TITLE_ALL_FIELDS'))
        return
      }
      this.isLoading = true
      this.$google.getCaptcha(CONSTANT.RECAPTCHA.OTC_CREATE_ORDER)
        .then(token => {
          this.order.reCaptcha = token
          this.order.adId = this.currentAd.id
          OtcService.createOrder(this.order).then(rs => {
            const data = rs
            if (data.status === CONSTANT.SUCCESS) {
              this.currentAd = {}
              if (this.$route.params.type_pair) {
                this.$store.dispatch('setCurrentOtc', UtilService.getCurrentOtc(this.$route.params.type_pair))
              } else {
                this.$store.dispatch('getTraderInfo', this.$route.query.id)
              }
              this.$router.push({ name: 'otc-tradeinfo', query: { id: data.data.id } })
            }
            this.isLoading = false
          }).catch(e => {
            this.isLoading = false
          })
        })
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
