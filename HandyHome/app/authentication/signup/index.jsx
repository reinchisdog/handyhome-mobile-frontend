/* --------------------------------- Imports -------------------------------- */
import { Text, View , KeyboardAvoidingView, SafeAreaView, Platform, TouchableHighlight, TouchableOpacity, StatusBar} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router';
/* ------------------------------- Components ------------------------------- */
import PersonalDetails from './personalDetails';
import LocationPrompt from '../../../components/authentication/LocationPrompt';
import LocationDetails from './locationDetails';
import AccountDetails from './accountDetails';
import DismissKeyboardWrapper from '../../../components/DismissKeyboard';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/AntDesign';

import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';

const SignupPages = () => {
    /* ----------------------------- Initialization ----------------------------- */
    const router = useRouter();
    const [step, setStep] = useState(1);
    /* -------------------------------- Functions ------------------------------- */
    // ---- Submits Signup Info
    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        email: '',
        phoneNumber: '',
        password: '',
        block: '',
        province: '',
        municipal: '',
        barangay: ''
    })

    useEffect(() => {
      // console.log(signupData)
    }, [signupData])


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
          onPress={() => {
            
            if (step == 1) router.back()
            else setStep(step-1)
          }}>
            <Arrows name='left' size={24} color={'#fff'}/>
          </TouchableOpacity>
          <Text style={[auth.headerTitle, {color: '#fff'}]}>
            SIGN UP
          </Text>
          <Text style={[auth.headerDescription, {color: '#fff'}]}>Fill your information below.</Text>
        </View>
      </SafeAreaView>

      {/* ---------------------------------- Main ---------------------------------- */}
      {step === 1 && <PersonalDetails signupData={signupData} setSignupData={setSignupData}/>}
      {step === 2 && <LocationPrompt setSignupData={setSignupData} setStep={setStep}/>}
      {step === 3 && <LocationDetails signupData={signupData} setSignupData={setSignupData}/>}
      {step === 4 && <AccountDetails signupData={signupData} setSignupData={setSignupData}/>}

      {/* --------------------------------- Buttons -------------------------------- */}
      <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
        {(step == 4) ? 
        <Text style={auth.textGeneral}>
          By continuing, you agree to HandyHome’s 
          <Text style={auth.textLinks}> Terms & Conditions</Text> and 
          <Text style={auth.textLinks}> Privacy Policy</Text>
        </Text> : 
        <></>}
        <TouchableHighlight style={
          (step == 4) ?
          global.primaryBtn :
          global.secondaryBtn
        }
          underlayColor={(step == 4) ? "#0072bc" : '#d8d8d8'}
          onPress={() => {
            
            (step == 4) ? router.replace('./authLoading') : setStep(step+1)
          }}>
            <Text style={
              (step == 4) ?
              global.primaryBtnText :
              global.secondaryBtnText
            }>
              {(step == 4) ? "SIGN UP" : "Continue"}
            </Text>
        </TouchableHighlight>
      </View>
    </View>
    </DismissKeyboardWrapper>
  )
}

export default SignupPages