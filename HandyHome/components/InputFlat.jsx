// Component: Input Flat

// Imports
// ---- React Components
import { TextInput, View, Animated, Easing, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
// ---- Styles and Icons
import { authStyles as auth } from '../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../styles/constants';

const InputFlat = ({
   placeholder = "",
   inputMode= "text",
   keyboardType="default",
   onChangeText,
   value,
   disabled=false
}) => {
   // Hooks and States
   const inputRef = useRef(new Animated.Value(0)).current;
   const inputColor = inputRef.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.labels, COLORS.primary],
      extrapolate: 'clamp'
   })

   // Functions
   const onFocus = () => {
      Animated.timing(inputRef, {
         toValue: 1,
         duration: 100,
         easing: Easing.out(Easing.ease),
         useNativeDriver: false
      }).start()
   }

   const onBlur = () => {
      Animated.timing(inputRef, {
         toValue: 0,
         duration: 100,
         easing: Easing.out(Easing.ease),
         useNativeDriver: false
      }).start()
   }

   return (
      <View style={{gap: 4, width: '100%'}}>
         <Animated.Text
         style={{
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.sm,
            color: inputColor
         }}>
            {placeholder}
         </Animated.Text>
         <Animated.View
         style={{
            borderBottomWidth: 1,
            borderColor: inputColor,
            paddingHorizontal: 12,
            backgroundColor: COLORS.secondary,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
         }}>
            <TextInput 
            editable={!disabled}
            onChangeText={onChangeText}
            value={value}
            style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.sm,
               color: COLORS.lettersicons,
               opacity: disabled ? 0.7 : 1,
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            />
         </Animated.View>
      </View>
   )
}

export default InputFlat

const styles = StyleSheet.create({})