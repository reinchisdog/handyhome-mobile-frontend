/* --------------------------------- IMPORTS -------------------------------- */
import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'

// Styles and Icons
import { useCustomFonts } from '../../assets/fonts/index';
import { globalStyles as global } from '../../styles/globalStyles';
import { launchStyles as launch } from '../../styles/launchStyles';
import { COLORS, FONT_SIZES } from '../../styles/constants';

const OnboardingItem = ({ item }) => {
  /* ----------------------------- Initialization ----------------------------- */
  const { width } = useWindowDimensions();


  return (
    <View style={[
      global.centerContainer, {
      flex: 1,
      width,
      zIndex: 4,
      position: 'relative',
    }]}>
    
      <Image 
        source={item.image}
        style={[launch.image]}
      />

      <View style={[{height: 96,}]}>
        <Text style={[launch.title]}>{item.title}</Text>
        <Text style={launch.description}>{item.description}</Text>
      </View>
    </View>
  )
}

export default OnboardingItem;