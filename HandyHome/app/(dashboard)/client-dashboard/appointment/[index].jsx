import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, useWindowDimensions, Animated, Image, StatusBar } from 'react-native'
import React, { useRef } from 'react'
import { useAppointment } from '../../../../context/AppointmentContext'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import Header from '../../../../components/dashboard/Header'
import ModalInput from '../../../../components/authentication/ModalInput'
import BasicMultiline from '../../../../components/authentication/BasicMultiline'
import { subServiceImages } from '../../../../components/SubServiceMap';

import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'
import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialIcons';

const IMAGE_HEIGHT = 272;

const CientSchedule = () => {
   const router = useRouter();

   const { id, mainName, subName } = useLocalSearchParams();
   const { width, height } = useWindowDimensions();
   const {appointment, setAppointment} = useAppointment();

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

   return (
      <View style={global.screenContainer}>

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
         }
         />

         <KeyboardAwareScrollView 
         bottomOffset={20}
         style={{flex: 1, backgroundColor: '#fff'}}
         onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
         >  
            {/* ------------------------------ Header Image ------------------------------ */}
            <Image 
            source={subServiceImages[id]}
            style={{
               width: width,
               height: IMAGE_HEIGHT,
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
                     <Text style={style.contentTitle}>Note (Optional)</Text>
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