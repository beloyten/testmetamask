import Profile from '@/views/user/Profile'
import ChangePassword from '@/views/user/ChangePassword'
import OtcLayout from '@/views/layout/OtcLayout'

const routes = [
  {
    path: '/profile',
    component: OtcLayout,
    children: [
      {
        path: '',
        component: Profile,
        name: 'profile',
        meta: {
          title: ''
        }
      }
    ]
  },
  {
    path: '/change-password',
    component: OtcLayout,
    children: [
      {
        path: '',
        component: ChangePassword,
        name: 'change-password',
        meta: {
          title: ''
        }
      }
    ]
  }
]
export default routes
