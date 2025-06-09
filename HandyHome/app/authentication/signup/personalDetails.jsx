/* --------------------------------- Imports -------------------------------- */
import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
/* ------------------------------- Components ------------------------------- */
import BasicInput from '../../../components/authentication/BasicInput';
import RadioGroup from '../../../components/authentication/RadioGroup';

/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';

const PersonalDetails = ({signupData, setSignupData}) => {
  /* ----------------------------- Initialization ----------------------------- */
  const [ formattedBirthDate, setFormattedBirthDate ] = useState(signupData.birthDate);
  useEffect(() => {
    let temp = formattedBirthDate;

    if(temp.length === 2 || temp.length === 5){
      temp = `${temp}/`;
      setFormattedBirthDate(temp);
    }
    
    setSignupData((prev) => ({
      ...prev,
      birthDate: temp
    }))
  }, [formattedBirthDate])

  return (
    <View style={auth.inputsContainer}>
      {/* -------------------------- Personal Information -------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>PERSONAL INFORMATION</Text>
        {/* ---- First Name */}
        <BasicInput 
          placeholder={"First Name"}
          onChangeText={(e) => setSignupData((prev) => ({
            ...prev,
            firstName: e
          }))}
          value={signupData.firstName}
        />

        {/* ---- Last Name */}
        <BasicInput 
          placeholder={"Last Name"}
          onChangeText={(e) => setSignupData((prev) => ({
            ...prev,
            lastName: e
          }))}
          value={signupData.lastName}
        />
      </View>

      {/* ------------------------------- Birth Date ------------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>BIRTH DATE</Text>

        <BasicInput 
          placeholder='MM / DD / YYYY'
          right={<Icons name="calendar-month" size={24} color="#3D3D3D" />}
          inputMode='numeric'
          keyboardType='numeric'
          onChangeText={(e) => setFormattedBirthDate(e.trim())}
          value={formattedBirthDate}
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
          setValue={(item) => {
            setSignupData((prev) => ({
              ...prev,
              gender: item
            }))
          }}
        />
      </View>

    </View>
  )
}

export default PersonalDetails;
