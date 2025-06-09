import { TextInput, View, Animated, Easing } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'


import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants';


export default function BasicMultiline({
  placeholder = "",
  onChangeText,
  value,  
  numberOfLines = 4,
  height = 48
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
    <Animated.View style={[
      auth.multilineContainer, 
      {borderColor: animBorderColor,
      }
    ]}>

      {/* INPUT BOX */}
      <TextInput 
        style={[auth.inputText, {
          padding: 24,
          textAlignVertical: 'top',
          minHeight: numberOfLines * FONT_SIZES.sm * 1.2,
        }]}
        multiline
        numberOfLines={numberOfLines}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholderText}
        placeholderTextColor={COLORS.strokes}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Animated.View>
  )
}