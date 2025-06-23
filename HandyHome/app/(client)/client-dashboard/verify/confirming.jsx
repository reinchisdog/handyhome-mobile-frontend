/* --------------------------------- Imports -------------------------------- */
import { View, Animated, useWindowDimensions, Easing, Text, TouchableHighlight } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useRouter} from 'expo-router';
import { useClientVerification } from '../../../../context/ClientVerificationContext';
/* ------------------------------- Components ------------------------------- */
import SuccessCheck from '../../../../assets/images/illustrations/SuccessCheck';
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
    </Animated.View>
  );
}

const SearchingSuccess = () => {
  const route = useRouter();
  const {width, height} = useWindowDimensions();

  const imageAnimation = useRef(new Animated.Value(0)).current;

  const imageRotation = imageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
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
      backgroundColor: '#fff',
      gap: 24,
    }]}>
    
      <Animated.View 
        style={{
          transform: [{rotate: imageRotation}]
        }}
      >
        <SuccessCheck />
      </Animated.View>

      <View style={[{height: 96}]}>
        <Text style={[launch.title]}>
          Verification Request Submitted
        </Text>
        <Text style={launch.description}>
          Your request is held under review by the admin.
          Please wait for a confirmation.
        </Text>
      </View>

      <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
        <TouchableHighlight style={global.secondaryBtn}
        underlayColor="#d8d8d8"
        onPress={() => route.replace('/client-dashboard/(tabs)/')}>
          <Text style={global.secondaryBtnText}>Back To Home</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const VerifyConfirming = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const { clientVerification, clearClientVerification } = useClientVerification();
  const [submitting, setSubmitting] = useState(true);

  const submitVerificationDetails = async () => {
    setTimeout(() => {
      console.log("Submitting Client Verification...")
    }, 1000)
  }

  useEffect(() => {
    submitVerificationDetails()
    setSubmitting(false);
    clearClientVerification();
  }, [])

  return (
    <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
    {(submitting) ?
      <SearchingScreen /> :
      <SearchingSuccess />
    }
    </View>
  );
}

export default VerifyConfirming
