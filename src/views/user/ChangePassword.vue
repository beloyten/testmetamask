<template>
  <v-main class="change-password-page">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title><span class="text-h5">Change password</span></v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-row class="ma-0">
            <v-col cols="12" md="4" class="pa-0">
              <v-row class="ma-0">
                <v-col cols="12" class="pa-0">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="currentPassword"
                    type="password"
                    placeholder="Current password..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5">
                <v-col cols="12" class="pa-0">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="newPassword"
                    type="password"
                    placeholder="New password..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5 mb-15">
                <v-col cols="12" class="pa-0">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="confirmNewPassword"
                    type="password"
                    placeholder="Confirm new password..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 py-15"></v-row>
              <v-row class="ma-0 pt-15">
                <v-col cols="12" class="pa-0">
                  <v-btn color="primary" block depressed @click="changePass()">Save & Change</v-btn>
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5 mb-15">
                <v-col cols="12" class="pa-0">
                  <v-btn block depressed outlined class="cancel-button" @click="clearData()">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="8" class="pa-0 d-flex flex-column justify-center align-center">
              <div class="image-content mb-15">
                <p>Stronger password</p>
                <h3>Stronger security</h3>
              </div>
              <img src="/assets/images/profile-image.svg" alt=""/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>
  </v-main>
</template>
<script>
export default {
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  },
  methods: {
    clearData () {
      this.newPassword = ''
      this.currentPassword = ''
      this.confirmNewPassword = ''
    },
    changePass () {
      if (this.newPassword.trim() !== '' && this.currentPassword.trim() !== '' && this.confirmNewPassword.trim() !== '') {
        if (this.newPassword === this.confirmNewPassword) {
          this.$store.dispatch('showSuccessMsg', 'Thay đổi mật khẩu thành công.')
        } else {
          this.$store.dispatch('showErrorMsg', 'Mật khẩu không trùng khớp')
        }
      } else {
        this.$store.dispatch('showErrorMsg', 'Vui lòng điền đầy đủ thông tin.')
      }
    }
  }
}
</script>
