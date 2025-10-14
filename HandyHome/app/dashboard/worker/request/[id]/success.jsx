// Screen: Request Success Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import SuccessMessage from '../../../../../components/SuccessMessage';
import MainButton from '../../../../../components/MainButton';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';

const RequestSuccessScreen = () => {
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width, height} = useWindowDimensions();

   return (
      <View
      style={[
         global.screenContainer,
         global.centerContainer, {
         backgroundColor: '#fff',
         position: 'relative',
      }]}>
         <SuccessMessage
         type='neutral'
         title={'Wait for confirmation'}
         body={
            <Text>
            Please check regularly if the client will proceed with the booking. In the meantime, we advise <Text style={{
               color: COLORS.accent,
               fontFamily: FONTS.roboto500
            }}>not to purchase any materials until 1 day before the scheduled service date</Text>, as bookings can be cancelled at any time.
            </Text>
         }/>

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
            text={"Back to Home"}
            onPress={() => router.replace('/dashboard/worker')}
            />
         </View>
      </View>
   )
}

export default RequestSuccessScreen

const styles = StyleSheet.create({})