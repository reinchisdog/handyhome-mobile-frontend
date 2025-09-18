// Screens: Identifier Code Screen

// Imports
// ---- React and Expo Components
import { Text, View, ImageBackground, Pressable } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
// ---- Custom Components
import InputBasic from '../../../../../components/InputBasic';
import MainButton from '../../../../../components/MainButton';
import Header from '../../../../../components/Header';
import ErrorModal from '../../../../../components/ErrorModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller'
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { authStyles as auth } from '../../../../../styles/authStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Config and Other Libraries
import { useAuth } from '../../../../../context/AuthContext';
import api from '../../../../../lib/api';

const AccountPassword = () => {
   // Hooks and States
   const insets = useSafeAreaInsets()
   const router = useRouter();
   const { token } = useAuth();

   const passwordReqList = [
      "At least 8 characters",
      "At least one uppercase letter (A-Z)",
      "At least one lowercase letter (a-z)",
      "At least one number (0-9)",
      "At least one special character (!@#$%^&*)",
      "No Spaces in between"
   ]
   const [passwords, setPasswords] = useState({
      current_password: '',
      new_password: '',
      confirm_new_password: ''
   });
   const [passwordLoading, setPasswordLoading] = useState(false);
   const [passErrors, setPassErrors] = useState([]);
   const [passwordShow, setPasswordShow] = useState({
      current: false,
      new: false,
      confirm: false
   });

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const verifyPassword = () => {
      const { current_password, new_password, confirm_new_password } = passwords;
      if (!current_password || !new_password || !confirm_new_password) {
         throw new Error("Please fill in all fields.");
      }
      if (new_password.length < 8) {
         throw new Error("Password must be at least 8 characters long.");
      }
      if (!/(?=.*[A-Z])/.test(new_password)) {
         throw new Error("Password must contain at least one uppercase letter.");
      }
      if (!/(?=.*[a-z])/.test(new_password)) {
         throw new Error("Password must contain at least one lowercase letter.");
      }
      if (!/(?=.*\d)/.test(new_password)) {
         throw new Error("Password must contain at least one number.");
      }
      if (!/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(new_password)) {
         throw new Error("Password must contain at least one special character.");
      }
      if (!/^\S*$/.test(new_password) && new_password === "") {
         throw new Error("Password must not contain spaces.");
      }
      if (new_password !== confirm_new_password) {
         throw new Error("New password and confirmation do not match.");
      }

   }

   const handlePassword = async () => {
      try {
         setPasswordLoading(true);
         console.log("---- [Profile Password] Password Change Attempt ----");
         console.log("[1] Validating Inputs");
         verifyPassword();

         console.log("[2] Changing Password");
         await api.put('user/password', passwords, {
            headers: { 'Authorization': `Bearer ${token}` }
         });

         console.log("[3] Password Changed Successfully, Routing to Success");
         router.replace('/dashboard/client/settings/account/success');
      } catch (err) {
         console.log("[0] Error changing password");
         const message = err?.response?.data?.message || err.message || "An unknown error occurred when changing your password. Please try again.";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setPasswordLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      const password = passwords.new_password || "";
      let requirements = []

      if (password.length > 8) requirements.push(0);
      if (/(?=.*[A-Z])/.test(password)) requirements.push(1);
      if (/(?=.*[a-z])/.test(password)) requirements.push(2);
      if (/(?=.*\d)/.test(password)) requirements.push(3);
      if (/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(password)) requirements.push(4);
      if (/^\S*$/.test(password) && password !== "") requirements.push(5);

      setPassErrors(requirements);
   }, [passwords.new_password]);
   
   
   return (
      <>
         <ErrorModal 
         visible={errorModal} 
         setVisible={setErrorModal} 
         title={"Something went wrong"}
         message={errorMessage}
         />

         <KeyboardAwareScrollView 
         style={[global.screenContainer, {position: 'relative'}]}
         contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between', paddingBottom: insets.bottom + 24 }}
         bottomOffset={24}
         >
            <ImageBackground
            source={require('../../../../../assets/images/backgrounds/graphic-bg3.png')}
            style={[auth.stylizedHeader]}>
               <Header hasBack backColor='#fff' backgroundColor='transparent'/>

               <View style={{paddingHorizontal: 24, gap: 12}}>
                  <Text style={[auth.headerTitle, {color: '#fff'}]}>
                     CHANGE PASSWORD
                  </Text>

                  <Text style={[auth.headerDescription, {color: '#fff'}]}>
                     Please enter your old password and new password.
                  </Text>
               </View>
            </ImageBackground>

            <View style={[auth.inputsContainer, {flex: 1}]}>
               <View style={auth.inputSet}>
                  <Text style={auth.inputSetTitle}>OLD PASSWORD</Text>
                  {/* ---- Email */}
                  <InputBasic 
                  right={
                     <Pressable 
                     underlayColor='#fff'
                     onPress={() => setPasswordShow(prev => ({...prev, current: !prev.current}))}>
                     {passwordShow.current ?
                        <Icons name="eye-off" size={24} color="#3D3D3D" /> :
                        <Icons name="eye" size={24} color="#3D3D3D" />
                     }
                     </Pressable>
                  }
                  placeholder={"Old Password"}
                  secureTextEntry={!passwordShow.current}
                  value={passwords.current_password}
                  onChangeText={(text) => setPasswords({...passwords, current_password: text})}
                  />
               </View>

               <View style={auth.inputSet}>
                  <Text style={auth.inputSetTitle}>NEW PASSWORD</Text>
                  {/* ---- Email */}
                  <InputBasic 
                  right={
                     <Pressable 
                     underlayColor='#fff'
                     onPress={() => setPasswordShow(prev => ({...prev, new: !prev.new}))}>
                     {passwordShow.new ?
                        <Icons name="eye-off" size={24} color="#3D3D3D" /> :
                        <Icons name="eye" size={24} color="#3D3D3D" />
                     }
                     </Pressable>
                  }
                  placeholder={"New Password"}
                  secureTextEntry={!passwordShow.new}
                  value={passwords.new_password}
                  onChangeText={(text) => setPasswords({...passwords, new_password: text})}
                  />

                  <InputBasic 
                  right={
                     <Pressable 
                     underlayColor='#fff'
                     onPress={() => setPasswordShow(prev => ({...prev, confirm: !prev.confirm}))}>
                     {passwordShow.confirm ?
                        <Icons name="eye-off" size={24} color="#3D3D3D" /> :
                        <Icons name="eye" size={24} color="#3D3D3D" />
                     }
                     </Pressable>
                  }
                  placeholder={"Confirm Password"}
                  secureTextEntry={!passwordShow.confirm}
                  value={passwords.confirm_new_password}
                  onChangeText={(text) => setPasswords({...passwords, confirm_new_password: text})}
                  />

                  <View>
                  {passwordReqList.map((item, key) => (
                     <Text
                     key={key}
                     style={[
                     auth.textGeneral,{
                     color: passErrors.includes(key) ? COLORS.green : COLORS.labels
                     }]}>
                     {`\u2022  ${item}`}
                     </Text>
                  ))}
                  </View>
               </View>
            </View>
            
            <View style={[global.buttonsContainer]}>
               <MainButton 
               text={"Change Password"}
               type={"primary"}
               onPress={handlePassword}
               loading={passwordLoading}
               />
            </View>
         </KeyboardAwareScrollView>
      </>
   )
}

export default AccountPassword