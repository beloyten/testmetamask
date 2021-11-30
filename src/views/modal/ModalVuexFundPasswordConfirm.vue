<template>
  <el-dialog
    v-if="1"
    :title="$t('TEXT_CONFIRM_FUND_PASSWORD')"
    :visible.sync="isShowConfirmFundPasswordModal"
    :closeOnClickModal="false"
    class="popup small"
  >
    <div class="popup-content" :class="{ 'loading': isLoading }">
      <div class="box-body">
        <div class="modal-field">
          <label>{{ $t('MBL_FUND_PASS') }}</label>
          <input type="password" v-model="fundPassword">
        </div>
      </div>
      <div class="popup-footer-box">
        <a class="popup-btn" href="javascript:;"
           :class="{ 'disabled': !fundPassword }"
           @click="confirm">{{ $t('BTN_CONFIRM') }}</a>
        <a class="popup-btn btn-cancel" href="javascript:;" @click="closeModal()">{{ $t('BTN_CANCEL') }}</a>
      </div>
    </div>

  </el-dialog>
  <el-dialog
    v-else
    :title="$t('TITLE_MODAL_FUND_PASSWORD')"
    :visible.sync="isShowConfirmFundPasswordModal"
    :closeOnClickModal="false"
    center
    :custom-class="isLoading ? 'loading': ''"
    :destroy-on-close="true"
    class="popup-small">
    <div class="tb-finance-exchange modal-confirm-box">
      <div class="modals-box popup-box popup-medium popup-height-auto active">
        <div ref="popupInner" class="popup-inner pb20 maw-400">
          <div class="popup-title">
            <h4>{{ $t('TEXT_CONFIRM_FUND_PASSWORD') }}</h4>
            <h5 class="sub-title">{{ $t('TEXT_FUND_PASSWORD_CONFIRM') }}</h5>
          </div>
          <div class="popup-content">
            <div class="modal-field">
              <label>{{ $t('TITLE_FUND_PASSWORD') }}</label>
              <input type="password" v-model="fundPassword">
              <!-- <span class="item-error-tip">Text error</span> -->
            </div>
          </div>
          <div class="popup-footer-box">
            <a class="popup-btn" href="javascript:;"
              :class="{ 'disabled': !fundPassword }"
              @click="confirm">{{ $t('BTN_CONFIRM') }}</a>
            <a class="popup-btn btn-cancel" href="javascript:;" @click="closeModal()">{{ $t('BTN_CANCEL') }}</a>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      fundPassword: '',
      isLoading: false
    }
  },
  computed: {
    isShowConfirmFundPasswordModal: {
      get  () {
        return this.$store.getters.isShowConfirmFundPasswordModal
      },
      set (val) {
        this.$store.dispatch('toggleConfirmFundPasswordModal')
      }
    },
    modalData () {
      return this.$store.getters.modalData
    },
    pagination () {
      return this.$store.getters.pagination
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('toggleConfirmFundPasswordModal')
      this.fundPassword = ''
    },
    async confirm () {
      this.isLoading = true
      let bodyObj = this.modalData.data || {}
      bodyObj.fundPassword = this.fundPassword
      let result = await this.$store.dispatch(this.modalData.action, bodyObj)
      console.log(result, 'after confirm fund')
      this.isLoading = false
      if (result) {
        this.closeModal()
        if (this.$route.name === 'otc-tradeinfo' && typeof result === 'object') {
          this.resetOrderDetail(result)
        } else if (this.$route.name === 'otc-ads') {
          this.$store.dispatch('getMyAds', this.pagination)
        }
      }
    },
    resetOrderDetail (order) {
      console.log(order, 'reset order')
      this.$store.dispatch('getOrder', order.id)
    }
  }
}
</script>
