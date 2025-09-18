// Screen: Profile Availability

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, Pressable, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// ---- Other Components
import Header from '../../../../components/Header';
import MainButton from '../../../../components/MainButton';
import ErrorModal from '../../../../components/ErrorModal';
import DatePicker from 'react-native-date-picker'
// ---- Context and Libraries
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useAppData } from '../../../../context/AppDataContext';
import { useConvert } from '../../../../hooks/useConvert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const ProfileAvailability = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const { token } = useAuth();
   const { worker, workerLoading, fetchWorker } = useAppData();
   const {convertDateToTime24} = useConvert();
   const [availability, setAvailability] = useState({
      Monday: {start: '08:00', end: '17:00', is_available: false},
      Tuesday: {start: '08:00', end: '17:00', is_available: false},
      Wednesday: {start: '08:00', end: '17:00', is_available: false},
      Thursday: {start: '08:00', end: '17:00', is_available: false},
      Friday: {start: '08:00', end: '17:00', is_available: false},
      Saturday: {start: '08:00', end: '17:00', is_available: false},
      Sunday: {start: '08:00', end: '17:00', is_available: false},
   });
   const [tempSchedule, setTempSchedule] = useState(null);
   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

   const [timeModal, setTimeModal] = useState(false);
   const [selectedDay, setSelectedDay] = useState(null);
   const [selectedTime, setSelectedTime] = useState(null);
   const [selectedMode, setSelectedMode] = useState(null);

   const [buttonLoading, setButtonLoading] = useState(false);
   const [buttonDisabled, setButtonDisabled] = useState(true);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const handleDay = (day) => {
      setAvailability(prev => ({
         ...prev,
         [day]: {
            ...prev[day],
            is_available: !prev[day].is_available
         }
      }))
   }

   const openTimeModal = (day, time, mode) => {
      setSelectedDay(day);
      setSelectedTime(time);
      setSelectedMode(mode);
      setTimeModal(true);
   }

   const convertToDate = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
   }

   const getMinDate = (day, mode) => {
      const minTime = new Date();
      minTime.setHours(0, 0, 0, 0); // Start at midnight
      
      if (mode === 'end') {
         // End time must be at least 1 hour after start time
         const startTime = convertToDate(availability[day]?.start);
         startTime.setHours(startTime.getHours() + 1);
         return startTime;
      }
      
      return minTime; // Start time can be from midnight
   }

   const getMaxDate = (day, mode) => {
      const maxTime = new Date();
      
      if (mode === 'start') {
         // Start time must be at least 1 hour before end time
         const endTime = convertToDate(availability[day]?.end);
         endTime.setHours(endTime.getHours() - 1);
         return endTime;
      }
      
      // End time can go up to 23:59
      maxTime.setHours(23, 59, 0, 0);
      return maxTime;
   };

   const validateTimeSelection = (day, newTime, mode) => {
      const newTimeDate = convertToDate(newTime);
      const startTime = convertToDate(
         mode === 'start' ? newTime : availability[day]?.start
      );
      const endTime = convertToDate(
         mode === 'end' ? newTime : availability[day]?.end
      );

      // End time must be after start time
      if (endTime <= startTime) {
         return {
            isValid: false,
            message: "End time must be at least 1 hour after start time"
         };
      }

      // Check for minimum work duration (e.g., at least 1 hour)
      const diffMs = endTime - startTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours < 1) {
         return {
            isValid: false,
            message: "Minimum work duration is 1 hour"
         };
      }

      return { isValid: true };
   };

   const handleTime = (day, time, mode) => {
      const timeString = convertDateToTime24(time);

      const validation = validateTimeSelection(day, timeString, mode);

      if (!validation.isValid) {
         setErrorMessage(validation.message);
         setErrorModal(true);
         setTimeModal(false);
         return;
      }

      setAvailability(prev => ({
         ...prev,
         [day]: {
            ...prev[day],
            [mode]: timeString
         }
      }))

      setTimeModal(false);
   }

   const handleUpdate = async () => {
      try {
         setButtonLoading(true);
         console.log(availability);
         const result = await api.put(`/worker/availability`, availability, {
            headers: {'Authorization': `Bearer ${token}`}
         })

         console.log(result);

         await fetchWorker();
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when updating your availability schedule. Please try again";
         setErrorMessage(message);
         setErrorModal(true);
         setAvailability(tempSchedule);
      } finally {
         setButtonLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (!worker) return;

      const data = {...availability, ...worker?.worker?.availability};

      setAvailability(data);
      setTempSchedule(data);
   }, [worker])

   useEffect(() => {
      if (JSON.stringify(availability) !== JSON.stringify(tempSchedule)) {
         setButtonDisabled(false);
      } else {
         setButtonDisabled(true);
      }
   }, [availability, tempSchedule])

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong"}
         message={errorMessage}
         />

         <DatePicker 
         modal
         open={timeModal}
         date={selectedTime ? convertToDate(selectedTime) : new Date()}
         mode='time'
         is24hourSource="locale"
         locale="en"
         minimumDate={selectedDay && selectedMode ? getMinDate(selectedDay, selectedMode) : undefined}
         maximumDate={selectedDay && selectedMode ? getMaxDate(selectedDay, selectedMode) : undefined}
         onConfirm={(date) => handleTime(
            selectedDay,
            date,
            selectedMode
         )}
         onCancel={() => setTimeModal(false)}
         theme='light'
         dividerColor={COLORS.accent}
         />

         <Header 
         hasBack
         backColor='#fff'
         title={"Availability"}
         textColor='#fff'
         backgroundColor={COLORS.primary}
         />
         
         <FlatList 
         data={days}
         renderItem={({item}) => (
            <View 
            style={{
               flexDirection: 'row',
               gap: 12,
               width: '100%',
               justifyContent: 'space-between',
               alignItems: 'center'
            }}>
               <Text style={{flex: 2, fontFamily: FONTS.roboto500, fontSize: FONT_SIZES.md, color: COLORS.labels}}>
                  {item}
               </Text>

               <View style={{flex: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
                  <View
                  style={{
                     flexDirection: 'row',
                     overflow: 'hidden',
                     height: 24,
                     borderRadius: 8,
                     borderWidth: 1,
                     borderColor: COLORS.strokes,
                     backgroundColor: COLORS.secondary
                  }}>
                     <Pressable
                     onPress={() => openTimeModal(
                        item,
                        availability[item]?.start,
                        'start'
                     )}
                     style={({pressed}) => [{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: 52,
                        backgroundColor: pressed ? COLORS.summaryPress : 'transparent',
                        borderRightWidth: 1,
                        borderColor: COLORS.strokes
                     }]}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons
                        }}>
                           {availability[item]?.start}
                        </Text>
                     </Pressable>
                     <Pressable
                     onPress={() => openTimeModal(
                        item,
                        availability[item]?.end,
                        'end'
                     )}
                     style={({pressed}) => [{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: 52,
                        backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                     }]}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons
                        }}>
                           {availability[item]?.end}
                        </Text>
                     </Pressable>
                  </View>

                  <DateSwitch 
                  active={availability[item]?.is_available}
                  onPress={() => handleDay(item)}
                  />
               </View>
            </View>
         )}
         contentContainerStyle={{
            padding: 24,
            gap: 12,
         }}
         ListHeaderComponent={
            <Text style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
               textAlign: 'justify',
               marginBottom: 12
            }}>
               <Text style={{fontFamily: FONTS.roboto600}}>NOTE: </Text>Choose your working hours for each day of the week. Customers will only be able to book appointments during your available times.
            </Text>
         }
         />

         <View style={[
            global.shadowBottom, {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
            borderRadius: 24,
            backgroundColor: '#fff',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: COLORS.strokes
         }]}>
            <MainButton 
            type='primary'
            text={'Update Availability'}
            loading={buttonLoading}
            disabled={buttonDisabled}
            onPress={handleUpdate}
            />
         </View>
      </View>
   )
}

export default ProfileAvailability

const DateSwitch = ({active, onPress}) => {
   // Hooks and States
   const switchAnim = useRef(new Animated.Value(active ? 1 : 0)).current;
   
   const switchColor = switchAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.strokes, COLORS.primary],
      extrapolate: 'clamp',
   });

   const switchX = switchAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [3, 15], // Actual pixel values for proper positioning
      extrapolate: 'clamp'
   });

   useEffect(() => {
      Animated.timing(switchAnim, {
         toValue: active ? 1 : 0,
         duration: 200,
         useNativeDriver: false
      }).start();
   }, [active]);

   return (
      <Pressable onPress={onPress}>
         <Animated.View
         style={{
            width: 38,
            height: 24,
            padding: 2,
            borderRadius: 12,
            backgroundColor: switchColor,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
         }}>
            <Animated.View 
            style={{
               aspectRatio: 1/1,
               height: '100%',
               backgroundColor: '#fff',
               borderRadius: '50%',
               position: 'absolute',
               top: 2,
               left: switchX
            }}
            />
         </Animated.View>
      </Pressable>
   );
}

const styles = StyleSheet.create({})