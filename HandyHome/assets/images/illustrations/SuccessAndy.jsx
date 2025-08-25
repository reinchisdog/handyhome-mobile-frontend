import { Image, View } from 'react-native'
import React from 'react'

import { COLORS } from '../../../styles/constants';

const SuccessAndy = () => {
  return (
    <View style={{
        maxWidth: 248,
        maxHeight: 248,
        width: '100%',
        height: '100%',
        aspectRatio: '1/1',
        backgroundColor: COLORS.lightblue,
        borderRadius: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    }}>
      <Image 
      source={require('../../images/illustrations/Onboarding-4.png')}
      style={{
         position: 'absolute',
         bottom: -32,
         right: 8,
         width: '100%',
         height: '100%',
         aspectRatio: '1/1',
         zIndex: 2
      }}
      />
      <View 
      style={{
        maxWidth: 200,
        maxHeight: 200,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '100%',
        position: 'relative',
        zIndex: 1,
      }}
      />
    </View>
  )
}

export default SuccessAndy