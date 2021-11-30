
import OtcService from '@/api/otc/OtcService'
const userState = {
  state: {
    onlineList: []
  },
  getters: {
    onlineList: state => state.onlineList
  },
  mutations: {
    SET_ONLINE_LIST: (state, data) => {
      state.onlineList = data
      console.log(data)
    }
  },
  actions: {
    setOnlineList ({ commit }, data) {
      commit('SET_ONLINE_LIST', data)
    },
    setUserState ({ commit }, data) {
      OtcService.updateOnlineOffline(data).then(rs => {
        console.log(rs)
      })
    }
  }
}

export default userState
