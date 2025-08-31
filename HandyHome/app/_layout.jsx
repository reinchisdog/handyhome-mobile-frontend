// Layout: Root - Top-most layout for the app

// Imports
// ---- Hooks and React Components
import { Slot, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
// ---- Contexts
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppDataProvider, useAppData } from '../context/AppDataContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller'
// ---- Libraries
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const AppInitializer = () => {
	const { isAuthReady, hasOnboarded, user } = useAuth();
	const { isAppDataReady } = useAppData(); 
	const router = useRouter();
	const [hasRouted, setHasRouted] = useState(false);

	useEffect(() => {
		if (!isAuthReady || !isAppDataReady || hasRouted) return; 

		if (!hasOnboarded) {
			console.log("[Routing] to Onboarding");
			router.replace("/onboarding");
		} else if (!user) {
			console.log("[Routing] to Authentication");
			router.replace("/authentication");
		} else {
			if (user?.role === "User") {
				console.log("[Routing] to Client Dashboard");
				router.replace("/dashboard/client");
			} else if (user?.role === "Worker") {
				console.log("[Routing] to Worker Dashboard");
				router.replace("/dashboard/worker");
			}
		}

		setHasRouted(true); 
	}, [isAuthReady, isAppDataReady, hasRouted]);

	useEffect(() => {
		if (hasRouted) {
			SplashScreen.hideAsync();
		}
	}, [hasRouted]);
 
	return null; 
 };

const RootLayout = () => {
    return (
		<AuthProvider>
		<AppDataProvider>
		<SafeAreaProvider>
		<KeyboardProvider>
			<AppInitializer />
			<Slot />
		</KeyboardProvider>
		</SafeAreaProvider>
		</AppDataProvider>
		</AuthProvider>
    );
};

export default RootLayout;
