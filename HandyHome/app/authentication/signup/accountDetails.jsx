/* --------------------------------- Imports -------------------------------- */
import { StyleSheet, Text, View , KeyboardAvoidingView, SafeAreaView, Platform, TouchableOpacity, TouchableHighlight} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useNavigation } from 'expo-router';
/* ------------------------------- Components ------------------------------- */
import BasicInput from '../../../components/authentication/BasicInput';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';

const AccountDetails = ({signupData, setSignupData}) => {
  /* ----------------------------- Initialization ----------------------------- */
  const passwordReqList = [
    "At least 8 characters",
    "At least one uppercase letter (A-Z)",
    "At least one lowercase letter (a-z)",
    "At least one number (0-9)",
    "At least one special character (!@#$%^&*)",
    "No Spaces in between"
  ]

  /* -------------------------------- Functions ------------------------------- */
  const [ passwordShow, setPasswordShow ] = useState(false);
  const onPasswordShow = () => {
    setPasswordShow(!passwordShow);
  }
  // ---- Verifies Password Validity
  const [ tempPass, setTempPass ] = useState("");
  const [ passErrors, setPassErrors ] = useState([]);
  useEffect(() => {
    let tempArr = [];

    // Character Length
    if (tempPass.length >= 8) {
      tempArr.push(0);
    }
    // Uppercase Letter
    if (/(?=.*[A-Z])/.test(tempPass)) {
      tempArr.push(1);
    }
    // Lowercase Letter
    if (/(?=.*[a-z])/.test(tempPass)) {
      tempArr.push(2);
    }
    // Number
    if (/(?=.*\d)/.test(tempPass)) {
      tempArr.push(3);
    }
    // Special Character
    if (/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(tempPass)) {
      tempArr.push(4);
    }
    // No Spaces
    if (/^\S*$/.test(tempPass) && tempPass.length > 1) {
      tempArr.push(5);
    }
    console.log(tempArr); // Contains all passed rule indices (0-5)
    setPassErrors(tempArr);
  }, [tempPass]);
  

  return (
    <View style={auth.inputsContainer}>
      {/* -------------------------- Account Information -------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>ACCOUNT INFORMATION</Text>
        <Text style={[auth.textGeneral, {width: '100%', textAlign: 'center'}]}>Fill in at least one of either Email or Phone.</Text>
        {/* ---- Email */}
        <BasicInput 
          left={<Icons name="email" size={24} color="#3D3D3D"/>}
          placeholder={"Email"}
          inputMode='email'
          keyboardType='email-address'
          onChangeText={(e) => setSignupData((prev) => ({
            ...prev,
            email: e
          }))}
          value={signupData.email}
        />

        {/* ---- Phone Number */}
        <BasicInput 
        left={<Icons name="phone" size={24} color="#3D3D3D"/>}
          placeholder={"Phone Number"}
          inputMode='numeric'
          keyboardType='numeric'
          onChangeText={(e) => setSignupData((prev) => ({
            ...prev,
            phoneNumber: e
          }))}
          value={signupData.phoneNumber}
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
            onChangeText={(e) => {
              setSignupData((prev) => ({
                ...prev,
                password: e
              }))
              setTempPass(e)
            }}
            value={signupData.password}
          />

          <View>
          {passwordReqList.map((item, key) => (
            <Text key={key}
            style={[
              auth.textGeneral,
              (passErrors.includes(key)) ?  {color: 'green'} : 
              {padding: 0}
              ]}
            >
              {`\u2022  ${item}`}
            </Text>
          ))}
          </View>
      </View>

    </View>
    
  )
}

export default AccountDetails;
