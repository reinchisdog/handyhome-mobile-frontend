import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, StatusBar, Image, TouchableHighlight, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'

import Header from '../../../../../components/dashboard/Header'
import ProfileTab from '../../../../../components/dashboard/profile/ProfileTab'

import { globalStyles as global } from '../../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../../styles/constants'
import Icons1 from '@expo/vector-icons/MaterialIcons';
import Icons2 from '@expo/vector-icons/MaterialCommunityIcons';
import Arrow from '@expo/vector-icons/AntDesign';

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
               fontSize: FONT_SIZES.sm,
               color: COLORS.lettersicons
            }]}
         >
             Verified
         </Text>
      </View>
   )
}

const ProfileScreen = () => {
   const { height } = useWindowDimensions();

   const [ isVerified, setIsVerified ] = useState(false);

   return (
      <ScrollView 
      style={[global.screenContainer, {backgroundColor: '#fff'}]}
      >
         {/* --------------------------------- Header --------------------------------- */}
         <View 
         style={{
            width: '100%',
            height: 224 + StatusBar.currentHeight,
            backgroundColor: COLORS.lightblue,
            overflow: 'hidden',
            borderBottomEndRadius: 42,
            borderBottomStartRadius: 42,
         }}>
            <SafeAreaView style={{
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
                  source={require('../../../../../assets/placeholder-base.png')}
                  style={{
                     width: 100,
                     height: 100,
                     aspectRatio: '1/1',
                     flexShrink: 0,
                     borderRadius: 50,
                  }}
               />

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
                     John Doe
                  </Text>
                  {(isVerified) ?
                  <VerifiedText /> :
                  <VerifyButton /> 
                  }
                  
               </View>

               <TouchableOpacity
                  onPress={() => {}}
               >
                  <Arrow name="right" size={24} color={COLORS.secondary} />
               </TouchableOpacity>
            </SafeAreaView>
         </View>

         {/* ---------------------------------- Tabs ---------------------------------- */}
         <ProfileTab 
            icon={<Icons2 name="key" size={24} color={COLORS.primary} />}
            title="Account and Security"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons1 name="location-on" size={24} color={COLORS.primary} />}
            title="My Addresses"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons2 name="credit-card" size={24} color={COLORS.primary} />}
            title="Payment Methods"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons2 name="message-question" size={24} color={COLORS.primary} />}
            title="FAQs"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons2 name="key" size={24} color={COLORS.primary} />}
            title="About Us"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons2 name="file-document" size={24} color={COLORS.primary} />}
            title="Terms and Conditions"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons2 name="shield-check" size={24} color={COLORS.primary} />}
            title="Privacy Policy"
            hasArrow={true}
            onPress={() => {}}
         />
         <ProfileTab 
            icon={<Icons2 name="logout" size={24} color={COLORS.primary} />}
            title="Log Out"
            hasArrow={false}
            onPress={() => {}}
         />
      </ScrollView>
   )
}

export default ProfileScreen