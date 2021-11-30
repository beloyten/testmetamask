<template>
  <v-dialog persistent
    v-model="isVisible"
    max-width="720px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Hesman Account</span>
      </v-card-title>
      <!-- Login Form -->
      <v-card-text>
        <template v-if="isLoading">
          <v-progress-linear
            indeterminate
            color="primary"
            class="mb-5 mt-5"
          />
        </template>
        <template v-else-if="isShowLoginForm">
          <v-container>
            <v-form
              ref="loginForm"
              v-model="isLoginFormValid"
            >
              <v-row>
                <v-col cols="12">
                  <div>Welcome back <span class="font-weight-bold primary--text">{{this.formData.nickname}}</span>. Enter your password to continue.</div>
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled disabled readonly
                    autocomplete="off"
                    background-color="#F6F8FA"
                    v-model="formData.email"
                    :append-icon="'mdi-check'"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled
                    autocomplete="off"
                    background-color="#F6F8FA"
                    label="Enter your password"
                    v-model="formData.password"
                    :disabled="isProcessing"
                    :type="showpass ? 'text' : 'password'"
                    :rules="[rules.required]"
                    :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showpass = !showpass"
                  />
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    :disabled="isProcessing"
                    v-model="doNotAskAgain"
                    label="Do not ask password on this browser"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </template>
        <!-- Register Form -->
        <template v-else-if="isShowRegisterForm">
          <v-container>
             <v-form
              ref="regForm"
              v-model="isRegFormValid"
            >
              <v-row>
                <v-col cols="12">
                  <h3>Register new account with your address.</h3>
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled disabled readonly
                    ref="walletAddress"
                    autocomplete="off"
                    background-color="#F6F8FA"
                    v-model="formData.walletAddress"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled
                    ref="email"
                    autocomplete="off"
                    background-color="#F6F8FA"
                    label="Enter your email"
                    v-model="formData.email"
                    :rules="[rules.required, rules.email]"
                    :disabled="isProcessing"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled
                    ref="nickname"
                    autocomplete="off"
                    background-color="#F6F8FA"
                    label="Enter your nickname"
                    v-model="formData.nickname"
                    :rules="[rules.required, rules.min, rules.max]"
                    :disabled="isProcessing"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled
                    ref="password"
                    autocomplete="off"
                    background-color="#F6F8FA"
                    label="Enter your password"
                    v-model="formData.password"
                    :disabled="isProcessing"
                    :type="showpass ? 'text' : 'password'"
                    :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    @click:append="showpass = !showpass"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field solo required flat filled
                    ref="confirmpassword"
                    autocomplete="off"
                    background-color="#F6F8FA"
                    label="Confirm your password"
                    v-model="formData.confirmPassword"
                    :disabled="isProcessing"
                    :type="showpass ? 'text' : 'password'"
                    :rules="[rules.required, rules.passMatch]"
                    :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showpass = !showpass"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field solo flat filled
                    ref="parentId"
                    autocomplete="off"
                    background-color="#F6F8FA"
                    label="Reference ID"
                    v-model="formData.parentId"
                    :disabled="isProcessing"
                  />
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    ref="agreetoc"
                    v-model="formData.isAgree"
                    :disabled="isProcessing"
                  >
                    <template v-slot:label>
                      I agree <a class="ml-1" href="#">term &amp; condition</a>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
             </v-form>
          </v-container>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          :disabled="isProcessing"
          @click="cancel"
        >
          Close
        </v-btn>
        <v-btn v-if="!isLoading"
          color="primary"
          class="pl-7 pr-7"
          :loading="isProcessing"
          @click="confirm"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import CONSTANT from '@/configs/constant'
import { createNewKeycloak } from '@/plugin/keycloak-js'
import Web3Obj from '@/plugin/web3-obj'

