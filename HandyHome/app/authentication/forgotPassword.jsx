// Screens: Forgot Password - Email and Code Prompts 

// Imports
// ---- React and React Native Components
import { Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
// ---- Custom Components
import BasicInput from '../../components/authentication/BasicInput';
import MainButton from '../../components/MainButton';
import Header from '../../components/dashboard/Header';
import ErrorModal from '../../components/ErrorModal';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../styles/globalStyles'
import { authStyles as auth } from '../../styles/authStyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../styles/constants';
// ---- Config and Other Libraries
import { useRouter } from 'expo-router';
import axios from 'axios';
import {API_URL} from '../../config'
import { SafeAreaView } from 'react-native-safe-area-context';

export default ForgotPasswordScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const [ identifier, setIdentifier ] = useState({ email: null });
   const [ code, setCode ] = useState({ verification_token: null });
   const [ coutdown, setCountdown ] = useState(60);
   const [ isCountdownActive, setIsCountdownActive ] = useState(false);
   const [ isEmailLoading, setIsEmailLoading ] = useState(false);
   const [ isCodeLoading, setIsCodeLoading ] = useState(false);
   const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);

   const [ errorModal, setErrorModal ] = useState(false);
   const [ errorModalMessage, setErrorModalMessage ] = useState('');

   // Functions
   const handleEmailConfirmation = async () => { 
      try {
         setIsEmailLoading(true);

         console.log("---- [Forgot Password]: Email Verification Attempt ----");
         console.log("1. Validating Email");
         validateEmail();
         await axios.post(`${API_URL}/auth/forgot-password`, {
            email: identifier.email
         });

         console.log("2. Successfully Verified Email");
         countdownStart();
      } catch (err) {
         console.log("2. Failed to Verify Email");
         const message = err.response?.data?.message || err.message || "An error occurred while trying to verify your email.";
         setErrorModalMessage(message);
         setErrorModal(true);
      } finally {
         setIsEmailLoading(false);
      }

   }

   const validateEmail = () => {
      const email = identifier.email?.trim();

      if (!email)
         throw Error("Please fill in your email address.");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         throw Error("Invalid email format. Please try again.");
      }
   }

   const countdownStart = () => {
      setIsCountdownActive(true);
      setCountdown(60);

      const interval = setInterval(() => {
         setCountdown(prev => {
            if (prev <= 1) {
               clearInterval(interval);
               setIsCountdownActive(false);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
   }

   const handleCodeConfirmation = async () => {
      try {
         setIsCodeLoading(true);

         console.log("---- [Forgot Password]: Code Verification Attempt ----");
         console.log("1. Validating Code");
         validateCode();
         
         const response = await axios.get(`${API_URL}/auth/check-password-reset-token/${code.verification_token}`);

         console.log("2. Successfully Verified Code");
         router.push({
            pathname: '/authentication/resetPassword/[token]',
            params: { token: code.verification_token },
         })
      } catch (err) {
         console.log("2. Failed to Verify Code");
         const message = err.response?.data?.message || err.message || "An error occurred while trying to verify your code.";
         setErrorModalMessage(message);
         setErrorModal(true);
      } finally {
         setIsCodeLoading(false);
      }
   } 

   const validateCode = () => {
      const codeValue = code.verification_token?.trim();

      if (!/^\d{6}$/.test(codeValue)) {
         throw Error("Invalid code format. Please enter a 6-digit code.");
      }
   }

   useEffect(() => {
      const codeValue = code.verification_token?.trim();
      
      if (!codeValue) {
         setIsButtonDisabled(true);
      } else {
         setIsButtonDisabled(false);
      }
   }, [code]);

   return (
      <View style={[global.screenContainer, { position: 'relative'}]}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Error trying to verify your account"}
         message={errorModalMessage} />

         {/* --------------------------------- Header --------------------------------- */}
         <ImageBackground
         source={require('../../assets/images/backgrounds/graphic-bg3.png')}
         style={[auth.stylizedHeader]}>
            <Header 
            background='transparent'
            left={
               <TouchableOpacity
               onPress={() => {router.back()}}>
                  <Arrows name='chevron-left' size={24} color={'#fff'}/>
               </TouchableOpacity>
            }/>

            <View style={{paddingHorizontal: 24, gap: 12}}>
               <Text style={[auth.headerTitle, {color: '#fff'}]}>
                  FORGOT PASSWORD?
               </Text>

               <Text style={[auth.headerDescription, {color: '#fff'}]}>
                  Please enter your email address to receive a verification code.
               </Text>
            </View>
         </ImageBackground>

         {/* ---------------------------------- Main ---------------------------------- */}
         <View style={[auth.inputsContainer, {flex: 1}]}>
            <View style={auth.inputSet}>
               <BasicInput 
               placeholder={"Email (handy@home.com)"}
               inputMode='email'
               keyboardType='email-address'
               onChangeText={(value) => setIdentifier(prev => ({
                  ...prev,
                  email: value
               }))}
               value={identifier.email}/>

               <BasicInput 
               placeholder={"Verification Code"}
               inputMode='numeric'
               keyboardType='number-pad'
               onChangeText={(value) => setCode(prev => ({
                  ...prev,
                  verification_token: value
               }))}
               value={code.verification_token}
               right={(
                  <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={isCountdownActive || isEmailLoading ? () => {} : handleEmailConfirmation}>
                     <Text 
                     style={[
                        auth.textLinks, { 
                        color: isCountdownActive || isEmailLoading ? 
                           COLORS.labelsDisabled : 
                           COLORS.accent,
                     }]}>
                        {isCountdownActive ? `Code Sent (${coutdown})` : "Send Code"}
                     </Text>
                  </TouchableOpacity>
               )}
               isRightIcon={false}/>
            </View>        
         </View>

         {/* --------------------------------- Button --------------------------------- */}
         <View 
         style={[
            global.buttonsContainer, {
            position: 'absolute', 
            bottom: 0, 
            paddingBottom: 24
         }]}>
            <SafeAreaView>
               <MainButton 
               text="Reset Password"
               type="secondary"
               loading={isCodeLoading}
               disabled={isButtonDisabled}
               onPress={handleCodeConfirmation}
               />
            </SafeAreaView>
         </View>
      </View>
   )
}