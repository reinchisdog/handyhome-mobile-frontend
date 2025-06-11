import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, useWindowDimensions, Animated, TouchableHighlight, TextInput, Platform, Image } from 'react-native'
import React, { useRef } from 'react'
import { useAppointment } from '../../../../context/AppointmentContext'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

import Header from '../../../../components/dashboard/Header'
import ModalInput from '../../../../components/authentication/ModalInput'
import BasicMultiline from '../../../../components/authentication/BasicMultiline'
import DismissKeyboardWrapper from '../../../../components/DismissKeyboard'

import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'
import Arrows from '@expo/vector-icons/AntDesign';
import Icons from '@expo/vector-icons/MaterialIcons';

const CientSchedule = () => {
   const router = useRouter();

   const { id } = useLocalSearchParams();
   const { width, height } = useWindowDimensions();
   const {appointment, setAppointment} = useAppointment();

   const scrollY = useRef(new Animated.Value(0)).current;

   const headerColor = scrollY.interpolate({
      inputRange: [100, 174],
      outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
      extrapolate: 'clamp',
    });

   return (
      <View style={global.screenContainer}>

         <Header 
         background={headerColor}
         left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"left"} size={24} color={COLORS.primary} />
            </TouchableOpacity>}
         headerPosition='absolute'
         />

         <KeyboardAwareScrollView 
         bottomOffset={60}
         style={{flex: 1, backgroundColor: '#fff'}}
         onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
         >  
            {/* ------------------------------ Header Image ------------------------------ */}
            <Image 
            source={require('../../../../assets/placeholder-base.png')}
            style={{
               width: width,
               height: 272,
               objectFit: 'cover'
            }}
            />
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
            }}
            >
               <View
               style={{
                  width: '100%',
                  gap: 24
               }}
               >
                  {/* ---------------------------- Content Category ---------------------------- */}
                  <View style={[style.contentBox]}>
                     <View
                     style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                     }}
                     >
                        <Text 
                        style={{
                           fontFamily: FONTS.roboto600,
                           fontSize: FONT_SIZES.xl,
                           color: COLORS.lettersicons
                        }}
                        >
                           {"Service Name"}
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
                              {"Service Category"}
                           </Text>
                        </View>
                     </View>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.strokes
                     }}
                     >
                        SCHEDULE APPOINTMENT
                        </Text>
                  </View>
                  {/* -------------------------------- Separator ------------------------------- */}
                  <View style={[style.contentBox, {
                     borderBottomWidth: 1,
                     borderBottomColor: COLORS.strokes
                  }]} />
                  {/* ---------------------------------- Date ---------------------------------- */}
                  <View style={style.contentBox}>
                     <Text style={style.contentTitle}>Date</Text>
                     <ModalInput 
                     right={<Icons name="calendar-month" size={24} color={COLORS.lettersicons}/>}
                     placeholder='MM / DD / YYYY'
                     />
                  </View>
                  {/* ---------------------------------- Time ---------------------------------- */}
                  <View style={style.contentBox}>
                     <Text style={style.contentTitle}>Time</Text>
                     <ModalInput 
                     right={<Icons name="access-time" size={24} color={COLORS.lettersicons}/>}
                     placeholder='00:00 AM / PM'
                     />
                  </View>
                  {/* ---------------------------------- Note ---------------------------------- */}
                  <View style={style.contentBox}>
                     <Text style={style.contentTitle}>Note</Text>
                     <BasicMultiline 
                     placeholder='Any special requests or instructions?'
                     numberOfLines={6}
                     />
                  </View>
               </View>
               

               <TouchableOpacity 
               style={[global.secondaryBtn, {}]}
               onPress={() => {router.replace('/client-dashboard/appointment/searching')}}
               >
                  <Text style={global.secondaryBtnText}>Find a Service Provider</Text>
               </TouchableOpacity>
            </View>
         </KeyboardAwareScrollView>
      </View>
   )
}
export default CientSchedule

const style = StyleSheet.create({
   contentBox: {
      width: '100%',
      gap: 16
   },
   contentTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons
   }
})