import { TextInput, View, Animated, Easing } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'


import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants';


export default function BasicInput({
  left,
  right,
  placeholder = "",
  secureTextEntry = false,
  inputMode= "text",
  keyboardType="default",
  onChangeText,
  value,  
}) {
  const [placeholderText, setPlaceholderText] = useState(placeholder);

  const [hasLeft, setHasLeft] = useState();
  const [hasRight, setHasRight] = useState();

  useEffect(() => {
    if (left) setHasLeft(true);
    if (right) setHasRight(true);
  }, [])

  const borderColor = useRef(new Animated.Value(0)).current;
  const animBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.strokes, COLORS.primary]
  })

  const labelX = useRef(new Animated.Value(0)).current;
  const animLabelX = labelX.interpolate({
    inputRange: [0, 1],
    outputRange: [(!hasLeft) ? (21) : (47), 20]
  })

  const labelY = useRef(new Animated.Value(0)).current;
  const animLabelY = labelY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -26]
  })

  const labelBackground = useRef(new Animated.Value(0)).current;
  const animLabelBG = labelBackground.interpolate({
    inputRange: [0, 1],
    outputRange: ["#fff", "#F5F5F5"]
  })

  const labelColor = useRef(new Animated.Value(0)).current;
  const animLabelColor = labelColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.lettersicons, COLORS.primary]
  })
  
  const labelOpacity = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
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
      {hasLeft ? 
        <View style={auth.inputIcon}>
          {left}
        </View> :
        <></>
      }
      

      {/* INPUT BOX */}
      <TextInput 
        style={[auth.inputText, {
          paddingHorizontal: (!hasLeft) ? 12 : 0,
        }]}
        secureTextEntry = {secureTextEntry}
        inputMode={inputMode}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholderText}
        placeholderTextColor={COLORS.strokes}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* LABEL */}
      <Animated.Text
      style={{
        position: 'absolute',
        letterSpacing: 0.2,
        transform: [
          {translateX: animLabelX}, 
          {translateY: animLabelY}],
        color: animLabelColor,
        backgroundColor: animLabelBG,
        paddingHorizontal: 2,
        fontFamily: FONTS.roboto700 ,
        opacity: labelOpacity,
      }}>
        {placeholder}
      </Animated.Text>
      
      {/* ICON */}
      {hasRight ? 
        <View style={auth.inputIcon}>
          {right}
        </View> :
        <></>
      }
    </Animated.View>
  )
}