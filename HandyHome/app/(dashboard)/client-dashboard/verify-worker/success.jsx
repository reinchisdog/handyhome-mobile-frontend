import { View, Animated, useWindowDimensions, Easing, Text, TouchableHighlight, StyleSheet } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useRouter} from 'expo-router';
import { useClientVerification } from '../../../../context/ClientVerificationContext';
/* ------------------------------- Components ------------------------------- */
import SuccessCheck from '../../../../assets/images/illustrations/SuccessCheck';
/* ---------------------------- Styles and Icons ---------------------------- */
import { globalStyles as global } from '../../../../styles/globalStyles';
import { launchStyles as launch } from '../../../../styles/launchStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const SuccessScreen = () => {
   const route = useRouter();
   const {width, height} = useWindowDimensions();
 
   const imageAnimation = useRef(new Animated.Value(0)).current;
 
   const imageRotation = imageAnimation.interpolate({
     inputRange: [0, 1],
     outputRange: ['-180deg', '0deg'],
     extrapolate: 'clamp'
   })
 
   useEffect(() => {
     Animated.timing(imageAnimation, {
       toValue: 1,
       duration: 1000,
       useNativeDriver: true,
       easing: Easing.bezier(0.22, 1, 0.36, 1)
     }).start();
     
   }, []);
 
   return (
      <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
         <View style={[
            global.centerContainer, {
            flex: 1,
            width,
            zIndex: 4,
            position: 'relative',
            backgroundColor: '#fff',
            gap: 24,
         }]}>
         
            <Animated.View 
               style={{
               transform: [{rotate: imageRotation}]
               }}
            >
               <SuccessCheck />
            </Animated.View>
      
            <View style={[{height: 96}]}>
               <Text style={[launch.title]}>
               Application Submitted!
               </Text>
               <Text style={[launch.description, {paddingHorizontal: 24}]}>
               Thank you for your interest in applying as a HandyHome Service Provider! You will be notified once your application is reviewed and approved.
               </Text>
            </View>
      
            <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
               <TouchableHighlight style={global.secondaryBtn}
               underlayColor="#d8d8d8"
               onPress={() => route.replace('/client-dashboard/(tabs)/')}>
               <Text style={global.secondaryBtnText}>Back To Home</Text>
               </TouchableHighlight>
            </View>
         </View>
      </View>
   );
}

export default SuccessScreen

const styles = StyleSheet.create({})