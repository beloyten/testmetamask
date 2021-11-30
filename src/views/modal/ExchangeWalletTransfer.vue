<template>
  <div id="modals-container">
    <el-dialog
      :title="$t('BTN_TRANSFER')"
      :visible.sync="isShowTransferExchangeWallet"
      :closeOnClickModal="false"
      @open="onOpen"
      center
      class="tb-finance-exchange popup-small"
      :destroy-on-close="true"
      >
      <div ref="popupInner" class="popup-inner">
        <div class="popup-content" :class="{ 'loading': isLoading }">
          <div v-if="wallets.length" class="modal-field">
            <label class="text-label">{{ $t('TEXT_COIN') }}</label>
            <el-select v-model="defautFromCurrencyCode" placeholder="Select" @change="updateCurrency" class="with-100">
              <el-option
                v-for="item in wallets"
                :key="item.coinCode"
                :label="item.name"
                :value="item.coinCode">
              </el-option>
            </el-select>
          </div>
          <div class="modal-fields-swap">
            <div v-if="currentBalancePair.length" class="modal-field">
              <label class="text-label">{{ $t('TEXT_FROM' )}}</label>
              <div>
                <span>{{ this.$t(fromWallet.name) }}</span>
                <span>( {{ $t('TEXT_BALANCE') }} {{ fromWallet.beautyBalance }} {{ fromWallet.symbol }} )</span>
              </div>
            </div>
            <div v-if="currentBalancePair.length" class="modal-field">
              <label class="text-label">{{ $t('TEXT_TO' )}}</label>
              <div>
                <span>{{ this.$t(toWallet.name) }}</span>
                <span>( {{ $t('TEXT_BALANCE') }} {{ toWallet.beautyBalance }} {{ toWallet.symbol }} )</span>
              </div>
            </div>
          </div>
          <div class="modal-field">
            <label class="text-label">{{ $t('TEXT_AMOUNT') }}
              <strong class="text-primary" v-if="beautyAmount"> ({{ beautyAmount }})</strong>
            </label>
            <input type="number" placeholder="0.000000" v-model="amount">
            <span class="all-volume" @click="all">{{ $t('TEXT_ALL') }}</span>
          </div>

          <div class="popup-footer-box">
            <a class="popup-btn btn-cancel" href="javascript:;" @click="closeModal">{{ $t('BTN_CANCEL') }}</a>
            <a class="popup-btn" :class="{ 'disabled': !isValidated || !isAllowTransfer}" href="javascript:;" @click="transfer">
              {{ $t('BTN_TRANSFER') }}
            </a>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UtilService from '@/utils/UtilService'
export default {
  data () {
    return {
      fromWallet: {},
      toWallet: {},
      avaiable: '0.000000',
      amount: null,
      isLoading: false,
      defautFromCurrencyCode: null,
      currentBalancePair: []
    }
  },
  computed: {
    wallets () {
      return this.$store.getters.otcBalances
    },
    currentWallet () {
      return this.$store.getters.modalExchangeData || {}
    },
    user () {
      return this.$store.getters.user
    },
    isShowTransferExchangeWallet: {
      get () {
        return this.$store.getters.isShowTransferExchangeWallet
      },
      set (val) {
        this.$store.dispatch('toggleTransferWalletExchange')
      }
    },
    isValidated () {
      return this.fromWallet.balance && this.amount &&
        this.fromWallet.balance >= this.amount
    },
    pagination () {
      return this.$store.getters.pagination
    },
    beautyAmount () {
      if (!this.amount) return 0
      return UtilService.beautyAmount(this.amount, this.currentWallet.numberDecimals)
    },
    isAllowTransfer () {
      return this.currentWallet.allowTransferOutFiat
    }
  },
  watch: {
    currentWallet (val) {
      this.currentBalancePair = UtilService.buildOtcBalancePair(val)
      let defautFromCurrency = this.wallets.find(temp => {
        return temp.coinCode === val.coinCode
      })
      this.defautFromCurrencyCode = defautFromCurrency.coinCode
    }
  },
  methods: {
    onOpen () {
      this.amount = null
      if (!this.currentBalancePair || !this.currentBalancePair[0]) return
      this.initData(this.currentBalancePair)
    },
    all () {
      this.amount = this.fromWallet.balance
    },
    initData (data) {
      this.amount = null
      let currentBalancePair = data
      let fromWallet = currentBalancePair.find(temp => {
        return !temp.index
      })
      let toWallet = currentBalancePair.find(temp => {
        return temp.index
      })
      this.fromWallet = fromWallet
      this.toWallet = toWallet
    },
    loadData () {
      let currentBalancePair = this.currentBalancePair
      let nextMainWalletIndex = this.fromWallet.index ? 0 : 1
      let nextExWalletIndex = nextMainWalletIndex ? 0 : 1
      this.fromWallet = currentBalancePair[nextMainWalletIndex]
      this.toWallet = currentBalancePair[nextExWalletIndex]
    },
    async exchangeTransfer () {
      if (!this.isAllowTransfer) return
      this.isLoading = true
      let obj = this.buildPayloadData()
      let res = await this.$store.dispatch('transfer', obj)
      this.isLoading = false
      if (res) {
        this.$store.dispatch('getUserBalance')
        this.closeModal()
        this.$store.dispatch('getOtcBalancesHistory', this.pagination)
      }
    },
    transfer () {
      this.exchangeTransfer()
    },
    updateCurrency (coinCode) {
      let currency = this.wallets.find(temp => {
        return temp.coinCode === coinCode
      })
      let currentBalancePair = UtilService.buildOtcBalancePair(currency)
      this.currentBalancePair = currentBalancePair
      this.initData(currentBalancePair)
    },
    buildPayloadData () {
      let obj = {
        currency: this.currentWallet.coinCode,
        amount: this.amount
      }
      return obj
    },
    closeModal () {
      this.$store.dispatch('toggleTransferWalletExchange')
    }
  }
}
</script>
