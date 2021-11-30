<template>
  <v-main class="account-wallet-page">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="py-5">
        <v-card-title class="px-8">
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">OTC Account Wallet</span></v-toolbar-title>
          </v-toolbar>
        </v-card-title>
          <v-row class="ma-0 px-8 my-10 py-5 btc-row">
            <v-col cols="12" md="4" lg="4" class="pa-0">
              <v-img src="/assets/images/crypto-icon/btc-1.svg" max-height="36" max-width="36" alt="" contain/>
              <span class="ml-5 btc">BTC</span>
            </v-col>
            <v-col cols="12" md="4" lg="2" class="pa-0">
              <p class="mb-2">OTC Account</p>
              <span>Available: 0.000 BTC</span>
            </v-col>
            <v-col cols="12" md="4" lg="2" class="pa-0">
              <p class="mb-2">Frozen</p>
              <span>Available: 0.000 BTC</span>
            </v-col>
            <v-col cols="12" md="4" lg="4" class="pa-0">
              <v-btn color="primary" @click="openForm = true">Transfer</v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 d-flex justify-center">
            DETAIL TRANSACTION
          </v-row>
          <v-row class="ma-0 mt-10">
            <v-col cols="12" class="pa-0">
              <v-data-table
                :headers="headers"
                :items="dataTable"
                class="elevation-1 px-5"
                hide-default-footer
                disable-sort
              >
                <template v-slot:no-data>
                  <no-data message="No data to display."/>
                </template>
                <template slot="item.amount" slot-scope="{ item }">
                  {{item.amount +' '+ item.coin}}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
      </v-card>
    </section>
    <TransferForm v-if="openForm" :openForm.sync="openForm" :success.sync="success" />
    <SuccessForm v-if="success" message="Transfer Success" :openForm.sync="success" />
  </v-main>
</template>
<script>
import TransferForm from './components/TransferForm'
import SuccessForm from './components/SuccessForm'
import NoData from './components/NoData.vue'

export default {
  components: {
    TransferForm,
    SuccessForm,
    NoData
  },
  data () {
    return {
      openForm: false,
      success: false,
      headers: [
        {
          text: 'Type',
          value: 'type',
          width: '30%'
        },
        {
          text: 'Coin',
          value: 'coin',
          width: '25%'
        },
        {
          text: 'Time',
          value: 'time',
          width: '25%'
        },
        {
          text: 'Amount',
          value: 'amount',
          width: '20%'
        }
      ],
      dataTable: [
        {
          type: 'Transfer in Fiat',
          coin: 'TRX_TCL',
          time: '2021-05-24 14:22:22',
          amount: 5
        },
        {
          type: 'Transfer in Fiat',
          coin: 'TRX_TCL',
          time: '2021-05-24 14:22:22',
          amount: 5
        },
        {
          type: 'Transfer in Fiat',
          coin: 'TRX_TCL',
          time: '2021-05-24 14:22:22',
          amount: 5
        },
        {
          type: 'Transfer in Fiat',
          coin: 'TRX_TCL',
          time: '2021-05-24 14:22:22',
          amount: 5
        },
        {
          type: 'Transfer in Fiat',
          coin: 'TRX_TCL',
          time: '2021-05-24 14:22:22',
          amount: 5
        }
      ]
    }
  }
}
</script>
