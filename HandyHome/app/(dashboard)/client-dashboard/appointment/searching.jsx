/* --------------------------------- Imports -------------------------------- */
import { View, Animated, useWindowDimensions, Easing, Text, Image } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useRouter} from 'expo-router';
import { useAppointment } from '../../../../context/AppointmentContext';

import ErrorModal from '../../../../components/ErrorModal';
/* ---------------------------- Styles and Icons ---------------------------- */
import { globalStyles as global } from '../../../../styles/globalStyles';
import { launchStyles as launch } from '../../../../styles/launchStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import { useAuth } from '../../../../context/AuthContext';

const SearchingScreen = () => {
  const {width, height} = useWindowDimensions();

  const ballAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  /* -------------------------------- Animation ------------------------------- */
  const translateYs = ballAnims.map(anim =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20], // goes up 20 units
      })
  );

  const contAnim = useRef(new Animated.Value(0)).current;
  const cont = contAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [width / 2 + 120, 0],
  });

  useEffect(() => {
    const createBounce = anim =>
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
  
    const loop = Animated.loop(
      Animated.stagger(150, ballAnims.map(anim => createBounce(anim)))
    );
  
    loop.start();
  
    Animated.timing(contAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();    
  }, []);

  return (
    <Animated.View
    style={{ 
      gap: 48,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: cont }] ,
    }}
    >
      <View
      style={{
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
      {translateYs.map((ty, i) => (
        <Animated.View
        key={i}
        style={{
            backgroundColor: COLORS.primary,
            width: 16,
            height: 16,
            borderRadius: 8,
            transform: [{ translateY: ty }],
        }}
        />
      ))}
      </View>

      <Text
      style={{
        fontFamily: FONTS.roboto500,
        fontSize: FONT_SIZES.md,
        color: COLORS.lettersicons,
        textAlign: 'center',
        width: width*0.8,
        position: 'absolute',
        transform: [{translateY: 64}]
      }}>
        Finding the best available provider for you...
      </Text>
    </Animated.View>
  );
}

const SearchingSuccess = () => {
  const {width, height} = useWindowDimensions();
  const router = useRouter();

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
    }).start(() => {
      router.replace(`client-dashboard/appointment/summary`);
    });
    
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
          Service Provider Found!
        </Text>
        <Text style={launch.description}>
          A provider has accepted your request. View their profile and confirm your booking.
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
    </View>
  );
}

const AppointLoading = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const router = useRouter();
  const {
    appointment, 
    fetchAppointmentStatus, 
    rejectInitialBooking,
  } = useAppointment();
  const {token} = useAuth();
  const [initialAppointSuccess, setInitialAppointSuccess] = useState(false);
  const [appointError, setAppointError] = useState(false);
  const [appointErrorMessage, setAppointErrorMessage] = useState(null);

  useEffect(() => {
    if (!appointment || !appointment.id || !token) return
    
    const start = Date.now();
    const interval = setInterval(async () => {
      const result = await fetchAppointmentStatus(appointment.id);

      if (result.success && result.status === "ready") {
        clearInterval(interval);
        // console.log("Booking Confirmed")
        setInitialAppointSuccess(true);
      } else if (!result.success) {
        clearInterval(interval);
        setAppointErrorMessage(result.message);
      } else if (Date.now() - start >= 300000) {
        clearInterval(interval);
        // console.log("Timeout Reached. Rejecting booking...");
        await rejectInitialBooking(bookingId);
      }

      return () => clearInterval(interval);
    }, 3000)
  }, [appointment, token]);

  const handleExit = () => {
    router.replace('client-dashboard/')
    setAppointError(false);
  }

  return (
    <>
      <ErrorModal 
      visible={appointError}
      setVisible={setAppointError}
      title={"Initial Booking Error"}
      message={appointErrorMessage}      
      onExit={handleExit}
      buttonText={"Return to Home"}
      />

      <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
      {(!initialAppointSuccess) ?
        <SearchingScreen /> :
        <SearchingSuccess />
      }
      </View>
    </>
  );
}

export default AppointLoading
