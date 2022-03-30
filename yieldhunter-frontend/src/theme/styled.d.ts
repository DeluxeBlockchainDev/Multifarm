import {
  FlattenSimpleInterpolation,
  ThemedCssFunction
} from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color

  modalBG: Color
  advancedBG: Color
  testBG: Color
  testBGlight: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  grey1: Color
  grey2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  blue1: Color
  blue4: Color
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    isDark: boolean

    // shadows
    shadow1: string
    background: string

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
