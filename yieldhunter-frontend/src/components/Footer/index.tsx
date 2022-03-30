import { ReactComponent as BookIcon } from '../../assets/svg/book.svg'
import { ReactComponent as DiscordIcon } from '../../assets/svg/discord.svg'
import { ReactComponent as MediumIcon } from '../../assets/svg/medium.svg'
// import {ReactComponent as LogoutIcon} from '../../assets/svg/exit 1.svg'
import { ReactComponent as TwitterIcon } from '../../assets/svg/twitter.svg'
import {
  FooterItem,
  FooterLink,
  FooterLogo,
  FooterRouterLink,
  // FooterLogout,
  SocialButton,
  StyledFooter
} from './styled'

export const Footer = () => {
  return (
    <StyledFooter>
      <FooterItem>
        <FooterLogo />
      </FooterItem>

      <FooterItem>
        <FooterLink
          target="_blank"
          href="https://www.notion.so/Job-Board-241dbe213eb746a991e463315c5db6b8"
        >
          Careers
        </FooterLink>
        <FooterRouterLink to="/disclaimer">Disclaimer</FooterRouterLink>
        <FooterLink target="_blank" href="https://forms.gle/wzo5di3gr5pfBGDw7">
          Request Listing
        </FooterLink>
        <FooterLink target="_blank" href="https://forms.gle/sxNDVzN3t2CTwEsG9">
          Report Data Error
        </FooterLink>
        <FooterRouterLink to="/privacy">Privacy Policy</FooterRouterLink>
        {/*<FooterLogout>*/}
        {/*  <LogoutIcon />*/}
        {/*  Leave out*/}
        {/*</FooterLogout>*/}
      </FooterItem>

      <FooterItem>
        <SocialButton target="_blank" href="https://twitter.com/multifarm_fi">
          <TwitterIcon />
        </SocialButton>
        <SocialButton
          target="_blank"
          href="https://discord.com/invite/yMXzezMchs"
        >
          <DiscordIcon />
        </SocialButton>
        <SocialButton target="_blank" href="https://medium.com/@multifarm_fi">
          <MediumIcon />
        </SocialButton>
        <SocialButton
          target="_blank"
          href="https://multifarm.gitbook.io/multifarm"
        >
          <BookIcon />
        </SocialButton>
      </FooterItem>
    </StyledFooter>
  )
}
