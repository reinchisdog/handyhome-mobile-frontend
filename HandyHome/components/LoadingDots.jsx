// Component: LoadingDots - Animated Dots

// Imports
// ---- Hooks and React Components
import React, {useEffect, useRef} from 'react';
import { Animated, useWindowDimensions, Easing } from 'react-native';
import { COLORS } from '../styles/constants';

export default LoadingDots = ({ size = 16, slide = true, animationTimeout = 1500, onAnimationEnd = () => {}}) => {
   const { width } = useWindowDimensions();

   const ballAnims = [
      useRef(new Animated.Value(0)).current,
      useRef(new Animated.Value(0)).current,
      useRef(new Animated.Value(0)).current,
  ];

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
    
      if (slide) {
         Animated.timing(contAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
         }).start(() => {
            setTimeout(() => {
               onAnimationEnd();
            }, animationTimeout);
         });
      } else {
         setTimeout(() => {
            onAnimationEnd();
         }, animationTimeout);
      }
        
   }, []);

   return (
      <Animated.View
      style={{
         flexDirection: 'row',
         gap: size - 4,
         transform: [{ translateX: slide ? cont : 0 }],
      }}>
        {translateYs.map((ty, i) => (
            <Animated.View
            key={i}
            style={{
                backgroundColor: COLORS.primary,
                width: size,
                height: size,
                borderRadius: size/2,
                transform: [{ translateY: ty }],
            }}/>
        ))}
      </Animated.View>
   )
}