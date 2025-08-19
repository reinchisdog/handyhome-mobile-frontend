// Screen: Appointment Start Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
// ---- Contexts
import { useAppointment } from '../../../../context/AppointmentContext'
import { useAuth } from '../../../../context/AuthContext';
// ---- Other Components
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Header from '../../../../components/Header';
import { ServiceCategoryImages } from '../../../../components/ServiceCategoryMap';
import InputDateTime from '../../../../components/InputDateTime';
import DatePicker from 'react-native-date-picker'
import Multiline from '../../../../components/Multiline';
import MediaUpload from '../../../../components/MediaUpload';
import MainButton from '../../../../components/MainButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Icons and Styles
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const MAX_DESCRIPTION = 2000;
const MAX_IMAGES = 1;

const AppointmentStartScreen = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const {height} = useWindowDimensions();
   
   const { categoryId, categoryName, serviceId, serviceName } = useLocalSearchParams();
   const { user } = useAuth();
   const { appointment, setAppointment, appointmentLoading, createAppointment } = useAppointment();
   
   const [datePickerOpen, setDatePickerOpen] = useState(false);
   const [datePickerMode, setDatePickerMode] = useState(false);
   const [descriptionExceed, setDescriptionExceed] = useState(false);
   const [buttonDisabled, setButtonDisabled] = useState(true);
  
   // Functions
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

   const openDateTime = (mode) => {
      setDatePickerMode(mode);
      setDatePickerOpen(true);
   }

   const setDateTime = (mode, value) => {
      setAppointment(prev => ({
         ...prev,
         [mode]: value
      }))
      setDatePickerOpen(false);
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

   // Effects
   useEffect(() => {
      setAppointment(prev => ({
         ...prev,
         service_id: serviceId,
         sub_service_id: categoryId,
      }))
   }, [])

   useEffect(() => {
      const isEmpty = appointment.description.length === 0 || !appointment.date || !appointment.time;
      const isTooLong = appointment.description.length > MAX_DESCRIPTION;

      setButtonDisabled(isEmpty || isTooLong);
      setDescriptionExceed(isTooLong);
   }, [appointment.description, appointment.date, appointment.time]);


   return (
      <>
         <DatePicker 
         modal
         open={datePickerOpen}
         date={appointment[datePickerMode] || getMinDate()}
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

         <KeyboardAwareScrollView
         stickyHeaderIndices={[0]}
         style={global.screenContainer}
         contentContainerStyle={[{
            minHeight: height,
            backgroundColor: COLORS.screenbg
         }]} >
            <Header 
            hasBack
            backgroundColor={COLORS.screenbg}
            />

            <View 
            style={{
               flex: 1,
               marginHorizontal: 12,
               paddingHorizontal: 12,
               paddingVertical: 24,
               paddingBottom: 0,
               borderRadius: 24,
               backgroundColor: '#fff',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'space-between',
               gap: 24,
            }}>
               {/* ---- Content */}
               <View style={{gap: 24, flex: 1,}}>
                  {/* ---- Greetings */}
                  <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     gap: 16,
                     width: '100%'
                  }}>
                     <Image
                     source={require(`../../../../assets/images/logos/square-logo-1.png`)}
                     style={{
                        height: 42,
                        width: 42,
                     }}
                     />

                     <Text
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                        textAlign: 'left',
                        flexShrink: 1,
                     }}>
                        Hi, <Text style={{fontFamily: FONTS.roboto700, color: COLORS.primary}}>{user.full_name} !</Text> To proceed with the booking, let’s assess the issue.
                     </Text>
                  </View>
                  
                  <View 
                  style={{
                     height: 1, 
                     minWidth: '100%',
                     backgroundColor: COLORS.strokes,
                     borderRadius: 0.5
                  }} />

                  {/* ---- Service Information */}
                  <View
                  style={{
                     flexDirection: 'row',
                     alignItems: 'stretch',
                     gap: 16,
                     width: '100%', 
                  }}>
                     <Image 
                     source={ServiceCategoryImages[`${categoryId}`]}
                     style={{ height: '100%', width: 80, borderRadius: 4, resizeMode: 'cover' }}
                     />

                     <View
                     style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        paddingVertical: 10,
                        gap: 10,
                     }}>
                        <Text
                        style={{
                           borderRadius: 8,
                           backgroundColor: COLORS.lightblue,
                           paddingHorizontal: 10,
                           paddingVertical: 4,
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.lettersicons,
                           flexShrink: 1,
                        }}>
                           {serviceName}
                        </Text>

                        <Text
                        style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons
                        }}>
                           {categoryName}
                        </Text>
                     </View>
                  </View>
                  
                  <View 
                  style={{
                     height: 1, 
                     minWidth: '100%',
                     backgroundColor: COLORS.strokes,
                     borderRadius: 0.5
                  }} />

                  {/* ---- Date and Time */}
                  <View style={{ gap: 16 }}>
                     <Text 
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        Date & Time
                     </Text>

                     <InputDateTime 
                     type = "date"
                     placeholder = "Set a Date"
                     value = {formatDate(appointment.date)}
                     onPress = {() => openDateTime("date")}
                     />

                     <InputDateTime 
                     type = "time"
                     placeholder = "Set a Time"
                     value = {formatTime(appointment.time)}
                     onPress = {() => openDateTime("time")}
                     />
                     
                  </View>

                  <View 
                  style={{
                     height: 1, 
                     minWidth: '100%',
                     backgroundColor: COLORS.strokes,
                     borderRadius: 0.5
                  }} />

                  {/* ---- Details Prompt */}
                  <View style={{ gap: 16 }}>
                     <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                     }}>
                        <Text 
                        style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons
                        }}>
                           Description
                        </Text>

                        <Text
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: descriptionExceed ? COLORS.red : COLORS.strokes
                        }}>
                           {`${appointment.description.length} / ${MAX_DESCRIPTION}`}
                        </Text>
                     </View>

                     <Multiline 
                     placeholder='Describe the problem you are facing...'
                     numberOfLines={8}
                     value={appointment}
                     onChangeText={(e) => setAppointment(prev => ({
                        ...prev,
                        description: e
                     }))}
                     />

                     <MediaUpload 
                     maxMedia={MAX_IMAGES}
                     data={appointment.attachment}
                     dataName={"attachment"}
                     setData={setAppointment}
                     />
                     
                  </View>
               </View>

               {/* ---- Button */}
               <View style={{paddingBottom: insets.bottom, width: '100%'}}>
                  <MainButton 
                  type='secondary'
                  text={"Proceed"}
                  disabled={buttonDisabled}
                  loading={appointmentLoading}
                  onPress={createAppointment}
                  />
               </View>
               
            </View>

            
         </KeyboardAwareScrollView>
      </>
   )
}

export default AppointmentStartScreen;
