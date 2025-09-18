// Screen: Appointment Payment

// Imports
// ---- React Components
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext';
import { useAppointment } from '../../../../../context/AppointmentContext';
// ---- Import Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomIcons from '../../../../../assets/customIcons';
// ---- Other Libraries
import api from '../../../../../lib/api';

const AppointmentPayment = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { width, height } = useWindowDimensions();

   const {token} = useAuth();
   const { summary, fetchSummary } = useAppointment();
   const [payment, setPayment] = useState(null);
   const [paymentLoading, setPaymentLoading] = useState(false);

   const [showError, setShowError] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);

   const paymentUpdate = async () => {
      try {
         setPaymentLoading(true);
         console.log("---- [Appointment Payment] Method Change Attempt ----");
         console.log(`[1] Changing Payment of Booking ${summary?.booking?.id} to ${payment}`);
         await api.put(`/user/book/${summary?.booking?.id}/update_payment_method/${payment}`, {}, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('[2] Succesfully Changed, Fetching Updated Summary');
         await fetchSummary(summary?.booking?.id);

         console.log("[3] Summary Fetch Succesful, Routing Back");
         router.back();
      } catch (err) {
         console.log("[0] Payment Change Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when changing the payment method. Please try again.";
         setErrorMessage(message);
         setShowError(true);
      } finally {
         setPaymentLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (!summary?.booking?.payment_method) return;

      setPayment(summary?.booking?.payment_method);
   }, [summary?.booking?.payment_method])

   return (
      <>
         <ErrorModal 
         visible={showError}
         setVisible={setShowError}
         title={"Payment Error"}
         message={errorMessage}
         />

         <ScrollView
         stickyHeaderIndices={[0]}
         style={global.screenContainer}
         contentContainerStyle={{
            minHeight: height,
            backgroundColor: COLORS.screenbg,
            paddingBottom: 224 + insets.bottom
         }}>
            <Header 
            hasBack
            backgroundColor='#fff'
            title='Payment Method'
            />

            <View
            style={{
               paddingVertical: 24,
               paddingHorizontal: 12,
               gap: 24
            }}>
               <View style={styles.method}>
                  <Text style={styles.title}>Cash</Text>
                  {/* ---- Cash */}
                  <Pressable onPress={() => {setPayment("Cash")}}
                  style={({pressed}) => [
                     styles.option, {
                     borderWidth: 2,
                     borderColor: pressed ? COLORS.lightblue : '#fff'
                  }]}>
                     <View 
                     style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                        flexShrink: 1,
                     }}>
                        <Icons name='cash-multiple' size={24} color={COLORS.primary}/>

                        <Text
                        style={{
                           textAlign: 'left',
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flexShrink: 1,
                        }}>
                           Cash
                        </Text>
                     </View>

                     <View
                     style={{
                        height: 24,
                        width: 24,
                        aspectRatio: 1/1,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: COLORS.labels,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.secondary
                     }}>
                        <View 
                        style={{
                           width: 16,
                           height: 16,
                           aspectRatio: 1/1,
                           borderRadius: 8,
                           backgroundColor: payment === 'Cash' ? COLORS.accent : COLORS.secondary
                        }}/>
                     </View>
                  </Pressable>
               </View>

               <View style={global.divider}/>

               <View style={styles.method}>
                  <Text style={styles.title}>More Payment Options</Text>
                  {/* ---- GCash */}
                  <Pressable onPress={() => {setPayment("GCash")}}
                  style={({pressed}) => [
                     styles.option, {
                     borderWidth: 2,
                     borderColor: pressed ? COLORS.lightblue : '#fff'
                  }]}>
                     <View 
                     style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                        flexShrink: 1,
                     }}>
                        <CustomIcons name="gcash" size={24} color={COLORS.primary}/>

                        <Text
                        style={{
                           textAlign: 'left',
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons,
                           flexShrink: 1,
                        }}>
                           GCash
                        </Text>
                     </View>

                     <View
                     style={{
                        height: 24,
                        width: 24,
                        aspectRatio: 1/1,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: COLORS.labels,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.secondary
                     }}>
                        <View 
                        style={{
                           width: 16,
                           height: 16,
                           aspectRatio: 1/1,
                           borderRadius: 8,
                           backgroundColor: payment === 'GCash' ? COLORS.accent : COLORS.secondary
                        }}/>
                     </View>
                  </Pressable>
               </View>

            </View>

            <View
            style={[
               global.shadowBottom, {
               position: 'absolute',
               bottom: 0,
               left: 0,
               right: 0,
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               paddingTop: 24,
               borderRadius: 20,
               backgroundColor: '#fff'
            }]}>
               <MainButton 
               type='primary'
               text={"Save"}
               loading={paymentLoading}
               onPress={paymentUpdate}
               />
            </View>
         </ScrollView>
      </>
   )
}

export default AppointmentPayment

const styles = StyleSheet.create({
   title: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.primary,
      textAlign: 'left',
      paddingHorizontal: 12
   },
   method: {
      gap: 12
   },
   option: {
      flexDirection: 'row',
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
   }
})