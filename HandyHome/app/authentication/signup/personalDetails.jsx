// SubScreen: Personal Details

// Imports
// ---- Hooks and React Components
import { Text, View, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSignup } from '../../../context/SignupContext';
// ---- Custom Components
import BasicInput from '../../../components/authentication/BasicInput';
import RadioGroup from '../../../components/authentication/RadioGroup';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialIcons';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants';
// ---- Other Libraries
import DateTimePicker from '@react-native-community/datetimepicker';

export default PersonalDetails = () => {
  // States and Hooks
  const [showPicker, setShowPicker] = useState(false);
  const { signupData, updateSignupData } = useSignup();

  const formatDateToYYYYMMDD = (date) => {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }

    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${year}-${month}-${day}`;
  };

  const formateDatetoMMDDYY = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const shortYear = year.slice(-2); 
  
    return `${month}/${day}/${shortYear}`;
  };

  const handleDate = (event, selectedValue) => {
    const date = formatDateToYYYYMMDD(selectedValue);
    setShowPicker(false);

    updateSignupData('birth_date', date);
 }

  const showDatePicker = () => {
    setShowPicker(!showPicker);
  }

  return (
    <View style={auth.inputsContainer}>
      {showPicker &&
        <DateTimePicker
        value={new Date()}
        mode="date"
        display="default"
        onChange={handleDate}
        maximumDate={new Date()}
      />
      }

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
        <Pressable 
        onPress={showDatePicker}
        style={styles.modalInputBox}>
        {!signupData.birth_date ?
          <Text style={[styles.modalInputText, {color: COLORS.strokes}]}>
              MM/DD/YYYY
          </Text> :
          <Text style={[styles.modalInputText]}>
              {formateDatetoMMDDYY(signupData.birth_date)}
          </Text> 
        }
          <Icons name='calendar-month' size={24} color={COLORS.lettersicons} />
        </Pressable>
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