import React from 'react'

import farms from '../../assets/2_farm_icon.svg'
import assets from '../../assets/3_assets_icon.svg'
import bridges from '../../assets/icons/Crypto.svg'
import { NavTabLink } from '../../styled'

export default function Tabs() {
  return (
    <>
      <NavTabLink activeClassName="selected" to="/farms">
        <img src={farms} alt="" />
        FARMS
      </NavTabLink>
      <NavTabLink activeClassName="selected" to="/assets">
        <img src={assets} alt="" />
        ASSETS
      </NavTabLink>
      <NavTabLink activeClassName="selected" to="/bridges">
        <img src={bridges} alt="" />
        Bridges
      </NavTabLink>
    </>
  )
}
