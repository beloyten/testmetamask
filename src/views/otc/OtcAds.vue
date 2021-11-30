<template>
  <div class="otc-my-ads">
    <div class="otc-create-head">
      <h2>{{ $t('TITLE_MY_ADS') }}</h2>
    </div>
    <div class="otc-trade-body otc-list-orders">
      <dl>
        <dt class="clearfix">
          <div class="item-no w-7 pl-20">{{ $t('TIT_NO') }}.</div>
          <div class="item-type w-8">{{ $t('TIT_TYPE') }}</div>
          <div class="item-amount w-17">{{ $t('LBL_AMOUNT') }}</div>
          <div class="item-limit w-25">{{ $t('LBL_LIMIT') }}</div>
          <div class="item-price w-15">{{ $t('LBL_TABLE_PRICE') }}</div>
          <div class="item-time w-15">{{ $t('LBL_TABLE_TIME') }}</div>
          <div class="item-control w-13 text-center">{{ $t('TITLE_CONTROL') }}</div>
        </dt>
      </dl>
      <dl :class="{ 'loading': isLoading }">
        <dd v-for="(i, index) in myAds.data" :key="i.id" class="clearfix">
          <div class="item-no otc-color w-7 pl-20">
            <label class="mobile-label">{{ $t('TIT_NO') }}</label>
            <span>{{ startIndex + index }}</span>
          </div>
          <div class="item-type w-8">
            <label class="mobile-label">{{ $t('TIT_TYPE') }}</label>
            <span :class="{ 'otc-buy-color': i.type === 'Buy', 'otc-sell-color': i.type === 'Sell' }">
              {{ i.type.toUpperCase() }}
            </span>
          </div>
          <div class="item-amount w-17">
            <label class="mobile-label">{{ $t('LBL_AMOUNT') }}</label>
            <span>{{ i.beauty_available }} {{ i.currencyCode }}</span>
          </div>
          <div class="item-limit w-25">
            <label class="mobile-label">{{ $t('LBL_LIMIT') }}</label>
            <span>{{ i.beauty_minLimit }} - {{ i.beauty_maxLimit }} {{ i.fiatCode }}</span>
          </div>
          <div class="item-price w-15"
            :class="{ 'otc-buy-color': i.type.toUpperCase() === 'BUY',
              'otc-sell-color': i.type.toUpperCase() === 'SELL' }">
            <label class="mobile-label">{{ $t('LBL_TABLE_PRICE') }}</label>
            <span>{{ i.beauty_price }} {{ i.fiatCode }}</span>
          </div>
          <div class="item-time otc-color w-15">
            <label class="mobile-label">{{ $t('LBL_TABLE_TIME') }}</label>
            <span>{{ i.beautyUpdatedAt }}</span>
          </div>
          <div class="item-control w-13 text-center" v-if="i.status !== 'Deleted'">
            <label class="mobile-label">{{ $t('TITLE_CONTROL') }}</label>
            <a class="switch-wrap" href="javascript:;"
              @click="changeStatus(i)">
              <span class="switch-icon"
                :class="{ 'on': i.active, 'off': !i.active }">
                <em>{{ i.active ? 'ON' : 'OFF'}}</em>
              </span>
            </a>
            <router-link :to="{ name: 'otc-update-ad', query: { id: i.id }}">
              <i class="hb_icon_edit color-blue"></i>
            </router-link>
            <a @click="cancel(i)"><i class="hb_icon_ash_can otc-sell-color"></i></a>
          </div>
          <div class="item-control w-13 text-center" v-else>
            <span class="otc-sell-color">{{ i.status }}</span>
          </div>
        </dd>
      </dl>
      <dl v-if="!myAds.total">
        <dd class="no-data-tips clearfix">
          <div class="no-data-table">
            <i class="icon-no-order"/>
            <span class="otc-color">{{ $t('LBL_NO_ADS') }}</span>
          </div>
        </dd>
      </dl>
    </div>
    <div class="text-center">
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
</template>
<script>
import CONSTANT from '@/configs/constant'
export default {
  data () {
    return {
      isProcessing: false,
      isLoading: false
    }
  },
  computed: {
    startIndex () {
      return (this.pagination.page - 1) * this.pagination.size + 1
    },
    otcUnitCurrencies () {
      return this.$store.getters.otcUnitCurrencies
    },
    otcCurrencies () {
      return this.$store.getters.otcCurrencies
    },
    myAds () {
      return this.$store.getters.myAds
    },
    pagination () {
      return this.$store.getters.pagination
    }
  },
  async created () {
    let query = {
      page: CONSTANT.DEFAULT_PAGE_NUMBER,
      size: CONSTANT.DEFAULT_PAGE_SIZE
    }
    this.isLoading = true
    await this.$store.dispatch('getMyAds', query)
    setTimeout(() => {
      this.isLoading = false
    }, 300)
  },
  methods: {
    async goToPage (page) {
      if (page === this.pagination.page) return
      let query = {
        page: page,
        size: CONSTANT.DEFAULT_PAGE_SIZE
      }
      this.isLoading = true
      await this.$store.dispatch('getMyAds', query)
      setTimeout(() => {
        this.isLoading = false
      }, 300)
    },
    cancel (i) {
      let data = {
        data: i,
        action: 'cancelAd'
      }
      this.$store.dispatch('toggleConfirmFundPasswordModal', data)
    },
    changeStatus (i) {
      let data = {
        data: i,
        action: 'updateAdStatus'
      }
      this.$store.dispatch('toggleConfirmFundPasswordModal', data)
    }
  }
}
</script>
