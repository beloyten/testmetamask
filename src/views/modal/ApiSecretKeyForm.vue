<template>
  <el-dialog
    :title="$t('TEXT_CREATE_API_KEY_SUCCESS')"
    :visible.sync="isShowSecretKeyForm"
    center
    :closeOnClickModal="false"
    class="popup-small"
    >
    <div ref="popupInner" class="popup-inner">
      <div class="popup-title">
        {{ $t('TEXT_API_KEY_WARNING') }}
      </div>
      <div class="popup-content">
        <div class="mb">
          <p>{{ $t('TEXT_API_KEY') }}</p>
          <div class="copy-code">
            <input type="text" :value="secretObj.publicKey">
            <a @click="doCopy(secretObj.publicKey)">{{ $t('BTN_COPY') }}</a>
          </div>
        </div>
        <p>{{ $t('TEXT_SECRET_KEY') }}</p>
        <div class="copy-code">
          <input type="text" :value="secretObj.secretKey">
          <a @click="doCopy(secretObj.secretKey)">{{ $t('BTN_COPY') }}</a>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  computed: {
    isShowSecretKeyForm: {
      get () {
        return this.$store.getters.isShowSecretKeyForm
      },
      set (val) {
        this.$store.dispatch('toggleAPISecretKey')
      }
    },
    secretObj () {
      return this.$store.getters.secretObj
    }
  },
  methods: {
    doCopy (text) {
      this.$copyText(text).then(e => {
        this.$store.dispatch('showSuccessMsg', this.$t('TEXT_COPIED'))
      })
    }
  }
}
</script>
