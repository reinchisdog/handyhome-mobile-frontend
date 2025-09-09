import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { MediaProvider } from '../../../../../../context/MediaContext'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const ApplicationFormLayout = () => {
   return (
      <KeyboardProvider>
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}/>
      </MediaProvider>
      </KeyboardProvider>
   )
}

export default ApplicationFormLayout