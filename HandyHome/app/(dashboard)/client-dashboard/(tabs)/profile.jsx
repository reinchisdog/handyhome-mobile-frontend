import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, StatusBar, Image, TouchableHighlight, TouchableOpacity, useWindowDimensions, ImageBackground, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useRouter} from 'expo-router'
import { useAuth } from '../../../../context/AuthContext';
import { useAppData } from '../../../../context/AppDataContext';
import axios from 'axios';
import { API_URL } from '../../../../config';

import Header from '../../../../components/dashboard/Header'
import ProfileTab from '../../../../components/dashboard/profile/ProfileTab'

import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'
import Icons1 from '@expo/vector-icons/MaterialIcons';
import Icons2 from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';

const VerifyButton = () => {
   return (
      <TouchableHighlight
         style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 28,
            width: 100,
            backgroundColor: COLORS.primary,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: COLORS.strokes
         }}
         underlayColor={'#035082'}
         onPress={() => {}}
      >
         <Text
            style={{
               fontFamily: FONTS.roboto700,
               color: COLORS.secondary,
               fontSize: FONT_SIZES.sm,
               letterSpacing: 0.2
            }}
         >Verify Now</Text>
      </TouchableHighlight>
   )
}

const VerifiedText = () => {
   return (
      <View
         style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
            alignItems: 'center',
            height: 28,
         }}
      >  
         <Icons1 name="verified" size={24} color={COLORS.primary} />

         <Text
            style={[
               global.centerContainer, {
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons
            }]}
         >
             Verified
         </Text>
      </View>
   )
}

export default ProfileScreen = () => {
   const router = useRouter();
   const { user, token } = useAuth();
   const { profile } = useAppData();


   const [showLogout, setShowLogout] = useState(false);
   const handleLogoutShow = () => {
      setShowLogout(true);
   }

   return (
      <>
         <LogoutModal showModal={showLogout} setShowModal={setShowLogout}/>
         <ScrollView 
         style={[global.screenContainer, {backgroundColor: '#fff'}]}
         >
            {/* --------------------------------- Header --------------------------------- */}
            <ImageBackground
            source={require('../../../../assets/images/backgrounds/graphic-bg1.png')} 
            style={{
               width: '100%',
               height: 224 + StatusBar.currentHeight,
               backgroundColor: COLORS.lightblue,
               overflow: 'hidden',
               borderBottomEndRadius: 42,
               borderBottomStartRadius: 42,
            }}>
               <SafeAreaView 
               style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: 24,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                  zIndex: 1,
                  paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
               }}>
                  <Image 
                  src={profile?.profile_photo_url}
                  style={{
                     width: 100,
                     height: 100,
                     aspectRatio: '1/1',
                     flexShrink: 0,
                     borderRadius: 50,
                     backgroundColor: '#fff'
                  }}/>

                  <View 
                  style={{
                     flex: 1,
                     gap: 8,
                     justifyContent: 'center',
                     alignItems: 'flex-start',
                  }}>
                     <Text 
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.xl,
                        color: COLORS.lettersicons,
                     }}>
                        {profile?.full_name || user?.full_name || ""}
                     </Text>
                     {profile && (
                        (profile.is_verified) ?
                        <VerifiedText /> :
                        <VerifyButton /> 
                     )}
                     
                  </View>

                  <TouchableOpacity
                     onPress={() => {/*router.push('client-dashboard/settings/accountInfo'*/}}
                  >
                     <Arrows name="chevron-right" size={24} color={COLORS.secondary} />
                  </TouchableOpacity>
               </SafeAreaView>
            </ImageBackground>

            {/* ---------------------------------- Tabs ---------------------------------- */}
            <ProfileTab 
               icon={<Icons2 name="key" size={24} color={COLORS.primary} />}
               title="Account and Security"
               hasArrow={true}
               onPress={() => {}}
            />
            {/* <ProfileTab 
               icon={<Icons1 name="location-on" size={24} color={COLORS.primary} />}
               title="My Addresses"
               hasArrow={true}
               onPress={() => {router.push('client-dashboard/settings/addresses')}}
            /> */}
            {/* <ProfileTab 
               icon={<Icons2 name="credit-card" size={24} color={COLORS.primary} />}
               title="Payment Methods"
               hasArrow={true}
               onPress={() => {router.push('client-dashboard/settings/payment')}}
            /> */}
            <ProfileTab 
               icon={<Icons1 name="contact-emergency" size={24} color={COLORS.primary} />}
               title="Emergency Contacts"
               hasArrow={true}
               onPress={() => {router.push('client-dashboard/settings/contacts')}}
            />
            <ProfileTab 
               icon={<Icons2 name="message-question" size={24} color={COLORS.primary} />}
               title="FAQs"
               hasArrow={true}
               onPress={() => {router.push('comingSoon')}}
            />
            <ProfileTab 
               icon={<Icons2 name="key" size={24} color={COLORS.primary} />}
               title="About Us"
               hasArrow={true}
               onPress={() => {router.push('comingSoon')}}
            />
            <ProfileTab 
               icon={<Icons2 name="file-document" size={24} color={COLORS.primary} />}
               title="Terms and Conditions"
               hasArrow={true}
               onPress={() => {router.push('comingSoon')}}
            />
            <ProfileTab 
               icon={<Icons2 name="shield-check" size={24} color={COLORS.primary} />}
               title="Privacy Policy"
               hasArrow={true}
               onPress={() => {router.push('comingSoon')}}
            />
            <ProfileTab 
               icon={<Icons2 name="wrench" size={24} color={COLORS.primary} />}
               title="Be a Service Provider"
               hasArrow={true}
               onPress={() => {router.push('client-dashboard/verify-worker')}}
            />
            <ProfileTab 
               icon={<Icons2 name="logout" size={24} color={COLORS.primary} />}
               title="Log Out"
               hasArrow={false}
               onPress={handleLogoutShow}
            />
         </ScrollView>
      </>
   )
}

const LogoutModal = ({showModal, setShowModal}) => {
   const router = useRouter();
   const { logout } = useAuth();

   const {width, height} = useWindowDimensions()

   const handleCloseModal = () => {
      setShowModal(false);
   }

   const handleLogout = () => {
      logout();
      setShowModal(false);
      router.replace('authentication');
   }

   return (
      <Modal 
      animationType='fade'
      visible={showModal}
      backdropColor={'rgba(0, 0, 0, 0.2)'}
      statusBarTranslucent={true}
      > 
         <View 
         style={{
            width: width,
            height: height,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
         }}>
            <View style={global.centerModal}>
               <Text style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary,
                  textAlign: 'center',
               }}>
                  Log Out
               </Text>

               <View style={global.divider}/>

               <Text style={{
                  textAlign: 'center',
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons
               }}>
                  Are you sure you want to log out?
               </Text>

               <View style={{flexDirection: 'row', gap: 12}}>
                  <TouchableHighlight
                  underlayColor="#d8d8d8"
                  onPress={handleCloseModal}
                  style={[global.secondaryBtn, {width: 0, flex: 1}]}>
                     <Text style={[global.secondaryBtnText]}>Cancel</Text>
                  </TouchableHighlight>

                  <TouchableHighlight 
                  underlayColor="#0072bc"
                  onPress={handleLogout}
                  style={[global.primaryBtn, {width: 0, flex: 1}]}>
                     <Text style={[global.primaryBtnText]}>Yes, Log Out</Text>
                  </TouchableHighlight>
               </View>
            </View> 
         </View>  

      </Modal>
   )
}