import CONSTANT from '@/configs/constant'
import OtcService from '@/api/otc/OtcService'
const modalConfirmation = {
  actions: {
    async deletePaymentMethod ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('deletePayment')
      body.reCaptcha = token
      let rs = await OtcService.deletePayment(body.id, body)
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      if (rs.status === CONSTANT.SUCCESS) {
        this.dispatch('getUserPayments')
      }
      return data
    },
    async togglePaymentStatus ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('togglePaymentStatus')
      body.reCaptcha = token
      let rs = await OtcService.changePaymentStatus(body.id, body)
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      if (rs.status === CONSTANT.SUCCESS) {
        this.dispatch('getUserPayments')
      }
      return data
    },
    async payOrder ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('payOrder')
      body.reCaptcha = token
      let rs = await OtcService.payOrder(body.order.id, body)
      console.log(rs, '**** pay order')
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      return data
    },
    async cancelDispute ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('cancelDispute')
      body.reCaptcha = token
      let rs = await OtcService.cancelDispute(body.order.id, body)
      console.log(rs, '**** cancel dispute')
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      return data
    },
    async cancelOtcOrder ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('cancelOrder')
      body.reCaptcha = token
      let rs = await OtcService.cancelOrder(body.order.id, body)
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      return data
    },
    async releaseOrder ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('releaseOrder')
      body.reCaptcha = token
      let rs = await OtcService.releaseOrder(body.order.id, body)
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      return data
    },
    async confirmOrder ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('confirmOrder')
      body.reCaptcha = token
      let rs = await OtcService.confirmOrder(body.order.id, body)
      console.log(rs, '**** confirm order')
      let data = rs.status === CONSTANT.SUCCESS ? (rs.data || true) : false
      return data
    },
    async updateAdStatus ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('updateAdStatus')
      body.reCaptcha = token
      let rs = await OtcService.updateAdStatus(body.id, body)
      let data = rs.status === CONSTANT.SUCCESS
      return data
    },
    async cancelAd ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('cancelAd')
      body.reCaptcha = token
      let rs = await OtcService.cancelAd(body.id, body)
      let data = rs.status === CONSTANT.SUCCESS
      return data
    },
    async blockUser ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('blockUser')
      body.reCaptcha = token
      let rs = await OtcService.blockUser(body.inviteCode, body)
      return rs
    },
    async unBlockUser ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('unBlockUser')
      body.reCaptcha = token
      let rs = await OtcService.unBlockUser(body.inviteCode, body)
      return rs
    },
    async unFollowUser ({ __ }, body) {
      let token = await this._vm.$google.getCaptcha('unFollowUser')
      body.reCaptcha = token
      let rs = await OtcService.unFollowUser(body.inviteCode, body)
      return rs
    }
  }
}

export default modalConfirmation
