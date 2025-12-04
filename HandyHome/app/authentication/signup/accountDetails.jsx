// SubScreen: Account Details

// Imports
// ---- Hooks and React Components
import { Text, View , TouchableHighlight} from 'react-native'
import React, { useState } from 'react'
import { useSignup } from '../../../context/SignupContext';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../styles/constants';
import { authStyles as auth } from '../../../styles/authStyles';

const AccountDetails = () => {
  // States and Hooks
  const { signupData, updateSignupData, passErrors } = useSignup();
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
  return (
    <View style={auth.inputsContainer}>
      {/* -------------------------- Account Information -------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>ACCOUNT INFORMATION</Text>
        {/* ---- Email */}
        <BasicInput 
          left={<Icons name="email" size={24} color="#3D3D3D"/>}
          placeholder={"Email (handy@home.com)"}
          inputMode='email'
          keyboardType='email-address'
          onChangeText={(e) => updateSignupData('email', e)}
          value={signupData.email}
        />

        {/* ---- Phone Number */}
        <BasicInput 
        left={<Icons name="phone" size={24} color="#3D3D3D"/>}
          placeholder={"Phone Number (09XXXXXXXXX)"}
          inputMode='numeric'
          keyboardType='numeric'
          onChangeText={(e) => updateSignupData('phone_number', e)}
          value={signupData.phone_number}
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
            onChangeText={(e) => updateSignupData('password', e)}
            value={signupData.password}
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
    
  )
}

export default AccountDetails;
