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
   const {user, token, isAuthReady, registerLogoutCallback, unregisterLogoutCallback} = useAuth();
   const [expoPushToken, setExpoPushToken] = useState(null);
   const [notification, setNotification] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);

   // Effects
   // ---- Register on Mount
   useEffect(() => {
      if (!isAuthReady) return;

      console.log('🚀 Auth ready - registering for push notifications');
      registerForPushNotif();
   }, [isAuthReady]);

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

   useEffect(() => {
      // When user becomes authenticated and we have a locally stored token
      const syncTokenWithBackend = async () => {
         if (user && token && expoPushToken) {
            console.log('🔄 User authenticated - syncing push token with backend');
            try {
               await callRegistrationAPI(expoPushToken, user.role);
               await AsyncStorage.setItem(LAST_REGISTERED_KEY, Date.now().toString());
            } catch (err) {
               console.error('Failed to sync push token:', err);
            }
         }
      };

      syncTokenWithBackend();
   }, [user, token, expoPushToken, callRegistrationAPI]); // Run when user/token/expoPushToken changes

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
   const callRegistrationAPI = async (pushToken, role) => {
      if (!user || !token) return null;
      const userRole = role || (user ? user.role : null);

      const deviceInfo = getDeviceInfo();

      let route = '/user/push-token/register'; // Default
      if (userRole === 'Worker') {
         route = '/worker/push-token/register';
      }
   
      try {
         const response = await api.post(route, {
            pushToken: pushToken,
            deviceInfo: deviceInfo,
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
   const registerForPushNotif = useCallback(async (force = false, userObj) => {
      setIsLoading(true);
      setError(null);

      // console.log('[REGISTER PUSH NOTIF]', userObj);

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
         console.log('PUSH TOKEN:', pushToken);

         const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
         if (!force && storedToken === pushToken) {
            console.log('⏭️ Token unchanged - skipping API registration');
            setExpoPushToken(pushToken);
            setIsLoading(false);
            return pushToken;
         }

         // console.log("______ [PUSH NOTIF CONTEXT] ______");
         // console.log('User:', userObj ? userObj : user);
         // console.log('Token:', userObj ? userObj.token : token);
         // console.log('Role:', userObj ? userObj.role : user.role);
         // console.log("__________________________________");

         if (user && token) {
            await callRegistrationAPI(pushToken, userObj ? userObj.role : user.role);
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
      const currentToken = expoPushToken;
      const currentAuthToken = token;
      const currentUser = user;

      try {
         if (!currentToken) {
            console.log('⚠️ No push token to remove from backend');
            return;
         }

         if (currentAuthToken && currentUser) {
            let route = '/user/push-token/remove';
            if (currentUser.role === 'Worker') {
               route = '/worker/push-token/remove';
            }

            await api.post(route, {
               pushToken: currentToken,
            }, {
               headers: { Authorization: `Bearer ${currentAuthToken}` }
            });

            console.log('🗑️ Push token removed from backend');
         } else {
            console.log('⚠️ No auth token available - skipping backend removal');
         }

         console.log('🗑️ Push token reset successfully');
      } catch (err) {
         console.error('❌ Failed to reset push token:', err);
      } finally {
         await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
         await AsyncStorage.removeItem(LAST_REGISTERED_KEY);
         setExpoPushToken(null);
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