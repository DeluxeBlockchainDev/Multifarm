import Signup from 'pages/Auth/signup'
import Login from 'pages/Auth/login'
import Reset from 'pages/Auth/reset'
import SetPwd from 'pages/Auth/setpwd'
import Assets from 'pages/Assets'
import AssetDetails from 'pages/Details'
import FarmDetails from 'pages/Details/FarmDetails'
import Disclaimer from 'pages/Disclaimer'
import Farms from 'pages/Farms'
import PrivacyPolicy from 'pages/PrivacyPolicy'

import Bridges from '../pages/Bridges'

interface Route {
  path: string
  Component: () => JSX.Element | null
}

const routes: Route[] = [
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/signup',
    Component: Signup
  },
  {
    path: '/set-password',
    Component: SetPwd
  },
  {
    path: '/reset',
    Component: Reset
  },
  {
    path: '/assets',
    Component: Assets
  },
  {
    path: '/assets/:assetId',
    Component: AssetDetails
  },
  {
    path: '/farms',
    Component: Farms
  },
  {
    path: '/farms/:farmId',
    Component: FarmDetails
  },
  {
    path: '/disclaimer',
    Component: Disclaimer
  },
  {
    path: '/privacy',
    Component: PrivacyPolicy
  },
  {
    path: '/bridges',
    Component: Bridges
  }
]

export default routes
