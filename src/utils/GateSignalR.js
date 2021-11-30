/* eslint-disable */
import CONSTANT from '@/configs/constant'
import Vue from 'vue'
import store from '@/store/index'
import i18n from '@/plugin/i18n'
const signalR = require('@aspnet/signalr')

export default function gateSignalR () {
  var invoke = (method, ...args) => {
    if (vm._state !== vm.STATE.OPEN) {
      return
    }
    if (args && args.length > 0) {
      return vm._connection.invoke(method, args)
    } else {
      return vm._connection.invoke(method)
    }
  }

  var vm = {
    STATE: {
      NORMAL: 0,
      OPEN: 1,
      NEGOTIATE: 2,
      RECONNECTING: 3,
      ERROR: 4,
      DISCONNECT: 5,
      CLOSE: 6
    },
    METHOD: {
      _HUB_CONNECTED: '_HUB_CONNECTED',
      _HUB_DISCONNECTED: '_HUB_DISCONNECTED',
      _HUB_PING_PONG: '_HUB_PING_PONG',
      _HUB_NOTIFY_MESSAGE: '_HUB_NOTIFY_MESSAGE',
      _HUB_NOTIFY_RATE_CHANGE: '_HUB_NOTIFY_RATE_CHANGE',
      _HUB_NOTIFY_USER_CHANGED: '_HUB_NOTIFY_USER_CHANGED',
      _HUB_NOTIFY_WALLET_CHANGED: '_HUB_NOTIFY_WALLET_CHANGED',
      _HUB_UPDATE_ONLINE_USER_LIST: CONSTANT.OTC.SOCKET_METHODS._HUB_UPDATE_ONLINE_USER_LIST,
      _HUB_SHOW_OTC_NOTIFICATION: CONSTANT.OTC.SOCKET_METHODS._HUB_SHOW_OTC_NOTIFICATION
    },
    _eventName: '',
    _isReconnectFirst: !1,
    _reconnectCount: 0,
    _isReconnect: !0,
    _negotiateUrl: '',
    _cookie: '',
    _connection: {},
    _isClosed: !1,
    _isFullMsg: !1,
    _timer: 0,
    _state: 0,
    _lastTime: 0,
    _timePingPong: 10,
    _isNotify: !0,
    // methods
    init: () => {
      vm._isNotify = !0
      vm._lastTime = 0
      vm._isReconnect = !0
      vm._isClosed = !1
      vm._listPings = []
      vm._state = vm.STATE.NORMAL
    },
    connect: (evtName, negotiateUrl, tokenJwt) => {
      console.log(evtName, negotiateUrl, ' connect params')
      return new Promise((resolve, reject) => {
        var t = vm
        t._eventName = evtName
        t._cookie = tokenJwt
        t._negotiateUrl = negotiateUrl
        let protocol = new signalR.JsonHubProtocol()
        var options = {}
        options.transport = signalR.HttpTransportType['WebSockets']
        options.accessTokenFactory = () => {
          return t._cookie
        }
        t._connection = new signalR.HubConnectionBuilder()
          .withUrl(t._negotiateUrl, options)
          .withHubProtocol(protocol)
          .build()
        // listen event
        t._connection.on('Send', function (msg) {
          t.dispatchCustomEvent(msg)
        })
        function start () {
          t._connection.start()
            .then(function () {
              t._state !== t.STATE.OPEN && (
                clearInterval(t._timer),
                t._timer = setInterval(function () {
                  vm.timer()
                },
                  1E3 * t._timePingPong),
                t._listPings = [],
                t._index = 0,
                t._lastTime = 0,
                t._isReconnect = !0,
                t._openParenthesis = 0,
                t._closeParenthesis = 0,
                t._currentData = '',
                t._isClosed = !1,
                t._state = t.STATE.OPEN,
                t._reconnectCount = 0,
                resolve(true),
                console.log('resolve true as callback', t._state)
              )
            })
            .catch(function (err) {
              t._state = t.STATE.ERROR
              if (t._reconnectCount < 5) {
                t._reconnectCount++
                setTimeout(() => start(), 5000)
              }
              else {
                t._state = t.STATE.DISCONNECT
              }
            })
        }
        vm._connection.onclose((e) => {
          t._isClosed ? t._isClosed = !1 : (
            t._state = t.STATE.DISCONNECT
          )
        })
        //
        setTimeout(() => {
          start()
        }, 100)
      })
    },
    close: () => {
      if (vm._connection) {
        vm._connection.stop()
      }
      clearInterval(vm._timer)
      vm._isReconnect = !1
      vm._isClosed = !0
      vm._state = vm.STATE.CLOSE
    },
    dispatchCustomEvent: (msg) => {
      var notify = JSON.parse(msg)
      switch (notify.method) {
        case vm.METHOD._HUB_SHOW_OTC_NOTIFICATION:
          let orderNotify = JSON.parse(notify.message)
          store.dispatch('addOtcNotifications', orderNotify)
          //console.log(orderNotify, 'check order notification')
          break
        case vm.METHOD._HUB_UPDATE_ONLINE_USER_LIST: 
          store.dispatch('setOnlineUsers', JSON.parse(notify.message))
          break
        case vm.METHOD._HUB_NOTIFY_MESSAGE: {
          store.dispatch('showErrorMsg', i18n.t(notify.message))
          break
        }
        case vm.METHOD._HUB_NOTIFY_USER_CHANGED: {
          // reload user info
          store.dispatch('GetUserInfo')
          // reload binary tree
          store.dispatch('getBinaryDataByUser', store.state.user.historyData[length - 1])
          // reload family tree
          store.dispatch('GetUserRefferal')
          store.dispatch('showErrorMsg', i18n.t(notify.message))
          break
        }
        case vm.METHOD._HUB_NOTIFY_RATE_CHANGE: {
          store.dispatch('showErrorMsg', i18n.t(notify.message))
          store.dispatch('GetWalletInfo')
          break
        }
        case vm.METHOD._HUB_NOTIFY_WALLET_CHANGED: {
          store.dispatch('showErrorMsg', i18n.t(notify.message))
          store.dispatch('GetWalletInfo')
          break
        }
      }
    },
    send: (method, msg) => {
      console.log(method,msg)
      invoke(method, msg)
    },
    timer: () => {
      var t = vm
      t._state == t.STATE.DISCONNECT || t._state === t.STATE.CLOSE ?
        (clearInterval(t._timer), t._listPings = [])
        :
        0 < t._lastTime && 6E4 <= (new Date).getTime() - t._lastTime && t._state != t.STATE.OPEN ?
          (t._lastTime = 0, t._state = t.STATE.DISCONNECT)
          :
          vm.send('PingPong', 'Ping')
    }
  }

  return vm
}
// export default vm