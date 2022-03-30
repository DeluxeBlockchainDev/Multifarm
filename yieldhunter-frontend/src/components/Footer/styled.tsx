import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { ReactComponent as LogoImage } from '../../assets/svg/logo.svg'

export const FooterLogo = styled(LogoImage)`
  font-size: 3rem;
`

export const StyledFooter = styled(Grid)`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 4rem 40px;
  color: #fff;
  justify-content: space-between;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

export const FooterItem = styled(Grid)`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    margin-bottom: 40px;

    &:last-child {
      margin-bottom: 0;
    }

    &:nth-child(2) {
      flex-direction: column;
    }
  }
`

export const FooterLink = styled.a`
  padding: 0 20px;
  font-size: 0.875rem;
  color: #fff;
  text-decoration: none;

  @media (max-width: 1024px) {
    margin-bottom: 15px;
  }
`

export const FooterRouterLink = styled(Link)`
  padding: 0 20px;
  font-size: 0.875rem;
  color: #fff;
  text-decoration: none;

  @media (max-width: 1024px) {
    margin-bottom: 15px;
  }
`

export const FooterLogout = styled.p`
  padding: 0 20px;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;

  & svg {
    margin-right: 0.5rem;
  }
`

export const SocialButton = styled.a`
  width: 36px;
  height: 36px;
  border: 2px solid #03a9f4;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 15px;
`
