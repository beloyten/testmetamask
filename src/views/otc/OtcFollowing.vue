<template>
  <v-main class="otc-following-page">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">OTC Following</span></v-toolbar-title>
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
          <v-col cols="12" md="6" lg="4" class="pa-0 pl-5">
            <v-tabs grow v-model="selected">
              <v-tab :href="`#following`" class="justify-start pa-0 mr-15">
                Following
              </v-tab>
              <v-tab :href="`#black-list`" class="justify-start pa-0">
                Black list
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
        <v-card-text>
          <v-tabs-items v-model="selected">
            <v-tab-item :value="`following`">
              <v-card flat tile color="transparent">
                <v-card-text>
                  <v-data-table hide-default-footer disable-sort
                    :headers="dataTableHeaders"
                    :items="otcFollowing"
                  >
                    <template v-slot:no-data>
                      <no-data message="No data to display."/>
                    </template>
                    <template slot="item.ctrl" slot-scope="{ item }">
                      <v-flex class="d-flex flex-row justify-space-around">
                      <v-switch flat
                        v-model="item.active"
                      />
                      <v-btn icon
                        color="primary"
                        class="mt-4"
                        :ripple="false"
                      >
                        <v-icon size="24">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon
                        color="accent"
                        class="mt-4"
                      >
                        <v-icon size="24">mdi-trash-can-outline</v-icon>
                      </v-btn>
                      </v-flex>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :value="`black-list`">
              <v-card flat tile color="transparent">
                <v-card-text>
                  <v-data-table hide-default-footer disable-sort
                    :headers="dataTableHeaders"
                    :items="otcBlackList"
                  >
                    <template v-slot:no-data>
                      <no-data message="No data to display."/>
                    </template>
                    <template slot="item.ctrl" slot-scope="{ item }">
                      <v-flex class="d-flex flex-row justify-space-around">
                      <v-switch flat
                        v-model="item.active"
                      />
                      <v-btn icon
                        color="primary"
                        class="mt-4"
                        :ripple="false"
                      >
                        <v-icon size="24">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon
                        color="accent"
                        class="mt-4"
                      >
                        <v-icon size="24">mdi-trash-can-outline</v-icon>
                      </v-btn>
                      </v-flex>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </section>
  </v-main>
</template>
<script>
import NoData from './components/NoData.vue'

export default {
  components: {
    NoData
  },
  data () {
    return {
      selected: 'following',
      search: '',
      dataTableHeaders: [
        {
          text: 'Completion Rate',
          value: 'completionRate'
        },
        {
          text: 'KYC level',
          value: 'kycLevel'
        },
        {
          text: 'Total Orders',
          value: 'totalOrders'
        },
        {
          text: 'AVG Payment Time',
          value: 'avgPaymentTime'
        },
        {
          text: 'Time of Following',
          value: 'timeOfFollowing'
        },
        {
          text: this.$t('TITLE_CONTROL'),
          value: 'ctrl'
        }
      ],
      otcFollowing: [],
      otcBlackList: []
    }
  },
  methods: {
    select (selector) {
      this.selected = selector
    }
  }
}
</script>
