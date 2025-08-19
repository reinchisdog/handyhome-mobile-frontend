// Component: Unverified Prompt

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Animated, Easing, Pressable, useWindowDimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router';
// ---- Styles and Icons
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';


const UnverifiedPrompt = ({ hidePrompt }) => {
   // Hooks and States
   const router = useRouter();
   const {width} = useWindowDimensions();
   // Refs
   const verifyX = useRef(new Animated.Value(0)).current;

   // Animations
   const closeVerify = () => {
      Animated.timing(verifyX, {
         toValue: -width,
         duration: 600,
         easing: Easing.bezier(0.76, 0, 0.24, 1),
         useNativeDriver: true
      }).start(() => {
         hidePrompt();
      })
   }

   return (
      <Animated.View
      style={[{
         gap: 16,
         marginHorizontal: 24,
         marginTop: 16,
         paddingHorizontal: 24,
         paddingVertical: 16,
         backgroundColor: '#fff',
         borderRadius: 20,

         transform: [{translateX: verifyX}]
      }]}>  
         <View
         style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
         }}>
            <Icons name='shield-check' size={24} color={COLORS.primary}/>
            <Text
            style={global.headingText}>
            <Text style={{color: COLORS.primary}}>Get Verified </Text>
            <Text style={{color: COLORS.lettersicons}}>to Book Services</Text>
            </Text>
         </View>

         <Text
         style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons
         }}
         >
            Verify your account to fully access booking features and ensure secure transactions.
         </Text>

         <View 
         style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
         }}>
            <Pressable 
            style={({pressed}) => [{
               backgroundColor: pressed ? COLORS.strokes : "transparent",
               height: 32,
               width: 100,
               borderRadius: 16,
               justifyContent: 'center',
               alignItems: 'center'
            }]}
            underlayColor='#0072bc'
            onPress={closeVerify}
            >
               <Text 
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons
               }}>
                  Maybe Later
               </Text>
            </Pressable>

            <Pressable 
            style={({pressed}) => [{
               backgroundColor: pressed ? COLORS.primaryPress : COLORS.primary,
               height: 32,
               width: 100,
               borderRadius: 16,
               justifyContent: 'center',
               alignItems: 'center'
            }]}

            onPress={() => {router.push('dashboard/client/verify/user')}}>
               <Text 
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.secondary
               }}>
                  Verify Now
               </Text>
            </Pressable>
         </View>
      </Animated.View>   
   )
}

export default UnverifiedPrompt

const styles = StyleSheet.create({})