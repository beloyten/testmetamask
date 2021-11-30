const userState = {
  computed: {
    onlineUsers () {
      return this.$store.getters.onlineUsers
    }
  },
  methods: {
    checkIsOnline (inviteCode) {
      let result = this.onlineUsers.find(temp => {
        return temp.inviteCode === inviteCode
      })
      return result
    }
  }
}
export default userState
