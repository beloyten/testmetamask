<template>
  <v-dialog
    v-model="isShowDisputeOtcModal"
    max-width="610px"
    :loading="isLoading"
  >
    <v-card flat
      class=""
    >
      <v-card-title class="">
        {{ $t('TEXT_COMPLAIN') }} <span class="red--text text--lighten-1 ml-2">{{ counterparty }}</span>
      </v-card-title>
      <v-card-subtitle>
        {{ $t('Order') }} #{{ ordernumber }}
      </v-card-subtitle>

      <v-card-text>
        <v-flex class="d-flex flex-row align-center yellow lighten-5 pa-2">
          <v-icon color="">mdi-information-outline</v-icon>
          <span class="ml-5">
            {{ $t('Please make sure that counterparty is violating our exchange process. A clear evidence could help Hesman supports your case.') }}
          </span>
        </v-flex>
      </v-card-text>
      <v-card-text>
        <v-form ref="refForm">
          <v-select solo flat
            background-color="#F6F8FA"
            v-model="disputeForm.type"
            item-value="id"
            item-text="text"
            :label="$t('Select a type')"
            :items="disputeCategory"
          />
          <v-textarea solo flat
            background-color="#F6F8FA"
            v-model="disputeForm.content"
            :label=" $t('TEXT_DESCRIPTION')"
            @blur="validateContent"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text
          color="primary"
          class="px-5"
          @click="closeModal"
        >
          {{ $t('BTN_CANCEL') }}
        </v-btn>
        <v-btn
          color="primary"
          class="px-5"
          :loading="isLoading"
          @click="confirmModal"
        >
          <span v-if="!remainingTime">{{ $t('BTN_CONFIRM') }}</span>
          <span v-else>
            <vue-countdown :time="remainingTime" @end="handleCountdownEnd">
              <template slot-scope="props">{{ props.minutes }} minutes, {{ props.seconds }} seconds.</template>
            </vue-countdown>
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import OtcService from '@/api/otc/OtcService'
import CONSTANT from '@/configs/constant'
import UtilService from '@/utils/UtilService'
import VueCountdown from '@chenfengyuan/vue-countdown'
export default {
  components: {
    VueCountdown
  },
  props: ['counterparty', 'ordernumber'],
  data () {
    return {
      disputeCategory: [],
      disputeForm: {
        title: '',
        content: '',
        type: null
      },
      isLoading: false,
      remainingTime: 0,
      errorForm: {
        content: {
          error: false,
          errorText: ''
        }
      }
    }
  },
  computed: {
    validated () {
      return this.disputeForm.content && !this.remainingTime
    },
    isShowDisputeOtcModal: {
      get () {
        return this.$store.getters.isShowDisputeOtcModal
      },
      set () {
        this.$store.dispatch('toggleShowDisputeOtcModal')
      }
    },
    modalData () {
      return this.$store.getters.modalData
    },
    orderDetail () {
      return this.$store.getters.orderDetail
    }
  },
  watch: {
    isShowDisputeOtcModal: function (isOpen) {
      if (isOpen) this.onOpen()
    }
  },
  methods: {
    onOpen () {
      console.log(this.orderDetail.order)
      this.remainingTime = UtilService.getRemainingTime(this.orderDetail.order.paidAt)
      OtcService.disputeTypes().then(rs => {
        if (rs.status === CONSTANT.SUCCESS) {
          let response = rs.data
          let type = this.orderDetail.typeObj.isBuyer ? CONSTANT.OTC.COMPLAIN_TYPE.BUYER : CONSTANT.OTC.COMPLAIN_TYPE.SELLER
          this.disputeCategory = response.filter(temp => {
            temp.text = this.$t(temp.title)
            return temp.type === type
          })
          this.disputeForm.type = this.disputeCategory[0]
        }
      })
    },
    closeModal () {
      this.disputeForm = {
        title: '',
        content: '',
        type: null
      }
      this.isLoading = false
      this.$refs.refForm.reset()
      this.$store.dispatch('toggleShowDisputeOtcModal')
    },
    handleCountdownEnd () {
      this.remainingTime = 0
    },
    validateContent () {
      this.errorForm.content.error =
        (this.disputeForm.content && this.disputeForm.content.length > 300)
      this.errorForm.content.errorText = this.$t('TEXT_NOT_OVER') + ' ' + 300 + ' ' + this.$t('TEXT_CHARACTERS')
      return this.errorForm.content.error
    },
    confirmModal () {
      this.disputeForm.type = this.disputeCategory.filter(temp => {
        return temp.id === this.disputeForm.type
      })[0]
      console.log('------------> data', this.disputeForm)
      const validateContent = this.validateContent()
      if (validateContent) return
      this.isLoading = true
      this.$google.getCaptcha('makeDispute')
        .then(async token => {
          let data = {}
          data.complain = this.disputeForm
          data.reCaptcha = token
          OtcService.dispute(this.orderDetail.order.id, data).then(rs => {
            this.isLoading = false
            if (rs.status === CONSTANT.SUCCESS) {
              this.closeModal()
              let id = this.$route.query.id
              if (id) this.$store.dispatch('getOrder', id)
            }
          })
        })
        .catch(err => {
          console.debug(err)
          this.closeModal()
        })
    }
  }
}
</script>
