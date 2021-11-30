import Vue from 'vue'
import Constant from '@/configs/constant'
import CONFIG from '@/configs/config'
import i18n from '@/plugin/i18n'
import BigNumber from 'bignumber.js'
import WAValidator from 'wallet-address-validator'
import bchaddr from 'bchaddrjs'
import _ from 'lodash'
import LocalStorage from './LocalStorage'
import numeral from 'numeral'

export default new Vue({
  methods: {
    mapOtcNotificationType (type) {
      let result = ''
      switch (type) {
        case 'OrderDispute':
          result = 'MSG_ORDER_DISPUTE'
          break
        case 'OrderCancelDispute':
          result = 'MSG_ORDER_CANCEL_DISPUTE'
          break
        default:
          result = type
          break
      }
      return result
    },
    mapOtcKycStatus (status) {
      let kycStatus = Constant.OTC.KYC_STATUS
      let result = ''
      switch (status) {
        case kycStatus.NONE:
          result = 'MSG_KYC_EMPTY'
          break
        case kycStatus.PENDING:
          result = 'MSG_KYC_PENDING'
          break
        case kycStatus.APPROVE:
          result = 'MSG_KYC_APPROVE'
          break
        case kycStatus.REJECT:
          result = 'MSG_KYC_REJECT'
          break
        default:
          break
      }
      return result
    },
    transformKycInfo (data) {
      data.kycStatusMess = this.mapOtcKycStatus(data.kycStatus)
      return data
    },
    transformPaymentMethod (data) {
      data.forEach(temp => {
        temp.isOn = false
      })
      return data
    },
    transformMessages (data) {
      data.forEach(temp => {
        temp.beautyCreatedAt = this.$moment(temp.createdAt).utc().local().format('HH:mm:ss')
        if (temp.type === 'Image') {
          let accessToken = Vue.$keycloak.token || ''
          temp.message = CONFIG.BASE_URL_PROXY + temp.message + '?token=' + accessToken
        }
      })
      return data
    },
    // Object builder
    buildOtcBalancePair (data) {
      let inObj = {
        name: 'TEXT_MAIN_ACCOUNT',
        symbol: data.coinCode,
        index: 1,
        type: 'in_exchange'
      }
      let otcObj = {
        name: 'TEXT_OTC_ACCOUNT',
        symbol: data.coinCode,
        index: 0,
        type: 'out_exchange'
      }
      inObj.balance = data.balancePrimary
      inObj.beautyBalance = this.beautyAmount(data.balancePrimary, data.numberDecimal)
      otcObj.balance = data.balanceFiat
      otcObj.beautyBalance = this.beautyAmount(data.balanceFiat, data.numberDecimal)
      otcObj.beautyBalanceOtcFrozen = this.beautyAmount(data.balanceFiatFrozen, data.numberDecimal)
      return [ inObj, otcObj ]
    },

    // Transformer service
    transformExchangeWallets (data) {
      if (!data || !data.length) return []
      data.forEach(element => {
        element.imageUrl = '/assets/images/crypto-icon/' + _.toLower(element.coinCode) + '.svg'
        element.name = element.coinName
        element.id = element.coinCode
        element.symbol = element.coinCode
        element.beautyBalanceExchange = this.beautyAmount(element.balanceExchange, element.numberDecimal)
        element.beautyBalanceExchangeFrozen = this.beautyAmount(element.balanceExchangeFrozen, element.numberDecimal)
        element.beautyBalancePrimary = this.beautyAmount(element.balancePrimary, element.numberDecimal)
      })
      return data
    },
    transformExchangeBalancesHistory (data) {
      if (!data || !data.length) return []
      data.forEach(element => {
        element.beautyDate = this.$moment(element.createdAt).utc().local().format('YYYY-MM-DD HH:mm')
        element.beautyType = this.mapTransactionType(element.transactionType)
        element.totalCoin = this.numberWithCommas(element.totalCoin)
      })
      return data
    },
    transformOpenOrders (data) {
      if (!data || !data.length) return []
      data.forEach(element => {
        element.beautyCreatedAt = this.$moment(element.createdAt).utc().local().format('YYYY-MM-DD HH:mm:ss')
        if ((element.amount !== null && element.amount !== undefined) && (element.filledAmount !== null && element.filledAmount !== undefined)) {
          element.unexcutedAmount = new BigNumber(element.amount).minus(element.filledAmount).toNumber()
          element.statusKey = this.mapExchangeOrderStatus(element.status)
          element.typeKey = this.mapExchangeOrderType(element.type)
          element.color = element.type && (element.type.indexOf('buy') !== -1) ? 'up' : 'down'
        }
        if (element.type && element.type.indexOf('market') !== -1) {
          element.price = 'TEXT_MARKET_PRICE'
          element.isMarketPrice = true
        }
        if (element.filledAmount) element.filledAmountNum = parseFloat(element.filledAmount)
      })
      return data
    },
    transformTransactionsOrder (data) {
      if (!data || !data.length) return []
      data.forEach(element => {
        element.beautyCreatedAt = this.$moment(element.createdAt).utc().local().format('YYYY-MM-DD HH:mm:ss')
        if (element.filledAmount !== null && element.filledAmount !== undefined) {
          element.amount = element.filledAmount
          element.statusKey = this.mapExchangeOrderStatus(element.status)
          element.typeKey = this.mapExchangeOrderType(element.type)
          element.color = element.type && (element.type.indexOf('buy') !== -1) ? 'up' : 'down'
        }
        if (element.type && element.type.indexOf('market') !== -1) {
          element.price = 'TEXT_MARKET_PRICE'
          element.isMarketPrice = true
        }
        if (element.filledAmount) element.filledAmountNum = parseFloat(element.filledAmount)
        element.fee = element.filledFees || 0
      })
      return data
    },
    transformListPairs (data) {
      if (!data || !data.length) {
        return []
      }
      let all = { displayName: 'All', id: 'all' }
      data.unshift(all)
      return data
    },
    transformTransactionHistory (data) {
      if (!data || !data.length) return data
      for (let i = 0; i < data.length; i++) {
        const temp = data[i]
        data[i].beautyCreatedAt = this.$moment(temp.createdAt).format('YYYY-MM-DD HH:mm:ss')
        data[i].beautyAmount = this.numberWithCommas(temp.totalCoin)
        data[i].success = temp.status === 'Completed'
        data[i].beautyType = this.mapTransactionType(data[i].transactionType)
      }
      return data
    },
    transformWallets (data) {
      if (!data || !data.length) return []
      for (let i = 0; i < data.length; i++) {
        data[i].beautyBalance = this.beautyAmount(data[i].balance, data[i].numberDecimal)
        data[i].isSmBalance = !data[i].balance
        data[i].imageUrl = '/assets/images/crypto-icon/' + _.toLower(data[i].coinCode) + '.svg'
        if (data[i].swapTo && data[i].swapTo.length) {
          for (let j = 0; j < data[i].swapTo.length; j++) {
            let temp = data[i].swapTo[j]
            temp.imageUrl = '/assets/images/crypto-icon/' + _.toLower(temp.toSymbol) + '.svg'
          }
        }
      }
      return data
    },
    transformActivities (data) {
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let temp = data[i]
          temp.beautyCreatedAt = this.$moment(temp.createdAt).format('YYYY-MM-DD')
          temp.beautyActivity = this.mapActivity(temp.activity)
        }
      } else return []
      return data
    },
    transformLimitation (data) {
      if (!data) data = {}
      data.beautyTotalInvited = !data || !data.totalInvited ? '0' : '$' + this.numberWithCommas(data.totalInvited)
      data.beautyTotalRebate = !data || !data.totalRebate ? '0' : '$' + this.numberWithCommas(data.totalRebate)
      data.beautyTotalLimit = !data || !data.totalLimit ? '0' : '$' + this.numberWithCommas(data.totalLimit)
      data.beautyTotalDailyLimit = !data || !data.beautyTotalDailyLimit ? '0' : '$' + this.numberWithCommas(data.totalDailyLimit)
      data.beautyTotalRemainingRebate = !data || !data.totalRebate || !data.totalLimit ? '0' : '$' + this.numberWithCommas(Math.floor((data.totalLimit - data.totalRebate) * 100) / 100)
      return data
    },
    transformReferral (data) {
      if (!data || !data.length) return []
      return data
    },
    transformInvitationRebateData (data) {
      if (!data || !data.length) return []
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        data[i].beautyCreatedAt = this.$moment(temp.registerAt * 1000).format('YYYY-MM-DD HH:mm:ss')
        if (data[i].rebate) data[i].beautyRebate = this.numberWithCommas(data[i].rebate)
        data[i].beautyStatus = data[i].status
        data[i].stt = i + 1
      }
      return data
    },
    transformApiKeys (data) {
      if (!data || !data.length) return []
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        data[i].beautyCreatedAt = this.$moment(temp.createdAt * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      return data
    },
    transformOrder (data) {
      if (data.order) {
        data.order.expiredTime = data.order.paymentWindowExpire * 1000 - Date.now()
        data.order.beautyPrice = this.numberWithCommas(data.order.price)
        data.order.beautyAmount = this.numberWithCommas(data.order.amount)
        data.order.beautyVolume = this.numberWithCommas(data.order.volume)
        data.typeObj = this.mapOrderType(data.order)
        data.isOwnerOfAd = data.order.username === data.order.currentUser.username
        data.isHiddenInfo = data.order.status === Constant.OTC_STEP.CANCELLED
        data.beautyCreatedAt = this.$moment(data.order.createdAt).utc().local().format('YYYY-MM-DD')
        data.beautyExpiredDate = this.$moment(data.order.paymentWindowExpire * 1000).utc().local().format('HH:mm:ss')
      }
      return data
    },
    transformOrders (data) {
      data.data.forEach(e => {
        e.beautyAmount = this.numberWithCommas(e.amount)
        e.beautyPrice = this.numberWithCommas(e.price)
        e.beautyVolume = this.numberWithCommas(e.volume)
        e.typeObj = this.mapOrderType(e)
        e.beautyCreatedAt = this.$moment(e.createdAt).utc().local().format('YYYY-MM-DD HH:mm:ss')
        e.statusTxt = i18n.t('STATUS_' + e.status.toUpperCase())
      })
      return data
    },
    mapOrderType (order) {
      let obj = {}
      if (order.orderType.toLocaleLowerCase() === 'sell') {
        if (order.currentUser.inviteCode === order.seller.inviteCode) {
          obj.realType = 'BTN_SELL'
          obj.counterparty = order.buyer.nickname
          obj.color = 'otc-sell-color'
          obj.isBuyer = false
          obj.orderTypeTxt = i18n.t('TIT_TO')
          obj.counterpartyId = order.buyer.inviteCode
          obj.shortTxt = order.buyer.nickname ? order.buyer.nickname.substring(0, 1) : ''
          obj.tradesInMonth = order.seller.total30DaysOrder
        } else {
          obj.realType = 'BTN_BUY'
          obj.counterparty = order.seller.nickname
          obj.color = 'otc-buy-color'
          obj.isBuyer = true
          obj.orderTypeTxt = i18n.t('TIT_FROM')
          obj.counterpartyId = order.seller.inviteCode
          obj.shortTxt = order.seller.nickname ? order.seller.nickname.substring(0, 1) : ''
          obj.tradesInMonth = order.buyer.total30DaysOrder
        }
      } else {
        if (order.currentUser.inviteCode === order.buyer.inviteCode) {
          obj.realType = 'BTN_BUY'
          obj.counterparty = order.seller.nickname
          obj.color = 'otc-buy-color'
          obj.isBuyer = true
          obj.orderTypeTxt = i18n.t('TIT_FROM')
          obj.counterpartyId = order.seller.inviteCode
          obj.shortTxt = order.seller.nickname ? order.seller.nickname.substring(0, 1) : ''
          obj.tradesInMonth = order.buyer.total30DaysOrder
        } else {
          obj.realType = 'BTN_SELL'
          obj.counterparty = order.buyer.nickname
          obj.color = 'otc-sell-color'
          obj.isBuyer = false
          obj.orderTypeTxt = i18n.t('TIT_TO')
          obj.counterpartyId = order.buyer.inviteCode
          obj.shortTxt = order.buyer.nickname ? order.buyer.nickname.substring(0, 1) : ''
          obj.tradesInMonth = order.seller.total30DaysOrder
        }
      }
      if (order.status === Constant.OTC_STEP.DISPUTE && order.complain && order.currentUser) {
        obj.isComplainAuthor = order.currentUser.id === order.complain.userId
      }
      if (order.buyer && order.buyer.fullname) {
        obj.bankOwnName = order.buyer.fullname
      }
      return obj
    },
    getRemainingTime (time) {
      let additionTime = Constant.OTC.DISPUTE_TIME * 60
      let validTime = time + additionTime
      let result = validTime - Date.now()
      if (result > 0) return result
      else return 0
    },
    checkValidDisputeTime (time) {
      let additionTime = Constant.OTC.DISPUTE_TIME * 60 * 1000
      let validTime = time * 1000 + additionTime
      return Date.now() > validTime
    },

    // Map utils
    mapActionType (orderType) {
      let actions = {
        limit: 'cancelOrder',
        stopLimit: 'cancelStopLimitOrder'
      }
      let result = ''
      switch (orderType) {
        case 'buy_stop_limit':
          result = actions.stopLimit
          break
        case 'sell_stop_limit':
          result = actions.stopLimit
          break
        case 'buy_limit':
          result = actions.limit
          break
        case 'sell_limit':
          result = actions.limit
          break
        default:
          result = actions.limit
          break
      }
      return result
    },
    mapTransactionType (type) {
      let result = ''
      switch (type) {
        case 'in_fiat':
          result = 'TEXT_TRANSFER_IN_FIAT'
          break
        case 'out_fiat':
          result = 'TEXT_TRANSFER_OUT_FIAT'
          break
        default:
          result = 'STATUS_OTHER'
      }
      return result
    },
    mapActivity (code) {
      switch (code) {
        case 1: return i18n.t('ACTIVITY_LOGIN')
        case 2: return i18n.t('ACTIVITY_LOGOUT')
        case 3: return i18n.t('ACTIVITY_DEPOSIT')
        case 4: return i18n.t('ACTIVITY_WITHDRAWAL')
        case 5: return i18n.t('ACTIVITY_VERIFY')
        case 6: return i18n.t('ACTIVITY_ENABLE_2FA')
        case 7: return i18n.t('ACTIVITY_DISABLE_2FA')
        case 8: return i18n.t('ACTIVITY_INVEST_PACKAGE')
        case 9: return i18n.t('ACTIVITY_CHANGE_PASSWORD')
        case 10: return i18n.t('ACTIVITY_PACKAGE_REFUNDED')
        case 11: return i18n.t('ACTIVITY_REQUEST_REFUND')
        case 12: return i18n.t('ACTIVITY_REINVEST_PACKAGE')
        case 13: return i18n.t('ACTIVITY_CANCEL_REFUND_REQUEST')
        case 14: return i18n.t('ACTIVITY_REQUEST_FORGOT_PASSWORD')
        case 15 : return i18n.t('ACTIVITY_CHANGE_PIN_CODE')
        case 16 : return i18n.t('ACTIVITY_UPDATE_PROFILE')
        case 17 : return i18n.t('ACTIVITY_TRANSFER')
        case 18 : return i18n.t('ACTIVITY_SWAP')
        case 19 : return i18n.t('ACTIVITY_CHANGE_PHONE')
        case 20 : return i18n.t('ACTIVITY_TURN_OFF_PHONE')
        case 21 : return i18n.t('ACTIVITY_TURN_ON_PHONE')
        case 22 : return i18n.t('ACTIVITY_CHANGE_2FA')
        case 23 : return i18n.t('ACTIVITY_TURN_OFF_2FA')
        case 24 : return i18n.t('ACTIVITY_TURN_ON_2FA')
        case 25: return i18n.t('ACTIVITY_VERIFY_TELEGRAM')

        case 26: return i18n.t('ACTIVITY_LINK_PHONE')
        case 27: return i18n.t('ACTIVITY_LINK_2FA')

        case 30: return i18n.t('TEXT_TRANSFER_IN_EXCHANGE')
        case 31: return i18n.t('TEXT_TRANSFER_OUT_EXCHANGE')
        case 34: return i18n.t('ACTIVITY_CHANGE_EMAIL')
        case 40: return i18n.t('ACTIVITY_ACTIVATION_CODE')
        case 41: return i18n.t('ACTIVITY_REFRESH_TOKEN')
        case 42: return i18n.t('ACTIVITY_FORGOT_PASSWORD')
        case 43: return i18n.t('ACTIVITY_RESET_PASSWORD')
        case 44: return i18n.t('ACTIVITY_SUBMIT_KYC')
        case 45: return i18n.t('ACTIVITY_CREATE_API_KEY')
        case 46: return i18n.t('ACTIVITY_UPDATE_API_KEY')
        case 47: return i18n.t('ACTIVITY_DELETE_API_KEY')
        case 48: return i18n.t('ACTIVITY_TURN_OFF_TELEGRAM')
        case 49: return i18n.t('ACTIVITY_TURN_ON_TELEGRAM')
        case 50: return i18n.t('ACTIVITY_CHANGE_TELEGRAM')
      }
    },
    mapExchangeOrderStatus (status) {
      let result = ''
      switch (status) {
        case 'filled':
          result = 'STATUS_COMPLETED'
          break
        case 'submitted':
          result = 'STATUS_SUBMITTED'
          break
        case 'partial_filled':
          result = 'STATUS_INCOMPLETE'
          break
        case 'canceled':
          result = 'STATUS_CANCELED'
          break
        case 'partial_canceled':
          result = 'STATUS_INCOMPLETE'
          break
        default:
          result = 'STATUS_OTHER'
      }
      return result
    },
    mapExchangeOrderType (type) {
      let result = ''
      switch (type) {
        case 'buy_limit':
          result = 'STATUS_BUY_LIMIT'
          break
        case 'sell_limit':
          result = 'STATUS_SELL_LIMIT'
          break
        case 'buy_stop_limit':
          result = 'STATUS_BUY_STOP_LIMIT'
          break
        case 'sell_stop_limit':
          result = 'STATUS_SELL_STOP_LIMIT'
          break
        case 'buy_market':
          result = 'STATUS_BUY_MARKET'
          break
        case 'sell_market':
          result = 'STATUS_SELL_MARKET'
          break
        default:
          result = 'STATUS_OTHER'
          break
      }
      return result
    },

    // Calculation utils
    calculateTotalMoney (amount, price, precision) {
      if (!amount || !price) return
      return new BigNumber(amount).multipliedBy(price).toFixed(precision || 2, BigNumber.ROUND_DOWN)
    },
    calculateTotalFiatMoney (amount, price, precision) {
      let money = this.calculateTotalMoney(amount, price, precision)
      return this.numberWithCommas(money)
    },
    calculateTotalBalance (data) {
      if (!data || !data.length) return 0
      let result = 0
      for (let i = 0; i < data.length; i++) {
        const temp = data[i]
        if (!temp.rate) temp.rate = 1
        result += (temp.rate * temp.balance)
      }
      result = Math.floor(result * Constant.BIG_DECIMAL_NUMBER) / Constant.BIG_DECIMAL_NUMBER || 0
      result = result.toFixed(8)
      return this.numberWithCommas(result)
    },
    calculateEstimateAmount (amount, fee, wallet) {
      let numberDecimal = wallet.numberDecimal || Constant.DECIMAL_PLACES
      let result = new BigNumber(amount).minus(fee)
      result = new BigNumber(result).dp(numberDecimal, BigNumber.ROUND_FLOOR).toNumber()
      return result
    },
    calculateFeeWithdraw (amount, wallet) {
      if (!amount) return 0
      var result = null
      let numberDecimal = wallet.numberDecimal || Constant.DECIMAL_PLACES
      switch (wallet.feeType) {
        case Constant.FEE_TYPE.PERCENT:
          let fee = new BigNumber(amount).multipliedBy(wallet.feeWithdraw)
          result = new BigNumber(fee).dp(numberDecimal, BigNumber.ROUND_UP).toNumber()
          break
        case Constant.FEE_TYPE.FIXED:
          result = wallet.feeWithdraw
          break
        default:
          result = 0
          break
      }
      return this.convertExponentialToDecimal(result)
    },
    calculateMinAmount (balance, rate) {
      if (!rate) return 0
      let temp = new BigNumber(balance).dividedBy(rate)
      let result = new BigNumber(temp).dp(Constant.DECIMAL_PLACES, BigNumber.ROUND_CEIL).toNumber()
      return result
    },
    calculateChange (strOpen, strClose) {
      if (!strOpen || !strClose) {
        return '0.00'
      }
      let open = Number(strOpen)
      let close = Number(strClose)
      if (open === 0) return '0.00'
      let change = ((close - open) / open) * 100
      return numeral(change).format('0.00')
    },
    calculateTurnover (strOpen, strClose, strVolume) {
      let open = Number(strOpen)
      let close = Number(strClose)
      let volume = Number(strVolume)

      let turnover = ((open + close) / 2) * volume
      return numeral(turnover).format('0,0')
    },
    calculateMinMaxPrice (price) {
      let result = {}
      result.min = parseFloat((price * (100 - Constant.OTC.PERCENT_FLOAT) / 100).toFixed(2))
      result.max = parseFloat((price * (100 + Constant.OTC.PERCENT_FLOAT) / 100).toFixed(2))
      return result
    },
    convertExponentialToDecimal (exponentialNumber) {
      // sanity check - is it exponential number
      const str = exponentialNumber.toString()
      if (str.indexOf('e') !== -1) {
        const exponent = parseInt(str.split('-')[1], 10)
        // Unfortunately I can not return 1e-8 as 0.00000001, because even if I call parseFloat() on it,
        // it will still return the exponential representation
        // So I have to use .toFixed()
        const result = exponentialNumber.toFixed(exponent)
        return result
      } else {
        return exponentialNumber
      }
    },

    // String utils
    beautyCurrency (data) {
      return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    numberWithCommas (x) {
      if (x === undefined) return
      var parts = x.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    beautyAmount (x, decimal) {
      x = Number(x)
      const temp = decimal ? x.toFixed(decimal) : x.toFixed(8)
      return this.numberWithCommas(temp)
    },

    // Common utils
    getCountryNameFromCountryId (id, listCountries) {
      let country = _.find(listCountries, (country) => {
        return country.id === id
      })
      return country || { name: '' }
    },
    getAddressBaseFromSymbol (symbol) {
      if (Constant.SPECIAL_SYMBOL[symbol]) {
        return Constant.SPECIAL_SYMBOL[symbol]
      }
      return symbol
    },
    getExchangePairByCurrency (wallets, pairs) {
      if (!wallets || !pairs || !wallets.length || !pairs.length) return
      pairs.forEach(element => {
        element.pairName = `${element.base}_${element.quote}`
      })
      let obj = {}
      wallets.forEach(element => {
        obj[_.toLower(element.coinCode)] = pairs.filter(temp => {
          return temp.base && _.toLower(temp.base) === _.toLower(element.coinCode)
        })
      })
      return obj
    },
    getResolution (interval) {
      if (interval < 60) {
        return `M${interval}`
      } else if (interval >= 60) {
        return `H${interval / 60}`
      } else {
        return `D1`
      }
    },
    getCoinFormat (formatStr) {
      let arr = formatStr.split(';')
      return arr
    },

    // Check falsy utils
    isValidAddressWithFormat (arrFormat, address) {
      for (let i = 0; i < arrFormat.length; i++) {
        let format = arrFormat[i]
        let isValid = WAValidator.validate(address, format)
        if (isValid) return true
      }
      return false
    },
    isRed (strOpen, strClose) {
      let open = Number(strOpen)
      let close = Number(strClose)
      return close < open
    },
    isValidAddress (address, currentAccount) {
      let isValid = false
      if (!address) return false
      if (currentAccount.coinCode === 'BCH') {
        let isMainnetAddress = bchaddr.isMainnetAddress
        try {
          isValid = isMainnetAddress(address)
        } catch (e) {
          isValid = false
          console.log(e)
        }
      } else {
        try {
          let formats = this.getCoinFormat(currentAccount.validateFormat)
          isValid = this.isValidAddressWithFormat(formats, address)
        } catch (e) {
          isValid = true
        }
      }
      console.log(isValid, ' address validation')
      return isValid
    },
    isMobileDevice () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      }
      return false
    },

    // Check valid data utils
    checkValidAmountDecimals (value, precision) {
      try {
        let arr = value.toString().split('.')
        if (!arr[1]) return true
        return arr[1].length <= precision || false
      } catch (error) {
        return false
      }
    },
    beautyOtcAd (data) {
      for (let key in data) {
        let value = data[key]
        if (typeof value === 'number') {
          let beautyKey = 'beauty_' + key
          if (key === 'available') {
            data[beautyKey] = this.beautyAmount(value, 6)
          } else {
            data[beautyKey] = this.beautyAmount(value, 2)
          }
        }
      }
      return data
    },
    convertDataType (data) {
      let keys = Object.keys(data)
      keys.forEach(key => {
        if (typeof data[key] === 'boolean') {
          data[key] = data[key] ? 1 : 0
        }
      })
      return data
    },
    checkValidDecimals (value, precision) {
      value = Number(value)
      if (Math.floor(value) === value) {
        return true
      }
      try {
        let arr = value.toString().split('.')
        return arr[1].length <= precision || false
      } catch (error) {
        return false
      }
    },
    checkValidateEmail (email) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(String(email).toLowerCase())
    },

    // Generator utils
    generateNumberFormat (precision) {
      let temp = '0000000000000000000000000000000'
      let result = '0.'
      let target = temp.substr(0, precision)
      result += target
      return result
    },
    generateRandomString (length) {
      var text = ''
      var possible = '_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-'
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    },

    // TV chart utils
    tvDecimalPlaceFormat (precision) {
      let temp = '0000000000000000000000000000000'
      let result = '1'
      let target = temp.substr(0, precision)
      result += target
      return result
    },

    // Cache utils
    clearCacheLocalStorage () {
      LocalStorage.removeItem(Constant.EX_LIST_PAIRS)
      LocalStorage.removeItem(Constant.SYSTEM_CONFIG)
    },
    getCookie (cname) {
      var name = cname + '='
      var decodedCookie = decodeURIComponent(document.cookie)
      var ca = decodedCookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    getCurrentOtc (str) {
      let arr = str.split('-')
      let obj = {}
      obj.type = arr[0] || 'buy'
      obj.currency = arr[1] || 'btc'
      return obj
    },
    buildOffsetLimitFromPagination (pagination) {
      pagination.page = pagination.page || Constant.DEFAULT_PAGE_NUMBER
      pagination.size = pagination.size || Constant.DEFAULT_PAGE_SIZE
      const offset = (pagination.page - 1)
      const limit = pagination.size
      return {
        offset: offset,
        limit: limit
      }
    },
    buildFilterQuery (filterObj) {
      let paging = this.buildOffsetLimitFromPagination(filterObj.paging)
      let filter = filterObj.filter
      let query
      if (filter.status !== '') {
        query = Object.assign(paging, filter)
      } else {
        query = paging
      }
      return query
    },
    buildTotalPage (total, limit) {
      return Math.ceil(total / limit)
    },
    buildPaginationFrom (total, page, size) {
      let totalPage = this.buildTotalPage(total, size)
      let query = {}
      query.page = parseFloat(page)
      query.size = parseFloat(size)
      query.total = totalPage
      return query
    },
    // Otc transform
    transformAd (data) {
      return this.beautyOtcAd(data)
    },
    transformTraderInfo (data) {
      data.user.registeredDate = this.$moment(data.user.createdAt).format('YYYY-MM-DD')
      data.user.shortTxt = data.user.nickname ? data.user.nickname.substring(0, 1).toUpperCase() : ''
      let temp = {
        data: {
          Buy: [],
          Sell: []
        },
        user: data.user
      }
      if (!data || !data.ads || !data.ads.length) return temp
      data.ads.forEach(element => {
        this.transformAd(element)
      })
      return { user: data.user, data: _.groupBy(data.ads, 'type') }
    },
    transformAds (data) {
      if (!data || !data.data || !data.data.length) {
        return {
          data: []
        }
      }
      data.data.forEach(element => {
        this.beautyOtcAd(element)
        element.shortTxt = element.nickname ? element.nickname.substring(0, 1) : ''
        element.beautyUpdatedAt = this.$moment(element.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        element.color = Math.floor(Math.random() * 10) + 1
      })
      return data
    },

    calculateFloatPrice (marketPrice, price, type) {
      if (!price) return this.numberWithCommas(marketPrice)
      let basePrice = type.toLocaleLowerCase() === Constant.OTC_TYPE.BUY.toLocaleLowerCase() ? -1 : 1
      let rate = (100 + (price * basePrice)) / 100
      let result = new BigNumber(marketPrice).multipliedBy(rate).decimalPlaces(Constant.OTC.OTC_FIAT_PRECISION).toNumber()
      return result
    },
    calculateMaxLimitPrice (price, floatPrice, available, type) {
      if (!price || !available) return 0
      let basePrice = type.toLocaleLowerCase() === Constant.OTC.PRICE_TYPE.FIXED.toLocaleLowerCase() ? price : floatPrice
      return new BigNumber(basePrice * available).decimalPlaces(2).toNumber()
    },
    transformUserPayment (data) {
      data.forEach(element => {
        element.isOn = false
      })
      return data
    },
    transformOtcWalletPairs (data) {
      if (!data || !data.length) return data
      data.forEach(element => {
        element.imageUrl = '/assets/images/crypto-icon/' + element.coinCode.toLocaleLowerCase() + '.svg'
        element.name = element.coinName
        element.id = element.coinCode
        element.symbol = element.coinCode
        // element.allowTransferOutFiat = true
        element.beautyBalanceOtc = this.beautyAmount(element.balanceFiat, element.numberDecimal)
        element.beautyBalanceOtcFrozen = this.beautyAmount(element.balanceFiatFrozen, element.numberDecimal)
        element.beautyBalancePrimary = this.beautyAmount(element.balancePrimary, element.numberDecimal)
      })
      return data
    },
    transformOtcBalancesHistory (data) {
      console.log(data)
      if (!data || !data.length) return data
      data.forEach(element => {
        element.beautyDate = this.$moment(element.createdAt).utc().local().format('YYYY-MM-DD HH:mm')
        element.beautyType = this.mapTransactionType(element.transactionType)
      })
      return data
    },
    transformOtcTransactionHistory (data) {
      console.log(data)
      if (!data || !data.length) return data
      data.forEach(element => {
        element.beautyDate = this.$moment(element.createdAt).utc().local().format('YYYY-MM-DD HH:mm')
        element.beautyType = this.mapTransactionType(element.transactionType)
        element.beautyAmount = this.beautyAmount(element.totalCoin, 4)
      })
      return data
    },
    transformFiat (data) {
      if (!data || !data.length) return []
      data.forEach(temp => {
        temp.symbol = Constant.FIAT_OBJ[temp.code] || ''
      })
      return data
    },
    validatePassword (pw) {
      let regex = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*&])\S{8,20}$/
      return !regex.test(pw)
    }
  }
})
