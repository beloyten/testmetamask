<template>
  <v-main class="otc-my-orders">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">My Orders</span></v-toolbar-title>
            <v-spacer />
            <v-text-field solo flat hide-details
                background-color="#F8F9F9"
                color="#0000001f"
                v-model="search"
                placeholder="Input search"
                class="shrink"
                append-icon="mdi-magnify"
              />
          </v-toolbar>
        </v-card-title>
        <v-row class="ma-0">
          <v-col cols="12" md="8" lg="8" class="pa-0 pl-5">
            <v-tabs>
              <v-tab
                v-for="i in types"
                :key="i.name"
                @click="switchStatus(i)"
                class="justify-start px-1 mr-5"
              >
                {{i.name}}
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row class="ma-0">
            <v-col cols="12" class="pa-0">
              <v-data-table hide-default-footer disable-sort
                :search="search"
                :headers="dataTableHeaders"
                :items="myOrders.data"
              >
                <template v-slot:no-data>
                  <no-data message="No data to display."/>
                </template>
                <template slot="item.no" slot-scope="{ item }">
                  <router-link :to="{ name: 'otc-tradeinfo', query: { id: item.id }}" class="otc-color-blue">
                    {{ item.orderNumber }}
                  </router-link>
                </template>

                <template slot="item.type" slot-scope="{ item }">
                  <span :class="{ 'otc-buy-color': item.type === 'Buy', 'otc-sell-color': item.type === 'Sell' }">
                    {{ item.orderType.toUpperCase() }}
                  </span>
                </template>

                <template slot="item.amount" slot-scope="{ item }">
                  <span>{{ item.beautyAmount }} {{ item.fiatCode }}</span>
                </template>

                <template slot="item.price" slot-scope="{ item }">
                  <span>{{ item.beautyPrice }} {{ item.fiatCode }}</span>
                </template>

                <template slot="item.volumefee" slot-scope="{ item }">
                  <span>{{ item.beautyVolume }} {{ item.currencyCode }}</span>
                </template>

                <template slot="item.status" slot-scope="{ item }">
                  <span>{{ item.status }}</span>
                </template>

                <template slot="item.time" slot-scope="{ item }">
                  <span>{{ item.beautyCreatedAt }}</span>
                </template>

                <template slot="item.party" slot-scope="{ item }">
                  <router-link
                    :to="{ name: 'otc-trader', query: { id: item.typeObj.counterpartyId} }"
                    :title="item.typeObj.counterparty"
                    class="otc-color-blue">{{ item.typeObj.counterparty }}
                  </router-link>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>
  </v-main>
</template>
<script>
import CONSTANT from '@/configs/constant'
import NoData from './components/NoData.vue'
export default {
  components: {
    NoData
  },
  data () {
    return {
      search: '',
      dataTableHeaders: [
        {
          text: this.$t('TIT_NO'),
          align: 'start',
          value: 'no'
        },
        {
          text: this.$t('TIT_TYPE'),
          value: 'type'
        },
        {
          text: this.$t('LBL_AMOUNT'),
          value: 'amount'
        },
        {
          text: this.$t('LBL_TABLE_PRICE'),
          value: 'price'
        },
        {
          text: this.$t('TEXT_VOLUME_FEE'),
          value: 'volumefee'
        },
        {
          text: this.$t('TEXT_STATUS'),
          value: 'status'
        },
        {
          text: this.$t('LBL_TABLE_TIME'),
          value: 'time'
        },
        {
          text: this.$t('TEXT_COUNTERPARTY'),
          value: 'party'
        }
      ],
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
      // this.loadData(val)
      const status = val.query.status
      let defaultStatus

      if (!status) {
        defaultStatus = this.types[0]
        this.$router.push({ name: 'otc-my-orders', query: { status: defaultStatus.id } })
      } else {
        this.loadData(this.$route)
      }
    }
  },
  created () {
    const route = this.$route.query
    const status = route.status
    let defaultStatus
    if (!status) {
      defaultStatus = this.types[0]
      this.$router.push({ name: 'otc-my-orders', query: { status: defaultStatus.id } })
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
      this.search = ''
      this.initPagination()
      this.$router.push({ name: 'otc-my-orders', query: { status: i.id } })
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
    },
    select (string) {
      this.selected = string
    }
  }
}
</script>
