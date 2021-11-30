<template>
  <v-dialog persistent
    v-model="isVisible"
    max-width="680"
  >
    <v-card
      :loading="isLoading || isProcessing"
    >
      <v-card-title>
        <span class="text-h5">{{ $t('Deposit') }}</span>
      </v-card-title>
      <v-card-subtitle>
        <v-flex class="d-flex flex-row align-center mt-3">
          <v-img :src="inputData.wallet.imageUrl" max-height="16" max-width="16" alt="" contain />
          <span class="ml-1">{{ inputData.wallet.symbol }}</span>
        </v-flex>
      </v-card-subtitle>

      <v-card-text :class="isLoading? 'loading' : ''">
        <v-form
          ref="formData"
        >
          <v-row>
            <v-col cols="12">
              <span>{{ $t('Your balance') }}:</span>
              <span class="primary--text ml-2">{{ accountBalance }} {{  inputData.wallet.symbol }}</span>
              <v-text-field solo required flat filled
                autocomplete="off"
                background-color="#F6F8FA"
                label="Enter amount"
                v-model="formData.amount"
                :rules="[rules.required, rules.max]"
                :disabled="isProcessing"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field solo required flat filled persistent-hint
                autocomplete="off"
                background-color="#F6F8FA"
                placeholder="deposit"
                v-model="formData.confirm"
                :hint="$t('Enter \'deposit\' to confirm')"
                :disabled="isProcessing"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          :disabled="isProcessing"
          @click="cancel"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn v-if="!isLoading"
          color="primary"
          class="pl-7 pr-7"
          :loading="isProcessing"
          readonly
          :disabled="formData.confirm !== 'deposit'"
          @click="confirm"
        >
          {{ $t('Confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Web3Obj from '@/plugin/web3-obj'
import ContractConfig from '@/configs/contracts'
import { USDT, ALI, ETH } from '@/configs/abi'

export default {
  components: { },
  props: {
    inputData: {}
  },
  computed: {
    // isVisible () {
    //   return this.inputData.isOpen
    // },
    contractConfig () {
      if (!this.inputData || !this.inputData.wallet || !this.inputData.wallet.symbol) {
        return
      }

      var rootAddress = ''
      var contractAddress = ''
      var weiUnit = 'ether'
      var contractAPI = null

      if (this.inputData.wallet.symbol.toLowerCase() === 'usdt') {
        rootAddress = ContractConfig.usdt.rootAccountAddress
        contractAddress = ContractConfig.usdt.address
        contractAPI = USDT
      }
      if (this.inputData.wallet.symbol.toLowerCase() === 'ali') {
        rootAddress = ContractConfig.ali.rootAccountAddress
        contractAddress = ContractConfig.ali.address
        contractAPI = ALI
      }
      if (this.inputData.wallet.symbol.toLowerCase() === 'eth') {
        rootAddress = ContractConfig.eth.rootAccountAddress
        contractAddress = ContractConfig.eth.address
        contractAPI = ETH
      }

      return {
        rootAddress,
        contractAddress,
        weiUnit,
        contractAPI
      }
    }
  },
  watch: {
    'inputData.wallet': function (val) {
      if (!val || !val.symbol) return

      this.isLoading = true
      // this.isProcessing = true
      Web3Obj.get().then(async web3 => {
        var accounts = await web3.eth.getAccounts()
        var accountAddress = accounts[0]

        var contractAddress = this.contractConfig.contractAddress
        var contractAPI = this.contractConfig.contractAPI

        var contract = new web3.eth.Contract(contractAPI, contractAddress, { from: accountAddress })

        var rawBalance = await contract.methods.balanceOf(accountAddress).call()
        this.accountBalance = web3.utils.fromWei(rawBalance, this.contractConfig.weiUnit)

        this.isLoading = false
        // this.isProcessing = false
      })
    },
    'inputData.isOpen': function (val) {
      this.isVisible = val
    }
  },
  data () {
    return {
      isVisible: false,
      isLoading: false,
      isProcessing: false,
      accountBalance: 0,
      formData: {
        amount: ''
      },
      rules: {
        required: value => !!value || this.$t('This field is required.'),
        max: v => (v != null && v <= this.accountBalance) || this.$t('Maximum is ' + this.accountBalance + ' ' + this.inputData.wallet.symbol)
      }
    }
  },
  methods: {
    cancel () {
      this.isVisible = false
      // reset form and input data
      this.resetForm()
    },
    resetForm () {
      if (this.$refs.formData) this.$refs.formData.reset()
      // reset modal prop
      this.isProcessing = false
      this.isLoading = false
      this.accountBalance = 0

      this.inputData.isOpen = false
      this.inputData.wallet = {}
    },
    confirm () {
      if (!this.$refs.formData.validate()) {
        return
      }
      this.isProcessing = true
      try {
        Web3Obj.get().then(async web3 => {
          var accounts = await web3.eth.getAccounts()
          var accountAddress = accounts[0]

          var rootAddress = this.contractConfig.rootAddress
          var contractAddress = this.contractConfig.contractAddress
          var contractAPI = this.contractConfig.contractAPI

          // web3.eth.getGasPrice().then(console.log)
          // web3.eth.getChainId().then(console.log)
          var contract = new web3.eth.Contract(contractAPI, contractAddress, { from: accountAddress })

          // var rootBalance = await contract.methods.balanceOf(rootAddress).call()
          var accountBalance = await contract.methods.balanceOf(accountAddress).call()
          if (this.formData.amount < 0 || this.formData.amount > accountBalance) {
            this.accountBalance = accountBalance
            this.$refs.formData.validate()
            this.isProcessing = false
            return
          }

          var transCount = await web3.eth.getTransactionCount(accountAddress)
          var sendAmount = web3.utils.toWei(this.formData.amount, this.contractConfig.weiUnit)

          // create transaction
          var txData = {
            from: accountAddress,
            to: contractAddress,
            value: '0x0',
            data: contract.methods.transfer(rootAddress, sendAmount).encodeABI(),
            none: transCount
          }

          // // var common = Common.custom(
          // //   'mainnet',
          // //   {
          // //     name: 'Binance Smart Chain Mainnet',
          // //     networkId: 56,
          // //     chainId: 56,
          // //     url: 'https://bsc-dataseed.binance.org/'
          // //   },
          // //   'istanbul'
          // // )

          // // const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { })
          // // console.log('--------> stx', tx)

          // // web3.eth.signTransaction(txData).then(_sTx => {
          // //   console.log('--------> stx', _sTx)
          // // })

          // using the event emitter
          web3.eth.sendTransaction(txData)
            .on('transactionHash', hash => {
              console.debug('transaction hash', hash)
              this.resetForm()
            })
            .on('receipt', receipt => {
              console.debug('transaction receipt', receipt)
              this.resetForm()
            })
            .on('confirmation', (confirmationNumber, receipt) => {
              console.debug('confirmation number', confirmationNumber)
              console.debug('confirmation receipt', receipt)
              this.resetForm()
            })
            .on('error', err => {
              console.error('TRANSACTION ERROR', err)
              this.cancel()
            })
          // end handler
        })
      } catch {
        this.$store.dispatch('showErrorMsg', this.$t('Unexpected error'))
        this.cancel()
      }
    }
  }
}
</script>
