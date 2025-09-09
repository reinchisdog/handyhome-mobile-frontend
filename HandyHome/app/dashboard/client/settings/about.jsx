// Screem: About Us in Profile Settings

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Pressable, ScrollView, FlatList, Image, ImageBackground } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import Header from '../../../../components/Header';
import LogoText from '../../../../components/LogoText';
import LogoIcon from '../../../../components/LogoIcon';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const ProfileAbout = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();

   return (
      <ScrollView
      stickyHeaderIndices={[0]}
      style={[global.screenContainer]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 12}}
      >
         <Header hasBack={true} backColor='#fff' title="About Us" textColor='#fff' backgroundColor={COLORS.primary}/>

         <View style={{ paddingHorizontal: 12, paddingVertical: 24, gap: 24 }}>
            <View 
            style={[ styles.container, {padding: 0} ]}>
               <ImageBackground 
               source={require('../../../../assets/images/backgrounds/graphic-bg1.png')}
               imageStyle={{
                  objectFit: 'cover',
                  resizeMode: 'cover'
               }}
               style={{
                  paddingVertical: 38,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
               }}>
                  <Image 
                  source={require('../../../../assets/images/logos/square-logo-1.png')}
                  style={{
                     width: 36,
                     height: 36
                  }}
                  />

                  <LogoText size={28}/>
               </ImageBackground>
               
               <View style={{padding: 24, gap: 24}}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     textAlign: 'justify', 
                  }}>
                     <Text style={{fontFamily: FONTS.roboto600}}>HandyHome</Text> is a mobile-only platform built with the Filipino household in mind. Our mission is to simplify and secure the way people access home repair and maintenance services by connecting them with trusted, verified freelance service providers. We aim to empower local workers while giving users peace of mind through streamlined booking processes and built-in safety features like the emergency button. Designed for urban communities like Marikina City, HandyHome champions convenience, safety, and professionalism—one service at a time.
                  </Text>

                  <View style={global.divider}/>

                  <Text
                  style={{
                     fontStyle: 'italic',
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     textAlign: 'justify', 
                     marginBottom: 24,
                  }}>
                     Ang <Text style={{fontFamily: FONTS.roboto600}}>HandyHome</Text> ay isang mobile-only na plataporma na ginawa para sa pangangailangan ng bawat pamilyang Pilipino. Layunin naming gawing mas madali at mas ligtas ang proseso ng pagkuha ng mga serbisyo sa bahay sa pamamagitan ng pagkonekta sa mga mapagkakatiwalaan at beripikadong freelance service providers. Pinalalakas namin ang kabuhayan ng lokal na manggagawa habang binibigyan ang mga kliyente ng kapanatagan sa paggamit ng streamlined na booking process at emergency button. Dinisenyo para sa mga urbanong komunidad tulad ng Marikina City, isinusulong ng HandyHome ang kaginhawaan, seguridad, at propesyonalismo—isang serbisyo sa bawat gamit.

                  </Text>
               </View>
            </View>

            
         </View>
      </ScrollView>
   )
}

export default ProfileAbout

const styles = StyleSheet.create({
   container: {
      overflow: 'hidden',
      borderRadius: 20,
      backgroundColor: '#fff'
   },
})