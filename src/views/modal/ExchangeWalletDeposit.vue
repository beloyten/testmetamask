<template>
  <div class="tb-finance-exchange">
    <el-dialog
      :title="$t('TEXT_SECURITY_DEPOSIT')"
      :visible.sync="isShowDepositExchangeWallet"
      :closeOnClickModal="false"
      center
      class="popup-small"
      >
      <div ref="popupInner" class="popup-inner">
        <div class="popup-content">
          <div class="box-body" :class="{ 'loading': isProcessing }">
            <div class="deposit-info text-center" v-if="wallet && wallet.id">
              <p>{{ $t('TEXT_DEPOSIT_ADDRESS') }}</p>
              <h4 v-if="wallet.addressList.length">{{ wallet.addressList[0].address }}</h4>
              <p class="copy" v-if="wallet.addressList.length">
                <a @click="doCopy">{{ $t('BTN_COPY') }}</a>
              </p>
              <div v-if="!wallet.addressList.length">
                <div class="button_control">
                    <button type="submit" class="button btn btn-primary"
                      @click="generate"
                      >
                      <span>{{ $t('BTN_GENERATE') }}</span>
                    </button>
                </div>
              </div>
              <div class="deposit-wrap-qr" v-else>
                <vue-qr
                  :size="200"
                  :correct-level="2"
                  :text="wallet.addressList[0].address"
                />
              </div>
            </div>
            <div class="deposit-desc" v-html="$t('TEXT_DEPOSIT_DESC_' + wallet.coinCode, { symbol: wallet.coinCode})">
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import VueQr from 'vue-qr'
export default {
  components: {
    VueQr
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    wallet () {
      return this.$store.getters.modalExchangeData
    },
    isShowDepositExchangeWallet: {
      get () {
        return this.$store.getters.isShowDepositExchangeWallet
      },
      set (val) {
        this.$store.dispatch('toggleDepositWalletExchange')
      }
    }
  },
  methods: {
    doCopy () {
      this.$copyText(this.wallet.addressList[0].address).then(e => {
        this.$store.dispatch('showSuccessMsg', this.$t('TEXT_COPIED'))
      }, e => {
      })
    },
    generate () {
      this.isProcessing = true
      this.$store.dispatch('createWallet', this.wallet.coinCode).then(rs => {
        let temp = JSON.parse(JSON.stringify(this.wallet))
        temp.addressList = rs
        this.$store.dispatch('setExchangeWalletModalData', temp)
        this.isProcessing = false
      })
    }
  }
}
</script>
