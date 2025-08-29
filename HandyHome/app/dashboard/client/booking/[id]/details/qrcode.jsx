// Screen: QR Code Screen

// Imports
// ---- React and Expo Components
import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
// ---- Other Components
import Header from '../../../../../../components/Header';
import QRCode from 'react-native-qrcode-svg';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZESN } from '../../../../../../styles/constants';
// ---- Other Libraries
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';

const QrCodeScreen = () => {
   // Hooks and States
   const router = useRouter();
   const {details} = useBookingDetails();
   const {id} = useLocalSearchParams();

   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.primary}]}>
         <Header 
         hasBack
         backColor='#fff'
         backgroundColor={COLORS.primary}
         title='Service QR'
         textColor='#fff'
         />
         <Image 
         source={{uri: details?.start_qr_token}}
         height={400}
         width={400}
         />
      </View>
   )
}

export default QrCodeScreen

const styles = StyleSheet.create({})