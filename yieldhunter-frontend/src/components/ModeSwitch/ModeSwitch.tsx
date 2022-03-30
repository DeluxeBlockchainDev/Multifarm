import React from 'react'

import DarkIcon from '../../assets/svg/dark_mode.svg'
import LightIcon from '../../assets/svg/light_mode.svg'
import { CheckBox, CheckBoxLabel, CheckBoxWrapper, Switch } from './styled'

export const ModeSwitch = ({
  state,
  onClick
}: {
  state: boolean
  onClick: () => void
}) => {
  return (
    <Switch>
      <img
        src={state ? DarkIcon : LightIcon}
        width={22}
        height={22}
        alt={state ? 'dark' : 'light'}
      />
      <CheckBoxWrapper>
        <CheckBox
          id="checkbox"
          type="checkbox"
          checked={state}
          onChange={onClick}
        />
        <CheckBoxLabel htmlFor="checkbox" />
      </CheckBoxWrapper>
    </Switch>
  )
}
