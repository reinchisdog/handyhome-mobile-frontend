// SubScreen: Location Prompt

// Imports
// ---- Hooks and React Components
import { Text, View, TouchableOpacity, Animated, Easing, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useSignup } from '../../context/SignupContext';
// ---- Styles and Icons
import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS } from '../../styles/constants';
import Icons from '@expo/vector-icons/MaterialIcons';
// ---- Other Libraries
import * as Location from 'expo-location';

const LocationPrompt = () => {
   // States and Hooks
   const { setStep, updateHomeData, setErrorModal, setErrorModalMessage, setExitCondition, } = useSignup();
   const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);

   const handleLocationAccess = () => {
         checkIfLocationEnabled();
         getCurrentLocation();
   }
   
   const checkIfLocationEnabled = async () => {
      let enabled = await Location.hasServicesEnabledAsync();
      
      if (!enabled) {
         Alert.alert('Location not enabled', 'Please enable location services in your device settings.', [
         {
            text: 'Cancel',
            onPress: () => console.log("Cancel Pressed"),
            style: 'cancel',
         }, {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
         }
         ]);
      } else {
         setLocationServicesEnabled(true);
      }
   }

   const getCurrentLocation = async () => {
      try {
         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please allow location access to continue.', [
            {
               text: 'Cancel',
               onPress: () => console.log("Cancel Pressed"),
               style: 'cancel',
            }, {
               text: 'OK',
               onPress: () => console.log('OK Pressed'),
            }
            ]);
         }

         const {coords} = await Location.getCurrentPositionAsync();
         if (coords) {
            const {latitude, longitude} = coords;

            let response = await Location.reverseGeocodeAsync({
               latitude,
               longitude
            });

            console.log(response);
            
            if (response.length <= 0) {
               throw new Error("Unable to retrieve address from location.");
            }

            if (!response[0].formattedAddress.includes("Marikina")) {
               throw new Error("Service is only currently available in Marikina City.");
            }
            
            updateHomeData('block', response[0].street);
            updateHomeData('province', 'Second District');
            updateHomeData('municipal', 'Marikina City');
            setStep(3); 
         }
      } catch (error) {
         const message = error.message || "An error occurred while fetching location.";
         setErrorModalMessage(`${message} Please enter your location manually instead.`);
         setExitCondition(null);
         setErrorModal(true);
         
         setTimeout(() => { setStep(3); }, 500);
         // console.log("[Location Prompt] Error getting location:", error);
      }
   }



  // Animations
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
    <View 
    style={[global.screenContainer, global.centerContainer, {
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
        onPress={handleLocationAccess}>
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
