// Screen: Booking Cancellation

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions, Pressable, Modal} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import Multiline from '../../../../../components/Multiline';
import GeneralModal from '../../../../../components/GeneralModal'
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other Libraries
import api from '../../../../../lib/api';

const BookingCancel = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { width } = useWindowDimensions();
   const { id } = useLocalSearchParams();
   const { token } = useAuth();

   const [cancelReason, setCancelReason] = useState(null);
   const [otherReason, setOtherReason] = useState("");
   const cancelOptions = [
      {label: 'Change in Plans', value: 'Change in Plans'},
      {label: 'Found another Provider', value: 'Found another Provider'},
      {label: 'Unexpected Work', value: 'Unexpected Work'},
      {label: 'Change in Requirements', value: 'Change in Requirements'},
      {label: 'Conflict in Scheduling', value: 'Conflict in Scheduling'},
      {label: 'Other:', value: 'Other'}
   ];

   const [cancelDisabled, setCancelDisabled] = useState(true);
   const [cancelLoading, setCancelLoading] = useState(false);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);
   const [successModal, setSuccessModal] = useState(false);

   // Functions
   const handleCancel = async () => {
      try {
         setCancelLoading(true);
         console.log("---- [Booking] Cancellation Attempt ----");
         const reasonObject = {
            reason: (cancelReason === 'Other') ? otherReason : cancelReason
         }
         console.log(`[1] Cancelling Booking: ${id} for ${reasonObject.reason}`);

         await api.post(`/user/book/${id}/cancel`, reasonObject, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         console.log('[2] Cancelled Succesfully, Showing Modal');
         setSuccessModal(true);

      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when cancelling this booking";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setCancelLoading(false);
      }
   }

   // Effects
   useEffect(() => {
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

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={'Booking Cancellation Error'}
         message={errorMessage}
         />

         <Modal 
         visible={successModal}
         statusBarTranslucent={true}
         animationType='fade'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => router.replace('/dashboard/client/bookings/cancelled')}
         >
            <View
            style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center'
            }}>
               <View style={global.centerModal}>
                  <Text 
                  style={{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.primary,
                     textAlign: 'center'
                  }}>
                     Booking Cancelled
                  </Text>

                  <View style={global.divider}/>

                  <Text 
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     textAlign: 'center'
                  }}>
                     Your booking has been successfully cancelled.
                  </Text>

                  <MainButton 
                  type={'secondary'}
                  text={"View my Bookings"}
                  onPress={() => router.replace('/dashboard/client/bookings/cancelled')}
                  />
               </View>
            </View>
         </Modal>

         <View style={[global.screenContainer, {position: 'relative'}]}>
            <Header 
            hasBack
            title={"Cancel Booking"}
            backgroundColor='#fff'
            />

            {/* ---- Content */}
            <KeyboardAwareScrollView 
            bottomOffset={12}
            style={[
               global.screenContainer, {
               backgroundColor: COLORS.screenbg
            }]}
            contentContainerStyle={{
               padding: 12
            }}
            >
               <View
               style={{
                  padding: 24,
                  borderRadius: 20,
                  backgroundColor: '#fff',
                  gap: 12
               }}>
                  <Text 
                  style={{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.labels
                  }}>
                     Please select the reason for cancellation.
                  </Text>

                  <View style={global.divider}/>

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

                     <Multiline 
                     placeholder='Enter your reason'
                     numberOfLines={8}
                     value={otherReason}
                     onChangeText={(e) => setOtherReason(e)}
                     />
                  </View>
               </View>
            </KeyboardAwareScrollView>

            {/* ---- Button */}
            <View
            style={[
               global.shadowBottom ,{
               padding: 24,
               paddingBottom: insets.bottom + 24,
               backgroundColor: '#fff',
               position: 'absolute',
               bottom: 0,
               // borderRadius: 20,
               borderTopLeftRadius: 20,
               borderTopRightRadius: 20,
               width: width,
               borderWidth: StyleSheet.hairlineWidth,
               borderColor: COLORS.strokes
            }]}>
               <MainButton 
               type='primary'
               text={"Cancel Appointment"}
               loading={cancelLoading}
               disabled={cancelDisabled}
               onPress={handleCancel}
               />
            </View>
         </View>
      </>
   )
}

const CancelOption = ({ label, value, selected, onPress }) => (
   <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
      <Pressable
      activeOpacity={0.6}
      onPress={() => onPress(value)}
      style={{
         height: 24,
         width: 24,
         aspectRatio: '1/1',
         borderRadius: 12,
         borderWidth: 1,
         borderColor: COLORS.labels,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: COLORS.secondary
      }}>
         <View 
         style={{
            width: 16,
            height: 16,
            aspectRatio: 1/1,
            borderRadius: 8,
            backgroundColor: selected ? COLORS.accent : COLORS.secondary
         }}/>
      </Pressable>
      <Pressable
      style={{height: 24}}
      onPress={() => onPress(value)}
      >
         <Text style={{fontFamily: FONTS.roboto500, fontSize: FONT_SIZES.md, color: COLORS.lettersicons}}>
            {label}
         </Text>
      </Pressable>
   </View>
);

export default BookingCancel

const styles = StyleSheet.create({})