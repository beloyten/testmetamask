<template>
  <v-dialog persistent
    max-width="610px"
    v-model="isShowConfirmModal"
    :class="isLoading ? 'loading': ''"
  >
    <v-card class="">
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-icon class="mr-5">mdi-help-circle-outline</v-icon>
        <span v-html="modalData.message" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text
          color="primary"
          class="px-6"
          :disabled="isLoading"
          @click="closeModal()"
        >
          {{ $t('BTN_CANCEL') }}
        </v-btn>
        <v-btn
          color="primary"
          class="ml-8 px-8"
          :loading="isLoading"
          @click="confirm"
        >
          {{ $t('BTN_CONFIRM') }}
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>
<script>
export default {
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    isShowConfirmModal () {
      return this.$store.getters.isShowConfirmModal
    },
    modalData () {
      return this.$store.getters.modalData
    },
    orderDetail () {
      return this.$store.getters.orderDetail
    },
    destinationRoute () {
      return this.$store.getters.destinationRoute
    }
  },
  watch: {
    destinationRoute: function (route) {
      this.$router.push({ name: route.name, query: route.query, params: route.params })
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('toggleConfirmModal')
      // this.isShowConfirmModal = false
      this.isLoading = false
    },
    async confirm () {
      this.isLoading = true
      if (this.modalData.action) {
        let bodyObj = this.modalData.data || {}
        var res = await this.$store.dispatch(this.modalData.action, bodyObj)
        this.isLoading = false
        if (res) {
          if (this.$route.name === 'otc-tradeinfo' && typeof result === 'object') {
            this.resetOrderDetail(res)
          }
        }
      } else {
        this.isLoading = false
      }
      this.closeModal()
    },
    resetOrderDetail (order) {
      this.$store.dispatch('getOrder', order.id)
    }
  }
}
</script>
