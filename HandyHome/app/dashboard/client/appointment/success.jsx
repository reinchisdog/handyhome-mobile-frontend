// Screen: Appointment Success

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import MainButton from '../../../../components/MainButton';
import SuccessMessage from '../../../../components/SuccessMessage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const AppointmentSuccess = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();
   
   return (
      <View
      style={[
         global.screenContainer,
         global.centerContainer, {
         backgroundColor: '#fff',
         position: 'relative',
      }]}>
         <SuccessMessage
         type='andy'
         title={'Booking Successful!'}
         body={'Your service is successfully booked. You can check your booking on the menu profile.'}
         />

         <View 
         style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 24,
            width: width
         }}>
            <MainButton
            type='secondary'
            text={"View My Bookings"}
            // onPress={() => router.replace('/dashboard/client/bookings')}
            onPress={() => router.replace('/dashboard/client')}
            />
         </View>
      </View>
   )
}

export default AppointmentSuccess

const styles = StyleSheet.create({})