// Screen: Profile Account Information

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions, Pressable, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
// ---- Other Components
import Header from '../../../../../components/Header';
import InputBasic from '../../../../../components/InputBasic';
import MainButton from '../../../../../components/MainButton';
import GeneralModal from '../../../../../components/GeneralModal';
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
// ---- Other Libraries
import { useAuth } from '../../../../../context/AuthContext';
import { useAccountSettings } from '../../../../../context/AccountSettingsContext';
import api from '../../../../../lib/api';

const ProfileAccount = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const { width, height } = useWindowDimensions();
   const { user } = useAuth();
   const { accountModal, setAccountModal, accountMode, accountLoading, accountDisabled, identifier, setIdentifier, openModal, handleSendToken } = useAccountSettings();

   return (
      <>
         <Modal
         visible={accountModal}
         statusBarTranslucent={true}
         animationType='slide'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setAccountModal(false)}
         >
            <KeyboardAvoidingView
            behavior='position'
            keyboardVerticalOffset={-insets.bottom + 24}>
               <Pressable
               onPress={() => setAccountModal(false)}
               style={{
                  height: height,
                  width: width,
                  position: 'relative'
               }}>
                  <View
                  style={{
                     position: 'absolute',
                     bottom: 0,
                     left: 0,
                     right: 0,
                     width: width,
                     padding: 24,
                     paddingBottom: insets.bottom + 24,
                     backgroundColor: '#fff',
                     borderTopLeftRadius: 20,
                     borderTopRightRadius: 20,
                     gap: 24
                  }}>
                     <Text
                     style={{
                        textAlign: 'center',
                        fontFamily: FONTS.roboto700,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.primary
                     }}>
                        {
                           accountMode === "email" ? "Change Email Address" : accountMode === "phone" ? "Change Phone Number":
                           null
                        }
                     </Text>

                     <View style={global.divider}/>

                     <InputBasic 
                     floatColor='#fff'
                     placeholder={
                        accountMode === "email" ? "Email" : accountMode === "phone" ? "Phone Number":
                        null
                     }
                     inputMode={
                        accountMode === "email" ? "email" : accountMode === "phone" ? "numeric":
                        null
                     }
                     keyboardType={
                        accountMode === "email" ? "email-address" : accountMode === "phone" ? "phone-pad":
                        null
                     }
                     left={
                        <Icons 
                        name={
                           accountMode === "email" ? "email" : accountMode === "phone" ? "phone":
                           null
                        }
                        size={24} 
                        color={COLORS.labels}
                        />
                     }
                     value={identifier}
                     onChangeText={(e) => setIdentifier(e)}/>
                     
                     <View 
                     style={{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        gap: 8
                     }}>
                        <MainButton 
                        type='primary'
                        text={'Next'}
                        loading={accountLoading}
                        disabled={accountDisabled}
                        onPress={() => {handleSendToken(accountMode)}}
                        />
                     </View>
                  </View>
               </Pressable>
            </KeyboardAvoidingView>
         </Modal>

         <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
            <Header 
            hasBack 
            title={"Account and Security"}
            />

            <View style={{ paddingHorizontal: 12 }}>
               {/* Email */}
               <View style={styles.container}>
                  <Pressable onPress={() => {openModal('email')}}
                  style={({pressed}) => [styles.button, {backgroundColor: pressed ? COLORS.summaryPress : '#fff'}]}>
                     <Text style={styles.left} numberOfLines={1}>Email</Text>
                     <Text style={styles.right} numberOfLines={1}>{user?.email}</Text>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
               </View>

               {/* Phone */}
               <View style={styles.container}>
                  <Pressable onPress={() => {openModal('phone')}}
                  style={({pressed}) => [styles.button, {backgroundColor: pressed ? COLORS.summaryPress : '#fff'}]}>
                     <Text style={styles.left} numberOfLines={1}>Phone Number</Text>
                     <Text style={styles.right} numberOfLines={1}>{user?.phone_number.replace('+63', '0')}</Text>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
               </View>

               {/* Password */}
               <View style={styles.container}>
                  <Pressable onPress={() => {router.push('/dashboard/client/settings/account/password')}} 
                  style={({pressed}) => [styles.button, {backgroundColor: pressed ? COLORS.summaryPress : '#fff'}]}>
                     <Text style={styles.left} numberOfLines={1}>Change Password</Text>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
               </View>

               {/* Deactivate */}
               <View style={styles.container}>
                  <Pressable onPress={() => {router.push('/dashboard/client/settings/account/delete')}} 
                  style={({pressed}) => [styles.button, {backgroundColor: pressed ? COLORS.summaryPress : '#fff'}]}>
                     <Text style={styles.left} numberOfLines={1}>Deactivate Account</Text>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
               </View>

            </View>
         </View>
      </>
   )
}

export default ProfileAccount

const styles = StyleSheet.create({
   container: {
      padding: 6,
      borderTopWidth: 1,
      borderColor: COLORS.strokes
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 8,
   },
   left: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels,
      textAlign: 'left',
      flexGrow: 1,
   },
   right: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      textAlign: 'right',
      flexShrink: 1,
   }
})