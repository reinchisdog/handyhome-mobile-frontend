// Screen: Signup Screen - Multi-page Form for new Users.

// Imports
// ---- Hooks and React Components
import { Text, View , TouchableOpacity, ImageBackground, ScrollView} from 'react-native'
import React, { use } from 'react'
import { useRouter } from 'expo-router';
import { useSignup } from '../../../context/SignupContext';
// ---- Custom Components
import PersonalDetails from './personalDetails';
import LocationPrompt from '../../../components/authentication/LocationPrompt';
import LocationDetails from './locationDetails';
import AccountDetails from './accountDetails';
import Header from '../../../components/dashboard/Header';
import MainButton from '../../../components/MainButton';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { COLORS } from '../../../styles/constants';
// ---- Other Libraries
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default  SignupScreen = () => {
    // States and Hooks
    const {
      signupData,
      updateSignupData,
      handleSignUp,
      step,
      setStep,
      signupLoading,
      signupDisabled
    } = useSignup();
    const insets = useSafeAreaInsets();
    const router = useRouter();

  return (
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
      {step === 2 && <LocationPrompt/>}

      <ScrollView>
      {step === 1 && <PersonalDetails/>}
      {step === 3 && <LocationDetails/>}
      {step === 4 && ( 
        <>
          <AccountDetails/>
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
              onPress={() => updateSignupData('terms_agreed', !prev.terms_agreed)}>
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
          </View>
        </>
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
  )
}