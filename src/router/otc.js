// Layout
import OtcLayout from '@/views/layout/OtcLayout'
import OtcTrade from '@/views/otc/OtcTrade'
import OtcFollowers from '@/views/otc/OtcFollowers'
import OtcOrders from '@/views/otc/OtcOrders'
import OtcPaymentSettings from '@/views/otc/OtcPaymentSettings'
import OtcTrader from '@/views/otc/OtcTrader'
import OtcAds from '@/views/otc/OtcAds'
import OtcCreateAd from '@/views/otc/OtcCreateAd'
import OtcTradeInfo from '@/views/otc/OtcTradeInfo'
import OtcVerification from '@/views/otc/OtcKyc'
import OtcMyAds from '@/views/otc/OtcMyAds'
import OtcMyOrders from '@/views/otc/OtcMyOrders'
import OtcSetting from '@/views/otc/OtcSetting'
import OtcFollowing from '@/views/otc/OtcFollowing'
import OtcCreateAds from '@/views/otc/OtcCreateAds'
import OtcSetupAccount from '@/views/otc/OtcSetupAccount'

const routes = [
  // Routing with user layout
  {
    path: '/otc',
    component: OtcLayout,
    children: [
      {
        path: 'trade/:type_pair',
        component: OtcTrade,
        name: 'otc-trade',
        meta: {
          title: 'ROUTE_BUY_CRYPTO'
        }
      },
      {
        path: 'followers',
        component: OtcFollowers,
        name: 'otc-followers',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'trader',
        component: OtcTrader,
        name: 'otc-trader',
        meta: {
          title: 'ROUTE_BUY_CRYPTO'
        }
      },
      {
        path: 'verification',
        component: OtcVerification,
        name: 'otc-verification',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'payment-settings',
        component: OtcPaymentSettings,
        name: 'otc-payment-settings',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'ads',
        component: OtcAds,
        name: 'otc-ads',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'update-ad',
        component: OtcCreateAds,
        name: 'otc-update-ad',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'orders',
        component: OtcOrders,
        name: 'otc-orders',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'create-ad',
        component: OtcCreateAd,
        name: 'otc-create-ad',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'tradeinfo',
        component: OtcTradeInfo,
        name: 'otc-tradeinfo',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'my-ads',
        component: OtcMyAds,
        name: 'otc-my-ads',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'my-orders',
        component: OtcMyOrders,
        name: 'otc-my-orders',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'otc-setting',
        component: OtcSetting,
        name: 'otc-setting',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'otc-following',
        component: OtcFollowing,
        name: 'otc-following',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'post-new-ad',
        component: OtcCreateAds,
        name: 'post-new-ad',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      },
      {
        path: 'setup-account',
        component: OtcSetupAccount,
        name: 'setup-account',
        meta: {
          title: 'ROUTE_BUY_CRYPTO',
          requiresAuth: true
        }
      }
    ],
    meta: {
      requiresAuth: false
    }
  }
]
export default routes
