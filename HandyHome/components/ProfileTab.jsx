import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../styles/constants';
import Arrow from '@expo/vector-icons/Entypo';

const ProfileTab = ({icon, title, onPress, hasArrow = true}) => {
   return (
      <Pressable
      onPress={onPress}
      style={({pressed}) => [{
         backgroundColor: pressed ? COLORS.summaryPress : '#fff',
         borderRadius: 12,
         padding: 12,
         flexDirection: 'row',
         gap: 12,
         alignItems: 'center'
      }]}>
         {icon}
         <Text
         style={{
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.md,
            color: COLORS.lettersicons,
            flex: 1,
         }}>
            {title}
         </Text>
         {hasArrow &&
            <Arrow name='chevron-right' size={24} color={COLORS.accent}/>
         }
      </Pressable>
   )
}

export default ProfileTab