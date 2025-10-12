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

const ClientReschedule = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const {convertDateToFormattedDate, convertDateToTime24} = useConvert();
   const { width, height } = useWindowDimensions();
   const { id } = useLocalSearchParams();
   const {token} = useAuth();
   const { details, detailsLoading, fetchDetails } = useBookingDetails();

   const [datePickerOpen, setDatePickerOpen] = useState(false);
   const [datePickerMode, setDatePickerMode] = useState(false);

   const [reschedule, setReschedule] = useState({
      date: null,
      time: null
   })
   const [rescheduleLoading, setRescheduleLoading] = useState(false);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const submitReschedule = async () => {
      try {
         setRescheduleLoading(true);

         if (!reschedule.date) throw new Error('Rescheduling date is empty. Please select one to proceed.');
         if (!reschedule.time) throw new Error('Rescheduling time is empty. Please select one to proceed.');

         const converted = {
            ...reschedule,
            date: convertDateToFormattedDate(reschedule.date),
            time: convertDateToTime24(reschedule.time),
         }

         const detailsDateArr = details?.date?.split('-');
         const detailsDate = `${detailsDateArr[1]}-${detailsDateArr[2]}-${detailsDateArr[0]}`;
         const detailsTime = details?.time.slice(0, 5);

         if (converted.date === detailsDate && (converted.time === detailsTime)) {
            throw new Error('Rescheduling time should be different when rescheduling on the same date. Please select a different one to proceed.');
         }

         let response;
         if (!details?.reschedule) {
            console.log("POST RESCHEDULE");
            response = await api.post(`/user/book/${id}/reschedule`, converted, {
               headers: {'Authorization': `Bearer ${token}`}
            });
         } else {
            console.log("PUT RESCHEDULE");
            response = await api.put(`/user/book/${id}/reschedule/update`, converted, {
               headers: {'Authorization': `Bearer ${token}`}
            });
         }

         console.log('RESCHEDULING RESPONSE:', response?.data);
         await fetchDetails(id, 'user');
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when attempting to submit a rescheduling request.";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setRescheduleLoading(false);
      }
   }

   const cancelReschedule = async () => {
      try {
         setRescheduleLoading(true);

         const response = await api.delete(`/user/book/${id}/reschedule/cancel`, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('CANCELLING RESPONSE:', response?.data);
         fetchDetails(id, 'user');
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when attempting to submit a rescheduling request.";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setRescheduleLoading(false);
      }
   }

   const openDateTime = (mode) => {
      setDatePickerMode(mode);
      setDatePickerOpen(true);
   }

   const setDateTime = (mode, value) => {
      setReschedule(prev => ({
         ...prev,
         [mode]: value
      }))
      setDatePickerOpen(false);
   }

   // Effects
   useEffect(() => {
      if (!id) return;

      fetchDetails(id, 'user');
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

   const getExpiration = (dateStr) => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + 1);

      const dateString = date.toISOString();
      console.log(dateString);

      return formatDateTime(dateString, null, ' - ');
   }

   const formatDate = (date) => {
      if (!date) return '';
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();

      return `${month}-${day}-${year}`;
   };

   const formatTime = (date) => {
      if (!date) return '';
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
   }

   const getMinDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
   }

   const getMaxDate = () => {
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      threeMonthsLater.setHours(23, 59, 59, 999);
      return threeMonthsLater;
   }

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={'Something went wrong!'}
         message={errorMessage}
         />

         <DatePicker 
         modal
         open={datePickerOpen}
         date={reschedule[datePickerMode] || getMinDate()}
         mode={datePickerMode}
         is24hourSource="locale"
         locale="en"
         onConfirm={(date) => {setDateTime(datePickerMode, date)}}
         onCancel={() => {setDatePickerOpen(false)}}
         theme='light'
         dividerColor={COLORS.accent}
         minimumDate={getMinDate()}
         maximumDate={getMaxDate()}
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
            
            {details?.reschedule?.status === "Pending" &&
               <View style={[styles.container]}>
                  <View style={[styles.sectionView, {padding: 24, gap: 12}]}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.accent,
                        textAlign: 'center'
                     }}>
                        Your request is currently pending
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify',
                        lineHeight: FONT_SIZES.lg
                     }}>
                        The worker has been notified of this reschedule request. Please wait until <Text style={{
                           fontFamily: FONTS.roboto500, color: COLORS.red}}>
                              {getExpiration(details?.reschedule?.created_at)}
                        </Text> for a response. Otherwise, this rescheduling will be automatically accepted and proceed to booking.
                     </Text>
                  </View>
               </View>
            }

            {details?.reschedule?.status === "Rejected" &&
               <View style={[styles.container]}>
                  <View style={[styles.sectionView, {padding: 24, gap: 12}]}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.red,
                        textAlign: 'center'
                     }}>
                        Your reschedule request has been Rejected
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify',
                        lineHeight: FONT_SIZES.lg
                     }}>
                        Submit a new request with a different date and time below. If none of the available times work, you can cancel this booking and create a new one.
                     </Text>
                  </View>
               </View>
            }

            {details?.reschedule?.status === "Accepted" &&
               <View style={[styles.container]}>
                  <View style={[styles.sectionView, {padding: 24, gap: 12}]}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.green,
                        textAlign: 'center'
                     }}>
                        Your reschedule request has been Accepted
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify',
                        lineHeight: FONT_SIZES.lg
                     }}>
                        Your reschedule request has been accepted. The booking has been updated to the new date and time. To make further changes, you'll need to cancel and create a new booking.
                     </Text>
                  </View>
               </View>
            }

            {/* RESCHEDULE PROMPT */}
            {(!details?.reschedule || details?.reschedule?.status === "Rejected") &&
               <View style={[styles.container]}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.lg,
                     color: COLORS.accent,
                     textAlign: 'center',
                     padding: 12,
                     paddingBottom: 6
                  }}>
                     Are you sure you want to reschedule your booking?
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
                     Select a new date and time for your appointment. Changes are subject to the worker's availability and must be made at least 24 hours in advance.
                  </Text>

                  <View style={{paddingHorizontal: 24}}>
                     <View style={global.divider} />
                  </View>

                  <View style={[styles.sectionView, {gap: 16, paddingVertical: 24}]}>
                     <InputDateTime 
                     type = "date"
                     placeholder = "Set new Date"
                     value = {formatDate(reschedule?.date)}
                     onPress = {() => openDateTime("date")}
                     />

                     <InputDateTime 
                     type = "time"
                     placeholder = "Set new Time"
                     value = {formatTime(reschedule?.time)}
                     onPress = {() => openDateTime("time")}
                     />
                  </View>
               </View>
            }

            
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
               {details?.reschedule?.status === "Pending" &&
                  <MainButton 
                  type='secondary'
                  text='Cancel Rescheduling'
                  loading={rescheduleLoading}
                  onPress={cancelReschedule}
                  />
               }

               {!details?.reschedule &&
                  <MainButton 
                  type='primary'
                  text='Reschedule Booking'
                  loading={rescheduleLoading}
                  onPress={submitReschedule}
                  />
               }

               {details?.reschedule?.status === "Rejected" &&
                  <MainButton 
                  type='primary'
                  text='Reschedule Again'
                  loading={rescheduleLoading}
                  onPress={submitReschedule}
                  />
               }

               {details?.reschedule?.status === "Rejected" || details?.reschedule?.status === "Accepted" &&
                  <MainButton 
                  type='secondary'
                  text='Cancel Booking'
                  // loading={rescheduleLoading}
                  onPress={() => router.replace({
                     pathname: `/dashboard/client/booking/[id]/cancel`,
                     params: {id: id}
                  })}
                  />
               }
            </View>
         }
      </View>
   )
}

export default ClientReschedule

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