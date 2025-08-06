import { StyleSheet, Text, View, TouchableOpacity, Pressable, useWindowDimensions, Animated, Image, StatusBar } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../../context/AuthContext';
import { useAppointment } from '../../../../context/AppointmentContext';
import axios from 'axios';
import { API_URL } from '../../../../config';

import Header from '../../../../components/dashboard/Header';
import BasicMultiline from '../../../../components/authentication/BasicMultiline';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainButton from '../../../../components/MainButton';
import ErroModal from '../../../../components/ErrorModal';
import { subServiceImages } from '../../../../components/SubServiceMap';

import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'
import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialIcons';

const IMAGE_HEIGHT = 272;

const CientSchedule = () => {
   /* ----------------------------- Initialization ----------------------------- */
   const insets = useSafeAreaInsets();
   const router = useRouter();

   const { id, subName, mainId, mainName } = useLocalSearchParams();
   const { width, height } = useWindowDimensions();
   const { token } = useAuth();
   const { setAppointment } = useAppointment();

   const scrollY = useRef(new Animated.Value(0)).current;

   const headerColor = scrollY.interpolate({
      inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
      outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
      extrapolate: 'clamp',
   });

   const headerText = scrollY.interpolate({
   inputRange: [IMAGE_HEIGHT-64-10-StatusBar.currentHeight, IMAGE_HEIGHT-64],
   outputRange: [0, 1],
   extrapolate: 'clamp',
   });

   /* ---------------------------- DateTime Handlers --------------------------- */
   const [showPicker, setShowPicker] = useState(false);
   const [pickerMode, setPickerMode] = useState('date');

   const showPickerMode = (mode) => {
      setPickerMode(mode);
      setShowPicker(true);
   }

   const showDatePicker = () => {
      // console.log("date click")
      showPickerMode('date')
   }

   const showTimePicker = () => {
      // console.log("time click")
      showPickerMode('time')
   }

   const handleDateTime = (event, selectedValue) => {
      const currenValue = selectedValue;
      setShowPicker(false);

      setInitialBook(prev => ({
         ...prev,
         [pickerMode]: currenValue
      }))
   }

   /* ---------------------------- Booking Handlers ---------------------------- */
   const [initialBook, setInitialBook] = useState({
      date: null,
      time: null,
      service_id: mainId,
      sub_service_id: id,
      description: null
   })
   const [initialBookDisabled, setInitalBookDisabled] = useState(true);
   const [initialBookLoading, setInitialBookLoading] = useState(false);

   const handleInitialBook = async () => {
      try {
         setInitialBookLoading(true);

         const formatDate = (date) => {
            const d = new Date(date);
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const year = d.getFullYear();
            return `${month}-${day}-${year}`;
         };
   
         const formatTime = (time) => {
            const t = new Date(time);
            const hours = String(t.getHours()).padStart(2, '0');
            const minutes = String(t.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
         };
   
         const tempBooking = {
            ...initialBook,
            date: initialBook.date ? formatDate(initialBook.date) : null,
            time: initialBook.time ? formatTime(initialBook.time) : null,
         };

         const result = await axios.post(`${API_URL}/user/book`, tempBooking, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })
         
         const status = result?.data?.status || "error"
         const message = result?.data?.message

         if (status === "success") {
            // console.log(result.data.data);
            setAppointment(result.data.data);
            router.replace('client-dashboard/appointment/searching');
         }
         else if (status === "failed" || status === "error")
            throw new Error(message)

      } catch (err) {
         const message = err?.message || "There is an unexpected error trying to create a booking"
         setErrorModalMessage(message)
         setErrorModal(true)
      } finally {
         setInitialBookLoading(false);
      }
   }

   const validateInitialBook = () => {
      return (
         initialBook.date instanceof Date &&
         initialBook.time instanceof Date
      );
   }

   useEffect(() => {
      if (validateInitialBook()) {
         setInitalBookDisabled(false)
      } else {
         setInitalBookDisabled(true)
      }
   }, [initialBook])

   const [errorModal, setErrorModal] = useState(false);
   const [errorModalMessage, setErrorModalMessage] = useState(null);
   
   return (
      <View style={[global.screenContainer, {paddingBottom: insets.bottom}]}>
         <ErroModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title="Initial Booking Error"
         message={errorModalMessage}
         />

         {showPicker &&
            <DateTimePicker
            value={(pickerMode === "date" ? initialBook.date : initialBook.time) || new Date()}
            mode={pickerMode}
            is24Hour={true}
            display={(pickerMode === "date") ? "default" : "spinner"}
            onChange={handleDateTime}
            minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
            maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
          />
         }

         <Header 
         background={headerColor}
         left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"chevron-left"} size={24} color={COLORS.primary} />
            </TouchableOpacity>}
         headerPosition='absolute'
         title={
            <Animated.View style={{
               opacity: headerText,
               flexDirection: 'row',
               justifyContent: 'space-between',
               width: '100%',
               paddingLeft: 24
            }}>
               <Text 
               numberOfLines={1}
               style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.xl,
                  color: COLORS.lettersicons,
                  flexShrink: 1
               }}>
                  {subName}
               </Text>
               <View 
               style={[
                  global.tagContainer, {
                  backgroundColor: COLORS.lightblue
               }]}>
                  <Text 
                  style={[
                     global.tagText, {
                     color: COLORS.lettersicons
                  }]}>
                     {mainName}
                  </Text>
               </View>
            </Animated.View>
         }/>

         <KeyboardAwareScrollView 
         bottomOffset={20}
         style={{flex: 1, backgroundColor: '#fff'}}
         onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
         )}>  
            {/* ------------------------------ Header Image ------------------------------ */}
            <Image 
            source={subServiceImages[id]}
            style={{
               width: width,
               height: IMAGE_HEIGHT,
               objectFit: 'cover'
            }}/>
            {/* --------------------------------- Content -------------------------------- */}
            <View
            style={{
               width: width,
               minHeight: height - 272+24,
               flexGrow: 1,
               padding: 24,
               borderRadius: 24,
               marginTop: -24,
               backgroundColor: '#fff',
               gap: 24,
               justifyContent: 'space-between'
            }}>
               <View
               style={{
                  width: '100%',
                  gap: 24
               }}>
                  {/* ---------------------------- Content Category ---------------------------- */}
                  <View style={[styles.contentBox]}>
                     <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                     }}>
                        <Text 
                        style={{
                           fontFamily: FONTS.roboto600,
                           fontSize: FONT_SIZES.xl,
                           color: COLORS.lettersicons
                        }}>
                           {subName}
                        </Text>
                        <View 
                        style={[
                           global.tagContainer, {
                           backgroundColor: COLORS.lightblue
                        }]}>
                           <Text 
                           style={[
                              global.tagText, {
                              color: COLORS.lettersicons
                           }]}>
                              {mainName}
                           </Text>
                        </View>
                     </View>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.strokes
                     }}>
                        SCHEDULE APPOINTMENT
                     </Text>
                  </View>
                  {/* -------------------------------- Separator ------------------------------- */}
                  <View style={[styles.contentBox, {
                     borderBottomWidth: 1,
                     borderBottomColor: COLORS.strokes
                  }]} />
                  {/* ---------------------------------- Date ---------------------------------- */}
                  <View style={styles.contentBox}>
                     <Text style={styles.contentTitle}>Date</Text>

                     <Pressable 
                     onPress={showDatePicker}
                     style={styles.modalInputBox}>
                     {!initialBook.date ?
                        <Text style={[styles.modalInputText, {paddingHorizontal: 16, color: COLORS.strokes}]}>
                           MM-DD-YYYY
                        </Text> :
                        <Text style={[styles.modalInputText, {paddingHorizontal: 16}]}>
                           {initialBook.date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                           }).replaceAll('/', '-')}
                        </Text> 
                     }
                        <Icons name='calendar-month' size={24} color={COLORS.lettersicons} />
                     </Pressable>
                  </View>

                  {/* ---------------------------------- Time ---------------------------------- */}
                  <View style={styles.contentBox}>
                     <Text style={styles.contentTitle}>Time</Text>

                     <Pressable 
                     onPress={showTimePicker}
                     style={styles.modalInputBox}>
                     {!initialBook.time ?
                        <Text style={[styles.modalInputText, {paddingHorizontal: 16, color: COLORS.strokes}]}>
                           00:00 AM / PM
                        </Text> :
                        <Text style={[styles.modalInputText, {paddingHorizontal: 16}]}>
                           {initialBook.time.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false, 
                           })}
                        </Text> 
                     }
                        <Icons name='access-time' size={24} color={COLORS.lettersicons} />
                     </Pressable>
                  </View>
                  {/* ---------------------------------- Note ---------------------------------- */}
                  <View style={styles.contentBox}>
                     <Text style={styles.contentTitle}>Note (Optional)</Text>
                     <BasicMultiline 
                     placeholder='Any special requests or instructions?'
                     numberOfLines={6}
                     value={initialBook.description}
                     onChangeText={(e) => setInitialBook(prev => ({
                        ...prev,
                        description: e
                     }))}
                     />
                  </View>
               </View>
               
               <MainButton 
               text="Find a Service Provider"
               type="secondary"
               onPress={handleInitialBook}
               disabled={initialBookDisabled}
               loading={initialBookLoading}/>
            </View>
         </KeyboardAwareScrollView>

         
      </View>
   )
}
export default CientSchedule

const styles = StyleSheet.create({
   contentBox: {
      width: '100%',
      gap: 16
   },
   contentTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons
   },
   modalInputBox: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 48,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: COLORS.strokes,
      borderRadius: 8,
      position: 'relative',
      backgroundColor: 'white',
      paddingHorizontal: 12
   },
   modalInputText: {
      flex: 1,
      paddingVertical: 12,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      letterSpacing: 0.2,
      color: '#3D3D3D',
      lineHeight: FONT_SIZES.sm*1.2
   },
   modalInputIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      aspectRatio: '1/1',
    },
   modalContent: {
      flex: 1,
      padding: 24,
      gap: 24,
   },
   illustrationCont: {
      aspectRatio: '1/1',
      height: 148,
      marginHorizontal: 'auto'
   },
})