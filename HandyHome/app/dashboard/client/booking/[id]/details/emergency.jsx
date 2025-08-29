// Screen: Emergency Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Animated, StatusBar } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
import MainButton from '../../../../../../components/MainButton';

const EmergencyScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { id } = useLocalSearchParams();
   const { handleEmergency, emergencySuccess, clearEmergency } = useBookingDetails();

   const countdown = 5;
   const [timer, setTimer] = useState(countdown);

   // Animation
   const circleLoop = useRef(new Animated.Value(0)).current;
   const circleSize = circleLoop.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 300],
      extrapolate: 'clamp'
   })
   const circleOpacity = circleLoop.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 0],
      extrapolate: 'clamp'
   })

   // Effects
   useEffect(() => {
      if (timer > 0){
         setTimeout(() => {
            setTimer(prev => prev - 1);
         }, 1000)
      } else {
         handleEmergency(id);
      }
   }, [timer])

   useEffect(() => {
      circleLoop.setValue(0);
      Animated.loop(
         Animated.timing(circleLoop, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
         })
      ).start(() => {
         
      });
   }, []);

   return (
      <View
      style={[
         global.screenContainer, {
         backgroundColor: '#000',
         position: 'relative',
         paddingTop: StatusBar.currentHeight + 24
      }]}>
         {/* ---- Top */}
         <View 
         style={{
            width: '100%', 
            paddingHorizontal: 24
         }}>
            <Text style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: '#fff',
               textAlign: 'center'
            }}>
               Notifying Admins and Emergency Contacts...
            </Text>
            <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: 48,
               color: '#fff',
               textAlign: 'center'
            }}>
               EMERGENCY
            </Text>
         </View>

         {/* ---- Middle */}
         <View 
         style={{
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: 24
         }}>
            <View 
            style={{
               justifyContent: 'center',
               alignItems: 'center',
               position: 'relative'
            }}>
               {(timer > 0) ? <CountdownCircle timer={timer}/> : <EmergencyMessage />}
               <Animated.View style={[
                  styles.circleItem, {
                  height: circleSize,
                  opacity: circleOpacity,
                  zIndex: 0,
               }]} />
            </View>
         </View>

         {/* ---- Bottom */}
         <View style={[
            global.buttonsContainer, {
            paddingBottom: insets.bottom
         }]}>
            <MainButton 
            type='alert'
            text={emergencySuccess ? "Go Back" : "Cancel"}
            onPress={() => {
               clearEmergency();
               router.back();
            }}
            />
         </View>
      </View>
   )
}

const CountdownCircle = ({timer}) => {
   return (
      <View 
      style={[
         styles.circleItem, 
         global.centerContainer, {
         height: 124,
         zIndex: 1,
      }]}>
         <Text style={{
            fontFamily: FONTS.roboto600,
            fontSize: 48,
            color: '#fff'
         }}>
            {timer}
         </Text>
      </View>
   )
}

const EmergencyMessage = () => {
   const [periods, setPeriods] = useState(0);
   useEffect(() => {
      setTimeout(() => {
         if (periods === 3) setPeriods(0)
         else setPeriods(prev => prev + 1)
      }, 500)
      
   }, [periods])

   return (
      <View style={{gap: 12, position: 'absolute', zIndex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <Icons name="alarm-light" size={40} color={COLORS.red} />
         <Text style={{
            fontFamily: FONTS.roboto600,
            fontSize: FONT_SIZES.xxl,
            color: '#fff',
             textAlign: 'center'
         }}>
            {`Sending Location and Booking Details to Admin and Emergency Contacts${".".repeat(periods)}`}
         </Text>
      </View>
   )
}

export default EmergencyScreen;

const styles = StyleSheet.create({
   circleItem: {
      aspectRatio: '1/1',
      backgroundColor: COLORS.red,
      borderRadius: '50%',
      position: 'absolute',
   },
})