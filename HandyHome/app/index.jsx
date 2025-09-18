//Screen: Root Splashscreen

// Imports
// ---- React Native and Expo Routers
import { StyleSheet, Text, View, Animated, useWindowDimensions, } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Contexts
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '@/styles/constants'

const RootIndex = () => {
   // Hooks and States
   const { height } = useWindowDimensions();
   const insets = useSafeAreaInsets();
   const { isAuthReady, hasOnboarded, user, isTokenValid } = useAuth();
   const { isAppDataReady } = useAppData();
   const router = useRouter();

   const [expanded, setExpanded] = useState(false);

   // Animation
   const expandAnim = useRef(new Animated.Value(0)).current;
   const contHeight = expandAnim.interpolate({
         inputRange: [0, 1],
         outputRange: [0, height - (insets.bottom + 24)],
         extrapolate: 'clamp'
   })
   const opacityAnim = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.parallel([
         Animated.timing(expandAnim, {
            delay: 300,
            toValue: 1,
            duration: 300,
            useNativeDriver: false
         }),
         Animated.timing(opacityAnim, {
            delay: 650,
            toValue: 1,
            duration: 150,
            useNativeDriver: false
         }),
      ]).start(() => {
         setExpanded(true);
      });
   }, [])

   useEffect(() => {
      if (!expanded || !isAuthReady || !isAppDataReady) return;

      setTimeout(() => {
         if (!hasOnboarded) {
            router.replace("/onboarding");
         } else if (!user || !isTokenValid) {
            router.replace("/authentication");
         } else {
            if (user?.role === "User") {
               router.replace("/dashboard/client");
            } else if (user?.role === "Worker") {
               router.replace("/dashboard/worker");
            }
         }
      }, 2000)

   }, [expanded, isAuthReady, isAppDataReady, isTokenValid])

   return (
      <View 
      style={{
         flex: 1,
         backgroundColor: '#58B7F3',
         alignItems: 'center',
         justifyContent: 'center',
         padding: 24,
      }}>
         <Animated.View
         style={{
            width: '100%',
            minHeight: contHeight,
            backgroundColor: '#fff',
            borderRadius: 24,
            overflow: 'hidden',
            position: 'relative'
         }}>
            <Animated.View 
            style={{
               gap: 6, 
               opacity: opacityAnim,
               width: '100%',
               justifyContent: 'center',
               alignItems: 'center',
               position: 'absolute',
               top: '50%',
               padding: 24,
               transform: [{translateY: '-50%'}]
            }}>
               <Text
               style={{
                  fontFamily: FONTS.nunito700,
                  fontSize: 40,
                  color: COLORS.primary,
                  textAlign: 'center'
               }}> 
               Handy<Text style={{color: COLORS.accent}}>Home</Text>
               </Text>
               <Text
               style={{
                  fontFamily: FONTS.nunito600,
                  // fontStyle: 'italic',
                  fontSize: FONT_SIZES.xl,
                  color: COLORS.lettersicons,
                  textAlign: 'center'
               }}>
               Para kay Maria. Para kay Juan. Para sa bawat tahanan.
               </Text>
            </Animated.View>
         </Animated.View> 
      </View>
   )
}

export default RootIndex

const styles = StyleSheet.create({})