const state = {
  state: {
    wallets: [],
    transactions: [],
    exWallets: []
  },
  getters: {
    wallets: state => state.wallets,
    transactions: state => state.transactions,
    exWallets: state => state.exWallets
  },
  mutations: {
    SET_WALLET: (state, data) => { state.wallets = data },
    SET_TRANSACTION: (state, data) => { state.transactions = data },
    SET_EXCHANGE_WALLETS: (state, data) => {
      state.exWallets = data
    }
  }
}

export default state
