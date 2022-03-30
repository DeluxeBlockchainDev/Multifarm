import { css, DefaultTheme } from 'styled-components'

import { Colors } from './styled'

const white = '#FFFFFF'
const black = '#000000'

const dayBg = '#fafafa'
const nightBg =
  'radial-gradient(100% 197.75% at 0% 1.03%, #272D49 0%, #222740 100%)'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? '#FFFFFF' : '#141414',
    text2: darkMode ? '#D0D0D0' : '#828282',
    text3: darkMode ? '#D0D0D0' : '#313131',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: darkMode ? '#232424' : '#FFFFFF',
    bg2: darkMode ? '#2C2F36' : '#F4F4F4',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? nightBg : dayBg,
    testBG: darkMode ? 'hsl(250deg 5% 46% / 25%)' : 'hsl(250deg 5% 46% / 25%)',
    testBGlight: darkMode ? '#634190a3' : '#b29ee87d',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#ff007a',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    primaryText1: darkMode ? '#E0E0E0' : '#ff007a',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    grey1: '#ffffff26',
    grey2: 'hsl(214deg 32% 60% / 15%)',
    red3: '#D60000',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    // dont wanna forget these blue yet
    blue4: darkMode ? '#9906FE;' : '#C4D9F8'
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),
    isDark: darkMode,

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',
    background: darkMode
      ? '/images/dark_background.png'
      : '/images/light_background.png',

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}
