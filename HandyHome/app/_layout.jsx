// Layout: Root - Top-most layout for the app

// Imports
// ---- Hooks and React Components
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
// ---- Contexts
import { AuthProvider } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';
import { InboxProvider } from '../context/InboxContext';
import { PushNotifProvider } from '../context/PushNotifContext'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller'

const RootLayout = () => {
    return (
		<AuthProvider>
		<AppDataProvider>
		<InboxProvider>
		<PushNotifProvider>
		<SafeAreaProvider>
		<KeyboardProvider>
			<Stack 
			screenOptions={{
				headerShown: false,
				animation: 'simple_push'
			}}
			/>
		</KeyboardProvider>
		</SafeAreaProvider>
		</PushNotifProvider>
		</InboxProvider>
		</AppDataProvider>
		</AuthProvider>
    );
};

export default RootLayout;
