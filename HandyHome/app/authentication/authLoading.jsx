/* --------------------------------- Imports -------------------------------- */
import { View, Animated, useWindowDimensions, Easing } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useRouter} from 'expo-router';
/* ---------------------------- Styles and Icons ---------------------------- */
import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS } from '../../styles/constants';

const AuthLoading = () => {
    /* ----------------------------- Initialization ----------------------------- */
    const {width, height} = useWindowDimensions();
    const router = useRouter();

    // Animated values for each ball
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
            setTimeout(() => {
              router.replace('../client-dashboard/');
            }, 1500);
          });
          
      }, []);
      


    return (
    <View style={[global.screenContainer, global.centerContainer]}>
        <Animated.View
        style={{
            flexDirection: 'row',
            gap: 12,
            transform: [{ translateX: cont }],
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
        </Animated.View>
    </View>
    );
}

export default AuthLoading
