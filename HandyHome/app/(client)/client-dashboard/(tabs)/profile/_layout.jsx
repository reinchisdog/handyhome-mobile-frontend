import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Stack} from 'expo-router'

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation:'slide_from_right'
      }} 
    />
  )
}

export default ProfileLayout;