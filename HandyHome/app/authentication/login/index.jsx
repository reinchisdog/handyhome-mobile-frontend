// Screen: Login Screen - User Login Interface

// Imports
// ---- Hooks and React Components
import { Text, View, TouchableHighlight, TouchableOpacity, ImageBackground, StatusBar} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from '../../../context/AuthContext'
import { usePushNotif } from '../../../context/PushNotifContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
import DismissKeyboardWrapper from '../../../components/DismissKeyboard';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/dashboard/Header';
import ErrorModal from '../../../components/ErrorModal';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants';

export default function LoginScreen() {
   // Hooks
   const { login } = useAuth();
   const { registerForPushNotif } = usePushNotif();
   const router = useRouter();
   const insets = useSafeAreaInsets();
   // States
   const [loginData, setLoginData] = useState({
      identifier: "",
      password: ""
   })
   const [ isLoginLoading, setIsLoginLoading ] = useState(false);
   const [ passwordShow, setPasswordShow ] = useState(false);
   const [ errorModal, setErrorModal ] = useState(false);
   const [ errorModalMessage, setErrorModalMessage ] = useState(null); 
   const [ exitCondition, setExitCondition ] = useState(null); 

   // Functions
   const handleLogin = async () => {
      try {
         setIsLoginLoading(true);

         const result = await login(loginData);
         
         if (!result.success) {
            throw Error (result.message);
         } 
         else router.replace('authentication/login/success');

         await registerForPushNotif();
      } catch (err) {
         console.log(err);

         if (
            err.message.toLowerCase().includes("verify") || 
            err.message.toLowerCase().includes("verification") || 
            err.message.toLowerCase().includes("verified")
         ) {
            setExitCondition("verify");
         } else {
            setExitCondition(null);
         }

         showErrorModal(err.message);
      } finally {
         setIsLoginLoading(false);
      }
   }

   const onPasswordShow = () => {
      setPasswordShow(!passwordShow);
   }  

   const showErrorModal = (message) => {
      setErrorModalMessage(message);
      setErrorModal(true);
   }

   const goToVerify = () => {
      router.replace('/authentication/verify');
   }

   return (
      <DismissKeyboardWrapper>
         <ErrorModal 
         visible={errorModal} 
         setVisible={setErrorModal} 
         title={"Error Logging into Handyhome"} 
         message={errorModalMessage}
         onExit={exitCondition === "verify" ? goToVerify : null}
         buttonText={exitCondition==="verify" ? "Verify Now" : null}/>

         <View 
         style={[global.screenContainer, {position: 'relative'}]}>
            {/* --------------------------------- Header --------------------------------- */}
            <ImageBackground
            source={require('../../../assets/images/backgrounds/graphic-bg3.png')}
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

                  <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => router.push('authentication/forgotPassword')}>
                     <Text style={[auth.textLinks, {alignSelf: 'flex-end'}]}>
                        Forgot Password?
                     </Text>
                  </TouchableOpacity>

               </View>
               
            </View>
                  
            {/* --------------------------------- Buttons -------------------------------- */}
            <View style={[
               global.buttonsContainer, {
               position: 'absolute', 
               bottom: 24,
            }]}>
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
