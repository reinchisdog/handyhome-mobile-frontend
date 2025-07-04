/* --------------------------------- Imports -------------------------------- */
import { Text, View , TouchableHighlight, TouchableOpacity, ImageBackground, ScrollView} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router';
import axios from 'axios';
import {API_URL} from '../../../config'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
/* ------------------------------- Components ------------------------------- */
import PersonalDetails from './personalDetails';
import LocationPrompt from '../../../components/authentication/LocationPrompt';
import LocationDetails from './locationDetails';
import AccountDetails from './accountDetails';
import Header from '../../../components/dashboard/Header';
import MainButton from '../../../components/MainButton';
import ErrorModal from '../../../components/ErrorModal';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';

import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { COLORS } from '../../../styles/constants';

const SignupPages = () => {
    /* ----------------------------- Initialization ----------------------------- */
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [step, setStep] = useState(1);
    /* -------------------------------- Functions ------------------------------- */
    // ---- Submits Signup Info
    const [signupData, setSignupData] = useState({
        first_name: "",
        last_name: "",
        email: null,
        gender: "",
        phone_number: null,
        password: "",
        home_address: {
          block: "",
          province: "",
          municipal: "",
          barangay: "",
        },
        terms_agreed: false
    })

    const [signupLoading, setSignupLoading] = useState(false);
    const [signupDisabled, setSignupDisabled] = useState(true);
    const [ passErrors, setPassErrors ] = useState([]);

    const validatePersonal = () => {
      const firstName = signupData.first_name?.trim() || "";
      const lastName = signupData.last_name?.trim() || "";
      const gender = signupData.gender?.trim() || "";
    
      const isNotEmpty = (
        firstName !== "" &&
        lastName !== "" &&
        gender !== ""
      );
    
      const isNotShort = (
        firstName.length > 2 &&
        lastName.length > 2
      );
    
      return isNotEmpty && isNotShort;
    };

    const validateLocation = () => {
      const address = signupData.home_address || {};
    
      const isNotEmpty = (
        (address.block?.trim() || "") !== "" &&
        (address.province?.trim() || "") !== "" &&
        (address.municipal?.trim() || "") !== "" &&
        (address.barangay?.trim() || "") !== ""
      );
    
      return isNotEmpty;
    };

    const validateAccount = () => {
      const email = signupData.email?.trim() || "";
      const phone = signupData.phone_number?.trim() || "";
      const password = signupData.password?.trim() || "";
      const termsAgreed = signupData.terms_agreed;
    
      const isNotEmpty = (email !== "" || phone !== "") && password !== "" && termsAgreed;
    
      const isValidEmail = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPhone = phone === "" || /^09\d{9}$/.test(phone);
    
      return isNotEmpty && isValidEmail && isValidPhone;
    };

    const validatePassword = () => {
      const password = signupData.password?.trim() || "";
    
      const tempArr = [];
    
      if (password.length >= 8) tempArr.push(0);
      if (/(?=.*[A-Z])/.test(password)) tempArr.push(1);
      if (/(?=.*[a-z])/.test(password)) tempArr.push(2);
      if (/(?=.*\d)/.test(password)) tempArr.push(3);
      if (/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(password)) tempArr.push(4);
      if (/^\S*$/.test(password) && password.length > 1) tempArr.push(5);
    
      // Only update if changed
      setPassErrors(prev => {
        const same = prev.length === tempArr.length && prev.every((val, i) => val === tempArr[i]);
        return same ? prev : tempArr;
      });
    };

    useEffect(() => {
      validatePassword();

      if (step === 1 && validatePersonal()) {
        setSignupDisabled(false)
      } else if (step === 3 && validateLocation()) {
        setSignupDisabled(false)
      } else if (step === 4 && validateAccount() && passErrors.length === 6) {
        setSignupDisabled(false)
      } else {
        setSignupDisabled(true)
      }
    }, [signupData, step])

    const handleSignUp = async () => {
      try{
        setSignupLoading(true);

        // console.log('[SignUp] Sending:', signupData);

        const result = await axios.post(`${API_URL}/auth/signup`, signupData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const status = result?.data?.status || "error";

        if (status === "success") {
          router.push('authentication/signup/verify');

        } else if (status === "failed" || status === "error") {
          const message = result.data.message || 'Sign-up failed.';
          throw new Error(message);
        }

      } catch (err) {
        console.log(err.message);
        const message = err.message || "An error has ocurred when trying to sign in. Please try again.";

        showErrorModal(message)
      } finally {
        setSignupLoading(false);
      }
    }

    const [errorModal, setErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState(null);

    const showErrorModal = (message) => {
      setErrorModalMessage(message);
      setErrorModal(true);
    }

  return (
    <>
      <ErrorModal 
      visible={errorModal} 
      setVisible={setErrorModal} 
      title={"There is an error signing into HandyHome"} 
      message={errorModalMessage}/>

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
                SIGN UP
              </Text>

              <Text style={[auth.headerDescription, {color: '#fff'}]}>Fill your information below.</Text>
            </View>
        </ImageBackground>

        {/* ---------------------------------- Main ---------------------------------- */}
        {step === 2 && <LocationPrompt setSignupData={setSignupData} setStep={setStep}/>}

        <ScrollView>
        {step === 1 && <PersonalDetails signupData={signupData} setSignupData={setSignupData}/>}
        {step === 3 && <LocationDetails signupData={signupData} setSignupData={setSignupData}/>}
        {step === 4 && ( 
          <><AccountDetails signupData={signupData} setSignupData={setSignupData} passErrors={passErrors}/>
          
          <View style={[global.buttonsContainer, {paddingBottom: insets.bottom}]}>
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <TouchableOpacity
              style={{
                width: 24,
                height: 24,
                aspectRatio: '1/1',
                borderWidth: 1.5,
                borderColor: signupData.terms_agreed ? COLORS.green : COLORS.labels,
                borderRadius: 4,
                backgroundColor: signupData.terms_agreed ? COLORS.green : 'transparent',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => setSignupData(prev => ({
                ...prev,
                terms_agreed: !prev.terms_agreed
              }))}>
                {signupData.terms_agreed && <Icons name='check' size={20} color={'#fff'} />}
              </TouchableOpacity>

              <Text style={[auth.textGeneral, {flexShrink: 1}]}>
                By continuing, you agree to HandyHome’s 
                <Text style={auth.textLinks}> Terms & Conditions</Text> and 
                <Text style={auth.textLinks}> Privacy Policy</Text>
              </Text>
            </View>
            
            <MainButton 
            text={"SIGN UP" }
            type={"primary"}
            onPress={handleSignUp}
            loading={signupLoading}
            disabled={signupDisabled}
            />

          </View></>
        )
        

        }
        </ScrollView>

        {/* --------------------------------- Buttons -------------------------------- */}
        {step !== 4 && <View style={[global.buttonsContainer, {paddingBottom: insets.bottom}]}>
          <MainButton 
          text={"Continue"}
          type={"secondary"}
          onPress={() => setStep(step+1)}
          loading={signupLoading}
          disabled={signupDisabled}
          />
        </View>}
      </View>
    </>
  )
}

export default SignupPages