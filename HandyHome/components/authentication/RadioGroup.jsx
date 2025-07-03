import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants'

const RadioGroup = ({items, direction = "column", value, setValue}) => {

  return (
    // RADIO GROUP CONTAINER
    <View style={[{
      display: 'flex',
      flexDirection: direction,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }]}>
      {items.map((item, key) => (
        // RADIO ITEM CONTAINER
        <View key={key}
        style={[{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }]}>
          {/* RADIO */}
          <TouchableOpacity
          onPress={() => setValue(item.val)}>
            <View 
              style={{
              height: 22,
              width: 22,
              aspectRatio: '1/1',
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: '#3A454D',
              borderRadius: 22,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 16,
                width: 16,
                backgroundColor: (value !== item.val) ? "#f8f8f8" : "#58B7F3",
                borderRadius: 8,
              }}></View>
            </View>
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons
          }} onPress={() => setValue(item.val)}>{item.name}</Text>
        </View>
      ))}
    </View>
  )
}

export default RadioGroup
