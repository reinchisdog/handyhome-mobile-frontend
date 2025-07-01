/* --------------------------------- Imports -------------------------------- */
import { StyleSheet, Text, View, TouchableHighlight, Image, useWindowDimensions, StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'
// Styles and Icons
import LogoText from '../../components/LogoText';
import MainButton from '../../components/MainButton';

import { globalStyles as global } from '../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants';

export default AuthStartingPage = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const {width} = useWindowDimensions();
  const route = useRouter();

  return (
    <View 
    style={[
      global.screenContainer, {
      position: 'relative', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingTop: 72 + StatusBar.currentHeight,
      paddingBottom: 72,
      backgroundColor: '#fff'
    }]}>
      {/* Logo */}
      <View style={{
        alignItems: 'center',
        gap: 8
      }}>
        <LogoText size={40}/>
        <Text style={{
          fontFamily: FONTS.nunito600,
          fontSize: FONT_SIZES.md,
          color: COLORS.darkblue
        }}>
          Home Services Made Simple
        </Text>
      </View>

      {/* Buttons */}
      <View style={[global.buttonsContainer, {position: 'relative', zIndex: 1}]}>
        <MainButton 
        text="Create a new account"
        type="secondary"
        onPress={() => route.navigate('/authentication/signup/')}
        />

        <MainButton 
        text="Already have an account"
        type="primary"
        onPress={() => route.navigate('/authentication/login')}
        />
        
      </View>

      <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: width,
        aspectRatio: '375/576',
        zIndex: 0,
      }}>
        <Image 
        source={require('../../assets/images/backgrounds/graphic-bg8.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}/>
      </View>
      
    </View>
  )
}