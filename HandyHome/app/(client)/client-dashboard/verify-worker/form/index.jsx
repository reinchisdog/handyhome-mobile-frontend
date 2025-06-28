import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Animated, StatusBar, useWindowDimensions, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import Header from '../../../../../components/dashboard/Header';
import Arrows from '@expo/vector-icons/Entypo'

import PhotoVerificationScreen from './step-1';
import CredentialsScreen from './step-2';
import WorkSamplesScreen from './step-3';
import OfferedServicesScreen from './step-4';
import SummaryScreen from './step-5';

import {globalStyles as global} from '../../../../../styles/globalStyles';
import {COLORS, FONTS, FONT_SIZES} from '../../../../../styles/constants';
import { useRouter } from 'expo-router';
import { useWorkerVerify } from '../../../../../context/WorkerVerificationContext';

const TITLE_CONT = 144;
const HEADER_HEIGHT = StatusBar.currentHeight + 64 + 24 + TITLE_CONT;

const FormLayoutScreen = () => {
   const {width, height} = useWindowDimensions();
   const router = useRouter();
   const { workerVerify, submitWorkerVerify } = useWorkerVerify();
   
   const stepTitles = [
      `Photo \nVerification`,
      `Upload \nCredentials`,
      `Upload Completed \nWork Samples`,
      `Select Services \nYou Offer`,
      `Submission \nSummary`
   ]

   const scrollViewRef = useRef(null);
   const scrollY = useRef(new Animated.Value(0)).current;
   const stepX = useRef(new Animated.Value(0)).current;

   const headerHeight = scrollY.interpolate({
      inputRange: [0, TITLE_CONT],
      outputRange: [TITLE_CONT, 0],
      extrapolate: 'clamp'
   })
   const headerOpacity = scrollY.interpolate({
      inputRange: [0, TITLE_CONT],
      outputRange: [1, 0],
      extrapolate: 'clamp'
   })
   
   const [step, setStep] = useState(1);
   const [stepContent, setStepContent] = useState(step);
   const stepProgress = useRef(new Animated.Value(0)).current;
   const stepPercent = stepProgress.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: ['0%', '20%', '40%', '60%', '80%', '100%'],
      extrapolate: 'clamp'
   })

   useEffect(() => {
      Animated.timing(stepProgress, {
         toValue: step,
         duration: 1000,
         useNativeDriver: false
      }).start()
   }, [step])
   
   const handleNextStep = () => {
      if (step < stepTitles.length) {
         scrollViewRef.current?.scrollTo({ y: 0, animated: true })

         setTimeout(() => {
            Animated.timing(stepX, {
               toValue: -width,
               duration: 400,
               useNativeDriver: true,
            }).start(() => {
               setStep(prev => prev + 1);           
               setStepContent(prev => prev + 1);   
               stepX.setValue(width);               
               
               Animated.timing(stepX, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
               }).start();
            });
         }, 300)
      } else {
         submitWorkerVerify();
      }

      console.log(workerVerify)
   };

   

   return (
      <View style={[global.screenContainer, {backgroundColor: '#fff', position: 'relative'}]}>
         {/* --------------------------------- Header --------------------------------- */}
         <Header 
         background='#fff'
         left={
            <TouchableOpacity onPress={() => {router.back()}}>
               <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
            </TouchableOpacity>
         }/>

         {/* ------------------------------ Progress Bar ------------------------------ */}
         <View 
         style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 24,
            height: 24
         }}>
            <Text style={{fontFamily: FONTS.roboto600, fontSize: FONT_SIZES.md, color: COLORS.primary}}>
               {`Step ${step} of 5`}
            </Text>
            <View style={{height: 5, flexGrow: 1, backgroundColor: COLORS.strokes, borderRadius: 2.5}}>
               <Animated.View 
               style={{
                  height: '100%',
                  width: stepPercent,
                  borderRadius: 2.5,
                  backgroundColor: COLORS.primary
               }}
               />
            </View>
         </View>
         
         {/* ------------------------------ Header Title ------------------------------ */}
         <Animated.View
         style={{
            position: 'absolute',
            top: HEADER_HEIGHT - TITLE_CONT,
            width: '100%',
            height: headerHeight,
            overflow: 'hidden',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            backgroundColor: '#fff',
            zIndex: 2,
         }}>
            <Animated.Text
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxxl,
               color: COLORS.darkblue,
               padding: 24,
               position: 'absolute',
               opacity: headerOpacity
            }}>
               {stepTitles[step-1]}
            </Animated.Text>
            <Animated.Image 
            source={require('../../../../../assets/images/backgrounds/graphic-bg7.png')}
            style={{
               height: TITLE_CONT,
               width: '100%',
               aspectRatio: '1500/548',
               opacity: headerOpacity
            }}
            />
         </Animated.View >

         {/* --------------------------------- Content -------------------------------- */}
         <Animated.View
         style={{
            transform: [{translateX: stepX}],
            flex: 1,
         }}>
            <ScrollView
            ref={scrollViewRef}
            style={{
               flex: 1,
            }}
            contentContainerStyle={{
               padding: 24,
               paddingTop: TITLE_CONT + 24,
            }}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
               useNativeDriver: false,
            })}>
               {(stepContent === 1) && <PhotoVerificationScreen />}
               {(stepContent === 2) && <CredentialsScreen />}
               {(stepContent === 3) && <WorkSamplesScreen />}
               {(stepContent === 4) && <OfferedServicesScreen />}
               {(stepContent === 5) && <SummaryScreen />}
            </ScrollView>

            <View style={[global.buttonsContainer]}>
               <TouchableHighlight style={global.primaryBtn}
               underlayColor='#0072bc'
               onPress={handleNextStep}>
                  <Text style={global.primaryBtnText}>
                     {(stepContent === 5) ? "Submit Application" : "Next"}
                  </Text>
               </TouchableHighlight>
            </View>

         </Animated.View>
      </View>
   )
}

export default FormLayoutScreen
