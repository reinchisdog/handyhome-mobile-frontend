/* --------------------------------- Imports -------------------------------- */
import { View, Animated, useWindowDimensions, Easing, Text, Image, TouchableHighlight } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useRouter} from 'expo-router';
import { useAppointment } from '../../../../context/AppointmentContext';
/* ---------------------------- Styles and Icons ---------------------------- */
import { globalStyles as global } from '../../../../styles/globalStyles';
import { launchStyles as launch } from '../../../../styles/launchStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const SuccessScreen = () => {
  const route = useRouter();
  const {width, height} = useWindowDimensions();

  const imageAnimation = useRef(new Animated.Value(0)).current;

  const imageRotation = imageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
    extrapolate: 'clamp'
  })

  const imageSize = imageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
    extrapolate: 'clamp'
  })

  useEffect(() => {
    Animated.timing(imageAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bezier(0.22, 1, 0.36, 1)
    }).start();
    
  }, []);

  return (
    <View style={[
      global.centerContainer, {
      flex: 1,
      width,
      zIndex: 4,
      position: 'relative',
      backgroundColor: '#fff'
    }]}>
    
      <Animated.Image 
        source={require('../../../../assets/images/illustrations/Onboarding-4.png')}
        style={[launch.image, {
          transform: [{rotate: imageRotation}, {scale: imageSize}]
        }]}
      />

      <View style={[{height: 96,}]}>
        <Text style={[launch.title]}>
          Booking Successful!
        </Text>
        <Text style={launch.description}>
          Your [Service Name] is successfully booked.
          You can check your booking on the menu profile.
        </Text>
      </View>
      <View style={{
        width: 266,
        aspectRatio: 1/1,
        borderColor: COLORS.primary,
        borderWidth: 29,
        borderRadius: 266,
        opacity: 0.25,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -133 }, { translateY: -210 }],
        zIndex: -1,
      }} />

      <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
        <TouchableHighlight style={global.secondaryBtn}
        underlayColor="#d8d8d8"
        onPress={() => route.replace('/client-dashboard/(tabs)/bookings/')}>
          <Text style={global.secondaryBtnText}>View My Bookings</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default SuccessScreen
