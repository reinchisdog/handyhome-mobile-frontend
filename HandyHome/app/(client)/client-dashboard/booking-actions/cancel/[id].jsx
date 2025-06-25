import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { KeyboardProvider, KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import Header from '../../../../../components/dashboard/Header'
import BasicMultiline from '../../../../../components/authentication/BasicMultiline'

import Arrows from '@expo/vector-icons/Entypo'
import {globalStyles as global} from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

export default CancelBookingScreen = () => {
   const router = useRouter();

   const [cancelReason, setCancelReason] = useState(null);
   const [otherReason, setOtherReason] = useState("");
   const cancelOptions = [
      {label: 'Change in Plans', value: 'Change in Plans'},
      {label: 'Found another Provider', value: 'Found another Provider'},
      {label: 'Unexpected Work', value: 'Unexpected Work'},
      {label: 'Change in Requirements', value: 'Change in Requirements'},
      {label: 'Conflict in Scheduling', value: 'Conflict in Scheduling'},
      {label: 'Other', value: otherReason}
   ];
   

   const handleCancel = () => {

   }

   return (
      <KeyboardProvider>
         <View style={[global.screenContainer]}>
            <Header 
            background='#fff'
            left={
               <TouchableOpacity onPress={() => router.back()}>
                  <Arrows name="chevron-left" size={24} color={COLORS.primary} />
               </TouchableOpacity>
            }
            title={
               <Text style={[global.headingText, {color: COLORS.primary}]}> 
                  Cancel Booking
               </Text>
            }
            titlePosition={"absolute"}
            />

            <KeyboardAwareScrollView
            bottomOffset={0}
            style={[
               global.screenContainer, {
               backgroundColor: '#fff'
            }]}
            contentContainerStyle={{
               padding: 24,
               gap: 24,
            }}>
               <Text style={{
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels
               }}>Please select the reason for cancellation.</Text>

               <View style={{gap: 16}}>
                  {cancelOptions.map((item, index) => (
                     <CancelOption 
                     key={index}
                     label={item.label}
                     value={item.value}
                     selected={cancelReason === item.value}
                     onPress={setCancelReason}
                     />
                  ))}

                  <BasicMultiline 
                  placeholder='Enter your reason'
                  numberOfLines={8}
                  />
               </View>
            </KeyboardAwareScrollView>

            <View style={[global.buttonsContainer, {backgroundColor: '#fff'}]}>
               <TouchableHighlight
               underlayColor={'#0072bc'}
               onPress={handleCancel}
               style={global.primaryBtn}>
                  <Text style={global.primaryBtnText}>
                     Cancel Appointment
                  </Text>
               </TouchableHighlight>
            </View>
            
         </View>
      </KeyboardProvider>
   )
}

const CancelOption = ({ label, value, selected, onPress }) => (
   <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
      <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(value)}
      style={{
         height: 22,
         width: 22,
         aspectRatio: '1/1',
         borderRadius: 12,
         borderWidth: 1,
         borderColor: COLORS.lettersicons,
         justifyContent: 'center',
         alignItems: 'center'
      }}>
         {selected && (
            <View 
            style={{
               height: 16,
               width: 16,
               backgroundColor: COLORS.accent,
               borderRadius: 8,
            }}/>
         )}
      </TouchableOpacity>
      <TouchableWithoutFeedback
      style={{height: 24}}
      onPress={() => onPress(value)}
      >
         <Text style={{fontFamily: FONTS.roboto500, fontSize: FONT_SIZES.md, color: COLORS.lettersicons}}>
            {label}
         </Text>
      </TouchableWithoutFeedback>
   </View>
);

const styles = StyleSheet.create({})