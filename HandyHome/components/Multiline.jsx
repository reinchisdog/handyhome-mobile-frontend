import { TextInput, View, Animated, Easing, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'


import { globalStyles as global } from '../styles/globalStyles';
import { authStyles as auth } from '../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../styles/constants';


export default function Multiline({
  placeholder = "",
  onChangeText,
  value,  
  numberOfLines = 4,
}) {
  const [placeholderText, setPlaceholderText] = useState(placeholder);

  const borderColor = useRef(new Animated.Value(0)).current;
  const animBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.strokes, COLORS.primary]
  })

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      })
    ]).start();
    setPlaceholderText("");
  }

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      })
    ]).start();
    setPlaceholderText(placeholder);
  }

   return (
      // <Animated.View 
      // style={{
      //    display: 'flex',
      //    flexDirection: 'row',
      //    width: '100%',
      //    borderRadius: 8,
      //    borderWidth: 2,
      //    borderColor: animBorderColor,
      //    position: 'relative',
      //    backgroundColor: COLORS.secondary,
      //    alignItems: 'flex-start', 
      //    paddingHorizontal: 12,
      //    paddingVertical: 4,
      // }}>

      //    <TextInput 
      //    multiline
      //    numberOfLines={numberOfLines}
      //    scrollEnabled={true}
      //    row
      //    style={{
      //       flex: 1,
      //       fontFamily: FONTS.roboto500,
      //       fontSize: FONT_SIZES.sm,
      //       letterSpacing: 0.2,
      //       color: COLORS.lettersicons,
      //       textAlignVertical: 'top',
      //    }}
      //    onChangeText={onChangeText}
      //    value={value}
      //    placeholder={placeholder}
      //    placeholderTextColor={COLORS.strokes}
      //    onFocus={onFocus}
      //    onBlur={onBlur}
      //    />
      // </Animated.View>
      <Animated.View
      style={{
        outlineColor: animBorderColor,
        outlineWidth: 2,
        borderRadius: 8,
        padding: 0,
        justifyContent: 'flex-start',
        paddingVertical: 4,
        minHeight: (numberOfLines * FONT_SIZES.md) + FONT_SIZES.md,
        maxHeight: (numberOfLines * FONT_SIZES.md) + FONT_SIZES.md,
      }}>
         <TextInput 
         value={value}
         onChangeText={onChangeText}
         multiline
         numberOfLines={numberOfLines}
         placeholder={placeholder}
         placeholderTextColor={COLORS.strokes}
         onFocus={onFocus}
         onBlur={onBlur}
         style={{
            // backgroundColor: 'yellow',
            // flex: 1,
            paddingHorizontal: 18,
            fontFamily: FONTS.roboto500,
            lineHeight: FONT_SIZES.md, 
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons,
            height: '100%',
            textAlignVertical: 'top',
            textAlign: 'left'
         }}/>
      </Animated.View>
   )
}