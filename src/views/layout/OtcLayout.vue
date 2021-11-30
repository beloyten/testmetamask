<template>
  <v-app>
    <main-header />

    <v-main>
      <v-container fluid class="pa-0">

        <router-view/>

        <UserConnectFormModal />
        <ModalVuexConfirm/>
        <ModalVuexFundPasswordConfirm/>
      </v-container>
    </v-main>

    <main-footer />
  </v-app>
</template>

<script>
import LocalStorage from '@/utils/LocalStorage'
import UtilService from '@/utils/UtilService'
import ClickOutside from '@/directives/VueClickOutside'
import ModalVuexConfirm from '@/views/modal/ModalVuexConfirm'
import ModalVuexFundPasswordConfirm from '@/views/modal/ModalVuexFundPasswordConfirm'
import UserConnectFormModal from '@/views/modal/UserConnectFormModal'
import MainHeader from '@/components/MainHeader'
import MainFooter from '@/components/MainFooter'

export default {
  components: {
    MainHeader,
    MainFooter,
    ModalVuexConfirm,
    ModalVuexFundPasswordConfirm,
    UserConnectFormModal
  },
  directives: { ClickOutside },
  data () {
    return {
      openCurrency: false,
      openMenuMobile: false,
      selectedFiat: {
        fiatId: 1,
        name: 'USD',
        symbol: '$'
      },
      selectedCurr: {}
    }
  },
  computed: {
    pair () {
      return this.$route.params.type_pair
    },
    otcCurrencies () {
      return [
        {
          currencyId: 1,
          rate: 1,
          symbol: 'btc-1'
        },
        {
          currencyId: 2,
          rate: 1,
          symbol: 'btc-2'
        }
      ]
    },
    currentOtc () {
      return this.$store.getters.currentOtc
    },
    paging () {
      return this.$store.getters.paging
    },
    otcUnitCurrencies () {
      return [
        {
          fiatId: 1,
          name: 'USD',
          symbol: '$'
        },
        {
          fiatId: 2,
          name: 'EUR',
          symbol: '@'
        },
        {
          fiatId: 3,
          name: 'VNĐ',
          symbol: 'đ'
        }
      ]
    },
    kycInfo () {
      return this.$store.getters.kycInfo
    },
    user () {
      return this.$store.getters.user
    },
    config () {
      return this.$store.getters.configs
    },
    isLoggedIn () {
      return this.$store.getters.jwt &&
        this.$store.getters.jwt.accessToken
    },
    logged () {
      return LocalStorage.getItem('isLoggedIn')
    }
  },
  mounted () {
    // const _this = this
    // const $otcNav = _this.$(_this.$el).find('.otc-nav')

    // $otcNav.on('closeMenu', function () {
    //   _this.openMenuMobile = false
    // })
    // _this.$('.otc-nav-block a', $otcNav).on('click', function () {
    //   $otcNav.trigger('closeMenu')
    // })
    // _this.$('.otc-nav-block .curr-list', $otcNav).on('click', function () {
    //   $otcNav.trigger('closeMenu')
    // })
    // _this.$('.otc-nav-block .otc-currency-list ', $otcNav).on('click', function () {
    //   $otcNav.trigger('closeMenu')
    // })
  },
  async created () {
    // let coins = await this.$store.dispatch('getOtcCurrencies')
    // let otcFiats = await this.$store.dispatch('getFiat')
    // let fiat = this.$route.query.fiatId || localStorage.getItem('fiatId') || otcFiats[0].fiatId
    // let coin = this.$route.query.currencyId || localStorage.getItem('currencyId') || coins[0].currencyId
    // let selectedFiat = otcFiats.find(temp => {
    //   return temp.fiatId === fiat
    // })
    // let selectedCurr = coins.find(temp => {
    //   return temp.currencyId === coin
    // })
    // this.selectedFiat = selectedFiat || otcFiats[0]
    // this.selectedCurr = selectedCurr || coins[0]
    // if (this.$route.name === 'otc-trade') {
    //   this.$router.push({ name: 'otc-trade', query: { fiatId: fiat, currencyId: coin }, params: { type_pair: this.pair } })
    // }
    // // Check kyc info
    // if (this.isLoggedIn) {
    //   // this.checkKycInfo()
    // } else {
    //   // connect signalR
    //   this.$store.dispatch('connectOtcWs')
    // }
  },
  methods: {
    setShowSubMenu () {
      if (this.$store.getters.showSubMenu) {
        this.$store.dispatch('setShowSubMenu', false)
      }
    },
    onClickOutsideCurr () {
      this.openCurrency = false
    },
    openSetupInfo () {
      this.openMenuMobile = false
      this.$store.dispatch('toggleOtcFundPasswordForm')
    },
    switchUnitCurrency (currency) {
      this.selectedFiat = currency
      this.$router.push({
        name: 'otc-trade',
        query: { fiatId: currency.fiatId, currencyId: this.$route.query.currencyId || this.selectedCurr.id },
        params: { type_pair: this.pair || 'buy' }
      })
      this.openCurrency = false
      localStorage.setItem('fiatId', currency.fiatId)
    },
    async switchCurrency (currency) {
      this.selectedCurr = currency
      this.initPaging()
      this.$router.push({
        name: 'otc-trade',
        query: { fiatId: this.$route.query.fiatId || this.selectedFiat.fiatId, currencyId: currency.currencyId },
        params: { type_pair: this.pair || 'buy' } })
      localStorage.setItem('currencyId', currency.currencyId)
    },
    initPaging () {
      let temp = JSON.parse(JSON.stringify(this.paging))
      temp.page = 1
      this.$store.dispatch('setPagingByClick', temp)
    },
    calculateTotalMoney (amount) {
      return (amount && this.selectedFiat.rate) ? UtilService.calculateTotalFiatMoney(amount, this.selectedFiat.rate || 0, 2) : 0
    },
    async checkKycInfo () {
      let result = await this.$store.dispatch('getKycInfo')
      if (result && !result.kycLevel && this.$route.name !== 'otc-verification') {
        setTimeout(() => {
          // this.openSetupInfo()
        }, 1000)
      }
    }
  }
}
</script>