export default {
  data () {
    return {
      isLoading: true,
      isProcessing: false,
      isShowRegisterForm: false,
      isShowLoginForm: false,
      showpass: false,
      doNotAskAgain: false,
      isLoginFormValid: false,
      isRegFormValid: false,
      formData: {
        walletAddress: null,
        email: null,
        nickname: null,
        password: null,
        confirmPassword: null,
        parentId: null,
        isAgree: false
      },
      rules: {
        required: value => !!value || 'This field is required.',
        min: v => (v != null && v.length >= 6) || 'Min 8 characters',
        max: v => (v != null && v.length <= 32) || 'Max 32 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Email is not valid.'
        },
        passMatch: v => v === this.formData.password || `The email and password you entered don't match`
      }
    }
  },
  computed: {
    initConnectProcess () {
      return this.$store.getters.startConnectWalletProcess
    },
    disconnectWallet () {
      return this.$store.getters.startDisconnectWalletProcess
    },
    isVisible () {
      return this.$store.getters.isShowUserConnectFormModal
    },
    modalData () {
      return this.$store.getters.modalData
    },
    orderDetail () {
      return this.$store.getters.orderDetail
    }
  },
  watch: {
    initConnectProcess: async function (isStart) {
      // connect using web3
      if (isStart) {
        Web3Obj.connect().then(async web3 => {
          const accounts = await web3.eth.getAccounts()
          // if the connect has account
          if (accounts) {
            // open acount form
            this.$store.dispatch('toggleUserConnectFormModal', accounts[0])
          }
        }).catch(() => {
          this.$store.dispatch('startConnectWalletProcess', false)
        })
      }
    },
    disconnectWallet: async function (start) {
      if (start) {
        Web3Obj.disconnect().then(() => {
          // logout keycloak after disconnected
          this.$keycloak.logout({ 'redirectUri': window.location.origin })
          // update store
          this.$store.dispatch('startDisconnectWalletProcess', false)
        })
      }
    },
    isVisible: function (isOpen) {
      if (isOpen) {
        this.isLoading = true
        var walletAddress = this.formData.walletAddress = this.$store.getters.modalData

        this.$store.dispatch('verifyWalletAddrx', walletAddress).then(res => {
          if (res.status === CONSTANT.SUCCESS) {
            if (!res.data.email) this.closeModal()
            this.formData.nickname = res.data.nickname
            this.formData.email = res.data.email
            this.isShowRegisterForm = false
            this.isShowLoginForm = true
          } else {
            // TODO check remember me
            this.isShowRegisterForm = true
            this.isShowLoginForm = false
          }
          this.isLoading = false
        })
      }
    }
  },
  created () {

  },
  methods: {
    closeModal () {
      this.sLoading = true
      this.isProcessing = false
      this.isShowRegisterForm = false
      this.isShowLoginForm = false
      this.showpass = false
      this.doNotAskAgain = false
      this.formData = {
        walletAddress: null,
        nickname: null,
        email: null,
        parentId: null,
        password: null,
        confirmPassword: null,
        isAgree: false
      }

      if (this.$refs.loginForm) this.$refs.loginForm.reset()
      if (this.$refs.regForm) this.$refs.regForm.reset()

      this.$store.dispatch('startConnectWalletProcess', false)
      this.$store.dispatch('toggleUserConnectFormModal')
    },
    cancel () {
      this.$store.dispatch('setLoggedIn', false)
      this.closeModal()
    },
    async confirm () {
      //
      if (this.isShowLoginForm) { // show login form
        // validate the form
        if (this.$refs.loginForm.validate()) {
          this.isProcessing = true
          // var loginForm = new FormData()

          await this.processLogin()
        }

        this.isProcessing = false
      } else if (this.isShowRegisterForm) {
        if (this.$refs.regForm.validate()) {
          this.isProcessing = true
          let result = await this.$store.dispatch('registerAccount', this.formData)
          if (result.status === CONSTANT.SUCCESS) {
            await this.processLogin()
            // this.closeModal()
          }
        }
        this.isProcessing = false
      }
    },
    async processLogin () {
      var loginForm = {
        'username': this.formData.email,
        'password': this.formData.password,
        'walletAddress': this.formData.walletAddress
      }
      var res = await this.$store.dispatch('loginSSO', loginForm)
      if (res.status === CONSTANT.SUCCESS) {
        // new kc to check
        var _kc = createNewKeycloak()
        _kc.init({
          checkLoginIframe: false,
          onLoad: 'check-sso',
          token: res.data.accessToken,
          idToken: res.data.idToken,
          refreshToken: res.data.refreshToken
        }).then(auth => {
          if (auth) {
            this.$store.dispatch('oauthCheckToken', _kc.token).then(() => {
              this.$store.dispatch('setLoggedIn', true)
              // this.$keycloak.init({ checkLoginIframe: true, onLoad: 'check-sso', pkceMethod: 'S256', promiseType: 'native' })
              this.$keycloak.login({ 'redirectUri': window.location.origin })

              // close this modal
              this.closeModal()
            }).catch(() => {
              if (this.$refs.loginForm) this.$refs.loginForm.reset()
              if (this.$refs.regForm) this.$refs.regForm.reset()
            })
          }
        })
      } else {
        // show error message
      }
    }
  }
}
</script>
