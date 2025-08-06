import { Switch, Text, View, TouchableOpacity, TouchableHighlight, ScrollView, Animated, StatusBar, useWindowDimensions, Pressable, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';

import Arrows from '@expo/vector-icons/Entypo'
import Header from '../../../../components/dashboard/Header'
import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants'

const TITLE_CONT = 144;
const HEADER_HEIGHT = StatusBar.currentHeight + 64 + TITLE_CONT;

export default AvailabilityScreen = () => {
   const {height} = useWindowDimensions()
   const router = useRouter();

   const scrollViewRef = useRef(null);
   const scrollY = useRef(new Animated.Value(0)).current;

   const headerHeight = scrollY.interpolate({
      inputRange: [0, TITLE_CONT],
      outputRange: [TITLE_CONT, 0],
      extrapolate: 'clamp'
   })
   const headerOpacity = scrollY.interpolate({
      inputRange: [0, TITLE_CONT],
      outputRange: [1, 0],
      extrapolate: 'clamp'
   })

   const [availability, setAvailability] = useState({
      monday: { available: false, start: null, end: null },
      tuesday: { available: false, start: null, end: null },
      wednesday: { available: false, start: null, end: null },
      thursday: { available: false, start: null, end: null },
      friday: { available: false, start: null, end: null },
      saturday: { available: false, start: null, end: null },
      sunday: { available: false, start: null, end: null }
   })

   useEffect(() => {
      setAvailability(prev => ({
         ...prev,
         monday: { available: true, start: '09:00', end: '17:00' },
         tuesday: { available: false, start: '09:00', end: '17:00' },
         wednesday: { available: true, start: '09:00', end: '17:00' },
         thursday: { available: true, start: '09:00', end: '17:00' },
         friday: { available: false, start: '09:00', end: '17:00' },
         saturday: { available: false, start: '09:00', end: '17:00' },
         sunday: { available: true, start: '09:00', end: '17:00' }
      }))
   }, [])

   const handlePress = () => {

   }

   const showAlert = () => {
      Alert.alert(
         'Invalid Time Input',
         'Time should not be earlier than 8:00 AM or later than 5:00 PM'
      );
   }

   return (
      <>
         <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
            <Header
            background='#fff'
            left={
               <TouchableOpacity onPress={() => router.back()}>
                  <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
               </TouchableOpacity>
            }/>

            {/* ------------------------------ Header Title ------------------------------ */}
            <Animated.View
            style={{
               position: 'absolute',
               top: HEADER_HEIGHT - TITLE_CONT,
               width: '100%',
               height: headerHeight,
               overflow: 'hidden',
               borderBottomLeftRadius: 24,
               borderBottomRightRadius: 24,
               backgroundColor: '#fff',
               zIndex: 2,
            }}>
               <Animated.Text
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.xxxl,
                  color: COLORS.darkblue,
                  padding: 24,
                  position: 'absolute',
                  opacity: headerOpacity
               }}>
                  Set Availability
               </Animated.Text>
               <Animated.Image 
               source={require('../../../../assets/images/backgrounds/graphic-bg7.png')}
               style={{
                  height: TITLE_CONT,
                  width: '100%',
                  aspectRatio: '1500/548',
                  opacity: headerOpacity
               }}
               />
            </Animated.View >

            {/* --------------------------------- Content -------------------------------- */}
            <ScrollView
            ref={scrollViewRef}
            style={{
               flex: 1,
            }}
            contentContainerStyle={{
               padding: 24,
               paddingTop: TITLE_CONT + 24,
            }}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
               useNativeDriver: false,
            })}>
               <View style={{
                  gap: 12,
                  minHeight: height - 144 - 48 - 64,
               }}>
                  <DayInput day={"monday"} availability={availability} setAvailability={setAvailability} />
                  <DayInput day={"tuesday"} availability={availability} setAvailability={setAvailability} />
                  <DayInput day={"wednesday"} availability={availability} setAvailability={setAvailability} />
                  <DayInput day={"thursday"} availability={availability} setAvailability={setAvailability} />
                  <DayInput day={"friday"} availability={availability} setAvailability={setAvailability} />
                  <DayInput day={"saturday"} availability={availability} setAvailability={setAvailability} />
                  <DayInput day={"sunday"} availability={availability} setAvailability={setAvailability} />
               </View>
            </ScrollView>

            <View style={[global.buttonsContainer]}>
               <TouchableHighlight style={global.primaryBtn}
               underlayColor={COLORS.primaryPress}
               onPress={handlePress}>
                  <Text style={global.primaryBtnText}>
                     Update Availability
                  </Text>
               </TouchableHighlight>
            </View>

         </View>
      </>   
   )
}

