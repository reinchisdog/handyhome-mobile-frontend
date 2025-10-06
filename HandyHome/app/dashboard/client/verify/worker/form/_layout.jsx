import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { MediaProvider } from '../../../../../../context/MediaContext'

const ApplicationFormLayout = () => {
   return (
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
         }}/>
      </MediaProvider>
   )
}

export default ApplicationFormLayout