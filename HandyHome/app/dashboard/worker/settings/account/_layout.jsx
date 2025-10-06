import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AccountSettingsProvider } from '../../../../../context/AccountSettingsContext'

const AccountLayout = () => {
   return (
      <AccountSettingsProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}/>
      </AccountSettingsProvider>
   )
}

export default AccountLayout