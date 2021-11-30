<template>
  <v-main class="otc-trade-info">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-sm-5">
        <v-card-title>
          <v-toolbar flat tile>
            <v-toolbar-title>
              <span class="text-h5">
                {{ $t(orderDetail.typeObj.realType) }}
                {{ orderDetail.order.beautyVolume }} {{ orderDetail.order.currencyCode }}
                {{ orderDetail.typeObj.orderTypeTxt }}
                <a>
                  {{ orderDetail.typeObj.counterparty }}
                </a>
              </span>
            </v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="7" :class="{ 'loading': isLoading }">
              <v-card flat color="transparent" class="pb-8">
                <v-card-text class="pa-0">
                  <v-row class="">
                    <v-col cols="12" sm="6" class="">
                      <span style="minWidth: 90px;display: inline-block;">{{ $t('TEXT_PRICE') }}:</span>
                      <span class="otc-buy-color">
                        {{ orderDetail.order.beautyPrice }} {{ orderDetail.order.fiatCode }}/{{ orderDetail.order.currencyCode }}
                      </span>
                    </v-col>
                    <v-col cols="12" sm="6" class="">
                      <span style="minWidth: 90px;display: inline-block;">Created At:</span>
                      <span class="otc-buy-color">
                        {{ orderDetail.beautyCreatedAt }}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row class="">
                    <v-col cols="12" sm="6" class="">
                      <span class="d-inline-block" style="minWidth: 90px;">{{ $t('TEXT_AMOUNT' )}}:</span>
                      <span class="color-buy">
                        {{ orderDetail.order.beautyAmount }} {{ orderDetail.order.fiatCode }}
                      </span>
                    </v-col>
                    <v-col cols="12" sm="6" class="">
                      <span class="d-inline-block" style="minWidth: 90px;">{{ $t('TEXT_ORDER') }}:</span>
                      <span class="">
                        #{{ orderDetail.order.orderNumber }}
                      </span>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card flat color="transparent" class="">
                <v-card-title class="px-0">
                  <span v-if="orderDetail.typeObj.isBuyer && orderDetail.order.status === STEP.CREATED">
                    <span class="text-subtitle-1">{{ $t('TEXT_PAYMENTS') }}</span>
                  </span>
                </v-card-title>
                <v-card-text class="px-0" v-if="orderDetail.typeObj.isBuyer && orderDetail.order.status === STEP.CREATED">
                  <v-flex class="d-flex flex-row justify-start align-center">
                    <v-icon class="mr-3">mdi-information-outline</v-icon>
                    <span>{{ $t('BUY_COIN_BANK_NOTIFY') }}
                      <span class="otc-sell-color" v-if="orderDetail.typeObj.bankOwnName">{{ $t('TEXT_YOUR_OWN_NAME') }} ({{ orderDetail.typeObj.bankOwnName }})</span>
                      {{ $t('TEXT_TO_ACCOUNT_BELOW') }}
                    </span>
                  </v-flex>
                </v-card-text>
                <v-card-text class="px-0" v-if="orderDetail.typeObj.isBuyer && orderDetail.order.status === STEP.CREATED">
                  <v-card flat
                    v-for="i in orderDetail.order.sellerPaymentMethods" :key="i.id"
                  >
                    <v-card-text>
                      <v-flex class="d-flex flex-row justify-start">
                        <div class="shrink mr-10 mt-3">
                          <span class="text-overline">Bank Card</span>
                          <v-img :aspect-ratio="16/9" src="/assets/images/bank-method.png" alt="" />
                        </div>
                        <!-- {{orderDetail.order.sellerPaymentMethods}} -->
                        <v-list class="pl-5">
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-subtitle>Name</v-list-item-subtitle>
                              <v-list-item-title>{{ i.beneficiaryName }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-subtitle>Account Number</v-list-item-subtitle>
                              <v-list-item-title>{{ i.bankAccount }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-subtitle>Bank Name</v-list-item-subtitle>
                              <v-list-item-title>{{ i.bankName }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-subtitle>Account Opening Branch</v-list-item-subtitle>
                              <v-list-item-title>{{ i.branchInfo }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-flex>
                    </v-card-text>
                  </v-card>
                </v-card-text>
                <v-card-text class="order-infor px-0">
                  <template v-if="orderDetail.typeObj.isBuyer">
                    <div v-if="orderDetail.order.status === STEP.CREATED && orderDetail.order.expiredTime >= 0">
                      <span class="text-subtitle-1 mr-2">{{ $t('Payment to be made') }}</span>
                      <span class="text-subtitle-2 accent--text">
                        <vue-countdown :time="orderDetail.order.expiredTime" @end="handleCountdownEnd">
                          <template slot-scope="props">{{ props.minutes }} {{ $t('minutes') }}, {{ props.seconds }} {{ $t('seconds') }}.</template>
                        </vue-countdown>
                      </span>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.PAID">
                      {{ $t('TEXT_BUYER_PAID') }}
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.CONFIRMED">
                      {{ $t('Your payment has been confirmed. Please check your balance on OTC Wallet.') }}
                      <v-flex class="d-flex flex-row align-center yellow lighten-5 pa-2 mt-3">
                        <v-icon color="">mdi-information-outline</v-icon>
                        <span class="ml-5">
                          {{ $t('You can contact our support help desk in case you did not get the coin and want to open a complain for this order.') }}
                        </span>
                      </v-flex>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.RELEASED">
                      {{ $t('TEXT_BUYER_RELEASED') }}
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.DISPUTE">
                      <span v-if="orderDetail.typeObj.isComplainAuthor">
                        {{ $t('TEXT_BUYER_DISPUTE') }}
                      </span>
                      <span v-else>
                        <i class="hb_icon_toast_failed warn otc-sell-color"/> {{ $t('TEXT_SELLER_DISPUTE') }}
                      </span>
                    </div>
                    <div class="payment-cancel" v-else-if="orderDetail.order.status === STEP.CANCELLED || orderDetail.order.expiredTime < 0">
                      <span class="text-h6">Order {{ $t('STATUS_CANCELLED') }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div v-if="orderDetail.order.status === STEP.CREATED && orderDetail.order.expiredTime >= 0">
                      <div>
                        {{ $t('TEXT_SELL_COIN_NOTIFY') }}
                        <span class="color-buy">{{ orderDetail.order.beautyAmount }} {{ orderDetail.order.fiatCode }}</span> {{ $t('TEXT_FROM') }}
                        <a href="#" class="otc-color-blue">{{ orderDetail.typeObj.counterparty }}</a>
                      </div>
                      <div>
                        <span class="text-subtitle-1 mr-2">{{ $t('Order will be close on') }}</span>
                        <span class="text-subtitle-2 accent--text">
                          <vue-countdown :time="orderDetail.order.expiredTime">
                            <template slot-scope="props">{{ props.minutes }} {{ $t('minutes') }}, {{ props.seconds }} {{ $t('seconds') }}.</template>
                          </vue-countdown>
                        </span>
                        <!-- <Countdown :end="orderDetail.order.expiredTime"/> -->
                      </div>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.PAID">
                      {{ $t('TEXT_SELLER_PAID') }}
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.CONFIRMED">
                      {{ $t('This order is confirmed and completed.') }}
                      <v-flex class="d-flex flex-row align-center yellow lighten-5 pa-2 mt-3">
                        <v-icon color="">mdi-information-outline</v-icon>
                        <span class="ml-5">
                          {{ $t('You still can chat with counterparty about this order.') }}
                        </span>
                      </v-flex>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.RELEASED">
                      {{ $t('TEXT_BUYER_RELEASED') }}
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.DISPUTE">
                      {{ orderDetail.typeObj.isComplainAuthor ? $t('TEXT_BUYER_DISPUTE') : $t('TEXT_SELLER_DISPUTE') }}
                    </div>
                    <div class="payment-cancel" v-else-if="orderDetail.order.status === STEP.CANCELLED || orderDetail.order.expiredTime < 0">
                      <span class="text-h6">Order {{ $t('STATUS_CANCELLED') }}</span>
                    </div>
                  </template>
                </v-card-text>

                <v-card-actions>
                  <template v-if="orderDetail.typeObj.isBuyer">
                    <div v-if="orderDetail.order.status === STEP.CREATED && orderDetail.order.expiredTime >= 0">
                      <v-btn
                        class="px-8 mr-5"
                        color="primary"
                        :class="{ 'disabled': !currentPayment.id }"
                        @click="payOrder"
                      >
                        {{ $t('Paid') }}
                      </v-btn>
                      <v-btn text
                        color="accent"
                        @click="cancelOrder"
                      >
                        {{ $t('Cancel Order') }}
                      </v-btn>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.PAID">
                      <!-- <a @click="confirm" class="otc-btn text-center w-45">Confirm</a> -->
                      <v-btn text
                        color="accent"
                        @click="cancelOrder"
                      >
                        {{ $t('Cancel Order') }}
                      </v-btn>
                      <v-btn text
                        class="px-8 ml-5"
                        color="red"
                        @click="openDispute"
                      >
                        {{ $t('Make Complain') }}
                      </v-btn>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.CONFIRMED">
                      <!-- <a @click="releaseOrder" class="otc-btn text-center w-45">{{ $t('COMMON.BTN_DONE') }}</a> -->
                      <!-- <a @click="cancelOrder" class="otc-btn otc-btn-cancel text-center w-45">{{ $t('COMMON.BTN_CANCEL') }}</a> -->
                      <!-- <a @click="openDispute" class="otc-btn otc-btn-cancel text-center w-45">{{ $t('COMMON.BTN_OPEN_DISPUTE') }}</a> -->
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.DISPUTE">
                      <v-btn text
                        color="primary"
                        @click="cancelDispute" v-if="orderDetail.typeObj.isComplainAuthor"
                      >
                        {{ $t('BTN_CANCEL_DISPUTE') }}
                      </v-btn>
                      <v-btn text
                        color="accent"
                        @click="cancelOrder" v-if="orderDetail.typeObj.isComplainAuthor"
                      >
                        Cancel Order
                      </v-btn>
                    </div>
                  </template>
                  <template v-else>
                    <div v-if="orderDetail.order.status === STEP.PAID">
                      <v-btn
                        class="px-8 mr-5"
                        color="primary"
                        @click="confirm"
                      >
                        {{ $t('BTN_CONFIRM') }}
                      </v-btn>
                      <v-btn text
                        color="accent"
                        @click="openDispute"
                      >
                        {{ $t('BTN_OPEN_DISPUTE') }}
                      </v-btn>
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.CONFIRMED">
                    </div>
                    <div v-else-if="orderDetail.order.status === STEP.DISPUTE">
                      <v-btn text
                        color="primary"
                        @click="cancelDispute"
                        v-if="orderDetail.typeObj.isComplainAuthor"
                      >
                        {{ $t('BTN_CANCEL_DISPUTE') }}
                      </v-btn>
                    </div>
                  </template>
                </v-card-actions>
              </v-card>
              <v-card flat class="trade-fag">
                <h3>{{$t('TEXT_FAQ')}}</h3>
                <ol>
                  <li class="fag-item">
                    <h4>{{$t('TEXT_IS_IT_SAFE')}}</h4>
                    <div>
                      <p>{{$t('TEXT_WHEN_YOU_ENTER_A_TRADE')}}</p>
                    </div>
                  </li>
                  <li class="fag-item">
                    <h4>{{$t('TEXT_WHEN_CAN_I_RECEIVE')}}</h4>
                    <div>
                      <p>{{$t('TEXT_IF_YOU_HAVE_PAID')}},
                        <span class="otc-sell-color">{{$t('TEXT_PLEASE_CLICK_ON_PAY')}}</span>. {{$t('TEXT_YOU_WILL_RECEIVE_THE_DIGITAL')}}</p>
                    </div>
                  </li>
                  <li class="fag-item">
                    <h4>{{$t('TEXT_REMINDERS_FOR_TRANSFER')}}</h4>
                    <div>
                      <p>{{$t('TEXT_TO_PERVENT_YOUR_TRANSFER')}}</p>
                      <p>{{$t('TEXT_IF_YOUR_AMOUNT_EXCEEDS_50000')}}</p>
                    </div>
                  </li>
                </ol>
              </v-card>
            </v-col>
            <v-col cols="12" md="5" class="px-md-8 mt-n9">
              <v-card @drop.prevent="onDrop" @dragover.prevent class="d-flex flex-column">
                <v-card-title>
                  <v-badge dot overlap
                    :color="!checkIsOnline(orderDetail.typeObj.counterpartyId) ? 'green': 'transparent'"
                  >
                    <v-avatar size="24" color="primary">
                      <span class="white--text text-overline">{{ orderDetail.typeObj.shortTxt }}</span>
                    </v-avatar>
                  </v-badge>
                  <span class="primary--text ml-3">{{ orderDetail.typeObj.counterparty }}</span>
                </v-card-title>
                <v-card-subtitle>
                  <span>{{ $t('TEXT_TRADE_IN_MONTH') }}：{{ orderDetail.typeObj.tradesInMonth }}</span>
                </v-card-subtitle>
                <v-divider />
                <v-card-text ref="chatboxBody" class="flex-grow-1 overflow-y-auto px-3 overflow-y-auto" style="max-height: 420px">
                  <div class="d-flex flex-column yellow lighten-5 pa-2 my-1">
                    <span class="text-center">{{ orderDetail.beautyCreatedAt }}</span>
                    <p v-if="orderDetail.typeObj.isBuyer">{{ $t('TEXT_BUY_CHAT_DEFAULT', { date: orderDetail.beautyExpiredDate }) }}</p>
                    <p v-else>{{ $t('TEXT_SELL_CHAT_DEFAULT', { date: orderDetail.beautyExpiredDate }) }}</p>
                  </div>
                  <div v-for="message in filteredMessages" :key="message.id"
                    class="d-flex align-center rounded"
                    :class="{
                      'flex-row-reverse': orderDetail.order.currentUser.userName === message.username && message.type !== 'Bot',
                      'flex-row': orderDetail.order.currentUser.userName !== message.username && message.type !== 'Bot',
                      'flex-column yellow lighten-5 pa-2 my-2': message.type === 'Bot' }"
                  >
                    <v-avatar v-if="orderDetail.order.currentUser.userName !== message.username && message.type !== 'Bot'"
                      size="24" color="primary"
                    >
                      <span class="white--text text-overline">{{ orderDetail.typeObj.shortTxt.toUpperCase() }}</span>
                    </v-avatar>
                    <template v-if="message.type !== 'Image'">
                      <span v-if="message.type === 'Bot'" class="text-center">
                        {{ orderDetail.beautyCreatedAt }}
                      </span>
                      <div
                        class="ma-2"
                        :class="{
                          'grey lighten-5 rounded pa-2': message.type !== 'Bot'
                        }"
                      >
                        {{ message.message }}
                      </div>
                      <div v-if="message.type !== 'Bot' && false" class="text-caption">
                        {{ message.beautyCreatedAt }}
                      </div>
                    </template>
                    <template v-else>
                      <v-img
                        :src="message.message"
                        @click="showImage(message)"
                      />
                    </template>
                  </div>
                </v-card-text>
                <v-divider />
                <v-card-actions :class="{ 'loading': isSending }">
                  <v-text-field solo flat
                    background-color="#F6F8FA"
                    v-model="chatMessage"
                    :placeholder="$t('TEXT_TYPE_IN_AND')"
                    @keydown.enter.prevent="sendMessage"
                  >
                    <template slot="append">
                      <v-flex class="d-flex flex-row align-center">
                        <v-btn icon plain
                          :ripple="false"
                          :loading="isSelecting || isUploading"
                          @click="onUploadImgClick"
                        >
                          <v-icon left>
                            mdi-attachment
                          </v-icon>
                        </v-btn>
                        <v-btn icon plain
                          class="mr-n3"
                          :ripple="false"
                          @click="sendMessage"
                        >
                          <v-icon left>
                            mdi-send
                          </v-icon>
                        </v-btn>
                      </v-flex>
                    </template>
                  </v-text-field>
                  <input ref="uploader" class="d-none" type="file"
                    accept="image/*"
                    @change="uploadImage($event)"
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>
    <!-- End Chat Mobile Icon -->
    <modal-otc-dispute :counterparty="orderDetail.typeObj.counterparty" :ordernumber="orderDetail.order.orderNumber" />
  </v-main>
</template>
<script>
import VueCountdown from '@chenfengyuan/vue-countdown'
import OtcService from '@/api/otc/OtcService'
import CONSTANT from '@/configs/constant'
// import UtilService from '@/utils/UtilService'
import UserState from '@/mixin/user-state'
import ModalOtcDispute from '@/views/modal/ModalOtcDispute'
export default {
  components: {
    VueCountdown,
    ModalOtcDispute
  },
  mixins: [UserState],
  data () {
    return {
      isTimeOut: false,
      currentPayment: {},
      isLoading: false,
      STEP: CONSTANT.OTC_STEP,
      updateIntervalId: null,
      chatMessage: '',
      openChatMobile: false,
      updateChatId: null,
      isSending: false,
      isUploading: false,
      isSelecting: false,
      isForcedCancel: false
    }
  },
  computed: {
    orderDetail () {
      return this.$store.getters.orderDetail
    },
    user () {
      return this.$store.getters.user
    },
    messages () {
      return this.$store.getters.messages
    },
    filteredMessages () {
      return this.messages.filter(temp => {
        return temp.message
      })
    }
  },
  watch: {
    orderDetail (val) {
      if (val &&
         val.order &&
         val.order.sellerPaymentMethods &&
         val.order.sellerPaymentMethods.length &&
         !this.currentPayment.id) {
        this.currentPayment = val.order.sellerPaymentMethods[0]
      }
    }
  },
  async created () {
    let id = this.$route.query.id
    if (!id) {
      this.$router.push({ name: 'otc-trade', params: { type_pair: 'buy' } })
    } else {
      this.isLoading = true
      let order = await this.$store.dispatch('getOrder', id)
      if (!order.order || !order.order.id) {
        this.$router.push({ name: 'otc-orders' })
        return
      }
      await this.$store.dispatch('getMessages', id)
      this.updateOrderDetail()
      this.updateChatMessage()
      setTimeout(() => {
        this.isLoading = false
      }, 400)
    }
  },
  methods: {
    showImage (message) {
      window.open(
        message.message,
        'blank'
      )
    },
    cancelDispute () {
      let message = this.$t('TEXT_CANCEL_DISPUTE_CONFIRM')
      let bodyObj = this.orderDetail
      let data = {
        message: message,
        data: bodyObj,
        action: 'cancelDispute'
      }
      this.$store.dispatch('toggleConfirmModal', data)
    },
    handleCountdownEnd () {
      if (this.isForcedCancel || !this.orderDetail.typeObj.isBuyer) return
      let bodyObj = {
        isForceUpdate: true
      }
      this.$google.getCaptcha('cancelDispute')
        .then(token => {
          bodyObj.reCaptcha = token
          OtcService.cancelOrder(this.orderDetail.order.id, bodyObj).then(rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.isForcedCancel = true
              this.resetOrderDetail(rs.data)
            }
          })
        })
    },
    selectPayment (i) {
      if (i.id === this.currentPayment.id) return
      this.currentPayment = i
    },
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.uploadImage(e)
    },
    uploadImage (e) {
      this.isSending = true
      let image
      if (e.dataTransfer) {
        image = e.dataTransfer.files[0]
      } else {
        image = e.target.files[0]
      }
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = e => {
        this.previewImage = e.target.result
        let data = {}
        data.message = this.previewImage
        this.$google.getCaptcha('uploadImage')
          .then(async token => {
            data.reCaptcha = token
            await OtcService.chat(this.orderDetail.order.id, data).then(async rs => {
              if (rs.status === CONSTANT.SUCCESS) {
                this.chatMessage = ''
                await this.$store.dispatch('getMessages', this.orderDetail.order.id)
                this.scrollToBottom()
              }
              this.isSending = false
            })
          })
      }
    },
    async payOrder () {
      let bodyObj = this.orderDetail
      let message =
        `
          ${this.$t('TEXT_CONFIRM_PAY_ORDER')}
          <div>${this.currentPayment.bankAccount} -
            ${this.currentPayment.bankName} -
            ${this.currentPayment.beneficiaryName}
          </div>
        `
      bodyObj.currentPayment = this.currentPayment
      bodyObj.sellerPaymentMethod = bodyObj.currentPayment

      let data = {
        message: message,
        data: bodyObj,
        action: 'payOrder'
      }
      this.$store.dispatch('toggleConfirmModal', data)
    },
    cancelOrder () {
      let message = this.$t('TEXT_CONFIRM_CANCEL_ORDER')
      let bodyObj = this.orderDetail
      let data = {
        message: message,
        data: bodyObj,
        action: 'cancelOtcOrder'
      }
      this.$store.dispatch('toggleConfirmModal', data)
    },
    async confirm () {
      let message = this.$t('Do you want to send coin to counterparty?')
      let bodyObj = this.orderDetail
      let data = {
        message: message,
        data: bodyObj,
        action: 'confirmOrder'
      }
      this.$store.dispatch('toggleConfirmModal', data)
    },
    releaseOrder () {
      let message = this.$t('TEXT_CONFIRM_RELEASE_ORDER')
      let bodyObj = this.orderDetail
      let data = {
        message: message,
        data: bodyObj,
        action: 'releaseOrder'
      }
      this.$store.dispatch('toggleConfirmModal', data)
    },
    openDispute () {
      this.$store.dispatch('toggleShowDisputeOtcModal', this.orderDetail)
    },
    resetOrderDetail (order) {
      // console.log(order, 'reset order')
      // let orderDetail = JSON.parse(JSON.stringify(this.orderDetail))
      // orderDetail.order = order
      // this.$store.dispatch('setOrderDetail', UtilService.transformOrder(orderDetail))
      this.$store.dispatch('getOrder', order.id)
    },
    updateOrderDetail () {
      if (this.updateIntervalId) return
      this.updateIntervalId = setInterval(() => {
        let id = this.$route.query.id
        if (!id || this.orderDetail.order.status === this.STEP.RELEASED ||
          this.orderDetail.order.status === this.STEP.CANCELLED) {
          clearInterval(this.updateIntervalId)
          // return
        }
        this.$store.dispatch('getOrder', id)
      }, 10000)
    },
    async sendMessage () {
      if (!this.chatMessage.trim() || this.isSending) return
      this.isSending = true
      let data = {}
      data.message = this.chatMessage.trim()
      this.$google.getCaptcha('sendMessage')
        .then(async token => {
          data.reCaptcha = token
          await OtcService.chat(this.orderDetail.order.id, data).then(async rs => {
            if (rs.status === CONSTANT.SUCCESS) {
              this.chatMessage = ''
              await this.$store.dispatch('getMessages', this.orderDetail.order.id)
              this.scrollToBottom()
            }
            this.isSending = false
          })
        })
    },
    async updateChatMessage () {
      if (this.updateChatId) return
      this.updateChatId = setInterval(async () => {
        let id = this.$route.query.id
        if (!id) return
        await this.$store.dispatch('getMessages', id)
        // this.scrollToBottom()
      }, 3000)
    },
    onUploadImgClick () {
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true })

      this.$refs.uploader.click()
    },
    scrollToBottom () {
      // var container = document.querySelector('.chatbox-body')
      // var scrollHeight = container.scrollHeight
      // container.scrollTop = scrollHeight
    }
  },
  destroyed () {
    clearInterval(this.updateIntervalId)
    clearInterval(this.updateChatId)
  }
}
</script>
