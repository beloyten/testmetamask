<template>
  <v-main class="otc-trade-page pt-0">
    <section class="banner-otc d-flex align-center">
      <v-row class="ma-0">
        <v-col flat tile cols="12" class="pl-0 pr-0 pt-0 d-flex justify-center align-center flex-column">
          <p class="title">Hesman P2P: Buy/Sell Your Crypto Locally</p>
          <p class="content">Peer-to-peer exchange (or P2P exchange) is a marketplace where people can trade crypto directly with each other on their own terms, in virtually any country.</p>
        </v-col>
      </v-row>
    </section>
    <section class="page-content py-10 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-row class="ma-0">
        <v-col cols="12" md="4" lg="2" class="pl-0 pr-0">
          <v-btn-toggle rounded borderless dense mandatory>
            <v-btn class="buy-button" width="100" height="40" plain retain-focus-on-click @click="switchType(OTC_TYPE.BUY)">
              <span>Buy</span>
            </v-btn>
            <v-btn class="sell-button" width="100" height="40" plain retain-focus-on-click @click="switchType(OTC_TYPE.SELL)">
              <span>Sell</span>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12" md="4" lg="8" class="pl-0 pr-0 mr-auto">
          <v-slide-group mandatory show-arrows>
            <v-slide-item
              v-for="item in otcCurrencies" :key="item.currencyId"
            >
              <v-btn
                class="mx-2"
                :class="selectedCurr.currencyId === item.currencyId ? 'active-coin' : ''"
                retain-focus-on-click
                active-class="active-link white--text"
                depressed
                text
                plain
                v-ripple="{ class: 'primary--text' }"
                @click="switchCurrency(item)"
              >
              {{ item.name }}
              </v-btn>
            </v-slide-item>
          </v-slide-group>
        </v-col>
        <v-col cols="12" md="2" class="px-0">
          <v-select solo flat
            label="Select Fiat"
            item-value="fiatId"
            background-color="#FFFFFF"
            :value="selectedFiat.fiatId"
            :items="otcUnitCurrencies"
            @change="switchUnitCurrency"
          >
            <template v-slot:prepend>

            </template>
            <template v-slot:selection="{item}">
              <v-avatar size="24" color="#FFDF00">
                <span class="grey[400]--text">{{item.symbol}}</span>
              </v-avatar>
              <span class="ml-3" >{{ item.name }}</span>
            </template>
            <template v-slot:item="{item}">
              <v-avatar size="24" color="#FFDF00">
                <span class="grey[400]--text">{{item.symbol}}</span>
              </v-avatar>
              <span class="ml-3" >{{ item.name }}</span>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col cols="12" class="pl-0 pr-0">
          <v-card flat>
            <v-row class="ma-0 px-5 pt-10">
              <v-col cols="12" md="4" lg="2" class="pl-0 pr-0 mr-auto">
                <v-text-field v-model="amountSearch" background-color="#fff" append-icon="mdi-magnify" dense height="30" outlined rounded placeholder="Amount">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="2" lg="1" class="pl-0 pr-0 d-flex justify-end">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text tile plain dense
                      :ripple="false" color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Refresh
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="selectRefresh(item.value)"
                    >
                      {{ item.title }}
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
            <v-data-table disable-sort hide-default-footer show-expand
              item-key="id"
              :single-expand="true"
              :headers="headers"
              :items="otcAds.data"
              :search="amountSearch"
              :expanded.sync="tableExpanded"
            >
              <template slot="item.nickname" slot-scope="{ item }">
                <v-avatar size="24" color="primary">
                  <span class="white--text">{{item.nickname.charAt(0).toUpperCase()}}</span>
                </v-avatar>
                <span class="">
                  {{item.nickname}}
                </span>
              </template>
              <template slot="item.price" slot-scope="{ item }">
                <span class="text-subtitle-1">
                  {{item.beauty_price }}
                </span>
                <span class="text-caption">
                  {{ selectedFiat.symbol }}/{{ selectedCurr.symbol}}
                </span>
              </template>
              <template slot="item.limitavailable" slot-scope="{ item }">
                <v-row class="py-3">
                  <v-col cols="12">
                    <label class="d-inline-block">Available:</label><span class="">{{' '+item.beauty_available+' '+selectedCurr.symbol}}</span>
                  </v-col>
                  <v-col cols="12">
                    <label class="d-inline-block">Limits:</label><span>{{' ' +item.beauty_minLimit +' '+  selectedFiat.symbol +' - '+item.beauty_maxLimit+' '+selectedFiat.symbol}}</span>
                  </v-col>
                </v-row>
              </template>
              <template slot="item.paymentMethodTrade" slot-scope="{ }">
                <img src="/assets/images/bank-method.png" alt="Bank Account" title="Bank Account">
                <span class="ml-3">Bank Account</span>
              </template>
              <template slot="item.data-table-expand" slot-scope="{ item }">
                <v-btn text
                  v-if="isLoggedIn && item.inviteCode === user.inviteCode"
                  @click="editAd(item)"
                >
                  <v-icon>mdi-edit</v-icon>
                  Edit
                </v-btn>
                <v-btn
                  v-else-if="isKycInfoValid(item) || !isLoggedIn"
                  @click="showForm(item)"
                  :ripple="false"
                  :color="currentOtc.type.toUpperCase() === 'BUY' ? 'primary' : 'accent'"
                  :loading="showActionForm && item.id == currentAdTemp.id"
                >
                  {{currentOtc.type.toUpperCase() + ' ' + item.currencyCode.toUpperCase()}}
                </v-btn>
                <v-btn v-else depressed
                  color="primary"
                  :to="{ name: 'otc-verification' }"
                  :ripple="false"
                >
                  Required KYC
                </v-btn>
              </template>
              <template slot="expanded-item" slot-scope="{ headers, item }">
                <td :colspan="headers.length">
                  <template v-if="item.id == currentAd.id && !showActionForm">
                    <BuySellForm :ad="currentAd" @cancel="cancel" ref="buySellForm"/>
                  </template>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </section>
    <section class="otc-working pb-15">
      <v-card-title class="pl-15 pt-15">How Hesman Works</v-card-title>
      <v-row class="px-15 ma-0 pt-5">
        <v-col cols="12" md="3" lg="2" class="pl-0 pr-0">
          <v-btn class="buy" block :class="hesmanWorkType === 'Buy' ? 'active-button' : ''" plain width="200" height="40" retain-focus-on-click @click="chooseType('Buy')">
            Buy Crypto
          </v-btn>
        </v-col>
        <v-col cols="12" md="3" lg="2" class="pl-0 pr-0">
          <v-btn class="sell" block :class="hesmanWorkType === 'Sell' ? 'active-button' : ''" plain width="200" height="40" retain-focus-on-click @click="chooseType('Sell')">
            Sell Crypto
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="px-15 ma-0 hesman-work" v-if="hesmanWorkType === 'Buy'">
        <v-col
          v-for="item in listBuy"
          :key="item.id"
          cols="12"
          md="3"
          lg="3"
          :class="item.id !== 3 && 'mr-auto'"
        >
          <v-item-group>
            <v-item>
              <v-card
                flat
                height="300"
                class="pt-10"
              >
                <v-img :src="item.img" width="80" height="80" />
                <h2 class="pt-10">{{item.title}}</h2>
                <p class="pt-5">{{item.description}}</p>
              </v-card>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>
      <v-row class="px-15 ma-0 hesman-work" v-else>
        <v-col
          v-for="item in listSell"
          :key="item.id"
          cols="12"
          md="3"
          lg="3"
          :class="item.id !== 3 && 'mr-auto'"
        >
          <v-item-group>
            <v-item>
              <v-card
                flat
                height="300"
                class="pt-10"
              >
                <v-img :src="item.img" width="80" height="80" />
                <h2 class="pt-10">{{item.title}}</h2>
                <p class="pt-5">{{item.description}}</p>
              </v-card>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>
    </section>
  </v-main>
