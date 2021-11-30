<template>
  <el-dialog
      :title="$t('TEXT_API_KEY_EDIT')"
      :visible.sync="isShowUpdateAPIKeyForm"
      :closeOnClickModal="false"
      center
      @open="onOpen"
      class="popup-small"
      >
    <div class="tb-finance-exchange">
      <div class="block-input-form panel-item">
        <div ref="popupInner" class="popup-inner">
          <div class="popup-content">
            <div class="modal-field">
              <label>{{ $t('PLACE_NOTE') }}</label>
              <input type="text" v-model="apiKeyTemp.name">
            </div>
            <div class="modal-field">
              <label>{{ $t('TEXT_PERMISSION_SETTING') }}</label>
              <div class="clearfix">
                <div v-for="(i, index) in apiPermissions" :key="i.id" class="panel-checkbox-item">
                  <label>{{ i.name }}</label>
                  <input type="checkbox" v-model="apiKeyTemp.permissions"
                    :disabled="!index"
                    :value="i.id" :id="i.id">
                </div>
              </div>
            </div>
          </div>
          <div class="popup-footer-box">
            <a class="popup-btn" href="javascript:;" @click="confirmModal">{{ $t('BTN_CONFIRM') }}</a>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import CONSTANT from '@/configs/constant'
export default {
  data () {
    return {
      apiKeyTemp: {}
    }
  },
  computed: {
    apiKey () {
      return this.$store.getters.currentApiKey
    },
    apiPermissions () {
      return this.$store.getters.apiPermissions
    },
    isShowUpdateAPIKeyForm: {
      get () {
        return this.$store.getters.isShowUpdateAPIKeyForm
      },
      set (val) {
        this.$store.dispatch('toggleUpdateAPIKey')
      }
    }
  },
  methods: {
    onOpen () {
      this.apiKeyTemp = JSON.parse(JSON.stringify(this.apiKey))
      this.apiKeyTemp.permissions = this.apiKey.permissions.map(temp => {
        return temp.id
      })
    },
    confirmModal () {
      this.$store.dispatch('toggleUpdateAPIKey')
      let temp = JSON.parse(JSON.stringify(this.apiKeyTemp))
      temp.permissions = this.apiKeyTemp.permissions.map(temp => {
        return { id: temp }
      })
      let data = {
        action: CONSTANT.SECURITY.UPDATE_API_KEY,
        newObject: temp
      }
      this.$store.dispatch('toggleSecurityConfirm', data)
    }
  }
}
</script>
