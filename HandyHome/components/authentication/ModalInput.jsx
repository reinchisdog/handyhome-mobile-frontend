import { TextInput, View, Text, Animated, Easing, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants';


export default function ModalInput({
  left,
  right,
  placeholder = "",
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
    <TouchableWithoutFeedback
    onPress={onFocus}>
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
        <View 
        style={[auth.inputText]}>
          <Text></Text>
        </View>
        {/* <TextInput 
          style={[auth.inputText]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholderText}

          onFocus={onFocus}
          onBlur={onBlur}
        /> */}

        {/* LABEL */}
        <Animated.Text
        style={{
          position: 'absolute',
          letterSpacing: 0.2,
          paddingHorizontal: 24,
          fontFamily: FONTS.roboto500 ,
          fontSize: FONT_SIZES.sm,
          color: COLORS.strokes
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
    </TouchableWithoutFeedback>

  )
}