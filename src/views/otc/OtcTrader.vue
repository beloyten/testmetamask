<template>
  <v-main class="otc-trade-info-page pt-0">
    <v-card class="ma-0 py-5 elevation-1" color="#FFF">
      <div class="page-content mx-xs-0 mx-sm-5 mx-md-auto">
        <v-row class="ma-0 mb-5 justify-end">
          <h3>&nbsp;</h3>
          <a @click="handleBlacklist" class="accent--text mr-10">{{ isInBlackList ? $t('TEXT_UN_BLACK_LIST') : $t('TEXT_BLACK_LIST') }}</a>
          <a @click="handleFollow" class="primary--text"
              :class="{ 'loading': isProcessing }">{{ isInFollowing ? $t('TEXT_UN_FOLLOW') : $t('TEXT_FOLLOW') }}</a>
        </v-row>
        <v-row class="ma-0">
          <v-col cols="12" md="3" class="pa-0">
            <v-avatar color="primary">
              <span class="white--text">{{traderInfo && traderInfo.user && traderInfo.user.shortTxt ? traderInfo.user.shortTxt : ''}}</span>
              <span class="online-icon"
                :class="{ 'on': checkIsOnline(traderInfo.user.inviteCode), 'off': !checkIsOnline(traderInfo.user.inviteCode) }"/>
            </v-avatar>
            <span class="ml-5">{{ traderInfo.user.nickname }}({{ traderInfo.user.completionRate }} %)</span>
          </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_REGISTER_DATE') }}</span>
            <p class="text-subtitle-1">{{ traderInfo.user.registeredDate }}</p>
          </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_KYC_VERIFICATION') }}</span>
            <p class="text-subtitle-1">{{ $t('TEXT_LEVEL', { level: traderInfo.user.kycLevel }) }}</p>
          </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_VERIFY_USER') }}</span>
            <p class="text-subtitle-1">{{ traderInfo.user.nickname }}</p>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="ma-0 pt-5">
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">Total Orders</span>
            <p class="text-subtitle-1">
              <span>{{ traderInfo.user.totalOrder }}</span>
              (<span class="otc-buy-color">
                {{ traderInfo.user.totalBuyOrder }}</span> | <span class="otc-sell-color">{{ traderInfo.user.totalSellOrder }}</span>)
            </p>
          </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_ORDERS_30') }}</span>
            <p class="text-subtitle-1">{{ traderInfo.user.total30DaysOrder }}</p>
          </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_COMPLETION_RATE') }}</span>
            <p class="text-subtitle-1">{{ traderInfo.user.completionRate }}%</p>
          </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_AVG_TIME') }}</span>
            <p class="text-subtitle-1">{{ traderInfo.user.avgPaymentTime }}”</p>
          </v-col>
        </v-row>
        <v-row class="ma-0 pt-5">
          <v-col cols="12" md="3" class="pa-0">
            <span class="text-caption">{{ $t('TEXT_SECURE_DEPOSIT') }}</span>
            <p class="text-subtitle-1">{{ traderInfo.user.secureDeposit || 0 }}</p>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <section class="page-content mx-xs-0 mx-sm-5 mx-md-auto py-10">
      <span>Buy from this user</span>
      <v-data-table disable-sort hide-default-footer show-expand
        item-key="id"
        :single-expand="true"
        :headers="headers"
        :items="traderInfo.data.Sell"
        :expanded.sync="tableExpanded"
        class="mt-5"
      >
        <template v-slot:no-data>
          <no-data message="No data to display."/>
        </template>
        <template slot="item.token" slot-scope="{ item }">
          <v-avatar size="24" color="primary">
            <span class="white--text">{{item.currencyCode.charAt(0).toUpperCase()}}</span>
          </v-avatar>
          <span class="">
            {{item.currencyCode}}
          </span>
        </template>
        <template slot="item.price" slot-scope="{ item }">
          <span class="text-subtitle-1">
            {{item.beauty_price }}
          </span>
        </template>
        <template slot="item.limitavailable" slot-scope="{ item }">
          <v-row class="py-3">
            <v-col cols="12">
              <label class="d-inline-block">Available:</label><span class="">{{item.beauty_available}}</span>
            </v-col>
            <v-col cols="12">
              <label class="d-inline-block">Limits:</label><span>{{item.beauty_minLimit+' - '+item.beauty_maxLimit}}</span>
            </v-col>
          </v-row>
        </template>
        <template slot="item.paymentMethodTrade" slot-scope="{ }">
          <img src="/assets/images/bank-method.png" alt="Bank Account" title="Bank Account">
          <span class="ml-3">Bank Account</span>
        </template>
        <template slot="item.data-table-expand" slot-scope="{ item }">
          <v-btn text
            v-if="isCurrentUser"
            :to="{ name: 'otc-update-ad', query: { id: item.id } }"
          >
            <v-icon>mdi-edit</v-icon>
            Edit
          </v-btn>
          <v-btn
            v-else
            @click="showForm(item)"
            :ripple="false"
            color="primary"
            :loading="showActionForm && item.id == currentAdTemp.id"
          >
            {{ $t('BTN_BUY') }}
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
    </section>
    <section class="page-content mx-xs-0 mx-sm-5 mx-md-auto py-10">
      <span>{{ $t('BTN_SELL') }} {{ $t('TEXT_TO_USER') }}</span>
      <v-data-table disable-sort hide-default-footer show-expand
        item-key="id"
        :single-expand="true"
        :headers="headers"
        :items="traderInfo.data.Buy"
        :expanded.sync="tableExpanded"
        class="mt-5"
      >
        <template v-slot:no-data>
          <no-data message="No data to display."/>
        </template>
        <template slot="item.token" slot-scope="{ item }">
          <v-avatar size="24" color="primary">
            <span class="white--text">{{item.currencyCode.charAt(0).toUpperCase()}}</span>
          </v-avatar>
          <span class="">
            {{item.currencyCode}}
          </span>
        </template>
        <template slot="item.price" slot-scope="{ item }">
          <span class="text-subtitle-1">
            {{item.beauty_price }}
          </span>
        </template>
        <template slot="item.limitavailable" slot-scope="{ item }">
          <v-row class="py-3">
            <v-col cols="12">
              <label class="d-inline-block">Available:</label><span class="">{{item.beauty_available}}</span>
            </v-col>
            <v-col cols="12">
              <label class="d-inline-block">Limits:</label><span>{{item.beauty_minLimit+' - '+item.beauty_maxLimit}}</span>
            </v-col>
          </v-row>
        </template>
        <template slot="item.paymentMethodTrade" slot-scope="{ }">
          <img src="/assets/images/bank-method.png" alt="Bank Account" title="Bank Account">
          <span class="ml-3">Bank Account</span>
        </template>
        <template slot="item.data-table-expand" slot-scope="{ item }">
          <v-btn text
            v-if="isCurrentUser"
            :to="{ name: 'otc-update-ad', query: { id: item.id } }"
          >
            <v-icon>mdi-edit</v-icon>
            Edit
          </v-btn>
          <v-btn
            v-else
            @click="showForm(item)"
            :ripple="false"
            color="accent"
            :loading="showActionForm && item.id == currentAdTemp.id"
          >
            {{ $t('BTN_SELL') }}
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
    </section>
  </v-main>
