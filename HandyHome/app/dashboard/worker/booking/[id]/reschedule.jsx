// Screen: Booking Rescheduling

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions, Pressable, Modal, ScrollView, Image} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext';
import { useBookingDetails } from '../../../../../context/BookingDetailsContext';
import api from '../../../../../lib/api';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import GeneralModal from '../../../../../components/GeneralModal'
import ErrorModal from '../../../../../components/ErrorModal';
import InputDateTime from '../../../../../components/InputDateTime';
import DatePicker from 'react-native-date-picker'
import {useConvert} from '../../../../../hooks/useConvert';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { ServiceCategoryImages } from '../../../../../components/ServiceCategoryMap';

const WorkerReschedule = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const {convertDateToFormattedDate, convertDateToTime24} = useConvert();
   const { width, height } = useWindowDimensions();
   const { id } = useLocalSearchParams();
   const {token} = useAuth();
   const { details, detailsLoading, fetchDetails } = useBookingDetails();

   const [rescheduleLoading, setRescheduleLoading] = useState(false);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const handleReschedule = async (status) => {
      try {
         setRescheduleLoading(true);

         console.log(status);
         const response = await api.put(`/worker/book/${id}/update/${status}`, null, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log(`${status.toUpperCase()}ING RESPONSE:`, response?.data);
         router.back();
      } catch (err) {
         // console.log(err);
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when attempting to submit a rescheduling request.";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setRescheduleLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (!id) return;

      fetchDetails(id, 'worker');
   }, [id])

   // Render
   const formatDateTime = (date, time, separator = ' | ') => {
      if (!date) return;
      
      let dateObj, hour, minutes;
      
      // Check if date is in ISO format (YYYY-MM-DDTHH:MM:SS)
      if (date.includes('T')) {
         dateObj = new Date(date);
         hour = dateObj.getHours();
         minutes = dateObj.getMinutes().toString().padStart(2, '0');
      } else {
         // Original format: separate date and time strings
         if (!time) return;
         
         // Parse the date string (YYYY-MM-DD)
         const [year, month, day] = date.split('-');
         dateObj = new Date(year, month - 1, day);
         
         // Parse the time string (HH:MM:SS)
         const [hours, mins] = time.split(':');
         hour = parseInt(hours);
         minutes = mins;
      }
      
      // Get month name
      const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
      const day = dateObj.getDate();
      
      // Convert to 12-hour format
      const period = hour >= 12 ? 'pm' : 'am';
      const hour12 = hour % 12 || 12;
      
      // Format the result
      return `${monthName} ${day}${separator}${hour12}:${minutes} ${period}`;
   }

   const formatDate = (dateString) => {
      if (!dateString) return;
  
      // Handle both YYYY-MM-DD and ISO format (YYYY-MM-DDTHH:MM:SS)
      const date = new Date(dateString.split('T')[0]);
      
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      const day = date.getDate();
      const year = date.getFullYear();
      
      return `${monthName} ${day}, ${year}`;
   };

   const formatTime = (timeString) => {
      if (!timeString) return;
  
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      
      return `${hour12}:${minutes} ${period}`;
   }

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={'Something went wrong!'}
         message={errorMessage}
         />

         {detailsLoading &&
            <View style={{
               position: 'absolute',
               justifyContent: 'center',
               alignItems: 'center',
               top: 0,
               left: 0,
               width: width,
               height: height,
               backgroundColor: '#fff',
               zIndex: 999999
            }}>
               <LoadingDots slide={false}/>
            </View>
         }

         <Header 
         hasBack
         title={"Reschedule Booking"}
         backgroundColor='#fff'
         />

         <ScrollView
         style={[
            global.screenContainer, {
            backgroundColor: COLORS.screenbg
         }]}
         contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 24,
            gap: 12,
            paddingBottom: insets.bottom + 48 + 120
         }}>
            <View style={[styles.container]}>
               <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                  Service Details
               </Text>
               <View style={[styles.sectionView, {flexDirection: 'row', gap: 12, alignItems: 'center'}]}>
                  <Image 
                  source={ServiceCategoryImages[details?.subServiceId]}
                  style={{
                     borderRadius: 8,
                     width: 64,
                     height: 64
                  }}/>
                  <View style={{flex: 1}}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.primary
                     }}>
                        {details?.serviceCategory}
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.labels
                     }}>
                        {details?.serviceName}
                     </Text>

                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        {formatDateTime(details?.date, details?.time)}
                     </Text>
                  </View>
               </View>
               
               <View style={{paddingHorizontal: 24}}>
                  <View style={global.divider} />
               </View>
               
               <View style={[styles.sectionView,]}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                     <Icons name='account' size={20} color={COLORS.primary}/>
                     <Text style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                        flexShrink: 1
                     }}>
                        {details?.user?.name}
                     </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                     <Icons name='wrench' size={20} color={COLORS.red}/>
                     <Text style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                        flexShrink: 1
                     }}>
                        {details?.worker?.name}
                     </Text>
                  </View>
               </View>
            </View>

            <View style={[styles.container]}>
               <Text
               style={{
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.accent,
                  textAlign: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  paddingBottom: 6
               }}>
                  Do you want to accept this rescheduling request for this booking?
               </Text>

               <Text
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels,
                  textAlign: 'justify',
                  paddingHorizontal: 24,
                  paddingTop: 0,
                  paddingBottom: 24
               }}>
                  You have 24 hours to respond to this request. If you accept, the booking will be updated to the new date and time below.
               </Text>

               <View style={{paddingHorizontal: 24}}>
                  <View style={global.divider} />
               </View>

               <View style={[styles.sectionView, {gap: 4, paddingVertical: 12, paddingHorizontal: 24}]}>
                  
                  <View style={{
                     flexDirection: 'row', 
                     alignItems: 'center',
                     gap: 8,
                     justifyContent: 'space-between'
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.labels
                     }}>
                        New Date:
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        {formatDate(details?.reschedule?.date)}
                     </Text>
                  </View>
                  
                  <View style={{
                     flexDirection: 'row', 
                     alignItems: 'center',
                     gap: 8,
                     justifyContent: 'space-between'
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.labels
                     }}>
                        New Time:
                     </Text>
                      <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        {formatTime(details?.reschedule?.time)}
                     </Text>
                  </View>
               </View>
            </View>
         </ScrollView>
         
         {!detailsLoading &&
            <View
            style={[
               global.shadowBottom, {
               paddingTop: 24,
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               borderWidth: StyleSheet.hairlineWidth,
               borderColor: COLORS.strokes,
               backgroundColor: '#fff',
               borderTopLeftRadius: 24,
               borderTopRightRadius: 24,
               flexDirection: 'column',
               gap: 16,
               alignItems: 'stretch',
               position: 'absolute',
               bottom: 0,
               width: width,
               zIndex: 1
            }]}>
               <MainButton 
               type='primary'
               text='Accept Schedule'
               loading={rescheduleLoading}
               onPress={() => handleReschedule('Accepted')}
               />

               <MainButton 
               type='secondary'
               text='Reject Schedule'
               loading={rescheduleLoading}
               onPress={() => handleReschedule('Rejected')}
               />
            </View>
         }
      </View>
   )
}

export default WorkerReschedule

const styles = StyleSheet.create({
   container: {
      borderRadius: 12,
      backgroundColor: '#fff',
      overflow: 'hidden'
   },
   sectionView: {
      padding: 12,
      gap: 6
   },
   sectionPressable: {
      padding: 6,
      gap: 6,
      borderRadius: 6
   },
   content : {
      gap: 6,
      padding: 6,
      flexShrink: 1
   },
   sectionTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels
   }
})