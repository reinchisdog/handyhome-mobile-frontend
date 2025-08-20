// Screen: Appointment Queue Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Contexts
import { useAppointment } from '../../../../context/AppointmentContext';
// ---- Other Components
import MainButton from '../../../../components/MainButton';
import LoadingDots from '../../../../components/LoadingDots';
import ErrorModal from '../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const AppointmentQueueScreen = () => {
   // Hooks and States
   const { appointmentLoading } = useAppointment();
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();

   return (
      <View style={[
         global.screenContainer, 
         global.centerContainer, {
         paddingHorizontal: 24, 
         backgroundColor: '#fff', 
         position: 'relative'
      }]}>
         {appointmentLoading ? (
            <>
               <View style={{gap: 48, alignItems: 'center'}}>
                  <LoadingDots />
                  <Text
                  style={{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons,
                     alignItems: 'center'
                  }}>
                     Finding the<Text style={{color: COLORS.primary}}> best available provider </Text>for you.
                  </Text>
               </View>

               <View 
               style={{
                  paddingBottom: insets.bottom, 
                  paddingHorizontal: 24, 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0,
                  width: width,
               }}>
                  <MainButton
                  type='secondary'
                  text={"Cancel Appointment"}
                  />
               </View>
            </>
         ) : (
            <>
            </>
         )}
      </View>
   )
}

export default AppointmentQueueScreen

const styles = StyleSheet.create({})