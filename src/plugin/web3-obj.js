import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import store from '@/store'

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
        },
        network: 'binance',
        qrcodeModalOptions: {
          mobileLinks: [
            'metamask',
            'trust',
            'imtoken',
            'safepal',
            'rainbow',
            'argent',
            'pillar'
          ]
        }
      }
    }
  }
})
// let storeKeyName = 'web3obj-web3'
let web3 = null

export default {
  get () {
    if (!web3) {
      return this.connect()
    }
    return new Promise(resolve => {
      resolve(web3)
    })
  },
  connect () {
    return new Promise(async (resolve, reject) => {
      // Check for injected web3 (mist/metamask)
      // var web3js = window.web3
      // if (typeof web3js !== 'undefined') {
      //   var web3 = new Web3(web3js.currentProvider)
      //   console.log('---------> web3', web3)
      //   resolve({
      //     currentProvider: web3.currentProvider,
      //     eth: web3.eth
      //   })
      // } else {
      try {
        var web3Provider = await web3Modal.connect()
        web3 = new Web3(web3Provider)
        // add events
        web3Provider.on('close', () => {
          store.dispatch('startDisconnectWalletProcess', true)
        })
        web3Provider.on('disconnect', () => {
          store.dispatch('startDisconnectWalletProcess', true)
        })
        web3Provider.on('accountsChanged', async accounts => {
          store.dispatch('startDisconnectWalletProcess', true)
        })
        web3Provider.on('chainChanged', async chainId => {
          store.dispatch('startDisconnectWalletProcess', true)
        })
        web3Provider.on('networkChanged', async networkId => {
          store.dispatch('startDisconnectWalletProcess', true)
        })

        // resolve
        resolve(web3)
      } catch {
        reject(new Error('Unable to connect to Metamask'))
      }
    })
  },
  async signTrans () {
    var web3Provider = await web3Modal.connect()
    web3 = new Web3(web3Provider)
    var tx = {
      from: '0x8Bae1b07763A2c4B0f014df36D65a43e9795B511',
      to: '0x5d80D191a7A1f7cB66b85f0003edC254c38F698A',
      value: web3.utils.toWei('1', 'ether')
    }
    web3.eth.signTransaction(tx).then(console.log)
  },
  async disconnect () {
    return new Promise(async resolve => {
      if (!web3) await this.connect()
      if (web3) {
        if (web3.currentProvider && web3.currentProvider.close) {
          await web3.currentProvider.close()
        }

        if (web3.currentProvider && web3.currentProvider.clearCachedProvider) {
          await web3.currentProvider.clearCachedProvider()
        }

        // unset provider
        web3.eth.setProvider(null)
      }

      // clear web3Modal cache
      web3Modal.clearCachedProvider()
      web3 = null

      resolve()
    })
  }
}
