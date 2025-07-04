import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Animated } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useRouter} from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../../../../components/dashboard/Header'
import Arrows from '@expo/vector-icons/Entypo'
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons'
import Icons2 from '@expo/vector-icons/MaterialIcons'
import MainButton from '../../../../components/MainButton';

import {globalStyles as global} from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

export default OverviewWorkerVerification = () => {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const scrollY = useRef(new Animated.Value(0)).current;

   const headerTitle = scrollY.interpolate({
      inputRange: [48, 64],
      outputRange: [0, 1],
      extrapolate: 'clamp'
   })

   const subSteps = [
      "2 Valid IDs",
      "NBI Clearance",
      "Barangay Clearance",
      "Licenses & Certifications",
      "Work Experience"
   ]

   return (
      <View style={[global.screenContainer, {paddingBottom: insets.bottom}]}>
         <Header 
         background={COLORS.screenbg}
         left={
            <TouchableOpacity
            onPress={() => router.back()}>
               <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
            </TouchableOpacity>
         }
         title={
            <Animated.Text style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxl,
               color: COLORS.primary,
               opacity: headerTitle
            }}>
               Submit Documents
            </Animated.Text>
         }
         titlePosition='absolute'
         titleAlign='center'
         />

         <ScrollView
         onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
            useNativeDriver: false,
         })}
         style={{
            flex: 1,
         }}
         contentContainerStyle={{
            paddingHorizontal: 24, gap: 12
         }}>
            {/* ---------------------------------- Title --------------------------------- */}
            <View 
            style={{
               padding: 10,
               gap: 10
            }}>
               <Text 
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.xxl,
                  color: COLORS.primary,
                  width: '100%',
                  textAlign: 'center'
               }}>
                  Submit Documents
               </Text>
               <Text
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons,
                  textAlign: 'center'
               }}>
                  We need to verify your information. Please submit the documents below and take the quiz to process your application.
               </Text>
            </View>

            {/* ---------------------------------- Steps --------------------------------- */}
            <StepContainer 
            label="Photo Verification"
            icon={<Icons2 name='person-search' size={24} color={COLORS.primary}/>}
            />

            <StepContainer 
            label="Credentials"
            icon={<Icons1 name='file-document' size={24} color={COLORS.primary}/>}
            />

            <View style={{paddingHorizontal: 24}}>
            {subSteps.map((item, index) => (
               <React.Fragment key={index}>
               {(index !== 0) && (
                  <View style={{
                     height: 16,
                     width: 1,
                     borderRadius: 0.5,
                     backgroundColor: COLORS.primary,
                     marginLeft: 5.25
                  }}/>
               )}
                  <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                     <View 
                     style={{
                        backgroundColor: COLORS.accent,
                        width: 12,
                        height: 12,
                        aspectRatio: '1/1',
                        borderRadius: 6
                     }}/>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>{item}</Text>
                  </View>
               
               </React.Fragment>
            ))}
            </View>

            <StepContainer 
            label="Proof of Work"
            icon={<Icons2 name='fact-check' size={24} color={COLORS.primary}/>}
            />

            <StepContainer 
            label="Service Selection"
            icon={<Icons1 name='pipe-wrench' size={24} color={COLORS.primary}/>}
            />

         </ScrollView>

         <View style={[global.buttonsContainer]}>
            <TouchableHighlight style={global.primaryBtn}
            underlayColor='#0072bc'
            onPress={() => {router.push('client-dashboard/verify-worker/form')}}>
               <Text style={global.primaryBtnText}>Get Started</Text>
            </TouchableHighlight>
         </View>
      </View>
   )
}

const StepContainer = ({icon, label}) => (
   <View style={{
      paddingHorizontal: 24,
      paddingVertical: 8,
      backgroundColor: '#fff',
      width: '100%',
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
   }}>
      <Text style={{
         fontFamily: FONTS.roboto500,
         fontSize: FONT_SIZES.md,
         color: COLORS.lettersicons,
         textAlign: 'left'
      }}>
         {label}
      </Text>

      {icon}
   </View>
)