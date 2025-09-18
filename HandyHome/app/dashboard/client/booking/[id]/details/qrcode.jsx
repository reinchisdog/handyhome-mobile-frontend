// Screen: QR Code Screen

// Imports
// ---- React and Expo Components
import { Image, StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import Header from '../../../../../../components/Header';
import QRCode from 'react-native-qrcode-svg';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES, } from '../../../../../../styles/constants';
// ---- Other Libraries
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';

const QrCodeScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();
   const {details} = useBookingDetails();
   const {id} = useLocalSearchParams();

   // Render
   const renderDate = (dateStr, timeStr) => {
      if (timeStr === "24:00:00") {
         let date = new Date(dateStr);

         date.setDate(date.getDate() + 1);

         let formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
         });

         return `${formattedDate} | "12:00 AM"`;
      }

      let dateTime = new Date(`${dateStr}T${timeStr}`);
      let formattedDate = dateTime.toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
      let formattedTime = dateTime.toLocaleTimeString("en-US", {
         hour: "numeric",
         minute: "2-digit",
      });

      return `${formattedDate} | ${formattedTime}`;
   }

   return (
      <ScrollView 
      stickyHeaderIndices={[0]}
      style={[
         global.screenContainer, {
         backgroundColor: COLORS.primary
      }]}>
         <Header 
         hasBack
         backColor='#fff'
         backgroundColor={COLORS.primary}
         title='Service QR'
         textColor='#fff'
         />
         
         <View
         style={{
            flex: 1,
            // backgroundColor: 'green',
            padding: 24,
            justifyContent: 'center',
            alignItems: 'center',
         }}>
            <View
            style={{
               backgroundColor: '#fff',
               padding: 24,
               width: '100%',
               borderRadius: 12,
               gap: 6,
               alignItems: 'center'
            }}>
               <Text
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.xxl,
                  color: COLORS.darkblue,
                  textAlign: 'center',
                  marginBottom: 12,
               }}>
                  {details?.serviceName}
               </Text>
                  
               <Text
               style={{
                  fontSize: FONT_SIZES.md,
                  fontFamily: FONTS.roboto400,
                  color: COLORS.labels,
                  textAlign: 'center'
               }}>
                  Client: <Text style={{
                     fontFamily: FONTS.roboto600,
                     color: COLORS.primary,
                     textAlign: 'center'
                  }}>
                     {details?.user?.name}
                  </Text>
               </Text>

               <View 
               style={{
                  marginVertical: 12,
                  padding: 24,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: COLORS.strokes,
                  // width: '100%',
                  alignItems: 'center'
               }}>
                  <QRCode 
                  value={
                     details?.status === 'Upcoming' ? details?.start_qr_token :
                     details?.status === 'Ongoing' || details?.status === 'Pending' ? details?.end_qr_token : null
                  }
                  color={COLORS.lettersicons}
                  size={(width - 144) <= 200 ? (width - 144) : 200}
                  />

               </View>
               
               <View
               style={{
                  gap: 0
               }}>
                  <Text
                  style={{
                     fontSize: FONT_SIZES.md,
                     fontFamily: FONTS.roboto400,
                     color: COLORS.labels,
                     textAlign: 'center'
                  }}>
                     Assigned Provider:
                  </Text>

                  <Text
                  style={{
                     fontSize: FONT_SIZES.md,
                     fontFamily: FONTS.roboto600,
                     color: COLORS.accent,
                     textAlign: 'center'
                  }}>
                     {details?.worker?.name}
                  </Text>
               </View>

               <Text
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.labels,
                  fontStyle: 'italic',
                  marginTop: 24
               }}>
                  {renderDate(details?.date, details?.time)}
               </Text>
               
               
            </View>
         </View>
      </ScrollView>
   )
}

export default QrCodeScreen

const styles = StyleSheet.create({})