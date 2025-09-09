// Screens: Verify Screen 

// Imports
// ---- React and React Native Components
import { Text, View, ImageBackground } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/dashboard/Header';
import ErrorModal from '../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Config and Other Libraries
import { useRouter } from 'expo-router';
import api from '../../../lib/api';

const SignupVerifyScreen = () => {
   // Hooks and States
   const insets = useSafeAreaInsets()
   const router = useRouter();
   const [code, setCode] = useState({ verification_token: null })
   const [isVerifyLoading, setIsVerifyLoading] = useState(false);
   const [isVerifyDisabled, setIsVerifyDisabled] = useState(true);
   
   const [errorModal, setErrorModal] = useState(false);
   const [errorModalMessage, setErrorModalMessage] = useState(null);

   // Functions
   const handleVerify =  async () => {
      try {
         console.log("--- [Verify Screen]: Verifying Account Attempt---");
         setIsVerifyLoading(true);

         console.log("1. Preparing verification data...");
         validateCode();

         const result = await api.post(`/auth/verify-account`, code, {
            headers: {
               'Content-Type': 'application/json',
            }
         })

         console.log("2. Verification successful:", result.data);
         router.replace('authentication/verify/success');

      } catch (err) {
         console.log(err);
         const message = err.response?.data.message || err.message || "An error has ocurred when verifying your account. Please try again.";

         showErrorModal(message);
      } finally {
         setIsVerifyLoading(false);
      }
   }

   const validateCode = () => {
      const token = code.verification_token ?? ''; 

      if (token.length !== 6) {
         throw new Error("The verification code must be 6 digits long.");
      } else if (/^\d+$/.test(token) === false) {
         throw new Error("The verification code must only contain numbers.");
      }
   };

   const isFormNotEmpty = () => {
      return code.verification_token !== null && code.verification_token.trim() !== "";
   }

   const showErrorModal = (message) => {
      setErrorModalMessage(message);
      setErrorModal(true);
   }
   
   // Effects
   useEffect(() => {
      if (isFormNotEmpty()) {
         setIsVerifyDisabled(false);
      } else {
         setIsVerifyDisabled(true);
      }
   }, [code])


   return (
      <View style={[global.screenContainer, {position: 'relative', paddingBottom: insets.bottom + 24}]}>
         <ErrorModal 
         visible={errorModal} 
         setVisible={setErrorModal} 
         title={"Error Verifying your Account"} 
         message={errorModalMessage}/>

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
         <View style={[auth.inputsContainer, {flex: 1}]}>
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
         <View style={[global.buttonsContainer]}>
            <MainButton 
            text="Verify"
            type="secondary"
            disabled={isVerifyDisabled}
            loading={isVerifyLoading}
            onPress={handleVerify}
            />
         </View>
      </View>
   )
}

export default SignupVerifyScreen