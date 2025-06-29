/* --------------------------------- IMPORTS -------------------------------- */
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, useWindowDimensions, Image} from 'react-native'
import { useAuth } from '../context/AuthContext';
// Components
import SplashIcon1 from '../assets/images/icons/SplashIcon1'
// Styles and Icons
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS } from '../styles/constants';

export default function SplashScreen() {
  /* ----------------------------- Initialization ----------------------------- */
    const router = useRouter();
    const { user, hasOnboarded, loading } = useAuth();
    const { height } = useWindowDimensions();

    const [ aniComplete, setAniComplete ] = useState(false);

  /* ------------------------------- Animations ------------------------------- */
    const screenColorAnim = useRef(new Animated.Value(0)).current;
    const screenColor = screenColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ '#3A454D', '#ffffff'],
    })

    const circleColorAnim = useRef(new Animated.Value(0)).current;
    const circleColor = circleColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ '#ffffff', '#3A454D'],
    })

    const circlePosAnim = useRef(new Animated.Value(1)).current;
    const circlePos = circlePosAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0, (-height/2)-100],
    })

    const circleScaleAnim = useRef(new Animated.Value(0)).current;
    const circleScale = circleScaleAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [ 165, 235, (height*1.5)],
    })

    const logoOpacityAnim1 = useRef(new Animated.Value(1)).current;
    const logoOpacityAnim2 = useRef(new Animated.Value(0)).current;
    const logoOpacityAnim3 = useRef(new Animated.Value(0)).current;
    const logoOpacityAnim4 = useRef(new Animated.Value(0)).current;

    const logoOpacity1 = logoOpacityAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0.0, 1.0],
    })
    const logoOpacity2 = logoOpacityAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0.0, 1.0],
    })
    const logoOpacity3 = logoOpacityAnim3.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0.0, 1.0],
    })
    const logoOpacity4 = logoOpacityAnim4.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0.0, 1.0],
    })
    
    const logo3PosAnim = useRef(new Animated.Value(0)).current;
    const logo3Pos = logo3PosAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0, -67],
    })
    const logo4PosAnim = useRef(new Animated.Value(0)).current;
    const logo4Pos = logo4PosAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [ 0, -48],
    })

    /* -------------------------------- Function -------------------------------- */
    const checkStatus = async () => {
      try {
        if (!hasOnboarded) {
          router.replace('/onboarding');
        } else if (!user) {
          router.replace('/authentication');
        } else if (user.role === "User") {
          router.replace('/client-dashboard');
        } else if (user.role === "Worker") {
          router.replace('/worker-dashboard');
        }
      } catch (e) {
        console.error('Splash check error: ', e);
      }
    }

    const splashAnimation = async () => {
      Animated.sequence([
        // First Animation
        Animated.parallel([
          Animated.timing(circlePosAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: false
          }),
          Animated.timing(logoOpacityAnim1, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacityAnim2, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true,
          }),
        ]),
        // Second Animation
        Animated.parallel([
          Animated.timing(circleColorAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: false
          }),
          Animated.timing(circleScaleAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: false
          }),
          Animated.timing(logoOpacityAnim2, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacityAnim3, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true,
          }),
        ]),
        // Third Animation
        Animated.parallel([
          Animated.timing(circleScaleAnim, {
            toValue: 2,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: false
          }),
          Animated.timing(circleColorAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: false
          }),
          Animated.timing(logoOpacityAnim3, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true
          }),
          Animated.timing(logoOpacityAnim4, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true
          }),
          Animated.timing(logo3PosAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true
          }),
          Animated.timing(logo4PosAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.40, 1, 0.40, 1),
            useNativeDriver: true
          }),
        ])
      ]).start(() => {
        setAniComplete(true);
      });
    }

    useEffect(() => {
      if (loading) return;

      const handleAnimationNavigation = async () => {
        if (!aniComplete) {
          await new Promise(resolve => {
            splashAnimation();
            const checkComplete = () => {
              if (aniComplete) {
                resolve();
              } else {
                setTimeout(checkComplete, 50);
              }
            };
            checkComplete();
          });
        }
        await checkStatus();
      };

      handleAnimationNavigation();
    }, [ user, hasOnboarded, loading, aniComplete ])

  return (
    <Animated.View style={[global.centerContainer, {flex: 1, backgroundColor: screenColor}]}>
      {/* ---------------------------------- Logo ---------------------------------- */}
      <Animated.View
      style={{position: 'absolute', zIndex: 4, opacity: logoOpacity1}}>
        <SplashIcon1 
        height={100}
        width={100}
        color="#fff"/>
      </Animated.View>
      <Animated.View
      style={{position: 'absolute', zIndex: 4, opacity: logoOpacity2}}>
        <SplashIcon1 
        height={100}
        width={100}
        color="#3A454D"/>
      </Animated.View>
      <Animated.View
      style={{position: 'absolute', zIndex: 4, opacity: logoOpacity3, transform: [{translateY: logo3Pos}]}}>
        <SplashIcon1 
        height={100}
        width={100}
        color="#58B7F3"/>
      </Animated.View>
      <Animated.View
      style={{position: 'absolute', zIndex: 4, opacity: logoOpacity4, transform: [{translateY: logo4Pos}]}}>
        <Image 
        source={require('../assets/images/logos/splash-logo.png')}
        style={{height: 148, objectFit: 'contain'}}
        />
      </Animated.View>

      {/* --------------------------------- Circle --------------------------------- */}
      <Animated.View
      style={{
        height: circleScale,
        width: circleScale,
        aspectRatio: "1/1",
        borderRadius: Animated.divide(circleScale, 2),
        position: 'absolute',
        backgroundColor: circleColor,
        transform: [{translateY: circlePos}],
        borderWidth: 15,
        borderColor: '#fff'
      }} />
      
    </Animated.View>

  )
}
