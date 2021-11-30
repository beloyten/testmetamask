<template>
  <div class="finance-exchange-wrap">
    <div id="tb-finance" class="tb-finance tb-finance-exchange color-gray">
      <div class="body" :class="{ 'loading': isLoading }">
        <div class="table_list">
          <dl>
            <dd v-for="(wallet, key) in otcBalances" :key="key">
              <div class="currency">
                <div class="inner-currency">
                  <img :src="wallet.imageUrl" :alt="wallet.symbol" />
                  <span>{{ wallet.symbol }}</span>
                </div>
              </div>
              <div class="account-detail">
                <h4>{{ $t('TEXT_OTC_ACCOUNT') }}</h4>
                <ul>
                  <li>
                    {{ $t('TEXT_AVAILABLE') }}：
                    <em>{{ wallet.beautyBalanceOtc || 0 }} {{ wallet.symbol }}</em>
                  </li>
                </ul>
              </div>
              <div class="account-detail">
                <h4>{{ $t('TEXT_FROZEN') }}</h4>
                <ul>
                  <li>
                    {{ $t('TEXT_AVAILABLE') }}：
                    <em>{{ wallet.beautyBalanceOtcFrozen }} {{ wallet.symbol }}</em>
                  </li>
                </ul>
              </div>
              <div class="account-controls">
                <a
                  class="tc-button tc-transparent tc-btn-w100"
                  :class="{ 'disabled': !wallet.allowTransferOutFiat }"
                  @click="openModalTransfer(wallet)"
                >{{ $t('BTN_TRANSFER') }}</a>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="finance-exchange-details">
      <div class="tb-finance tb-finance-details">
        <div class="head">
          {{ $t('TEXT_DETAILS') }}
        </div>
        <div class="body">
          <div class="table_list" :class="{ 'loading': isLoadingHistory }">
            <dl>
              <dt>
                <div>{{ $t('TEXT_TYPE') }}</div>
                <div>{{ $t('TEXT_COIN') }}</div>
                <div>{{ $t('TEXT_TIME') }}</div>
                <div>{{ $t('TEXT_AMOUNT') }}</div>
              </dt>
            </dl>
            <dl class="table-body" v-if="otcBalancesHistory && otcBalancesHistory.length">
              <dd v-for="(i, index) in otcBalancesHistory" :key="index">
                <div>{{ $t(i.beautyType) }}</div>
                <div>{{ i.coinName }}</div>
                <div>{{ i.beautyDate }}</div>
                <div>{{ i.totalCoin }} {{ i.coinName }}</div>
              </dd>
            </dl>
            <dl v-else>
              <EmptyData />
            </dl>
          </div>
          <div v-if="pagination.total > 1">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-count="pagination.total"
              :page-size="pagination.size"
              :current-page="pagination.page"
              @current-change="goToPage"
              :hide-on-single-page="true">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <ExchangeWalletTransfer/>
  </div>
</template>

<script>
import EmptyData from '@/components/EmptyData'
import CONSTANT from '@/configs/constant'
import ExchangeWalletTransfer from '@/views/modal/ExchangeWalletTransfer'

export default {
  components: {
    EmptyData,
    ExchangeWalletTransfer
  },
  data () {
    return {
      isLoadingHistory: false,
      searchDateForm: '',
      searchDate: '',
      searchCoin: '',
      searchType: '',
      searchBox: false,
      isLoading: false,
      interval: null
    }
  },
  computed: {
    pagination () {
      return this.$store.getters.pagination
    },
    otcBalances () {
      return this.$store.getters.otcBalances
    },
    otcBalancesHistory () {
      return this.$store.getters.otcBalancesHistory
    },
    configs () {
      return this.$store.getters.configs
    },
    user () {
      return this.$store.getters.user
    }
  },
  async created () {
    this.isLoading = true
    let query = {
      page: CONSTANT.DEFAULT_PAGE_NUMBER,
      size: CONSTANT.DEFAULT_PAGE_SIZE
    }
    this.$store.dispatch('getOtcBalancesHistory', query)
    this.updateBalance()
  },
  methods: {
    async goToPage (page) {
      let temp = JSON.parse(JSON.stringify(this.pagination))
      temp.page = page
      this.$store.dispatch('setPagination', temp)
      this.isLoadingHistory = true
      await this.$store.dispatch('getOtcBalancesHistory', temp)
      this.isLoadingHistory = false
    },
    openModalTransfer (wallet) {
      if (!wallet.allowTransferOutFiat) return
      this.$store.dispatch('toggleTransferWalletExchange', wallet)
    },
    async updateBalance () {
      this.isLoading = true
      await this.$store.dispatch('getUserBalance')
      setTimeout(() => {
        this.isLoading = false
      }, 200)
      this.interval = setInterval(() => {
        console.log('interval update balance for exchange')
        this.$store.dispatch('getUserBalance')
      }, CONSTANT.EXCHANGE.WALLET_BALANCE_RF_TIME)
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>
