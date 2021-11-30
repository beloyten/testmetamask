// Authentication
import AuthLayout from '@/views/layout/AuthLayout'
import SSOLogin from '@/views/auth/SSOLogin'
import Login from '@/views/auth/Login'
import Signup from '@/views/auth/Signup'
import ForgotPassword from '@/views/auth/ForgotPassword'
const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'callback',
        component: SSOLogin,
        name: 'auth-callback',
        meta: {
          title: 'ROUTE_BUY_CRYPTO'
        }
      }
    ]
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Login,
        name: 'login',
        meta: {
          title: 'Login'
        }
      }
    ]
  },
  {
    path: '/signup',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Signup,
        name: 'signup',
        meta: {
          title: 'Signup'
        }
      }
    ]
  },
  {
    path: '/forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: ForgotPassword,
        name: 'ForgotPassword',
        meta: {
          title: 'ForgotPassword'
        }
      }
    ]
  }
]
export default routes
