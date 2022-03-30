import styled from 'styled-components'

export const Switch = styled.div<any>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`

export const DegenSwitch = styled(Switch)`
  margin: 0;
  & svg {
    transform: rotate(180deg);
  }
`

export const CheckBoxWrapper = styled.div`
  height: 26px;
  position: relative;
`
export const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: rgba(181, 181, 181, 0.25);
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    margin: 5px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
export const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 44px;
  height: 20px;
  margin: 0;
  &:checked + ${CheckBoxLabel} {
    background: linear-gradient(110.29deg, #33b6ff -3.21%, #1a6b9f 105.5%);
    box-shadow: 0px 4px 12px rgba(0, 35, 57, 0.25);
    &::after {
      content: '';
      background: #fafafa;
      display: block;
      border-radius: 50%;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`