const DayInput = ({day, availability, setAvailability}) => {
   const [showTime, setShowTime] = useState(false)
   const [activeField, setActiveField] = useState(null);

   const [invalidTimeModal, setInvalidTimeModal] = useState(false)

   // Move to the Component
   const handleDayAvailability = () => {
      setAvailability(prev => ({
         ...prev,
         [day]: {
            ...prev[day],
            available: !prev[day].available
         }
      }));
   }

   const handleTimeChange = (e, selectedTime) => {
      if (e.type === 'dismissed') {
         setShowTime(false);
         return;
      }

      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const formatted = `${hours}:${minutes}`;

      if (
         selectedTime.getHours() < 8 || selectedTime.getHours() > 17 ||
         (selectedTime.getHours() === 17 && selectedTime.getMinutes() > 0)
      ) {
         setShowTime(false);
         setInvalidTimeModal(true);
         return;
      }

   
      setAvailability(prev => ({
         ...prev,
         [day]: {
            ...prev[day],
            [activeField]: formatted
         }
      }));

      setShowTime(false);
   }

   const getTimeAsDate = (time) => {
      if (!time) return new Date();

      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      now.setHours(hours);
      now.setMinutes(minutes);
      now.setSeconds(0);

      return now;
   }

   return (
      <> 
         {showTime && (
            <DateTimePicker 
            mode='time'
            display='spinner'
            is24Hour={true}
            value={getTimeAsDate(availability[day][activeField])}
            onChange={handleTimeChange}
            />
         )}

         <InvalidTimeModal visible={invalidTimeModal} setVisible={setInvalidTimeModal}/>

         <View 
         style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
         }}>
            <Text
            numberOfLines={1}
            style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.sm,
               color: COLORS.labels,
               textAlign: 'left',
               flexShrink: 1,
               textTransform: 'capitalize',
               width: '40%'
            }}>
               {day}
            </Text>

            <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               gap: 12,
               flexGrow: 1,
               width: '60%'
            }}>
               {/* ---- Time */}
               <View
               style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  gap: 1,
                  borderColor: COLORS.strokes,
                  height: 24,
                  backgroundColor: COLORS.strokes,
                  flexDirection: 'row',
                  overflow: 'hidden'
               }}>
                  {/* ---- Start */}
                  <Pressable 
                  onPress={() => {
                     setActiveField('start');
                     setShowTime(true);
                  }}
                  style={({pressed}) => [
                     global.centerContainer, {
                     height: '100%',
                     width: 48,
                     backgroundColor: pressed ? COLORS.lightblue : "#fff"
                  }]}>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        {availability[day].start || "--:--"}
                     </Text>
                  </Pressable>

                  {/* ---- End */}
                  <Pressable 
                  onPress={() => {
                     setActiveField('end');
                     setShowTime(true);
                  }}
                  style={({pressed}) => [
                     global.centerContainer, {
                     height: '100%',
                     width: 48,
                     backgroundColor: pressed ? COLORS.lightblue : "#fff"
                  }]}>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        {availability[day].end || "--:--"}
                     </Text>
                  </Pressable>
               </View>

               {/* ---- Day */}
               <View 
               style={[global.centerContainer, {
                  padding: 0,
                  backgroundColor: availability[day].available ? COLORS.primary : COLORS.labels,
                  borderRadius: 16
               }]}>
                  <Switch
                  trackColor={{false: COLORS.labels, true: COLORS.primary}}
                  thumbColor={'#fff'}
                  ios_backgroundColor={COLORS.labels}
                  onValueChange={handleDayAvailability}
                  value={availability[day].available}
                  />
               </View>
               
            </View>

         </View>
      </>
   )
}

const InvalidTimeModal = ({visible, setVisible}) => {

   return (
      <Modal 
      animationType='slide'
      visible={visible}
      backdropColor={COLORS.modalbg}
      statusBarTranslucent={true}> 
         <Pressable 
         style={{flex: 1}}
         onPress={() => setVisible(false)}
         />

         <View style={global.bottomModal}>
            <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: FONT_SIZES.md,
               color: COLORS.red,
               textAlign: 'center',
            }}>
               Invalid Time Input
            </Text>
            
            <View style={global.divider}/>

            <Text style={{
               textAlign: 'center',
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons
            }}>
               Sorry. Please understand that the time availability should be and only be between 8:00 AM to 5:00 PM.
            </Text>

            <TouchableHighlight
            underlayColor={COLORS.primaryPress}
            onPress={() => setVisible(false)}
            style={global.primaryBtn}>
               <Text style={global.primaryBtnText}>
                  Ok
               </Text>
            </TouchableHighlight>
         </View>

      </Modal>
   )
}
