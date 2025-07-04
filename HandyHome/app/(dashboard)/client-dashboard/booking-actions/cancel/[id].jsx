import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { KeyboardProvider, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAuth } from '../../../../../context/AuthContext';
import { API_URL } from '../../../../../config';

import Header from '../../../../../components/dashboard/Header'
import BasicMultiline from '../../../../../components/authentication/BasicMultiline'
import MainButton from '../../../../../components/MainButton';
import ErrorModal from '../../../../../components/ErrorModal';

import Arrows from '@expo/vector-icons/Entypo'
import {globalStyles as global} from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

export default CancelBookingScreen = () => {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const {id} = useLocalSearchParams();
   const {token} = useAuth();

   const [cancelReason, setCancelReason] = useState(null);
   const [otherReason, setOtherReason] = useState("");
   const cancelOptions = [
      {label: 'Change in Plans', value: 'Change in Plans'},
      {label: 'Found another Provider', value: 'Found another Provider'},
      {label: 'Unexpected Work', value: 'Unexpected Work'},
      {label: 'Change in Requirements', value: 'Change in Requirements'},
      {label: 'Conflict in Scheduling', value: 'Conflict in Scheduling'},
      {label: 'Other', value: 'Other'}
   ];
   
   useEffect(() => {
      console.log(`[Cancellation] id: ${id}, token: ${token}`);
   }, [])

   const [cancelDisabled, setCancelDisabled] = useState(true);
   const [cancelLoading, setCancelLoading] = useState(false);

   const handleCancel = async () => {
      try {
         setCancelLoading(true)

         const reasonObject = {
            reason: (cancelReason === 'Other') ? otherReason : cancelReason
         }

         const result = await axios.post(`${API_URL}/user/book/${id}/cancel`, reasonObject, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const status = result?.data?.status || "error";
         const message = result?.data?.message;

         if (status === "success") {
            router.back();
         } else if (status === "failed" || status === "error") {
            throw new Error(message)
         }

      } catch (err) {
         const message = err?.message || "An unknown error has occured when cancelling this booking";
        setErrorModalMessage(message);
        setErrorModal(true);
         
      } finally {
         setCancelLoading(false)
      }
   }

   useEffect(() => {
      console.log(cancelReason);
      if (cancelReason === 'Other') {
         if (otherReason?.trim() !== "") {
           setCancelDisabled(false); 
         } else {
           setCancelDisabled(true); 
         }
       } else if (cancelReason) {
         setCancelDisabled(false); 
       } else {
         setCancelDisabled(true); 
       }
   }, [cancelReason, otherReason])

   const [errorModal, setErrorModal] = useState(false);
   const [errorModalMessage, setErrorModalMessage] = useState(null);

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={'Booking Cancellation Error'}
         message={errorModalMessage}
         />

         <KeyboardProvider>
            <View style={[global.screenContainer, {paddingBottom: insets.bottom}]}>
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
                     value={otherReason}
                     onChangeText={(e) => setOtherReason(e)}
                     />
                  </View>
               </KeyboardAwareScrollView>

               <View style={[global.buttonsContainer, {backgroundColor: '#fff'}]}>
                  <MainButton 
                  text="Cancel Appointment"
                  type="secondary"
                  onPress={handleCancel}
                  loading={cancelLoading}
                  disabled={cancelDisabled}
                  />
               </View>
               
            </View>
         </KeyboardProvider>
      </>
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