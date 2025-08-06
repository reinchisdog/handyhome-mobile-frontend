// SubScreen: Personal Details

// Imports
// ---- Hooks and React Components
import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSignup } from '../../../context/SignupContext';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
import RadioGroup from '../../../components/authentication/RadioGroup';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';

const PersonalDetails = () => {
  // States and Hooks
  const { signupData, updateSignupData } = useSignup();

  return (
    <View style={auth.inputsContainer}>
      {/* -------------------------- Personal Information -------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>PERSONAL INFORMATION</Text>
        {/* ---- First Name */}
        <BasicInput 
          placeholder={"First Name"}
          onChangeText={(e) => updateSignupData("first_name", e)}
          value={signupData.first_name}
        />

        {/* ---- Last Name */}
        <BasicInput 
          placeholder={"Last Name"}
          onChangeText={(e) => updateSignupData("last_name", e)}
          value={signupData.last_name}
        />
      </View>

      {/* --------------------------------- Gender --------------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>GENDER</Text>

        <RadioGroup 
        items={[
          {name: "Male", val: "Male"},
          {name: "Female", val: "Female"},
          {name: "Rather not say", val: "Other"}
        ]}
        direction="row"
        value={signupData.gender}
        setValue={(item) => updateSignupData("gender", item)}
        />
      </View>

    </View>
  )
}

export default PersonalDetails;
