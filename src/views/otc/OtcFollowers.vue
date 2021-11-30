<template>
  <div class="otc-trade otc-followers">
    <div class="otc-trade-menu menu-buy-sell">
      <ul class="clearfix">
        <li v-for="i in types" :key="i.id"
          @click="switchTab(i)"
          :class="{ 'active': currentTab.id === i.id, 'otc-buy-color': i.id === 1, 'otc-sell-color': i.id === 2 }">
          <span>
            {{ $t(i.name) }}
          </span>
        </li>
      </ul>
    </div>
    <div class="otc-trade-body">
      <div class="otc-list-orders">
        <dl>
          <dt class="clearfix">
            <div class="item-user w-25">{{ $t('TITLE_COMPLETION_RATE') }}</div>
            <div class="item-kyc-level w-15">{{ $t('TITLE_KYC_LEVEL') }}</div>
            <div class="item-total-orders w-20">{{ $t('TITLE_TOTAL_ORDERS') }}</div>
            <div class="item-avg-time w-15">{{ $t('TITLE_AVG_TIME') }}</div>
            <div class="item-time w-15">{{ $t('TITLE_TIME_OF_FOLLOWING') }}</div>
            <div class="item-action w-10 text-right pr-20">{{ $t('TITLE_CONTROL') }}</div>
          </dt>
        </dl>
        <dl v-if="currentTab.id === 1 && followers.length">
          <dd class="clearfix" v-for="(i, index) in followers" :key="index">
            <div class="item-user w-25">
              <a href="#" class="item-avatar-wrap">
                <div class="item-avatar color-1">
                  <em class="name">{{ i.nickname ? i.nickname.substring(0, 1).toUpperCase() : '' }}</em>
                  <span class="online-icon off"></span>
                </div>
              </a>
              <router-link :to="{ name: 'otc-trader', query: { id: i.inviteCode }}">{{ i.nickname }} ({{ i.completionRate }}%)</router-link>
            </div>
            <div class="item-kyc-level w-15">
              <label class="mobile-label">{{ $t('TITLE_KYC_LEVEL') }}</label>
              <span>{{ $t('TITLE_LEVEL', { level: i.kycLevel }) }}</span></div>
            <div class="item-total-orders w-20">
              <label class="mobile-label">{{ $t('TITLE_TOTAL_ORDERS') }}</label>
              <span>{{ i.totalOrder }}
                (<span class="otc-buy-color">{{ i.totalBuyOrder }}</span> | <span class="otc-sell-color">{{ i.totalSellOrder }}</span>)
              </span>
            </div>
            <div class="item-avg-time w-15">
              <label class="mobile-label">{{ $t('TITLE_AVG_TIME') }}</label>
              <span>{{ i.avgPaymentTime }}</span>
            </div>
            <div class="item-time w-15">
              <label class="mobile-label">{{ $t('TITLE_TIME_OF_FOLLOWING') }}</label>
              <span>{{ $moment(i.createdAt).utc().local().format('YYYY-MM-DD') }}</span>
            </div>
            <div class="item-action w-10 text-right pr-20">
              <label class="mobile-label">{{ $t('TITLE_CONTROL') }}</label>
              <span @click="handleUndoAction(1, i)">
                <i class="hb_icon_ash_can otc-sell-color"></i>
              </span>
            </div>
          </dd>
        </dl>
        <dl v-else-if="currentTab.id === 2 && blacklist.length">
          <dd class="clearfix" v-for="(i, index) in blacklist" :key="index">
            <div class="item-user w-25">
              <a href="#" class="item-avatar-wrap">
                <div class="item-avatar color-1">
                  <em class="name">{{ i.nickname ? i.nickname.substring(0, 1).toUpperCase() : '' }}</em>
                  <span class="online-icon off"></span>
                </div>
              </a>
              <router-link :to="{ name: 'otc-trader', query: { id: i.inviteCode }}">{{ i.nickname }} ({{ i.completionRate }}%)</router-link>
            </div>
            <div class="item-kyc-level w-15">
              <label class="mobile-label">{{ $t('TITLE_KYC_LEVEL') }}</label>
              <span>{{ $t('TITLE_LEVEL', { level: i.kycLevel }) }}</span></div>
            <div class="item-total-orders w-20">
              <label class="mobile-label">{{ $t('TITLE_TOTAL_ORDERS') }}</label>
              <span>{{ i.totalOrder }}
                (<span class="otc-buy-color">{{ i.totalBuyOrder }}</span> | <span class="otc-sell-color">{{ i.totalSellOrder }}</span>)
              </span>
            </div>
            <div class="item-avg-time w-15">
              <label class="mobile-label">{{ $t('TITLE_AVG_TIME') }}</label>
              <span>{{ i.avgPaymentTime }}</span>
            </div>
            <div class="item-time w-15">
              <label class="mobile-label">{{ $t('TITLE_TIME_OF_FOLLOWING') }}</label>
              <span>{{ $moment(i.createdAt).utc().local().format('YYYY-MM-DD') }}</span>
            </div>
            <div class="item-action w-10 text-right pr-20">
              <label class="mobile-label">{{ $t('TITLE_CONTROL') }}</label>
              <span @click="handleUndoAction(2, i)">
                <i class="hb_icon_ash_can otc-sell-color"></i>
              </span>
            </div>
          </dd>
        </dl>
        <dl v-else>
          <dd class="no-data-tips clearfix">
            <div class="no-data-table">
              <i class="icon-no-order"/>
              <span class="otc-color">{{ $t('MSG_NO_DATA_TO_DISPLAY') }}</span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import CONSTANT from '@/configs/constant'
export default {
  data () {
    return {
      types: [
        { name: 'TITLE_FOLLOWING', id: 1 },
        { name: 'TITLE_BLACKLIST', id: 2 }
      ],
      currentTab: {}
    }
  },
  computed: {
    blacklist () {
      return this.$store.getters.blacklist
    },
    followers () {
      return this.$store.getters.followers
    }
  },
  watch: {
  },
  created () {
    let current = this.$route.query.tab || this.types[0].id
    this.currentTab = this.types.find(temp => {
      return temp.id === parseInt(current)
    })
    this.getDataByTab(current)
  },
  methods: {
    switchTab (current) {
      this.currentTab = current
      this.getDataByTab(current.id)
      this.$router.push({ name: 'otc-followers', query: { tab: current.id } })
    },
    getDataByTab (current) {
      let tab = parseInt(current)
      switch (tab) {
        case 1:
          this.$store.dispatch('getFollowers')
          break
        case 2:
          this.$store.dispatch('getBlacklist')
          break
        default:
          break
      }
    },
    handleUndoAction (currentTab, i) {
      let bodyObj = i
      currentTab = Number(currentTab)
      if (currentTab === 1) {
        this.$confirm(this.$t('COMMON_OTC_CONFIRM_REMOVE_FOLLOW'), this.$t('TEXT_WARNING')).then(() => {
          this.$store.dispatch('unFollowUser', bodyObj).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getFollowers')
            }
          })
        })
      } else {
        this.$confirm(this.$t('COMMON_OTC_CONFIRM_REMOVE_BLACKLIST'), this.$t('TEXT_WARNING')).then(() => {
          this.$store.dispatch('unBlockUser', bodyObj).then(data => {
            if (data.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getBlacklist')
            }
          })
        })
      }
    }
  }
}
</script>
