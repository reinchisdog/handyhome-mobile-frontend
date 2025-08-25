// Screen: Appointment Failed (No Workers Found)

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import MainButton from '../../../../components/MainButton';
import SuccessMessage from '../../../../components/SuccessMessage';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const AppointmentFailed = () => {
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
         type='fail'
         title={'Failed to find a worker'}
         body={"Sorry for the inconvenience. All service providers are currently unavailable. Please try booking another date and time. Thank you for your understanding."}
         />

         <View
         style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: insets.bottom,
            paddingHorizontal: 24,
            width: width
         }}>
            <MainButton 
            type='secondary'
            text={'Go back to Home'}
            onPress={() => router.replace('/dashboard/client')}
            />
         </View>
      </View>
   )
}

export default AppointmentFailed

const styles = StyleSheet.create({})