export default {
  // Response Status
  SUCCESS: 'Success',
  ERROR: 'Error',
  // Error code
  UNAUTHORIZED_CODE: 403,
  INVALID_TOKEN: 401,
  INVALID_ROLE: 409,
  INACTIVE_USER: 303,
  // exchange
  DEFAULT_PAIR: 'btc_usdt',
  EXCHANGE: {
    BALANCE_PRECISION_DECIMAL: 6,
    REFRESH_TIME: 3000,
    WALLET_BALANCE_RF_TIME: 10000
  },
  // localStorage
  THEME: 'Theme::Mode',
  EX_LIST_PAIRS: 'Ex:List-Pairs',
  TV_RESOLUTION: 'Tv:Resolution',
  CACHE_TIME_EXPIRED: 'Cache:ExpiredTime',
  CACHE_TIME: 5, // minutes
  LAYOUT_STYLE: 'EX:Layout-Style',
  // socket topic
  MARKET_OVERVIEW: 'market.overview',
  // domain
  DOMAIN: 'Timebit',

  JWT: 'jwt',
  IS_LOGGED: 'Auth:IsLogged',
  // Login next action
  AFTER_LOGIN_ACTION: {
    VERIFY_2FA: 'VERIFY_2FA'
  },
  // Default decimal number
  BIG_DECIMAL_NUMBER: 100000000,
  // Kyc status
  KYC_STATUS: {
    NONE: 0,
    PENDING: 1,
    REJECTED: -1,
    VERIFIED: 2
  },
  DECIMAL_PLACES: 8,
  BASE_COLOR: '#071435',
  MAX_IMAGE_FILE: 2,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NUMBER: 1,
  REMEMBER: 'Auth:RememberAuth',
  RECAPTCHA: {
    VERIFICATION: 'Verification',
    CONFIRM_SECURITY: 'ConfirmSecurity',
    CONFIRM_LINK_PHONE: 'ConfirmLinkPhone',
    CONFIRM_LINK_2FA: 'ConfirmLinkGa',
    CONFIRM_RESET_PASSWORD: 'ResetPassword',
    CROWD: 'CROW',
    OTC_CREATE_PAYMENT: 'CreatePaymentMethod',
    OTC_CREATE_AD: 'CreateOtcAd',
    OTC_TRANSFER: 'OtcTransfer',
    OTC_CREATE_ORDER: 'OtcCreateOrder',
    EXCHANGE_TRANSFER: 'ExchangeTransfer',
    DELETE_ACCOUNT: 'DeleteAccount'
  },
  SECURITY: {
    RESET_PASSWORD: 'RESET_PASSWORD',
    TURN_ON_2FA: 'TURN_ON_2FA',
    TURN_OFF_2FA: 'TURN_OFF_2FA',
    RESET_2FA: 'RESET_2FA',
    LINK_2FA: 'LINK_2FA',
    TURN_ON_PHONE: 'TURN_ON_PHONE',
    TURN_OFF_PHONE: 'TURN_OFF_PHONE',
    CHANGE_PHONE: 'CHANGE_PHONE',
    LINK_PHONE: 'LINK_PHONE',
    TURN_ON_TELEGRAM: 'TURN_ON_TELEGRAM',
    TURN_OFF_TELEGRAM: 'TURN_OFF_TELEGRAM',
    CHANGE_TELEGRAM: 'CHANGE_TELEGRAM',
    RESET_TELEGRAM: 'RESET_TELEGRAM',
    WITHDRAW: 'WITHDRAW',
    SWAP: 'SWAP',
    TRANSFER: 'TRANSFER',
    CREATE_API_KEY: 'CREATE_API_KEY',
    DELETE_API_KEY: 'DELETE_API_KEY',
    UPDATE_API_KEY: 'UPDATE_API_KEY'
  },
  SEND_CODE: {
    EMAIL: 'EMAIL',
    PHONE: 'PHONE',
    TELEGRAM: 'TELEGRAM'
  },
  // Socket prefix and suffix
  SOCKET_TOPIC_CANDLE_PREFIX: 'cloud.candle.',
  SOCKET_TOPIC_ORDER_BOOK_SUFFIX: '-cloud-orderbook',
  SOCKET_TOPIC_TOP_100_SUFFIX: '-cloud-tx-top100',
  SOCKET_TOPIC_OVERVIEW: 'market.overview',
  SOCKET_TOPIC_DEPTH_SUFFIX: '-cloud-depth',

  // Fee withdraw type
  FEE_TYPE: {
    PERCENT: 'percent',
    FIXED: 'fix',
    NONE: 'none'
  },
  MAX_SMS_LENGTH: 12,
  V2: '6Le2n74UAAAAAGSpyQ2D71cXAdnZUtR3X_MzWcMh',
  MAX_IMAGE_SIZE: 5242880,
  PUBLIC_API: [
    '/api/v1/auth/token',
    '/api/v1/auth/check-verification',
    '/api/v1/auth/send-verification',
    '/api/v1/auth/reset-password',
    '/api/v1/auth/resend-activation-code',
    '/api/v1/auth/request-forgot-password',
    '/api/v1/auth/user-refresh-token',
    '/api/v1/auth/refresh-token',
    '/api/v1/auth/user-activation-code',
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/v1/auth/login-switch',
    '/api/v1/auth/login-2fa',
    '/api/v1/currency/',
    '/api/v1/fee/list-fee',
    '/api/v1/order/limit-order',
    '/api/v1/system/system-config',
    '/api/v1/ticker/'
  ],
  OTC_TYPE: {
    BUY: 'Buy',
    SELL: 'Sell'
  },
  OTC_STEP: {
    CREATED: 'Created',
    PAID: 'Paid',
    CONFIRMED: 'Confirmed',
    DISPUTE: 'Complain',
    CANCELLED: 'Cancelled',
    RELEASED: 'Released'
  },
  OTC: {
    IS_ENABLE_ADS_CHECK_KYC: true,
    ORDER_FORM_OPEN_TIME: 30000,
    SOCKET_METHODS: {
      _HUB_UPDATE_ONLINE_USER_LIST: '_HUB_UPDATE_ONLINE_USER_LIST',
      _HUB_SHOW_OTC_NOTIFICATION: '_HUB_SHOW_OTC_NOTIFICATION',
      _I_AM_ONLINE: 'IAmOnline'
    },
    KYC_STATUS: {
      NONE: 0,
      PENDING: 1,
      APPROVE: 2,
      REJECT: -1
    },
    MAX_IMAGES_UPLOAD: 2,
    COMPLAIN_TYPE: {
      SELLER: 'Seller',
      BUYER: 'Buyer'
    },
    LIMIT_PAYMENT_METHOD: 3,
    DISPUTE_TIME: 5,
    OTC_FIAT_PRECISION: 2,
    COIN_PRECISION: 6,
    MIN_LIMIT: 15,
    ADS_PRICE: [
      { name: 'TEXT_FLOAT_PRICE', id: 'Float' },
      { name: 'TEXT_FIXED_PRICE', id: 'Fixed' }
    ],
    ADS_TYPE: [
      { name: 'BTN_BUY', id: 'Buy' },
      { name: 'BTN_SELL', id: 'Sell' }
    ],
    PERCENT_FLOAT: 30,
    PAYMENT_WINDOW: {
      min: 10,
      max: 20
    },
    REFRESH_TIME: 10000,
    PRICE_TYPE: {
      FIXED: 'Fixed',
      FLOAT: 'Float'
    },
    ORDER_TYPES: [
      {
        name: 'PROCESSING',
        id: 'processing',
        img: '/assets/images/processing.png'
      },
      {
        name: 'COMPLETED',
        id: 'completed',
        img: '/assets/images/complete.png'
      },
      {
        name: 'CANCELLED',
        id: 'cancelled',
        img: '/assets/images/cancel.png'
      },
      {
        name: 'ALL',
        id: ''
      }
    ]
  },
  LANGUAGE_LINK: 'https://language.romaniex.com',
  EXTERNAL_PATH: {
    EXCHANGE_PATH: '/pair/btc_usdt',
    MARKET_PATH: '/market',
    MAIN_ACCOUNT_PATH: '/wallet/balance',
    REGISTER: '/Account/Register',
    CHANGEPASS: '/Manage/ChangePassword',
    PROFILE: '/Account/Profile'
  },
  FIAT_OBJ: {
    KRW: '₩',
    USD: '$',
    SGD: '$',
    INR: '₹',
    VND: '₫',
    CAD: '$',
    CNY: '¥'
  }
}
