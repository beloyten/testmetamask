// Layout
// import UserLayout from '@/views/layout/UserLayout'
import OtcLayout from '@/views/layout/OtcLayout'
// Wallet
import WalletOtc from '@/views/wallet/OtcAccountWallet'
const routes = [
  {
    path: '/wallet',
    component: OtcLayout,
    children: [
      {
        path: '/',
        component: WalletOtc,
        name: 'otc-account-wallet',
        meta: {
          title: 'ROUTE_WALLET'
        }
      }
    ],
    meta: {
      requiresAuth: true
    }
  }
]
export default routes
