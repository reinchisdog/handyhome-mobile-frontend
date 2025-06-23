import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { globalStyles as global } from '../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants';
import Icons from '@expo/vector-icons/Feather';

const SuccessCheck = () => {
  return (
    <View style={{
        width: 150,
        height: 150,
        aspectRatio: '1/1',
        backgroundColor: COLORS.secondary,
        borderWidth: 16,
        borderColor: COLORS.lightblue,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <Icons name='check' size={86} color={COLORS.accent}/>
    </View>
  )
}

export default SuccessCheck