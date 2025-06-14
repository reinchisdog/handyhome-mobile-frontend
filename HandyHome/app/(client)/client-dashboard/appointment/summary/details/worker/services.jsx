import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Animated, useWindowDimensions } from 'react-native'
import React, {useState, useEffect} from 'react'

import { globalStyles as global } from '../../../../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../../styles/constants'

const specialtyItems = [
  "Leak Repair",
  "Pipe Installation",
  "Drain Cleaning",
]

const ReviewWorkServices = ({onScroll, paddingTop, minHeight, listRef}) => {
  const {height, width} = useWindowDimensions();

  return (
    <Animated.FlatList 
    ref={listRef}
    onScroll={onScroll}
    data={specialtyItems}
    ListHeaderComponent={
      <Text style={[styles.sectionTitle, {marginBottom: 14}]}>Services <Text style={{color: COLORS.labels}}>{`(${specialtyItems.length})`}</Text></Text>
    }
    renderItem={({item, index}) => (
      <View 
      key={index}
      style={[global.tagContainer, {backgroundColor: COLORS.secondary}]}>
        <Text style={[global.tagText, {color: COLORS.primary}]}>{item}</Text>
      </View>
    )}
    contentContainerStyle={{
      paddingTop: paddingTop,
      minHeight: minHeight ?? height,
      gap: 8,
      
    }}
    style={{
      padding: 24,
    }}
    />
  )
}

export default ReviewWorkServices

const styles = StyleSheet.create({
  section: {
    width: '100%',
    gap: 16
  },
  sectionTitle: {
    fontFamily: FONTS.roboto600,
    fontSize: FONT_SIZES.sm,
    color: COLORS.lettersicons
  },
  sectionMainText: {
    fontFamily: FONTS.roboto400,
    fontSize: FONT_SIZES.sm,
    color: COLORS.lettersicons
  },
  sectionSubText: {
    fontFamily: FONTS.roboto400,
    fontSize: FONT_SIZES.sm,
    color: COLORS.strokes
  },
})