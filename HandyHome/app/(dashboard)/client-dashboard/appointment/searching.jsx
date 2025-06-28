/* --------------------------------- Imports -------------------------------- */
import { View, Animated, useWindowDimensions, Easing, Text, Image } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useRouter} from 'expo-router';
import { useAppointment } from '../../../../context/AppointmentContext';
/* ---------------------------- Styles and Icons ---------------------------- */
import { globalStyles as global } from '../../../../styles/globalStyles';
import { launchStyles as launch } from '../../../../styles/launchStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

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
  
    // One looped animation with staggered starts
    const loop = Animated.loop(
      Animated.stagger(150, ballAnims.map(anim => createBounce(anim)))
    );
  
    loop.start();
  
    Animated.timing(contAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start(() => {
        
        // Next Step

      });
      
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
  const {appointment, setAppointment} = useAppointment();
  const [workerDetails, setWorkerDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (workerDetails) {
      setAppointment((prev) => ({
        ...prev,
        workerDetails: workerDetails
      }))

      console.log(workerDetails)

      setTimeout(() => {
        router.replace('client-dashboard/appointment/summary')
      }, 500)
    }

    const getWorkerDetails = async () => {
      setTimeout(() => {
        setWorkerDetails("merp");
      }, 500)
    }

    getWorkerDetails();

  }, [workerDetails]);

  return (
    <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
    {(!workerDetails) ?
      <SearchingScreen /> :
      <SearchingSuccess />
    }
    </View>
  );
}

export default AppointLoading
