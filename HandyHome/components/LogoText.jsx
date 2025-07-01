import { Text } from 'react-native'
import React from 'react'

import {COLORS, FONTS} from '../styles/constants'

export default LogoText = ({size = 40}) => {
   return (
      <Text
      style={{
         fontFamily: FONTS.nunito700,
         fontSize: size,
         color: COLORS.primary,
         textAlign: 'center'
      }}>
         <Text style={{color: COLORS.accent}}>Handy</Text>Home
      </Text>
   )
}