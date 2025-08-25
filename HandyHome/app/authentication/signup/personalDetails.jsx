// SubScreen: Personal Details

// Imports
// ---- Hooks and React Components
import { Text, View, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSignup } from '../../../context/SignupContext';
import { useConvert } from '../../../hooks/useConvert';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
import RadioGroup from '../../../components/authentication/RadioGroup';
import InputDateTime from '../../../components/InputDateTime';
import DatePicker from 'react-native-date-picker';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants';

export default PersonalDetails = () => {
  // States and Hooks
  const {convertDateToFormattedDate} = useConvert();

  const [showPicker, setShowPicker] = useState(false);
  const { signupData, updateSignupData } = useSignup();


  return (
    <View style={auth.inputsContainer}>
      <DatePicker 
      modal
      open={showPicker}
      date={signupData.birth_date || new Date()}
      mode="date"
      onConfirm={(date) => {
        updateSignupData("birth_date", date);
        setShowPicker(false);
      }}
      onCancel={() => {setShowPicker(false)}}
      theme='light'
      dividerColor={COLORS.accent}
      maximumDate={new Date()}
      />

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

      {/* ------------------------------- Birth Date ------------------------------- */}
      <View style={auth.inputSet}>
      <Text style={auth.inputSetTitle}>BIRTH DATE</Text>
        <InputDateTime
        type="date"
        placeholder="MM/DD/YYYY"
        value={convertDateToFormattedDate(signupData.birth_date, "/")}
        onPress={() => setShowPicker(true)}
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

const styles = StyleSheet.create({
  modalInputBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 48,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.strokes,
    borderRadius: 8,
    position: 'relative',
    backgroundColor: 'white',
    paddingHorizontal: 12
 },
 modalInputText: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: FONTS.roboto500,
    fontSize: FONT_SIZES.sm,
    letterSpacing: 0.2,
    color: '#3D3D3D',
    lineHeight: FONT_SIZES.sm*1.2
 },
})