</template>
<script>
import CONSTANT from '@/configs/constant'
import UtilService from '@/utils/UtilService'
import OtcService from '@/api/otc/OtcService'
import BuySellForm from './components/BuySellForm'
import UserState from '@/mixin/user-state'
// import LocalStorage from '@/utils/LocalStorage'
import _ from 'lodash'
export default {
  components: {
    BuySellForm
  },
  mixins: [UserState],
  data () {
    return {
      countPagingChanged: 0,
      OTC_TYPE: CONSTANT.OTC_TYPE,
      search: false,
      filter: {
        currency: {},
        paymentMethod: {},
        country: {}
      },
      filterTemp: {
        currency: {},
        paymentMethod: {},
        country: {}
      },
      ordersStatus: 'cancelled',
      showActionForm: false,
      currentAd: {},
      currentAdTemp: {},
      needSetInfo: true,
      isTableLoading: false,
      interval: null,
      currentOtcWallet: {},
      prevText: '<i class="hb_icon_arrow_down"></i>Prev',
      nextText: 'Next<i class="hb_icon_arrow_down"></i>',
      currencyId: this.$route.query.currencyId,
      fiatId: this.$route.query.fiatId,
      fiatSelect: 2,
      listRefresh: [
        {
          id: 1,
          lable: 'Refresh now',
          value: 'Refresh now'
        },
        {
          id: 2,
          lable: 'Refresh in 5s',
          value: 'Refresh in 5s'
        },
        {
          id: 3,
          lable: 'Refresh in 10s',
          value: 'Refresh in 10s'
        }
      ],
      tableExpanded: [],
      headers: [
        {
          text: 'Advertisers',
          align: 'start',
          sortable: false,
          value: 'nickname',
          width: '22%'
        },
        {
          text: 'Price',
          value: 'price',
          sortable: false,
          width: '16%'
        },
        {
          text: 'Limits/Available',
          value: 'limitavailable',
          sortable: false
        },
        {
          text: 'Payment Method',
          value: 'paymentMethodTrade',
          sortable: false,
          width: '15%'
        },
        {
          text: 'Trade 0 Fee',
          value: 'data-table-expand',
          sortable: false,
          width: '15%'
        }
      ],
      hesmanWorkType: 'Buy',
      listBuy: [
        {
          id: 1,
          img: '/assets/icons/dat-lenh.png',
          title: 'Place an Order',
          description: 'Once you place a P2P order, the crypto asset will be escrowed by Hesman P2P.'
        },
        {
          id: 2,
          img: '/assets/icons/thanh-toan.png',
          title: 'Pay the Seller',
          description: 'Send money to the seller via the suggested payment methods. Complete the fiat transaction and click "Transferred, notify seller" on Hesman P2P.'
        },
        {
          id: 3,
          img: '/assets/icons/nhan-tien.png',
          title: 'Get your Crypto',
          description: 'Once the seller confirms receipt of money, the escrowed crypto will be released to you.'
        }
      ],
      listSell: [
        {
          id: 1,
          img: '/assets/icons/dat-lenh.png',
          title: 'Place an Order',
          description: 'Sau khi bạn đặt lệnh, tiền mã hóa của bạn sẽ được ký quỹ vào Hesman P2P.'
        },
        {
          id: 2,
          img: '/assets/icons/xac-nhan.png',
          title: 'Confirm the Payment',
          description: 'Check the transaction record in the given payment account, and make sure you receive the money sent by the buyer.'
        },
        {
          id: 3,
          img: '/assets/icons/mo-khoa.png',
          title: 'Release Crypto',
          description: 'Once you confirm the receipt of money, release crypto to the buyer on Hesman P2P.'
        }
      ],
      amountSearch: '',
      items: [
        {
          title: 'Refresh now',
          value: 0
        },
        {
          title: 'Refresh in 5s',
          value: 5
        },
        {
          title: 'Refresh in 10s',
          value: 10
        },
        {
          title: 'Refresh in 20s',
          value: 20
        }
      ],
      refreshTime: CONSTANT.OTC.REFRESH_TIME
    }
  },
  computed: {
    kycInfo () {
      return this.$store.getters.kycInfo
    },
    isEnableAdsCheckKyc () {
      return CONSTANT.OTC.IS_ENABLE_ADS_CHECK_KYC
    },
    otcCurrencies () {
      return this.$store.getters.otcCurrencies
    },
    currentOtc () {
      return UtilService.getCurrentOtc(this.pair)
    },
    paging () {
      return this.$store.getters.paging
    },
    pair () {
      return this.$route.params.type_pair
    },
    configs () {
      return this.$store.getters.configs
    },
    otcUserPayments () {
      return this.$store.getters.otcUserPayments
    },
    otcPayments () {
      return this.$store.getters.otcPayments
    },
    filterOtcPayments () {
      return _.filter(this.otcUserPayments, (temp) => {
        return temp.active
      })
    },
    paymentMethod: {
      get () {
        return this.otcPayments.length && JSON.parse(JSON.stringify(this.otcPayments[0]))
      },
      set (val) {
        this.filterTemp.paymentMethod = val
      }
    },
    otcCountries () {
      return this.$store.getters.otcCountries
    },
    country: {
      get () {
        return this.otcCountries.length && JSON.parse(JSON.stringify(this.otcCountries[0]))
      },
      set (val) {
        this.filterTemp.country = val
      }
    },
    otcUnitCurrencies () {
      return this.$store.getters.otcUnitCurrencies
    },
    currency: {
      get () {
        return this.otcUnitCurrencies.length && JSON.parse(JSON.stringify(this.otcUnitCurrencies[0]))
      },
      set (val) {
        this.filterTemp.currency = val
      }
    },
    pagination () {
      return this.$store.getters.pagination
    },
    otcAds () {
      return this.$store.getters.otcAds
    },
    showLoading () {
      return this.$store.getters.showLoading
    },
    otcBalances () {
      return this.$store.getters.otcBalances
    },
    user () {
      return this.$store.getters.user
    },
    selectedCurr () {
      let obj = {}
      if (!this.$route.query.currencyId || !this.otcCurrencies.length) return obj
      obj = this.otcCurrencies.find(temp => {
        return temp.currencyId === this.$route.query.currencyId
      })
      return obj
    },
    selectedFiat () {
      let obj = {}
      if (!this.$route.query.fiatId || !this.otcUnitCurrencies.length) return obj
      obj = this.otcUnitCurrencies.find(temp => {
        return temp.fiatId === this.$route.query.fiatId
      })
      return obj
    },
    isLoggedIn () {
      // return this.$store.getters.jwt && this.$store.getters.jwt.accessToken
      return this.$keycloak.authenticated && this.$store.getters.isLoggedIn
    }
  },
  watch: {
    search: function (val) {
      if (this.search) {
        this.$('body').addClass('body-cover')
      } else {
        this.$('body').removeClass('body-cover')
      }
    },
    otcCountries (val) {
      if (!val || !val.length) return
      if (!this.filter.country.id) this.filter.country = val[0]
    },
    otcUnitCurrencies (val) {
      if (!val || !val.length) return
      if (!this.filter.currency.id) this.filter.currency = val[0]
    },
    otcPayments (val) {
      if (!val || !val.length) return
      if (!this.filter.paymentMethod.id) this.filter.paymentMethod = val[0]
    },
    $route (val) {
      // this.loadData()
      this.reloadPage()
    }
  },
  async created () {
    // setup page
    let coins = await this.$store.dispatch('getOtcCurrencies')
    let otcFiats = await this.$store.dispatch('getFiat')
    let fiat = this.$route.query.fiatId || localStorage.getItem('fiatId') || otcFiats[0].fiatId
    let coin = this.$route.query.currencyId || localStorage.getItem('currencyId') || coins[0].currencyId
    // let selectedFiat = otcFiats.find(temp => {
    //   return temp.fiatId === fiat
    // })
    // let selectedCurr = coins.find(temp => {
    //   return temp.currencyId === coin
    // })
    // this.selectedFiat = selectedFiat || otcFiats[0]
    // this.selectedCurr = selectedCurr || coins[0]
    if (this.$route.name === 'otc-trade') {
      this.$router.push({ name: 'otc-trade', query: { fiatId: fiat, currencyId: coin }, params: { type_pair: this.pair } })
    }

    if (!this.otcUserPayments || !this.otcUserPayments.length) {
      this.isLoggedIn && this.$store.dispatch('getUserPayments')
    }
    // if (!this.user || !this.user.username) {
    //   this.isLoggedIn && this.$store.dispatch('getKycInfo')
    // }
    this.loadData()
    this.updateAds()
  },
  methods: {
    checkKycLevelRequire (ad) {
      if (ad.filterPassAdvancedVerification) {
        return this.user.kycLevel === 3 && this.kycInfo.kycStatus === CONSTANT.OTC.KYC_STATUS.APPROVE
      } else if (ad.filterBindMobileNumber) {
        return this.user.kycLevel >= 2
      }
      return true
    },
    isKycInfoValid (ad) {
      return (this.isEnableAdsCheckKyc && this.checkKycLevelRequire(ad)) || !this.isEnableAdsCheckKyc
    },
    editAd (i) {
      this.$router.push({ name: 'otc-update-ad', query: { id: i.id } })
    },
    togglePopup () {
      this.search = !this.search
    },
    openModalFunPassword () {
      this.$store.dispatch('toggleOtcFundPasswordForm')
    },
    updateCountry (data) {
      this.country = data
    },
    updateCurrency (data) {
      this.currency = data
    },
    updatePayment (data) {
      this.paymentMethod = data
    },
    submitForm () {
      this.search = false
      this.filter = JSON.parse(JSON.stringify(this.filterTemp))
    },
    async switchType (type) {
      const param = type
      this.initPaging()
      this.$router.push({
        name: 'otc-trade',
        query: { fiatId: this.$route.query.fiatId, currencyId: this.$route.query.currencyId },
        params: { type_pair: param.toLowerCase() }
      })
    },
    initPaging () {
      let temp = JSON.parse(JSON.stringify(this.paging))
      temp.page = 1
      this.$store.dispatch('setPagingByClick', temp)
    },
    showForm (ad) {
      this.tableExpanded = []
      if (this.currentAd.id === ad.id) {
        this.currentAd = {}
        this.order = {
          volume: '',
          volumeFiat: ''
        }
        return
      }
      if (!this.isLoggedIn) {
        this.$store.dispatch('startConnectWalletProcess', true)
        return
      }
      // this.currentAd = ad
      if (this.filterOtcPayments.length) {
        this.showActionForm = true
        this.currentAdTemp = ad
        OtcService.getOtcAd(ad.id).then(async rs => {
          if (rs.status === CONSTANT.SUCCESS) {
            this.currentAd = await UtilService.transformAd(rs.data)
            this.showActionForm = false
            this.tableExpanded.push(ad)
            // wait a second
            setTimeout(() => {
            }, 500)
          } else {
            this.$store.dispatch('showErrorMsg', this.$t('TEXT_GET_AD_ERROR'))
          }
        }).catch(e => {
          this.$store.dispatch('showErrorMsg', this.$t('TEXT_GET_AD_ERROR'))
        })
      } else {
        let data = {
          data: { 'name': 'otc-setting', 'query': { 'act': 'payment-setting' } },
          message: 'Add payment method to continue',
          action: 'redirectToDestinationRoute'
        }
        this.$store.dispatch('toggleConfirmModal', data)
      }
    },
    cancel () {
      this.currentAd = {}
      this.tableExpanded = []
      this.order = {
        volume: '',
        volumeFiat: ''
      }
    },
    reloadPage () {
      clearInterval(this.interval)
      this.isTableLoading = true
      this.loadData()
      this.updateAds()
    },
    async goToPage (i) {
      const temp = JSON.parse(JSON.stringify(this.paging))
      temp.page = i
      this.$store.dispatch('setPagingByClick', temp)
      // Load data from api
      this.loadData()
    },
    updateAds () {
      this.isLoggedIn && this.$store.dispatch('getUserBalance')
      this.interval = setInterval(() => {
        // console.log('update otc ads')
        this.loadData()
      }, this.refreshTime)
    },
    async loadData () {
      let type = CONSTANT.OTC_TYPE
      const paging = {
        page: this.paging.page || CONSTANT.DEFAULT_PAGE_NUMBER,
        size: this.paging.size || CONSTANT.DEFAULT_PAGE_SIZE
      }
      let filter = {
        tadType: this.pair.toLowerCase() === type.BUY.toLowerCase() ? type.SELL : type.BUY,
        currencyId: this.$route.query.currencyId,
        fiatId: this.$route.query.fiatId
      }
      if (!filter.currencyId || !filter.fiatId) return
      let queryObj = {
        filter: filter,
        paging: paging
      }
      await this.$store.dispatch('getOtcAds', queryObj)
      this.isTableLoading = false
    },
    checkCurrentState () {
      if (this.otcCurrencies && this.otcCurrencies.length) {

      }
    },
    switchCurrency (currency) {
      // this.selectedCurr = currency
      this.initPaging()
      this.$router.push({
        name: 'otc-trade',
        query: { fiatId: this.$route.query.fiatId || this.selectedFiat.fiatId, currencyId: currency.currencyId },
        params: { type_pair: this.pair || 'buy' } })

      localStorage.setItem('currencyId', currency.currencyId)
    },
    switchUnitCurrency (fiatId) {
      // this.selectedFiat = fiat
      let fiat = this.otcUnitCurrencies.find(temp => {
        return temp.fiatId === fiatId
      })
      this.$router.push({
        name: 'otc-trade',
        query: { fiatId: fiat.fiatId, currencyId: this.$route.query.currencyId || this.selectedCurr.id },
        params: { type_pair: this.pair || 'buy' }
      })
      this.openCurrency = false
      localStorage.setItem('fiatId', fiat.fiatId)
    },
    chooseType (string) {
      this.hesmanWorkType = string
    },
    selectRefresh (time) {
      if (time !== 0) {
        this.refresh = time * 1000
        this.reloadPage()
      } else {
        this.reloadPage()
      }
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>
