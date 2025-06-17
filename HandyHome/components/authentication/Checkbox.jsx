import { StyleSheet, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'

import Icons from '@expo/vector-icons/MaterialCommunityIcons';

import { globalStyles as global } from '../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../styles/constants';

const Checkbox = ({onPress, value = false}) => {
   return (
      <TouchableOpacity
      onPress={onPress}
      >
         <View style={{
            borderWidth: 1,
            borderColor: (value) ? '#12E26C' : COLORS.lettersicons,
            borderRadius: 4,
            backgroundColor: (value) ? '#12E26C' : COLORS.secondary,
            height: 24,
            width: 24,
            aspectRatio: '1/1',
            justifyContent: 'center',
            alignItems: 'center',
         }}>
            {(value) ? <Icons name='check' size={20} color={'#fff'}/> : <></>}
         </View>
         
      </TouchableOpacity>
   )
}

export default Checkbox

const styles = StyleSheet.create({})