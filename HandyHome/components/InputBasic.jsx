// Component: Input Basic

// Imports
// ---- React Components
import { TextInput, View, Animated, Easing, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
// ---- Styles and Icons
import { authStyles as auth } from '../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../styles/constants';


export default function InputBasic({
  left,
  right,
  isRightIcon = true,
  placeholder = "",
  secureTextEntry = false,
  inputMode= "text",
  keyboardType="default",
  onChangeText,
  value,
  floatLabel = true, 
  floatColor = COLORS.screenbg
}) {
  const [placeholderText, setPlaceholderText] = useState(floatLabel ? placeholder : placeholder);

  const borderColor = useRef(new Animated.Value(0)).current;
  const animBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.strokes, COLORS.primary]
  })

  const labelX = useRef(new Animated.Value(0)).current;
  const animLabelX = labelX.interpolate({
    inputRange: [0, 1],
    outputRange: [(!left) ? (21) : (47), 20]
  })

  const labelY = useRef(new Animated.Value(0)).current;
  const animLabelY = labelY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -28]
  })

  const labelBackground = useRef(new Animated.Value(0)).current;
  const animLabelBG = labelBackground.interpolate({
    inputRange: [0, 1],
    outputRange: ["#fff", floatColor]
  })

  const labelColor = useRef(new Animated.Value(0)).current;
  const animLabelColor = labelColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.labels, COLORS.primary]
  })
  
  const labelOpacity = useRef(new Animated.Value(floatLabel ? 0 : 1)).current;

  const onFocus = () => {
    if (!floatLabel) {
      // Normal behavior - just animate border color
      Animated.timing(borderColor, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }).start();
      return;
    }

    // Float label behavior
    Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }),
      Animated.timing(labelColor, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelX, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelY, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelBackground, {
        toValue: 1,
        duration: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true
      }),
    ]).start();
    setPlaceholderText("");
  }

  const onBlur = () => {
    if (!floatLabel) {
      // Normal behavior - just animate border color back
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }).start();
      return;
    }

    // Float label behavior
    if (value && value.trim() !== "")  {
      Animated.parallel([
        Animated.timing(borderColor, {
          toValue: 0,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false
        }),
        Animated.timing(labelColor, {
          toValue: 0,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }),
      Animated.timing(labelColor, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelX, {
        toValue: 0,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelY, {
        toValue: 0,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelBackground, {
        toValue: 0,
        duration: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(labelOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }),
    ]).start();
    setPlaceholderText(placeholder);
  }

  return (
    <Animated.View style={[
      auth.inputContainer, 
      {borderColor: animBorderColor}
    ]}>
      {/* ICON */}
      {left ? 
        <View style={auth.inputIcon}>
          {left}
        </View> :
        <></>
      }
      

      {/* INPUT BOX */}
      <TextInput 
        style={[auth.inputText, {
          paddingHorizontal: (!left) ? 12 : 0,
        }]}
        secureTextEntry = {secureTextEntry}
        inputMode={inputMode}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        placeholder={floatLabel ? placeholderText : placeholder}
        placeholderTextColor={COLORS.strokes}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* FLOATING LABEL - Only render if floatLabel is true */}
      {floatLabel && (
        <Animated.Text
        style={{
          position: 'absolute',
          letterSpacing: 0.2,
          transform: [
            {translateX: animLabelX}, 
            {translateY: animLabelY}],
          color: animLabelColor,
          backgroundColor: animLabelBG,
          paddingHorizontal: 4,
          fontFamily: FONTS.roboto700 ,
          opacity: labelOpacity,
          height: FONT_SIZES.sm,
          lineHeight: FONT_SIZES.sm,
        }}>
          {placeholder}
        </Animated.Text>
      )}
      
      {/* ICON */}
      {right && (
        <View style={isRightIcon ? auth.inputIcon : styles.inputText}>
          {right}
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  inputText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 8,
  }
});