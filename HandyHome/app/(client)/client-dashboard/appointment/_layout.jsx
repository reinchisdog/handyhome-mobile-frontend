import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AppointmentProvider } from '../../../../context/AppointmentContext';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Stack } from 'expo-router';

const AppointmentLayout = () => {
  return (
    <KeyboardProvider>
      <AppointmentProvider>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        />
      </AppointmentProvider>
    </KeyboardProvider>
  )
}

export default AppointmentLayout