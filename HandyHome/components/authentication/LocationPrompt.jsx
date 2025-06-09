/* --------------------------------- Imports -------------------------------- */
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useRouter, useNavigation } from 'expo-router';
/* ---------------------------- Styles and Icons ---------------------------- */
import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS } from '../../styles/constants';
import Icons from '@expo/vector-icons/MaterialIcons';

const LocationPrompt = ({setSignupData, setStep}) => {
    const route = useRouter();

    const locScale = useRef(new Animated.Value(0)).current;
    const animLocScale = locScale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2]
    })

    const locOpacity = useRef(new Animated.Value(0)).current;
    const animLocOpacity = locOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0.25, 0]
    })

    useEffect(() => {
      Animated.loop( Animated.parallel([
        Animated.timing(locScale, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(locOpacity, {
          toValue: 1,
          delay: 600,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])).start();
    }, [])

  return (
    <View style={[global.screenContainer, global.centerContainer, {
      gap: 20, 
      position:'absolute', 
      zIndex: 999, 
      height: '100%',
      backgroundColor: COLORS.secondary
    }]}>
      {/* ICON */}
      <View style={{
        width: '100%',
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        <View style={{
          width: 100,
          height: 100,
          aspectRatio: '1/1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: 'white',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 5,
          borderRadius: 50,
        }}>
          <Icons name='location-on' size={60} color={COLORS.primary}/>
        </View>
        <Animated.View style={{
          position: 'absolute',
          elevation: 0,
          zIndex: 0,
          aspectRatio: '1/1',
          borderRadius: '50%',
          backgroundColor: COLORS.lightblue,
          height: 100,
          transform: [{scaleX: animLocScale}, {scaleY: animLocScale}],
          opacity: animLocOpacity,
        }}>
        </Animated.View>
      </View>
        
      {/* BUTTONS */}
      <View style={[global.buttonsContainer]}>
        {/* TEXT */}
        <Text style={[auth.headerTitle, {textAlign: 'center', color: COLORS.primary}]}>
          Where is Your Location?
        </Text>

        {/* AUTOMATIC LOCATION */}
        <TouchableOpacity 
        style={[global.primaryBtn]}
        onPress={() => {}}>
          <Text style={[global.primaryBtnText]}>Allow Location Access</Text>
        </TouchableOpacity>

        {/* MANUAL LOCATION */}
        <TouchableOpacity 
        style={[global.secondaryBtn]}
        onPress={() => setStep(3)}>
          <Text style={[global.secondaryBtnText]}>Enter Location Manually</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default LocationPrompt
