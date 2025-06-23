import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

import Arrows from '@expo/vector-icons/Entypo'
import Header from '../components/dashboard/Header'

import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

const ComingSoonScreen = () => {
   const router = useRouter();

   return (
      <View style={global.screenContainer}>
         <Header 
         background={'#fff'}
         left={(
         <TouchableOpacity onPress={() => router.back()}>
               <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
         </TouchableOpacity>
         )}

         title={(
         <Text style={[global.headingText, {color: COLORS.primary}]}>Coming Soon</Text>
         )}
         titleAlign='center'
         titlePosition='absolute'
         />
         <View style={[global.screenContainer, global.centerContainer, {gap: 8, padding: 24, transform: [{translateY: -64}]}]}>
            <Image 
            source={require('../assets/images/illustrations/ComingSoon.png')}
            style={{width: 200, height: 200}}
            />
            <Text style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxxl,
               color: COLORS.primary,
               textAlign: 'center'
            }}>Feature Unavaliable</Text>
            <Text style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
               textAlign: 'center',
               lineHeight: 20
            }}>{`We are still working on this feature.\n`}<Text style={{fontFamily: FONTS.roboto600}}>Thank you for your patience!</Text></Text>
         </View>
      </View>
   )
}

export default ComingSoonScreen