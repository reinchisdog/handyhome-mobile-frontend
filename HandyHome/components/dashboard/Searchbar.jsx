import { TextInput, View, Animated, Easing } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import Icon from '@expo/vector-icons/MaterialIcons';

import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants';


export default function Searchbar({
  placeholder = "Search",
  onChangeText,
  value,  
}) {
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
  }

  return (
    <Animated.View style={[
      auth.inputContainer, 
      {borderColor: animBorderColor}
    ]}>
      {/* INPUT BOX */}
      <TextInput 
        style={[auth.inputText, {
          paddingHorizontal: 12,
        }]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={COLORS.strokes}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* ICON */}
      <View style={auth.inputIcon}>
        <Icon name="search" size={24} color={COLORS.lettersicons} />
      </View> 

    </Animated.View>
  )
}