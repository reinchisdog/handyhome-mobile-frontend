import { StyleSheet, Text, Animated, Pressable } from 'react-native'
import React, {useEffect, useRef} from 'react'

import { globalStyles as global } from '../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants'

const SmallButton = ({
   type = "primary",
   disabled = false,
   loading = false,
   onPress,
   text
}) => {
   const getBackgroundColor = (pressed) => {
      if (disabled) return COLORS.primaryDisabled;

      if (type === "primary") {
         return pressed ? COLORS.primaryPress : COLORS.primary
      } else {
         return pressed ? COLORS.secondaryPress : '#fff'
      }
   }
   
   const getBorderColor = (pressed) => {
      if (disabled) return COLORS.primaryDisabled;

      if (type === "primary") {
         return pressed ? COLORS.primaryPress : COLORS.primary
      } else {
         return COLORS.labels
      }
   }

   const loadingButton = useRef(new Animated.Value(0)).current;
   const bgLoadingPrimary = loadingButton.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.primary, '#1e98e6'],
      extrapolate: 'clamp'
   })
   const bgLoadingSecondary = loadingButton.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', '#e1e4e6'],
      extrapolate: 'clamp'
   })

   useEffect(() => {
      if (!loading) return;

      const loopAnimation = Animated.loop(
         Animated.sequence([
           Animated.timing(loadingButton, {
             toValue: 1,
             duration: 500,
             useNativeDriver: false, 
           }),
           Animated.timing(loadingButton, {
             toValue: 0,
             duration: 500,
             useNativeDriver: false,
           }),
         ])
       );
     
       loopAnimation.start();
     
       return () => loopAnimation.stop();

   }, [loading])

   return (
      <Pressable
      onPress={!(disabled || loading) ? onPress : undefined}
      style={({pressed}) => [{
         height: '100%',
         maxWidth: '33.33%',
         flex: 1,
         backgroundColor: getBackgroundColor(pressed),
         borderRadius: 24,
         borderWidth: 1.5,
         borderColor: getBorderColor(pressed),
         overflow: 'hidden',
      }]}>
         <Animated.View
         style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: (!loading) ? 'transparent' : ( type === "primary") ? bgLoadingPrimary : bgLoadingSecondary,
         }}>
            <Text
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.sm,
               color: disabled ? COLORS.textDisabled : type === "primary" ? '#fff' : COLORS.accent,
               opacity: !(disabled || loading) ? 1 : 0.5
            }}>
               {text}
            </Text>
         </Animated.View>
      </Pressable>
   )
}

export default SmallButton

const styles = StyleSheet.create({})