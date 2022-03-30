import React from 'react'

import { CheckBox, CheckBoxLabel, CheckBoxWrapper, DegenSwitch } from './styled'

export const DegenModeSwitch = ({
  onClick,
  onChange
}: {
  onClick?: any
  onChange?: any
}) => {
  const handleClick = () => {
    onClick?.()
  }

  return (
    <DegenSwitch>
      <CheckBoxWrapper>
        <CheckBox
          id="degencheckbox"
          type="checkbox"
          onClick={handleClick}
          onChange={onChange}
        />
        <CheckBoxLabel htmlFor="degencheckbox" />
      </CheckBoxWrapper>
      <span>Show active/inactive pools</span>
    </DegenSwitch>
  )
}
