import AuthLayout from '@/views/layout/AuthLayout'
import OtcLayout from '@/views/layout/OtcLayout'
import Terms from '@/views/external-pages/Terms'
import Policy from '@/views/external-pages/Policy'
import Introduction from '@/views/hesman/Introduction'
import Advantages from '@/views/hesman/Advantages'
import CaseStudies from '@/views/hesman/CaseStudies'
import ContactUs from '@/views/hesman/ContactUs'
import Announcements from '@/views/hesman/Announcements'
import PrivacyPolicy from '@/views/hesman/PrivacyPolicy'
import TermsOfService from '@/views/hesman/TermsOfService'

const routes = [
  // Routing with auth layout
  {
    path: '/terms',
    component: AuthLayout,
    children: [
      { path: '',
        component: Terms,
        name: 'terms',
        meta: {
          title: 'ROUTE_TERMS'
        }
      }
    ]
  },
  {
    path: '/policy',
    component: AuthLayout,
    children: [
      { path: '',
        component: Policy,
        name: 'policy',
        meta: {
          title: 'ROUTE_POLICY'
        }
      }
    ]
  },
  {
    path: '/introduction',
    component: OtcLayout,
    children: [
      { path: '',
        component: Introduction,
        name: 'introduction',
        meta: {
          title: 'ROUTE_INTRODUCTION'
        }
      }
    ]
  },
  {
    path: '/advantages',
    component: OtcLayout,
    children: [
      { path: '',
        component: Advantages,
        name: 'advantages',
        meta: {
          title: 'ROUTE_ADVANTAGES'
        }
      }
    ]
  },
  {
    path: '/case-studies',
    component: OtcLayout,
    children: [
      { path: '',
        component: CaseStudies,
        name: 'case-studies',
        meta: {
          title: 'ROUTE_CASE_STUDIES'
        }
      }
    ]
  },
  {
    path: '/contact-us',
    component: OtcLayout,
    children: [
      { path: '',
        component: ContactUs,
        name: 'contact-us',
        meta: {
          title: 'ROUTE_CONTACT_US'
        }
      }
    ]
  },
  {
    path: '/announcements',
    component: OtcLayout,
    children: [
      { path: '',
        component: Announcements,
        name: 'announcements',
        meta: {
          title: 'ROUTE_ANNOUNCEMENTS'
        }
      }
    ]
  },
  {
    path: '/privacy-policy',
    component: OtcLayout,
    children: [
      { path: '',
        component: PrivacyPolicy,
        name: 'privacy-policy',
        meta: {
          title: 'ROUTE_PRIVACY_POLICY'
        }
      }
    ]
  },
  {
    path: '/terms-of-service',
    component: OtcLayout,
    children: [
      { path: '',
        component: TermsOfService,
        name: 'terms-of-service',
        meta: {
          title: 'ROUTE_TERMS_OF_SERVICE'
        }
      }
    ]
  }
]
export default routes
