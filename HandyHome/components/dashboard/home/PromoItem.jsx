/* --------------------------------- IMPORTS -------------------------------- */
import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'

// Styles and Icons
import { globalStyles as global } from '../../../styles/globalStyles';
import { launchStyles as launch } from '../../../styles/launchStyles';
import { COLORS, FONT_SIZES } from '../../../styles/constants';

const PromoItem = ({ item }) => {
  /* ----------------------------- Initialization ----------------------------- */
  const { width } = useWindowDimensions();
  return (
    <View style={[
      global.centerContainer, {
      height: 152,
      width,
      zIndex: 4,
      position: 'relative',
      paddingHorizontal: 24,
    }]}>
    
      <Image 
        source={item.image}
        style={{
          borderRadius: 20,
          width: '100%',
          maxWidth: 326,
          height: '100%',
          objectFit: 'cover',
          backgroundColor: COLORS.strokes
        }}
      />
    </View>
  )
}

export default PromoItem;             