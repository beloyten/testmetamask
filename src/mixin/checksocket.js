export default {
  data () {
    return {
      hidden: null
    }
  },
  computed: {
    lastSocketDataReceiveTime () {
      return this.$store.getters.lastSocketDataReceiveTime
    },
    countUnsubcribeComponent () {
      return this.$store.getters.countUnsubcribeComponent
    }
  },
  watch: {
    countUnsubcribeComponent (val) {
      if (val === 2) {
        // Reset socket and re subcribe
        this.$store.dispatch('resetSocket', true)
      }
    }
  },
  mounted () {
    // Set the name of the hidden property and the change event for visibility
    let visibilityChange
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      this.hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      this.hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      this.hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === 'undefined' || this.hidden === undefined) {
      console.log('This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.')
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, this.handleVisibilityChange, false)
    }
  },
  methods: {
    handleVisibilityChange () {
      if (!document[this.hidden]) {
        this.checkDataTimer()
      }
    },
    checkDataTimer () {
      let reFocusTime = new Date().getTime()
      setTimeout(() => {
        let isSocketAlive = this.lastSocketDataReceiveTime > reFocusTime
        console.log(isSocketAlive ? 'Socket is alive' : 'Socket is dead')
        if (!isSocketAlive) {
          this.reconnectSocket()
        }
      }, 3000)
    },
    reconnectSocket () {
      this.$store.dispatch('setForceReconnectSocket')
      this.$store.dispatch('resetIsForceSubcribeTopic')
      this.$store.dispatch('resetCountUnsubcribeComponent')
      setTimeout(() => {
        this.$store.dispatch('setForceReconnectSocket')
      }, 500)
    }
  }
}
