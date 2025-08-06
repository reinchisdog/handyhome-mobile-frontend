// Screen: Login Screen - User Login Interface

// Imports
// ---- Hooks and React Components
import { Text, View, TouchableHighlight, TouchableOpacity, ImageBackground, StatusBar} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from '../../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context';
// ---- Custom Components
import BasicInput from '../../components/authentication/BasicInput';
import DismissKeyboardWrapper from '../../components/DismissKeyboard';
import MainButton from '../../components/MainButton';
import Header from '../../components/dashboard/Header';
import ErrorModal from '../../components/ErrorModal';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../styles/constants';

export default function LoginScreen() {
   // Hooks
   const { login } = useAuth();
   const router = useRouter();
   // States
   const [loginData, setLoginData] = useState({
      identifier: "",
      password: ""
   })
   const [ isLoginLoading, setIsLoginLoading ] = useState(false);
   const [ loginErrors, setLoginErrors ] = useState({})
   const [ passwordShow, setPasswordShow ] = useState(false);
   const [ errorModal, setErrorModal ] = useState(false);
   const [ errorModalMessage, setErrorModalMessage ] = useState(null); 

   // Functions
   const handleLogin = async () => {
      try {
         setIsLoginLoading(true);

         const isValid = await validateForm();
         if (!isValid) return;

         const result = await login(loginData);

         if (!result.success) {
            throw Error (result.message);
         } 
         else router.replace('authentication/authLoading');
         
      } catch (err) {
         console.log(err);
         showErrorModal(err.message);
      } finally {
         setIsLoginLoading(false);
      }
   }

   const validateForm = async () => {
      let errors = {}

      // Identification or Password field is empty
      if (!loginData.identifier) errors.identifier = "Email/Phone Number is required.";
      if (!loginData.password) errors.password = "Password is required.";

      setLoginErrors(errors);
      return Object.keys(errors).length === 0;
   }

   const onPasswordShow = () => {
      setPasswordShow(!passwordShow);
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
         title={"There is an error logging into HandyHome"} 
         message={errorModalMessage}/>

         <View 
         style={[global.screenContainer, {position: 'relative'}]}>
            {/* --------------------------------- Header --------------------------------- */}
            <ImageBackground
            source={require('../../assets/images/backgrounds/graphic-bg3.png')}
            style={[auth.stylizedHeader]}>
               <Header 
               background='transparent'
               left={
                  <TouchableOpacity
                  onPress={() => {router.replace('authentication')}}>
                     <Arrows name='chevron-left' size={24} color={'#fff'}/>
                  </TouchableOpacity>
               }/>

               <View style={{paddingHorizontal: 24, gap: 12}}>
                  <Text style={[auth.headerTitle, {color: '#fff'}]}>
                     LOG IN
                  </Text>

                  <Text style={[auth.headerDescription, {color: '#fff'}]}>Hi! Welcome back. Login to your existing account.</Text>
               </View>
            </ImageBackground>

            {/* ---------------------------------- Main ---------------------------------- */}
            <View style={auth.inputsContainer}>
               <View style={auth.inputSet}>
                  {/* ---- Identification */}
                  <BasicInput 
                     left={
                     <Icons name="email" size={24} color="#3D3D3D" />
                     }
                     placeholder={"Email or Phone Number"}
                     inputMode='email'
                     keyboardType='email-address'
                     onChangeText={(value) => setLoginData(prev => ({
                     ...prev,
                     identifier: value
                     }))}
                     value={loginData.identifier}
                  />

                  {loginErrors.identifier && <Text style={[global.errorText, {marginTop: -8}]}>{loginErrors.identifier}</Text>}

                  {/* ---- Password */}
                  <BasicInput 
                     left={
                     <Icons name="key" size={24} color="#3D3D3D" />
                     }
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
                     onChangeText={(value) => setLoginData(prev => ({
                     ...prev,
                     password: value
                     }))}
                     value={loginData.password}
                  />

                  {loginErrors.password && <Text style={[global.errorText, {marginTop: -8}]}>{loginErrors.password}</Text>}

               </View>
               <TouchableOpacity
               activeOpacity={0.5}
               onPress={() => console.log("Forgot Password")}>
                  <Text style={[auth.textLinks, {alignSelf: 'flex-end'}]}>
                     Forgot Password?
                  </Text>
               </TouchableOpacity>
            </View>
                  
            {/* --------------------------------- Buttons -------------------------------- */}
            <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
               <SafeAreaView>
                  <MainButton 
                  text="LOG IN"
                  type="primary"
                  loading={isLoginLoading}
                  onPress={handleLogin}
                  />
               </SafeAreaView>
            </View>
         </View>
      </DismissKeyboardWrapper>
   )
}
