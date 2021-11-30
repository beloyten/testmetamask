<template>
  <div>
    <div class="flex-table">
      <h2>{{ $t('TEXT_CREATE_API_KEY') }}</h2>
      <dl>
        <dd class="flex-start">
          <div class="flex-1">
            <p>{{ $t('PLACE_NOTE') }}</p>
            <input type="text" v-model="apiKey.name">
            <p class="mt-20">{{ $t('TEXT_PERMISSION_SETTING') }}</p>
            <div class="flex-box">
              <div v-for="(i, index) in apiPermissions" :key="i.id" class="flex-1 checkbox-wrap">
                <input type="checkbox" v-model="apiKey.permissions"
                       :disabled="!index"
                       :value="i.id" :id="i.id">
                <label :for="i.id">{{ i.name }}</label>
              </div>
            </div>
            <a class="tc-button" :class="{ 'disabled': !apiKey.name }" @click="openModalConfirmAIPKey">Create</a>
          </div>
          <div class="flex-1">
            <p>{{ $t('PLACE_NOTE') }}</p>
            <ul>
              <li>{{ $t('TEXT_API_KEY_DESC', { name: broker.toUpperCase() }) }}
                <a>{{ $t('TEXT_API_KEY_DOC') }}</a></li>
              <li>{{ $t('TEXT_API_KEY_LIMIT') }}</li>
            </ul>
          </div>
        </dd>
      </dl>
    </div>
    <div class="flex-table">
      <h2>{{ $t('TEXT_MY_API_KEY') }}</h2>
      <dl>
        <dt>
          <div class="flex-1">{{ $t('TEXT_CREATE_DATE') }}</div>
          <div class="flex-1">{{ $t('PLACE_NOTE') }}</div>
          <div class="flex-1">{{ $t('TEXT_PERMISSIONS') }}</div>
          <div class="flex-1">{{ $t('TEXT_ACCESS_KEY') }}</div>
          <div class="flex-1">{{ $t('TEXT_STATUS') }}</div>
          <div class="flex-1 text-right">{{ $t('TEXT_ACTION') }}</div>
        </dt>
        <dd v-for="i in apiKeys" :key="i.id">
          <div class="flex-1"><span class="only-mobile">{{ $t('TEXT_CREATE_DATE') }}</span>{{ i.beautyCreatedAt }}</div>
          <div class="flex-1"><span class="only-mobile">{{ $t('PLACE_NOTE') }}</span>{{ i.name || 'Empty' }}</div>
          <div class="flex-1">
            <span class="only-mobile">{{ $t('TEXT_PERMISSIONS') }}</span>
            <span v-for="(temp, index) in i.permissions" :key="temp.id">
              {{ temp.name }} {{ index === (i.permissions.length - 1) ? '' : ',' }}
            </span>
          </div>
          <div class="flex-1"><span class="only-mobile">{{ $t('TEXT_ACCESS_KEY') }}</span>{{ i.publicKey }}</div>
          <div class="flex-1"><span class="only-mobile">{{ $t('TEXT_STATUS') }}</span>{{ $t('TEXT_NORMAL') }}</div>
          <div class="flex-1 text-right">
            <span class="only-mobile">{{ $t('TEXT_ACTION') }}</span>
            <a @click="openModalEditAPIKey(i)">{{ $t('BTN_EDIT') }}</a>
            <a @click="openModalDeleteAPIKey(i)">{{ $t('BTN_DELETE') }}</a>
          </div>
        </dd>
        <dd v-if="!apiKeys.length">
          <div class="flex-1">
            <EmptyData/>
          </div>
        </dd>
      </dl>
    </div>
    <ApiSecretKeyForm/>
    <UpdateApiKeyForm/>
  </div>
</template>
<script>
import EmptyData from '@/components/EmptyData'
import CONSTANT from '@/configs/constant'
import ApiSecretKeyForm from '@/views/modal/ApiSecretKeyForm'
import UpdateApiKeyForm from '@/views/modal/UpdateApiKeyForm'
export default {
  components: {
    EmptyData,
    ApiSecretKeyForm,
    UpdateApiKeyForm
  },
  data () {
    return {
      openConfirm: false,
      apiKey: {
        permissions: [],
        name: ''
      },
      initApiKey: {
      }
    }
  },
  computed: {
    apiKeys () {
      return this.$store.getters.apiKeys
    },
    apiPermissions () {
      return this.$store.getters.apiPermissions
    },
    secretKey () {
      return this.$store.getters.secretKey
    },
    resetCreateApiKeyFormNotify () {
      return this.$store.getters.resetCreateApiKeyFormNotify
    },
    broker () {
      return this.$store.getters.configs.broker || ''
    }
  },
  watch: {
    // Receive reset form notification
    resetCreateApiKeyFormNotify (val) {
      this.apiKey = JSON.parse(JSON.stringify(this.initApiKey))
    }
  },
  async created () {
    await this.$store.dispatch('getApiPermissions')
    if (this.apiPermissions.length) this.apiKey.permissions[0] = this.apiPermissions[0].id
    // Temp key to clear form
    this.initApiKey = JSON.parse(JSON.stringify(this.apiKey))
    this.$store.dispatch('getApiKeys')
  },
  methods: {
    openModalConfirmAIPKey () {
      let temp = JSON.parse(JSON.stringify(this.apiKey))
      temp.permissions = this.apiKey.permissions.map(temp => {
        return { id: temp }
      })
      let data = {
        action: CONSTANT.SECURITY.CREATE_API_KEY,
        newObject: temp
      }
      this.$store.dispatch('toggleSecurityConfirm', data)
    },
    openModalEditAPIKey (key) {
      this.$store.dispatch('setCurrentApiKey', key).then(rs => {
        rs && this.$store.dispatch('toggleUpdateAPIKey')
      })
    },
    openModalDeleteAPIKey (key) {
      let temp = {
        id: key.id
      }
      let data = {
        action: CONSTANT.SECURITY.DELETE_API_KEY,
        newObject: temp
      }
      this.$store.dispatch('toggleSecurityConfirm', data)
    }
  }
}
</script>
