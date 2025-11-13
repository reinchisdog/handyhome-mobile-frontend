import React, {createContext, useContext, useEffect, useState, useCallback} from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from './AuthContext';
import api from '../lib/api';

const TOKEN_STORAGE_KEY = '@expo_push_token';
const LAST_REGISTERED_KEY = '@last_token_registration';
const REGISTRATION_COOLDOWN_HOURS = 24;

Notifications.setNotificationHandler({
   handleNotification: async () => ({
     shouldShowAlert: true,
     shouldPlaySound: true,
     shouldSetBadge: true,
   }),
});

const PushNotifContext = createContext(null);

export const PushNotifProvider = ({children}) => {
   // Hooks and States
   const {user, token} = useAuth();
   const [expoPushToken, setExpoPushToken] = useState(null);
   const [notification, setNotification] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);

   // Effects
   // ---- Register on Mount
   useEffect(() => {
      registerForPushNotif();
   }, []);

   // ---- Listen on Mount
   useEffect(() => {
      const notificationListener = Notifications.addNotificationReceivedListener(
         (notification) => {
            console.log('Notification Received:', notification);
            setNotification(notification);
         }
      )

      const responseListener = Notifications.addNotificationResponseReceivedListener(
         (response) => {
            console.log('Notification Response Received:', response);
         }
      );

      return () => {
         notificationListener.remove();
         responseListener.remove();
      }
   }, []);

   // Functions
   // ---- Checks if token registration is needed based on cooldown
   const shouldRegister = async () => {
      try {
         const lastRegistered = await AsyncStorage.getItem(LAST_REGISTERED_KEY);

         if (!lastRegistered) return true;

         const hoursSinceLastRegistration = (Date.now() - parseInt(lastRegistered, 10)) / (1000 * 60 * 60);
         return hoursSinceLastRegistration >= REGISTRATION_COOLDOWN_HOURS;
      } catch (e) {
         console.log('Error checking registration cooldown:', e);
         return true;
      }
   }

   // ---- Get Device Information
   const getDeviceInfo = () => {
      return {
         platform: Device.osName,
         device_model: Device.modelName,
         os_version: Device.osVersion,
         device_brand: Device.brand,
      };
   }

   // ---- API Call to register token with backend
   const callRegistrationAPI = async (pushToken) => {
      if (!user || !token) return null;

      const deviceInfo = getDeviceInfo();

      try {
         const response = await api.post('/push-token/register', {
            push_token: pushToken,
            device_info: deviceInfo,
         }, {
            headers: { Authorization: `Bearer ${token}` }
         });

         console.log('✅ API registration successful');
         return response;
      } catch (error) {
         console.error('❌ API registration failed:', error);
         throw error;
      }
   }

   // ---- Main Registration Function
   const registerForPushNotif = useCallback(async (force = false) => {
      setIsLoading(true);
      setError(null);

      try {
         if (!Device.isDevice) {
            console.warn('⚠️ Push notifications only work on physical devices');
            setIsLoading(false);
            return null;
         }

         if (!force) {
            const should = await shouldRegister();
            if (!should) {
               console.log('⏭️ Skipping registration - within cooldown period');
               const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
               setExpoPushToken(storedToken);
               setIsLoading(false);
               return storedToken;
            }
         }

         const {status: existingStatus} = await Notifications.getPermissionsAsync();
         let finalStatus = existingStatus;

         if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
         }

         if (finalStatus !== 'granted') {
            throw new Error('Permission for push notifications not granted');
         }

         const tokenData = await Notifications.getExpoPushTokenAsync();
         const pushToken = tokenData.data;

         const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
         if (!force && storedToken === pushToken) {
            console.log('⏭️ Token unchanged - skipping API registration');
            setExpoPushToken(pushToken);
            setIsLoading(false);
            return pushToken;
         }

         if (user && token) {
            await callRegistrationAPI(pushToken);
         } else {
            console.log('⚠️ User not authenticated - token stored locally only');
         }

         await AsyncStorage.setItem(TOKEN_STORAGE_KEY, pushToken);
         await AsyncStorage.setItem(LAST_REGISTERED_KEY, Date.now().toString());

         setExpoPushToken(pushToken);
         console.log('✅ Push notification registered successfully');
      
         return pushToken;
      } catch (err) {
         console.error('❌ Failed to register for push notifications:', err);
         setError(err.message);
         return null;
      } finally {
         setIsLoading(false);
      }
   }, [user, token]);

   // ---- Force Re-registration
   const forceRegister = useCallback(async () => {
      console.log('🔄 Force registering push token...');
      return await registerForPushNotif(true);
   }, [registerForPushNotif]);

   // ---- Soft Reset
   const resetPushToken = useCallback(async () => {
      try {
         if (!user || !token) {
            console.log('⚠️ No user or token - skipping API call');
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
            await AsyncStorage.removeItem(LAST_REGISTERED_KEY);
            setExpoPushToken(null);
            return;
         }

         const response = await api.post('/push-token/remove', {
            push_token: expoPushToken,
         }, {
            headers: { Authorization: `Bearer ${token}` }
         });

         await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
         await AsyncStorage.removeItem(LAST_REGISTERED_KEY);

         setExpoPushToken(null);
         console.log('🗑️ Push token reset successfully');
      } catch (err) {
         console.error('❌ Failed to reset push token:', err);
      }
   }, [user, token, expoPushToken]);

   // ---- Check if Notifications are Enabled
   const checkNotificationsEnabled = useCallback(async () => {
      const {status} = await Notifications.getPermissionsAsync();
      return status === 'granted';
   }, []);

   return (
      <PushNotifContext.Provider value={{
         expoPushToken,
         notification,
         isLoading,
         error,
         registerForPushNotif,
          forceRegister,
         resetPushToken,
         checkNotificationsEnabled,
      }}>
         {children}
      </PushNotifContext.Provider>
   )
}

export const usePushNotif = () => useContext(PushNotifContext);