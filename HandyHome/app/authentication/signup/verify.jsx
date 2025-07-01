/* --------------------------------- Imports -------------------------------- */
import { Text, View, TouchableHighlight, TouchableOpacity, ImageBackground} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import {API_URL} from '../../../config';
/* ------------------------------- Components ------------------------------- */
import BasicInput from '../../../components/authentication/BasicInput';
import DismissKeyboardWrapper from '../../../components/DismissKeyboard';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/dashboard/Header';
import ErrorModal from '../../../components/ErrorModal';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';

import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants';

const SignupVerifyScreen = () => {
   const router = useRouter();

   const [code, setCode] = useState({
      verification_token: null
   })

   const [isVerifyLoading, setIsVerifyLoading] = useState(false);
   const [isVerifyDisabled, setIsVerifyDisabled] = useState(true);
   
   useEffect(() => {
      if (validateCode()) {
         setIsVerifyDisabled(false);
      } else {
         setIsVerifyDisabled(true);
      }
   }, [code])

   const handleVerify =  async () => {
      try {
         setIsVerifyLoading(true);

         const result = await axios.post(`${API_URL}/auth/verify-account`, code, {
            headers: {
               'Content-Type': 'application/json',
            }
         })

         const status = result.data.status || "failed";

         if (status === "success") {
            router.replace('authentication/signup/verifyLoading');
         } else if (status === "error") {
            const message = result.data.message || 'Verification failed.';
            throw new Error(message);
         }

      } catch (err) {
         console.log(err);
         const message = err || "An error has ocurred when verifying your account. Please try again.";

         showErrorModal(message);
      } finally {
         setIsVerifyLoading(false);
      }
   }

   const [errorModal, setErrorModal] = useState(false);
   const [errorModalMessage, setErrorModalMessage] = useState(null);

   const validateCode = () => {
      const token = code.verification_token ?? ''; 
      const isNotEmpty = token.trim() !== ""
      const isComplete = token.length === 6

      return isNotEmpty && isComplete
   }

   const showErrorModal = (message) => {
      setErrorModalMessage(message);
      setErrorModal(true);
   }


   return (
      <DismissKeyboardWrapper>
         <ErrorModal 
         visible={errorModal} 
         setVisible={setErrorModal} 
         title={"There is an error verifying your account"} 
         message={errorModalMessage}/>

         <View
         style={[global.screenContainer, {position: 'relative'}]}>
            {/* --------------------------------- Header --------------------------------- */}
            <ImageBackground
            source={require('../../../assets/images/backgrounds/graphic-bg3.png')}
            style={[auth.stylizedHeader]}>
               <Header 
               background='transparent'/>

               <View style={{paddingHorizontal: 24, gap: 12}}>
                  <Text style={[auth.headerTitle, {color: '#fff'}]}>
                     VERIFY YOUR EMAIL
                  </Text>

                  <Text style={[auth.headerDescription, {color: '#fff'}]}>
                     Please enter the code we sent to your email.
                  </Text>
               </View>
            </ImageBackground>

            {/* ---------------------------------- Main ---------------------------------- */}
            <View style={auth.inputsContainer}>
               <View style={auth.inputSet}>
                  {/* ---- Code */}
                  <BasicInput 
                  placeholder={"Verification Code"}
                  inputMode='numeric'
                  keyboardType='number-pad'
                  onChangeText={(value) => setCode(prev => ({
                  ...prev,
                  verification_token: value
                  }))}
                  value={code.verification_token}
                  />
               </View>
            </View>

            {/* --------------------------------- Buttons -------------------------------- */}
            <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
               <MainButton 
               text="Verify"
               type="secondary"
               disabled={isVerifyDisabled}
               loading={isVerifyLoading}
               onPress={handleVerify}
               />
            </View>
         </View>
      </DismissKeyboardWrapper>
   )
}

export default SignupVerifyScreen