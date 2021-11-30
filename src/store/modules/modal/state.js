
const state = {
  isShowDepositExchangeWallet: false,
  isShowTransferExchangeWallet: false,
  isShowEnableTelegram: false,
  isShowSecurityConfirm: false,
  isShowUpdateAPIKeyForm: false,
  isShowSecretKeyForm: false,
  isShowLogoutTelegramGuide: false,
  resetCreateApiKeyFormNotify: 0,
  isShowOtcFundPassForm: false,
  isShowConfirmModal: false,
  isShowUserConnectFormModal: false,
  startConnectWalletProcess: false,
  startDisconnectWalletProcess: false,
  isShowConfirmFundPasswordModal: false,
  isShowOtcPaymentMethod: false,
  modalData: {
    action: '',
    newObject: null
  },
  modalExchangeData: {},
  isShowDisputeOtcModal: false,
  destinationRouteData: ''
}
const getters = {
  isShowDepositExchangeWallet: state => state.isShowDepositExchangeWallet,
  isShowTransferExchangeWallet: state => state.isShowTransferExchangeWallet,
  isShowEnableTelegram: state => state.isShowEnableTelegram,
  isShowSecurityConfirm: state => state.isShowSecurityConfirm,
  isShowUpdateAPIKeyForm: state => state.isShowUpdateAPIKeyForm,
  isShowSecretKeyForm: state => state.isShowSecretKeyForm,
  isShowLogoutTelegramGuide: state => state.isShowLogoutTelegramGuide,
  modalData: state => state.modalData,
  resetCreateApiKeyFormNotify: state => state.resetCreateApiKeyFormNotify,
  modalExchangeData: state => state.modalExchangeData,
  isShowOtcFundPassForm: state => state.isShowOtcFundPassForm,
  isShowOtcPaymentMethod: state => state.isShowOtcPaymentMethod,
  isShowConfirmFundPasswordModal: state => state.isShowConfirmFundPasswordModal,
  isShowConfirmModal: state => state.isShowConfirmModal,
  startConnectWalletProcess: state => state.startConnectWalletProcess,
  startDisconnectWalletProcess: state => state.startDisconnectWalletProcess,
  isShowUserConnectFormModal: state => state.isShowUserConnectFormModal,
  isShowDisputeOtcModal: state => state.isShowDisputeOtcModal,
  destinationRoute: state => state.destinationRouteData
}
const mutations = {
  TOGGLE_DEPOSIT_EXCHANGE_WALLET_FORM: (state) => {
    state.isShowDepositExchangeWallet = !state.isShowDepositExchangeWallet
  },
  TOGGLE_TRANSFER_EXCHANGE_WALLET_FORM: (state) => {
    state.isShowTransferExchangeWallet = !state.isShowTransferExchangeWallet
  },
  TOGGLE_SECURITY_CONFIRM: (state) => {
    state.isShowSecurityConfirm = !state.isShowSecurityConfirm
  },
  TOGGLE_ENABLE_TELEGRAM: (state) => {
    state.isShowEnableTelegram = !state.isShowEnableTelegram
  },
  TOGGLE_UPDATE_API_KEY: (state) => {
    state.isShowUpdateAPIKeyForm = !state.isShowUpdateAPIKeyForm
  },
  TOGGLE_API_SECRET_KEY: (state) => {
    state.isShowSecretKeyForm = !state.isShowSecretKeyForm
  },
  TOGGLE_LOGOUT_TELEGRAM: (state) => {
    state.isShowLogoutTelegramGuide = !state.isShowLogoutTelegramGuide
  },
  TOGGLE_OTC_FUND_PASSWORD: (state) => {
    state.isShowOtcFundPassForm = !state.isShowOtcFundPassForm
  },
  TOGGLE_OTC_PAYMENT_METHOD: (state) => {
    state.isShowOtcPaymentMethod = !state.isShowOtcPaymentMethod
  },
  TOGGLE_SHOW_VUEX_CONFIRM_MODAL: (state, data) => {
    state.isShowConfirmModal = data
  },
  TOGGLE_SHOW_VUEX_FUND_PASS_MODAL: (state) => {
    state.isShowConfirmFundPasswordModal = !state.isShowConfirmFundPasswordModal
  },
  SET_START_CONNECT_WALLET_PROCESS: (state, data) => {
    state.startConnectWalletProcess = data
  },
  SET_START_DISCONNECT_WALLET_PROCESS: (state, data) => {
    state.startDisconnectWalletProcess = data
  },
  TOGGLE_SHOW_USER_CONNECT_FORM_MODAL: (state) => {
    state.isShowUserConnectFormModal = !state.isShowUserConnectFormModal
  },
  CLOSE_ALL_MODAL: (state) => {
    state.isShowEnableTelegram = false
    state.isShowSecurityConfirm = false
    state.isShowUpdateAPIKeyForm = false
    state.isShowSecretKeyForm = false
    state.isShowTransferExchangeWallet = false
    state.isShowDepositExchangeWallet = false
    state.isShowLogoutTelegramGuide = false
    state.isShowOtcFundPassForm = false
    state.isShowOtcPaymentMethod = false
    state.isShowConfirmModal = false
    state.isShowUserConnectFormModal = false
    state.isShowConfirmFundPasswordModal = false
    state.isShowDisputeOtcModal = false
  },
  SET_CONFIRM_MODAL_DATA: (state, data) => {
    state.modalData = data
  },
  SET_RESET_CREATE_API_KEY: (state) => {
    state.resetCreateApiKeyFormNotify++
  },
  SET_EXCHANGE_WALLET_MODAL_DATA: (state, data) => {
    state.modalExchangeData = data
  },
  TOGGLE_SHOW_DISPUTE_OTC_MODAL: (state) => {
    state.isShowDisputeOtcModal = !state.isShowDisputeOtcModal
  },
  SET_REDIRECTION_ROUTE_DATA: (state, data) => {
    state.destinationRouteData = data
  }
}

export default { state, getters, mutations }
