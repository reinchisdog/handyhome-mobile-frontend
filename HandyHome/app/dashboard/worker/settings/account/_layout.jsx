import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AccountSettingsProvider } from '../../../../../context/AccountSettingsContext'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const AccountLayout = () => {
   return (
      <KeyboardProvider>
      <AccountSettingsProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}/>
      </AccountSettingsProvider>
      </KeyboardProvider>
   )
}

export default AccountLayout