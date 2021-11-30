export default {
  data () {
    return {
      title: ''
    }
  },
  computed: {
    configs () {
      return this.$store.getters.configs
    }
  },
  methods: {
    setTitle: function () {
      let title = ''
      if (this.configs) {
        title = this.configs.siteNameOtc
      }
      if (this.$route && this.$route.meta && this.$route.meta.title) {
        document.title = '' + this.$t(this.$route.meta.title) + ' | ' + title
      }
    }
  },
  watch: {
    '$route' () {
      this.setTitle()
    }
  }
}
