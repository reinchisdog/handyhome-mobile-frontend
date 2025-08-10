// Screens: Forgot Password - Email and Code Prompts 

// Imports
// ---- React and React Native Components
import { Text, View, ImageBackground, TouchableOpacity, TouchableHighlight} from 'react-native';
import React, { useState, useEffect } from 'react';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/dashboard/Header';
import ErrorModal from '../../../components/ErrorModal';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../../styles/globalStyles'
import { authStyles as auth } from '../../../styles/authStyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../styles/constants';
// ---- Config and Other Libraries
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import {API_URL} from '../../../config'
import { SafeAreaView } from 'react-native-safe-area-context';

export default ResetPasswordScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { token } = useLocalSearchParams();
   const [ newPassword, setNewPassword ] = useState('');
   const [ confirmPassword, setConfirmPassword ] = useState('');
   const [ passwordShow, setPasswordShow ] = useState(false);

   const [ isButtonLoading, setIsButtonLoading ] = useState(false);
   const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
   const [ errorModal, setErrorModal ] = useState(false);
   const [ errorModalMessage, setErrorModalMessage ] = useState('');

   // Functions
   const onPasswordShow = () => {
      setPasswordShow(!passwordShow);
   }

   const handlePasswordUpdate = async () => {
      try {
         setIsButtonLoading(true);
         console.log("---- [Reset Password]: Attempting to Update Password ----");
         const data = { new_password: newPassword };

         console.log("1. Validating Passwords");
         validatePassword();
         await axios.post(`${API_URL}/auth/forgot-password/update-password/${token}`, data);

         console.log("2. Successfully Updated Password");
         router.push('/authentication/resetPassword/success');
      } catch (err) {
         console.log("2. Failed to Update Password");
         const message = err.response?.data?.message || err.message || "An error occurred while trying to update your password.";
         setErrorModalMessage(message);
         setErrorModal(true);
      } finally {
         setIsButtonLoading(false);
      }
   }

   const validatePassword = () => {
      const password = newPassword;

      if (password !== confirmPassword) {
         throw new Error("Passwords do not match. Please try again.");
      }

      if (password.length < 8) {
         throw new Error("Password must be at least 8 characters long.");
      }

      if (!/(?=.*[A-Z])/.test(password)) {
         throw new Error("Password must contain at least one uppercase letter.");
      }

      if (!/(?=.*[a-z])/.test(password)) {
         throw new Error("Password must contain at least one lowercase letter.");
      }

      if (!/(?=.*\d)/.test(password)) {
         throw new Error("Password must contain at least one number.");
      }

      if (!/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(password)) {
         throw new Error("Password must contain at least one special character.");
      }

      if (!/^\S*$/.test(password)) {
         throw new Error("Password must not contain spaces.");
      }
   };

   // Effects
   useEffect(() => {
      setIsButtonDisabled(
         newPassword.trim() === '' || 
         confirmPassword.trim() === ''
      );
   }, [newPassword, confirmPassword]);

   return (
      <View style={[global.screenContainer, { position: 'relative'}]}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Error trying to verifying your account"}
         message={errorModalMessage} />

         {/* --------------------------------- Header --------------------------------- */}
         <ImageBackground
         source={require('../../../assets/images/backgrounds/graphic-bg3.png')}
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
                  NEW PASSWORD
               </Text>

               <Text style={[auth.headerDescription, {color: '#fff'}]}>
                  Your new password must be different from previously used passwords.
               </Text>
            </View>
         </ImageBackground>

         {/* ---------------------------------- Main ---------------------------------- */}
         <View style={[auth.inputsContainer, {flex: 1}]}>
            <View style={auth.inputSet}>
               <BasicInput 
                  right={
                  <TouchableHighlight 
                  underlayColor='#fff'
                  onPress={onPasswordShow}>
                  {passwordShow ?
                     <Icons name="eye-off" size={24} color="#3D3D3D" /> :
                     <Icons name="eye" size={24} color="#3D3D3D" />
                  }
                  </TouchableHighlight>
                  }
                  placeholder={"Password"}
                  secureTextEntry={!passwordShow}
                  onChangeText={(value) => setNewPassword(value)}
                  value={newPassword}
               />

               <BasicInput 
                  right={
                  <TouchableHighlight 
                  underlayColor='#fff'
                  onPress={onPasswordShow}>
                  {passwordShow ?
                     <Icons name="eye-off" size={24} color="#3D3D3D" /> :
                     <Icons name="eye" size={24} color="#3D3D3D" />
                  }
                  </TouchableHighlight>
                  }
                  placeholder={"Confirm Password"}
                  secureTextEntry={!passwordShow}
                  onChangeText={(value) => setConfirmPassword(value)}
                  value={confirmPassword}
               />
            </View>        
         </View>

         {/* --------------------------------- Button --------------------------------- */}
         <View 
         style={[
            global.buttonsContainer, {
            position: 'absolute', 
            bottom: 0, 
            paddingBottom: 24,
         }]}>
            <SafeAreaView>
               <MainButton 
               text="Create New Password"
               type="primary"
               loading={isButtonLoading}
               disabled={isButtonDisabled}
               onPress={handlePasswordUpdate}
               />
            </SafeAreaView>
         </View>
      </View>
   )
}