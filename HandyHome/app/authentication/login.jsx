/* --------------------------------- Imports -------------------------------- */
import { Text, View , KeyboardAvoidingView, SafeAreaView, Platform, TouchableHighlight, TouchableOpacity, StatusBar} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router';
/* ------------------------------- Components ------------------------------- */
import BasicInput from '../../components/authentication/BasicInput';
import DismissKeyboardWrapper from '../../components/DismissKeyboard'
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/AntDesign';

import { globalStyles as global } from '../../styles/globalStyles';
import { authStyles as auth } from '../../styles/authStyles';

export default function LoginPage() {
  /* ----------------------------- Initialization ----------------------------- */
  const router = useRouter();

  /* -------------------------------- Functions ------------------------------- */
  // ---- Shows and Hides Password
  const [ passwordShow, setPasswordShow ] = useState(false);
  const onPasswordShow = () => {
    setPasswordShow(!passwordShow);
  }

  // ---- Submits Login Info
  const [loginData, setLoginData] = useState({
    identification: "",
    password: ""
  })
  const [isLoginLoading, setIsLoginLoading] = useState()
  const onLoginSubmit = async () => {
    setIsLoginLoading(true);

    const isValid = await validateForm();
    if (isValid) {
      router.replace("../(dashboard)/");
    }

    setIsLoginLoading(false);
  }

  // ---- Checks and Shows Errors
  const [loginErrors, setLoginErrors] = useState({})
  const validateForm = async () => {
    let errors = {}

    // Identification or Password field is empty
    if (!loginData.identification) errors.identification = "Email/Phone Number is required.";
    if (!loginData.password) errors.password = "Password is required.";

    // Identification not existing
    if (false) errors.identification = "That Email/Phone Number does not exist.";

    // Identifaction and Password does not match
    if (false) {}

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <DismissKeyboardWrapper>
    <View 
    style={[global.screenContainer, {position: 'relative'}]}>
      {/* --------------------------------- Header --------------------------------- */}
      <SafeAreaView style={[auth.stylizedHeader, {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }]}>
        <View style={auth.headerContainer}>
          <TouchableOpacity
          onPress={() => {router.back()}}>
            <Arrows name='left' size={24} color={'#fff'}/>
          </TouchableOpacity>
          <Text style={[auth.headerTitle, {color: '#fff'}]}>
            LOG IN
          </Text>
          <Text style={[auth.headerDescription, {color: '#fff'}]}>Hi! Welcome back. Login to your existing account.</Text>
        </View>
      </SafeAreaView>

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
              identification: value
            }))}
            value={loginData.identification}
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
        <TouchableHighlight style={global.primaryBtn}
          underlayColor='#0072bc'
          onPress={() => router.replace('./authLoading')}>
            <Text style={global.primaryBtnText}>LOG IN</Text>
        </TouchableHighlight>
      </View>
    </View>
    </DismissKeyboardWrapper>
  )
}
