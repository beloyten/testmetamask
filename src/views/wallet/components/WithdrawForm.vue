<template>
  <v-dialog persistent
    v-model="isVisible"
    max-width="680"
  >
    <v-card
      :loading="isLoading || isProcessing"
    >
      <v-card-title>
        <span class="text-h5">{{ $t('Withdraw') }}</span>
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
              <span class="accent--text ml-2">{{ accountBalance }} {{  inputData.wallet.symbol }}</span>
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
                placeholder="withdraw"
                v-model="formData.confirm"
                :hint="$t('Enter \'withdraw\' to confirm')"
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
          color="accent"
          class="pl-7 pr-7"
          :loading="isProcessing"
          readonly
          :disabled="formData.confirm !== 'withdraw'"
          @click="confirm"
        >
          {{ $t('Confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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

      this.accountBalance = val.balanceFiat
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
    }
  }
}
</script>
