const actions = {
  setExchangeWalletModalData ({ commit }, data) {
    commit('SET_EXCHANGE_WALLET_MODAL_DATA', data)
  },
  toggleDepositWalletExchange ({ commit }, modalData) {
    commit('TOGGLE_DEPOSIT_EXCHANGE_WALLET_FORM')
    modalData && commit('SET_EXCHANGE_WALLET_MODAL_DATA', modalData)
  },
  toggleTransferWalletExchange ({ commit }, modalData) {
    commit('TOGGLE_TRANSFER_EXCHANGE_WALLET_FORM')
    modalData && commit('SET_EXCHANGE_WALLET_MODAL_DATA', modalData)
  },
  toggleSecurityConfirm ({ commit }, modalData) {
    commit('TOGGLE_SECURITY_CONFIRM')
    modalData && this.dispatch('setConfirmModalData', modalData)
  },
  toggleOtcFundPasswordForm ({ commit }) {
    commit('TOGGLE_OTC_FUND_PASSWORD')
  },
  toggleOtcPaymentMethod ({ commit }) {
    commit('TOGGLE_OTC_PAYMENT_METHOD')
  },
  toggleConfirmFundPasswordModal ({ commit }, modalData) {
    commit('TOGGLE_SHOW_VUEX_FUND_PASS_MODAL')
    modalData && this.dispatch('setConfirmModalData', modalData)
  },
  toggleConfirmModal ({ commit, dispatch }, modalData) {
    if (!modalData || modalData === false) {
      commit('TOGGLE_SHOW_VUEX_CONFIRM_MODAL', false)
    } else if (modalData === true) {
      commit('TOGGLE_SHOW_VUEX_CONFIRM_MODAL', true)
    } else {
      commit('TOGGLE_SHOW_VUEX_CONFIRM_MODAL', true)
      modalData && dispatch('setConfirmModalData', modalData)
    }
  },
  startConnectWalletProcess ({ commit }, data) {
    commit('SET_START_CONNECT_WALLET_PROCESS', data)
  },
  startDisconnectWalletProcess ({ commit }, data) {
    commit('SET_START_DISCONNECT_WALLET_PROCESS', data)
  },
  toggleUserConnectFormModal ({ commit, dispatch }, modalData) {
    commit('TOGGLE_SHOW_USER_CONNECT_FORM_MODAL')
    modalData && dispatch('setConfirmModalData', modalData)
  },
  toggleEnableTelegram ({ commit }) {
    commit('TOGGLE_ENABLE_TELEGRAM')
  },
  toggleUpdateAPIKey ({ commit }) {
    commit('TOGGLE_UPDATE_API_KEY')
  },
  toggleAPISecretKey ({ commit }) {
    commit('TOGGLE_API_SECRET_KEY')
  },
  closeAllModal ({ commit }) {
    commit('CLOSE_ALL_MODAL')
  },
  setConfirmModalData ({ commit }, data) {
    commit('SET_CONFIRM_MODAL_DATA', data)
  },
  setResetCreateApiFormNotify ({ commit }) {
    commit('SET_RESET_CREATE_API_KEY')
  },
  toggleLogoutTelegramGuide ({ commit }) {
    commit('TOGGLE_LOGOUT_TELEGRAM')
  },
  toggleShowDisputeOtcModal ({ commit }, modalData) {
    commit('TOGGLE_SHOW_DISPUTE_OTC_MODAL')
    modalData && this.dispatch('setConfirmModalData', modalData)
  },
  redirectToDestinationRoute ({ commit }, routeData) {
    commit('SET_REDIRECTION_ROUTE_DATA', routeData)
  }
}
export default { actions }