</template>
<script>
import OtcService from '@/api/otc/OtcService'
import BuySellForm from './components/BuySellForm'
import CONSTANT from '@/configs/constant'
import UtilService from '@/utils/UtilService'
import NoData from './components/NoData.vue'

import UserState from '@/mixin/user-state'
export default {
  components: {
    BuySellForm,
    NoData
  },
  mixins: [UserState],
  data () {
    return {
      isLoading: false,
      showActionForm: false,
      currentAd: {},
      currentOtcWallet: {},
      currentAdTemp: {},
      isProcessing: false,
      headers: [
        {
          text: 'Token',
          align: 'start',
          sortable: false,
          value: 'token',
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
      ]
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
    isCurrentUser () {
      return this.user && this.traderInfo && this.traderInfo.user && this.user.inviteCode === this.traderInfo.user.userName
    },
    traderInfo () {
      return this.$store.getters.traderInfo
    },
    blacklist () {
      return this.$store.getters.blacklist
    },
    followers () {
      return this.$store.getters.followers
    },
    isInBlackList () {
      let obj = this.blacklist.find(temp => {
        return temp.inviteCode === this.traderInfo.user.inviteCode
      })
      return obj
    },
    isInFollowing () {
      let obj = this.followers.find(temp => {
        return temp.inviteCode === this.traderInfo.user.inviteCode
      })
      return obj
    },
    isLoggedIn () {
      return this.$store.getters.jwt &&
        this.$store.getters.jwt.accessToken
    }
  },
  async created () {
    if (!this.kycInfo || !this.kycInfo.username) {
      this.isLoggedIn && this.$store.dispatch('getKycInfo')
    }
    if (!this.otcUserPayments || !this.otcUserPayments.length) {
      this.isLoggedIn && this.$store.dispatch('getUserPayments')
    }
    let traderInviteCode = this.$route.query.id
    this.isLoading = true
    this.isLoggedIn && this.$store.dispatch('getUserBalance')
    await this.$store.dispatch('getTraderInfo', traderInviteCode)
    setTimeout(() => {
      this.isLoading = false
    }, 300)
    this.isLoggedIn && this.$store.dispatch('getFollowers')
    this.isLoggedIn && this.$store.dispatch('getBlacklist')
  },
  methods: {
    handleFollow () {
      let bodyObj = this.traderInfo.user
      if (this.isInFollowing) {
        this.$confirm(this.$t('CONFIRM_REMOVE_FOLLOW'), this.$t('TEXT_WARNING')).then(() => {
          this.$store.dispatch('unFollowUser', bodyObj).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getFollowers')
            }
          })
        })
      } else {
        this.isProcessing = true
        let obj = {}
        this.$google.getCaptcha('follow')
          .then(async token => {
            obj.reCaptcha = token
            OtcService.followUser(this.traderInfo.user.inviteCode, obj).then(rs => {
              if (rs.status === CONSTANT.SUCCESS) {
                this.$store.dispatch('getFollowers')
              }
              this.isProcessing = false
            })
          })
      }
    },
    handleBlacklist () {
      let bodyObj = this.traderInfo.user
      if (this.isInBlackList) {
        this.$confirm(this.$t('CONFIRM_REMOVE_BLACKLIST'), this.$t('TEXT_WARNING')).then(() => {
          this.$store.dispatch('unBlockUser', bodyObj).then(data => {
            if (data.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getBlacklist')
            }
          })
        })
      } else {
        bodyObj.message = this.$t('CONFIRM_BLOCK_USER')
        this.$confirm(this.$t('CONFIRM_BLOCK_USER'), this.$t('TEXT_WARNING')).then(() => {
          this.$store.dispatch('blockUser', bodyObj).then(data => {
            if (data.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getBlacklist')
            }
          })
        })
      }
    },
    showForm (ad) {
      if (!this.isLoggedIn) {
        this.$store.dispatch('showErrorMsg', this.$t('MBL_LOGIN_TO_CONTINUE'))
        return
      }
      if (!this.kycInfo.kycLevel) {
        this.$store.dispatch('toggleOtcFundPasswordForm')
        return
      }
      if (!this.otcUserPayments.length) {
        let message = this.$t('TEXT_BANK_METHOD_REQUIRED')
        this.$store.dispatch('showErrorMsg', message)
        setTimeout(() => {
          this.$router.push({
            name: 'otc-payment-settings',
            query: { currentTab: 'payments_setting' }
          })
        }, 300)
        return
      }
      if (this.currentAd.id === ad.id) {
        this.currentAd = {}
        this.order = {
          volume: '',
          volumeFiat: ''
        }
        return
      }
      console.log('show form')
      this.showActionForm = true
      this.currentAdTemp = ad
      OtcService.getOtcAd(ad.id).then(rs => {
        if (rs.status === CONSTANT.SUCCESS) {
          setTimeout(() => {
            this.currentAd = UtilService.transformAd(rs.data)
            this.showActionForm = false
          }, 500)
        }
      }).catch(e => {
        let message = this.$t('TEXT_GET_AD_ERROR')
        this.$store.dispatch('showErrorMsg', message)
      })
    },
    cancel () {
      this.currentAd = {}
      this.order = {
        volume: '',
        volumeFiat: ''
      }
    }
  }
}
</script>
