import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AppointmentProvider } from '../../../../context/AppointmentContext';
import { Stack } from 'expo-router';

const AppointmentLayout = () => {
  return (
    <AppointmentProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </AppointmentProvider>
  )
}

export default AppointmentLayout