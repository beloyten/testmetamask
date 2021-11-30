<template>
  <div class="otc-kyc-verification">
    <div class="otc-create-head">
      <h2>{{ $t('TITLE_KYC_VERIFICATION') }}</h2>
      <p v-if="user.kycLevel === 3">{{ $t('TITLE_CURRENT_LEVEL_TITLE', { level: kycInfo.kycLevel })}}</p>
      <p v-else-if="user.kycLevel > 1">{{ $t('TITLE_CURRENT_LEVEL_TITLE', { level: user.kycLevel })}}</p>
      <div class="otc-kyc-level">
        <ul class="clearfix">
          <li :class="{ 'passed': user.kycLevel > 0, 'processing': user.kycLevel === 0 }">
            <i class="hb_icon_auth"/>
            <span>{{ $t('TITLE_LEVEL', { level: 1 })}}</span>
          </li>
          <li :class="{ 'passed': user.kycLevel > 1, 'processing': user.kycLevel === 1 }">
            <i class="hb_icon_user_info"/>
            <span>{{ $t('TITLE_LEVEL', { level: 2 })}}</span>
          </li>
          <li :class="{ 'passed': user.kycLevel > 2, 'processing': user.kycLevel === 2 }">
            <i class="hb_icon_top_star"/>
            <span>{{ $t('TITLE_LEVEL', { level: 3 })}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="otc-trade-body">
      <div class="otc-kyc-permission">
        <!-- {{ $t(kycInfo.kycStatusMess) }} -->
      </div>
      <div v-if="!user.nickname">
        <div class="otc-create-head otc-kyc-permission">
          <h2>{{ $t('TEXT_CREATE_FUND_PASSWORD') }}</h2>
        </div>
        <div class="otc-trade-body">
          <div class="otc-update-fun-password">
            <div class="otc-update-item">
              <label>{{ $t('TEXT_NICKNAME') }}</label>
              <input
                type="text"
                :placeholder="$t('TEXT_NICK_NAME_PLACEHOLDER')"
                onfocus="this.removeAttribute('readonly');"
                v-model="form.nickname"
                >
            </div>
            <div class="otc-update-item">
              <label>{{ $t('TEXT_NEW_FUND_PASSWORD') }}</label>
              <input
                type="password"
                onfocus="this.removeAttribute('readonly');"
                v-model="form.fundPassword"
              >
            </div>
            <div class="otc-update-item">
              <label>{{ $t('TEXT_CONFIRM_NEW_FUND_PASSWORD') }}</label>
              <input
                type="password"
                autocomplete="new-password"
                onfocus="this.removeAttribute('readonly');"
                v-model="form.reFundPassword"
              >
            </div>
            <div class="otc-update-item">
              <a class="otc-btn loading-20"
                :class="{ 'disabled': !isValidated, 'loading': isUpdating }"
                @click="update"
                href="javascript:;">{{ $t('BTN_CONFIRM') }}</a>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="user.kycLevel === 0" class="otc-kyc-permission">
        <h4>{{ $t('TEXT_TO_PASSED_LEVEL_1') }} </h4>
        <p>{{ $t('TEXT_VERIFY_EMAIL') }}</p>
        <p>{{ $t('TEXT_VERIFY_PHONE_NUMBER') }}</p>
        <h4>{{ $t('TEXT_AFTER_VERIFICATION') }}</h4>
        <p class="verified">{{ $t('TEXT_AFTER_OTC_VERIFIED_LEVEL_1') }}</p>
      </div>
      <div v-if="user.kycLevel === 1" class="otc-kyc-permission">
        <h4>{{ $t('TEXT_TO_PASSED_LEVEL_2') }}</h4>
        <p>{{ $t('TEXT_VERIFY_PASSPORT_ID') }}</p>
        <h4>{{ $t('TEXT_AFTER_VERIFICATION') }}</h4>
        <p class="verified">{{ $t('TEXT_AFTER_OTC_VERIFIED_LEVEL_2') }}</p>
      </div>
      <div v-if="user.kycLevel === 2" class="otc-kyc-permission">
        <h4 v-if="isNeedUpload">{{ $t('TEXT_TO_PASSED_LEVEL_3') }} </h4>
        <p v-if="isNeedUpload">{{ $t('TEXT_VERIFY_BANK_ST') }}</p>
        <p class="verify-bank-statement clearfix" v-if="isNeedUpload">
          <input name="photos" type="file" accept="image/*" class="input-file" multiple @change="uploadFile">
          <span class="color-blue">
            <em><i class="hb_icon_add"></i>{{ $t('KYC_BANK_STM') }}</em>
            <img data-v-1841f2bd="" src="/assets/images/kyc/identity_card_3.png" alt="PhotoID">
          </span>
        </p>
        <div class="image-wrapper">
          <div v-for="i in images" :key="i.name" @click="removeFile">
            {{ i.name }}
          </div>
        </div>
        <h4>{{ $t('TEXT_AFTER_VERIFICATION') }}</h4>
        <p class="verified">{{ $t('TEXT_AFTER_OTC_VERIFIED_LEVEL_3') }}</p>
      </div>
    </div>
    <a v-if="user.kycLevel < 2 && user.kycLevel >= 0 && user.nickname"
      class="otc-btn mt-20" :href="kycLink">{{ $t('TEXT_UPGRADE_LEVEL', { level: user.kycLevel + 1 }) }}</a>
    <a class="otc-btn mt-20" v-else-if="user.kycLevel === 2"
      :class="{ 'disabled': !imageArr.length, 'loading': isUploading }"
      @click="upload">
      {{ $t('BTN_SUBMIT') }}
    </a>
  </div>
</template>

<script>
import CONSTANT from '@/configs/constant'
import OtcService from '@/api/otc/OtcService'
import CONFIG from '@/configs/config'
export default {
  data () {
    return {
      isUploading: false,
      form: {
        nickname: '',
        fundPassword: '',
        reFundPassword: ''
      },
      imageArr: [],
      images: [],
      kycStatus: CONSTANT.OTC.KYC_STATUS,
      isUpdating: false,
      kycLink: CONFIG.EXTERNAL_URL.KYC
    }
  },
  computed: {
    isValidated () {
      return this.form.nickname && this.form.fundPassword && this.form.reFundPassword &&
        (this.form.fundPassword === this.form.reFundPassword)
    },
    kycInfo () {
      return this.$store.getters.kycInfo
    },
    user () {
      return this.$store.getters.user
    },
    isNeedUpload () {
      return !(this.images.length > CONSTANT.OTC.MAX_IMAGES_UPLOAD)
    }
  },
  created () {
    this.$store.dispatch('getKycInfo')
  },
  methods: {
    update () {
      this.isUpdating = true
      let obj = this.form
      this.$google.getCaptcha('updateKycInfo')
        .then(async token => {
          obj.reCaptcha = token
          let rs = await OtcService.updateKycInfo(this.form)
          if (rs.status === CONSTANT.SUCCESS) {
            this.$store.dispatch('setKycInfo', rs.data)
            this.isUpdating = false
          }
        })
    },
    removeFile () {
      this.images = []
      this.imageArr = []
    },
    uploadFile (e) {
      const images = e.target.files
      if (images.length > CONSTANT.OTC.MAX_IMAGES_UPLOAD) {
        this.$store.dispatch('showErrorMsg', this.$t('MSG_OVER_OTC_BANK_UPLOAD', { number: CONSTANT.OTC.MAX_IMAGES_UPLOAD }))
        return
      }
      this.images = images
      this.imageArr = []
      for (let i = 0; i < images.length; i++) {
        let image = images[i]
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onload = e => {
          let base64Url = e.target.result
          this.imageArr.push(base64Url)
        }
      }
    },
    upload () {
      if (!this.imageArr.length) return
      this.isUploading = true
      let data = {}
      data.files = this.imageArr
      this.$google.getCaptcha('uploadOtcImage')
        .then(async token => {
          data.reCaptcha = token
          OtcService.uploadBankImage(data).then(rs => {
            this.isUploading = false
            this.images = []
            this.imageArr = []
            if (rs.status === CONSTANT.SUCCESS) {
              this.$store.dispatch('getKycInfo')
            }
          })
        })
    }
  }
}
</script>
