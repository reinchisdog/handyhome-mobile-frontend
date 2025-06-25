import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from 'react-native';
import React from 'react';
import {useRouter} from 'expo-router'

import Header from '../../../../components/dashboard/Header'
import Arrows from '@expo/vector-icons/Entypo'

import {globalStyles as global} from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

export default InitialWorkerVerification = () => {
   const router = useRouter()

   return (
      <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
         <Header 
         left={
            <TouchableOpacity
            onPress={() => router.back()}>
               <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
            </TouchableOpacity>
         }/>

         <ScrollView contentContainerStyle={{flex: 1, padding: 24, gap: 24, justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxl,
               color: COLORS.primary,
               textAlign: 'center'
            }}>
               Become a <Text style={{color: COLORS.accent}}>Handy</Text>Home Service Provider
            </Text>

            <View style={{position: 'relative'}}>
               <Image 
               source={require('../../../../assets/images/illustrations/Onboarding-1.png')}
               style={{
                  width: 256,
                  height: 256,
                  aspectRatio: '1/1',
                  objectFit: 'contain',
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 1,
               }}
               />
               <View style={{
                  width: 266,
                  aspectRatio: 1/1,
                  borderColor: COLORS.primary,
                  borderWidth: 29,
                  borderRadius: 266,
                  opacity: 0.25,
                  marginBottom: 24,
               }} />
            </View>

            <Text style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
                textAlign: 'center'
            }}>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
         </ScrollView>
         
         <View style={global.buttonsContainer}>
            <TouchableHighlight style={global.primaryBtn}
            underlayColor='#0072bc'
            onPress={() => router.push('client-dashboard/verify-worker/overview')}>
               <Text style={global.primaryBtnText}>See Details</Text>
            </TouchableHighlight>
         </View>
      </View>
   )
}