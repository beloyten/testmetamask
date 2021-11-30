<template>
  <v-main class="otc-my-ads">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">My ADS</span></v-toolbar-title>
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
        <v-card-subtitle class="text-subtitle-1 mb-5">List of your all created AD</v-card-subtitle>

        <v-card-text>
          <v-row class="ma-0">
            <v-col cols="12" class="pa-0">
              <v-data-table hide-default-footer disable-sort
                :search="search"
                :headers="headers"
                :items="myAds.data"
              >
                <template v-slot:no-data>
                  <no-data message="No data to display."/>
                </template>
                <template slot="item.no" slot-scope="{ index }">
                  {{ index + 1 }}
                </template>

                <template slot="item.type" slot-scope="{ item }">
                  <span :class="{ 'otc-buy-color': item.type === 'Buy', 'otc-sell-color': item.type === 'Sell' }">
                    {{ item.type.toUpperCase() }}
                  </span>
                </template>

                <template v-slot:[`item.amount`]="{ item }">
                  <span>{{ item.beauty_available }} {{ item.currencyCode }}</span>
                </template>

                <template v-slot:[`item.limit`]="{ item }">
                  <span>{{ item.beauty_minLimit }} - {{ item.beauty_maxLimit }} {{ item.fiatCode }}</span>
                </template>

                <template v-slot:[`item.price`]="{ item }">
                  <span>{{ item.beauty_price }} {{ item.fiatCode }}</span>
                </template>

                <template v-slot:[`item.time`]="{ item }">
                  <span>{{ item.beautyUpdatedAt }}</span>
                </template>

                <template v-slot:[`item.ctrl`]>
                  <div class="d-flex">
                    <v-switch dense></v-switch>
                    <v-icon
                      small
                      class="mr-2"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      small
                    >
                      mdi-delete
                    </v-icon>
                  </div>
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
      isProcessing: false,
      isLoading: false,
      search: '',
      headers: [
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
          text: this.$t('LBL_LIMIT'),
          value: 'limit'
        },
        {
          text: this.$t('LBL_TABLE_PRICE'),
          value: 'price'
        },
        {
          text: this.$t('LBL_TABLE_TIME'),
          value: 'time'
        },
        {
          text: this.$t('TITLE_CONTROL'),
          value: 'ctrl'
        }
      ]
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
