import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import React from 'react'

import { globalStyles as global } from '../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../styles/constants';
import Arrow from '@expo/vector-icons/Entypo';

const ProfileTab = ({icon, title, onPress, hasArrow}) => {
  return (
    <TouchableHighlight
    underlayColor={'#F2F2F7'}
    onPress={onPress}
    >
      <View
        style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            width: '100%'
        }}
      >
        {icon}

        {/* ---------------------------------- Text ---------------------------------- */}
        <Text
            style={{
                fontFamily: FONTS.roboto500,
                fontSize: FONT_SIZES.md,
                color: COLORS.lettersicons,
                flex: 1
            }}
        >
            {title}
        </Text>

        {/* ---------------------------------- Arrow --------------------------------- */}
        {(hasArrow) ?
        <Arrow name="chevron-right" size={24} color={COLORS.accent}/>:
        <></>
        }
      </View>
    </TouchableHighlight>
  )
}

export default ProfileTab