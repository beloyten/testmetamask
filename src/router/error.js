import ErrorLayout from '@/views/layout/ErrorLayout'
import InactiveUser from '@/views/error/InactiveUser'
// Error page
import PageNotFound from '@/views/error/PageNotFound'
import OtcLayout from '@/views/layout/OtcLayout'

const routes = [
  {
    path: '/404',
    component: OtcLayout,
    children: [
      {
        path: '',
        component: PageNotFound,
        name: '404',
        meta: {
          title: 'ROUTE_ERROR_404'
        }
      }
    ]
  },
  {
    path: '/inactive-user',
    component: ErrorLayout,
    children: [
      {
        path: '',
        component: InactiveUser,
        name: 'inactive-user',
        meta: {
          title: 'MSG_USER_INACTIVE'
        }
      }
    ]
  },
  {
    path: '/index.html', redirect: '/'
  },
  {
    path: '*', redirect: '/404'
  }
]
export default routes
