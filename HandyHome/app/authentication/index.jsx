/* --------------------------------- Imports -------------------------------- */
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import { StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'
// Styles and Icons
import Icons from '@expo/vector-icons/AntDesign';
import { globalStyles as global } from '../../styles/globalStyles';

import { COLORS, FONT_SIZES } from '../../styles/constants';

const AuthStartingPage = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const route = useRouter();

  return (
    <View style={[global.screenContainer, global.centerContainer, {position: 'relative'}]}>
      {/* Logo */}
      <View>
        <Text>Logo</Text>
      </View>

      {/* Buttons */}
      <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
        <Text style={global.btnsContText}>How would you like to get started?</Text>
        <TouchableHighlight style={global.primaryBtn}
        underlayColor='#0072bc'
        onPress={() => route.navigate('/authentication/signup/')}>
          <Text style={global.primaryBtnText}>Create a new account</Text>
        </TouchableHighlight>

        <TouchableHighlight style={global.secondaryBtn}
        underlayColor="#d8d8d8"
        onPress={() => route.navigate('/authentication/login')}>
          <Text style={global.secondaryBtnText}>Already have an account</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default AuthStartingPage

const styles = StyleSheet.create({})