<template>
  <v-main class="account-wallet-page1">
    <section class="page-content pb-10 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5" :loading="isLoading || !otcBalances">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">Account Wallet</span></v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-row
            class="ma-0 py-5"
            v-for="(wallet, key) in otcBalances"
            :key="key"
          >
            <v-col cols="12" md="3" lg="3" class="d-flex flex-row justify-start align-center">
              <v-img :src="wallet.imageUrl" max-height="36" max-width="36" alt="" contain />
              <span class="text-button ml-3 black--text">{{ wallet.symbol }}</span>
            </v-col>
            <v-col cols="12" md="3" lg="3" class="pa-0">
              <p class="mb-2">{{ $t('Available') }}</p>
              <span class="text-subtitle-1 black--text">{{ wallet.beautyBalanceOtc || 0 }} {{ wallet.symbol }}</span>
            </v-col>
            <v-col cols="12" md="3" lg="3" class="pa-0">
              <p class="mb-2">{{ $t('Frozen') }}</p>
              <span class="text-subtitle-1 black--text">{{ wallet.beautyBalanceOtcFrozen }} {{ wallet.symbol }}</span>
            </v-col>
            <v-col cols="12" md="3" lg="3" class="d-flex flex-row justify-end">
              <v-btn text rounded outlined
                class="mr-5"
                color="primary"
                @click="openDepositForm(wallet)"
              >
                {{ $t('Deposit') }}
              </v-btn>

              <v-btn text rounded outlined
                color="accent"
                @click="openWithdrawForm(wallet)"
              >
                {{ $t('Withdraw') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card flat class="pa-5" :loading="isLoading || isLoadingHistory">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">{{ $t('Detail Transactions') }}</span></v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-row class="">
            <v-col cols="12" class="pa-0">
              <v-data-table hide-default-footer disable-sort
                :headers="headers"
                :items="otcTransactionHistory"
              >
                <template slot="item.amount" slot-scope="{ item }">
                  {{item.amount +' '+ item.coin}}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>
    <deposit-form :inputData.sync="depositForm" />
    <withdraw-form :inputData.sync="withdrawForm" />
  </v-main>
</template>
<script>
import CONSTANT from '@/configs/constant'
// import ContractConfig from '@/configs/contracts'
// import { USDT } from '@/configs/abi'
import DepositForm from './components/DepositForm'
import WithdrawForm from './components/WithdrawForm'
// import Web3Obj from '@/plugin/web3-obj'
// import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
// import Common from '@ethereumjs/common'

export default {
  components: {
    DepositForm,
    WithdrawForm
  },
  data () {
    return {
      isDepositForm: false,
      success: false,
      isLoading: true,
      isLoadingHistory: true,
      searchDateForm: '',
      searchDate: '',
      searchCoin: '',
      searchType: '',
      searchBox: false,
      interval: null,
      depositForm: {
        isOpen: false,
        wallet: {}
      },
      withdrawForm: {
        isOpen: false,
        wallet: {}
      },
      headers: [
        {
          text: 'Type',
          value: 'beautyType',
          width: '10%'
        },
        {
          text: 'From',
          value: 'fromInfo',
          width: '23%'
        },
        {
          text: 'To',
          value: 'toInfo',
          width: '23%'
        },
        {
          text: 'Currency',
          value: 'coinName',
          width: '10%'
        },
        {
          text: 'Amount',
          value: 'beautyAmount',
          width: '10%'
        },
        {
          text: 'Status',
          value: 'status',
          width: '10%'
        },
        {
          text: 'Time',
          value: 'beautyDate',
          width: '12%'
        }
      ]
    }
  },
  computed: {
    pagination () {
      return this.$store.getters.pagination
    },
    otcBalances () {
      return this.$store.getters.otcBalances
    },
    otcTransactionHistory () {
      return this.$store.getters.otcTransactionHistory
    },
    configs () {
      return this.$store.getters.configs
    },
    user () {
      return this.$store.getters.user
    }
  },
  created () {
    this.isLoading = true
    let query = {
      page: CONSTANT.DEFAULT_PAGE_NUMBER,
      size: CONSTANT.DEFAULT_PAGE_SIZE
    }
    this.$store.dispatch('getOtcTransactionsHistory', query).then(() => {
      this.isLoadingHistory = false
    })
    this.updateBalance()
  },
  methods: {
    async goToPage (page) {
      let temp = JSON.parse(JSON.stringify(this.pagination))
      temp.page = page
      this.$store.dispatch('setPagination', temp)
      this.isLoadingHistory = true
      await this.$store.dispatch('getOtcTransactionsHistory', temp)
      this.isLoadingHistory = false
    },
    openModalTransfer (wallet) {
      if (!wallet.allowTransferOutFiat) return
      this.$store.dispatch('toggleTransferWalletExchange', wallet)
    },
    async updateBalance () {
      this.isLoading = true

      this.$store.dispatch('getUserBalance').then(() => {
        this.isLoading = false
        // interval
        this.interval = setInterval(() => {
          this.$store.dispatch('getUserBalance')
        }, CONSTANT.EXCHANGE.WALLET_BALANCE_RF_TIME)
      })
    },
    openDepositForm (wallet) {
      this.depositForm.isOpen = true
      this.depositForm.wallet = wallet
    },
    openWithdrawForm (wallet) {
      // TODO check user email is verified
      if (!this.user.emailVerified) {
        var data = {
          message: this.$t('Verified email is required for withdraw')
        }
        this.$store.dispatch('toggleConfirmModal', data)

        return
      }

      // open modal form
      this.withdrawForm.isOpen = true
      this.withdrawForm.wallet = wallet
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>
