import Grid from '@material-ui/core/Grid'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { ReactComponent as Logo } from './assets/svg/logo.svg'
import { device } from './utils/screen'

export const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ theme }) => theme.advancedBG};
  min-height: 100vh;
  & * {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 40px;
  color: ${({ theme }) => theme.text1};

  @media (max-width: 1024px) {
    padding: 30px 20px;
  }
`

export const MenuWpapper = styled.aside`
  width: 100%;
  position: sticky;
  top: 0px;
  z-index: 11;
  box-sizing: border-box;
  color: rgb(228, 236, 255);
  display: flex;
  flex-direction: column;

  .right-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 40px;

    .country {
      height: 40px;
      width: 40px;
    }

    @media ${device.laptop} {
      gap: 16px;
    }

    .country {
      height: 26px;
      width: 26px;
    }
  }
`

export const HeaderLogo = styled(Logo)`
  width: 108px;
  margin-right: 40px;

  @media (max-width: 1024px) {
    margin-right: 10px;
  }
`

export const MenuTopWrapper = styled(Grid)`
  min-height: 80px;
  padding: 0 40px;
  background: linear-gradient(111.6deg, #303659 -2.51%, #292e4d 104.46%);
  border-bottom: 2px solid #41486e;

  @media (max-width: 1024px) {
    min-height: 64px;
    padding: 0 20px;
    background: ${({ theme }) => theme.advancedBG};
  }
`

export const MobileTabsWrapper = styled(Grid)`
  background: linear-gradient(111.6deg, #303659 -2.51%, #292e4d 104.46%);
`

export const NavList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  & * {
    cursor: pointer;
  }
  img {
    width: 108px;
    margin-right: 2rem;
  }

  @media ${device.laptop} {
    img {
      width: 92px;
      margin-right: 0rem;
    }
  }
`

export const ProLogIn = styled.button`
  width: 140px;
  height: 40px;
  background: linear-gradient(110.29deg, #33B6FF -3.21%, #1A6B9F 105.5%);
  box-shadow: 0px 4px 12px rgba(0, 35, 57, 0.25);
  border-radius: 15px;
  color: #fafafa;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: center;
  // opacity: 0.7;
  &:hover {
    opacity: 1;
  }
  @media ${device.laptop} {
    width: 91px;
    height: 27px;
    font-size: 0.75rem;
  }
`

export const NavTabLink = styled(NavLink)`
  width: 10rem;
  text-decoration-line: blink;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  height: 80px;
  text-transform: uppercase;
  text-align: center;
  color: #b2bdff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  img {
    height: 22px;
    width: auto;
    margin: auto 0;
  }

  &.selected {
    color: white;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) -9.64%,
      rgba(255, 255, 255, 0) 138.09%
    );
    border-radius: 3px;
    border-bottom-width: 4px;
    border-bottom-style: solid;
    border-bottom-color: #d733ff;
  }

  &:hover {
    color: white;
  }

  @media ${device.laptop} {
    height: 49px;
  }
`

export const Markdown = styled.div`
  max-width: 1024px;

  h2 {
    font-size: 3rem;
  }

  h3 {
    font-size: 2rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.15rem;
  }

  p {
    font-size: 1rem;
  }

  a {
    color: #fff;
  }
`
