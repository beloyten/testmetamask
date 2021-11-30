<template>
  <div class="otc-orders">
    <div class="otc-trade-menu menu-buy-sell">
      <ul class="clearfix">
        <li
          v-for="i in types"
          :key="i.name"
          :class="{ 'active': i.id === $route.query.status }"
          class="otc-color-blue"
          @click="switchStatus(i)">
          <span><img v-if="i.img" :src="i.img" alt=""><em>{{ i.name }}</em></span>
        </li>
      </ul>
    </div>
    <div class="otc-trade-body">
      <div class="otc-list-orders">
        <dl>
          <dt class="clearfix">
            <div class="item-no w-10 pl-20">{{ $t('TEXT_NO') }}.</div>
            <div class="item-type w-7">{{ $t('TEXT_TYPE') }}</div>
            <div class="item-amount w-16">{{ $t('LBL_AMOUNT') }}</div>
            <div class="item-price w-18">{{ $t('LBL_TABLE_PRICE') }}</div>
            <div class="item-volume w-12">{{ $t('TEXT_VOLUME_FEE') }}</div>
            <div class="item-status w-12">{{ $t('TEXT_STATUS') }}</div>
            <div class="item-time w-13">{{ $t('LBL_TABLE_TIME') }}</div>
            <div class="item-counterparty w-12 text-right pr-20">{{ $t('TEXT_COUNTERPARTY') }}</div>
          </dt>
        </dl>
        <dl
          :class="{ 'loading': showLoading }">
          <dd v-for="i in myOrders.data" :key="i.id" class="clearfix">
            <div class="item-no w-10 pl-20">
              <label class="mobile-label">{{ $t('TEXT_NO') }}</label>
              <router-link :to="{ name: 'otc-tradeinfo', query: { id: i.id }}" class="otc-color-blue">
                {{ i.orderNumber }}
              </router-link>
            </div>
            <div class="item-type w-7">
              <label class="mobile-label">{{ $t('TEXT_TYPE') }}</label>
              <span :class="i.typeObj.color">
                {{ $t(i.typeObj.realType) }}
              </span>
            </div>
            <div class="item-amount w-16">
              <label class="mobile-label">{{ $t('LBL_AMOUNT') }}</label>
              {{ i.beautyAmount }}
            </div>
            <div class="item-price w-18"
                 :class="i.typeObj.color">
              <label class="mobile-label">{{ $t('LBL_TABLE_PRICE') }}</label>
              {{ i.beautyPrice }} {{ i.fiatCode }}
            </div>

            <div class="item-volume w-12">
              <label class="mobile-label">{{ $t('TEXT_VOLUME_FEE') }}</label>
              <span>{{ i.beautyVolume }} {{ i.currencyCode }}</span>
              <span class="fee otc-color">0.000000 {{ i.currencyCode }}</span>
            </div>
            <div v-if="i.status === STEP.RELEASED" class="item-status w-12">
              <label class="mobile-label">{{ $t('TEXT_STATUS') }}</label>
              <span class="otc-buy-color">{{ i.statusTxt }}</span>
            </div>
            <div v-else-if="i.status === STEP.CANCELLED" class="item-status w-12">
              <label class="mobile-label">{{ $t('TEXT__STATUS') }}</label>
              <span class="otc-sell-color">{{ i.statusTxt }}</span>
            </div>
            <div v-else class="item-status w-12">
              <label class="mobile-label">{{ $t('TEXT__STATUS') }}</label>
              <span class="color-blue">{{ i.statusTxt }}</span>
            </div>
            <div class="item-time w-13 otc-color">
              <label class="mobile-label">{{ $t('LBL_TABLE_TIME') }}</label>
              {{ i.beautyCreatedAt }}
            </div>
            <div class="item-counterparty w-12 pr-20 text-right">
              <label class="mobile-label">{{ $t('TEXT_COUNTERPARTY') }}</label>
              <router-link
                :to="{ name: 'otc-trader', query: { id: i.typeObj.counterpartyId} }"
                :title="i.typeObj.counterparty"
                class="otc-color-blue">{{ i.typeObj.counterparty }}
              </router-link>
            </div>
          </dd>
        </dl>
        <dl v-if="!myOrders.total">
          <dd class="no-data-tips clearfix">
            <div class="no-data-table">
              <i class="icon-no-order"/>
              <span class="otc-color">{{ $t('MSG_NO_DATA_TO_DISPLAY') }}</span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <div
      v-if="myOrders && myOrders.total && myOrders.data.length"
      class="text-center">
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
  components: {
  },
  data () {
    return {
      countPagingChanged: 0,
      types: CONSTANT.OTC.ORDER_TYPES,
      STEP: CONSTANT.OTC_STEP,
      prevText: '<i class="hb_icon_arrow_down"></i>Prev',
      nextText: 'Next<i class="hb_icon_arrow_down"></i>'
    }
  },
  computed: {
    pagination () {
      return this.$store.getters.pagination
    },
    myOrders () {
      return this.$store.getters.myOrders
    },
    showLoading () {
      return this.$store.getters.showLoading
    }
  },
  watch: {
    $route (val) {
      this.loadData(val)
    }
  },
  created () {
    const route = this.$route.query
    const status = route.status
    let defaultStatus
    if (!status) {
      defaultStatus = this.types[0]
      this.$router.push({ name: 'otc-orders', query: { status: defaultStatus.id } })
    } else {
      this.loadData(this.$route)
    }
  },
  methods: {
    goToPage (i) {
      this.loadDataByPaging(this.$route, i)
    },
    switchStatus (i) {
      if (i.id === this.$route.query.status) return
      this.initPagination()
      this.$router.push({ name: 'otc-orders', query: { status: i.id } })
    },
    async loadData (val) {
      const paging = {
        page: CONSTANT.DEFAULT_PAGE_NUMBER,
        size: CONSTANT.DEFAULT_PAGE_SIZE
      }
      const queryObj = {
        paging: paging,
        filter: { status: val.query.status }
      }
      // Load data from api
      await this.$store.dispatch('getMyOrders', queryObj)
    },
    async loadDataByPaging (val, page) {
      const paging = {
        page: page,
        size: CONSTANT.DEFAULT_PAGE_SIZE
      }
      const queryObj = {
        paging: paging,
        filter: { status: val.query.status }
      }
      // Load data from api
      await this.$store.dispatch('getMyOrders', queryObj)
    },
    initPagination () {
      const temp = JSON.parse(JSON.stringify(this.pagination))
      temp.page = 1
      this.$store.dispatch('setPagination', temp)
      this.countPagingChanged++
    }
  }
}
</script>
