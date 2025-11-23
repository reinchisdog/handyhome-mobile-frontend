// Context: AuthContext - Handles authentication state and actions.

// Imports
import 
   React, { 
   createContext, 
   useCallback, 
   useContext, 
   useEffect, 
   useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';
import { useRouter } from 'expo-router';

const TOKEN_STORAGE_KEY = '@expo_push_token';
const LAST_REGISTERED_KEY = '@last_token_registration';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
   // States
   const router = useRouter()
   const [ user, setUser ] = useState(null);
   const [ token, setToken ] = useState(null);
   const [ isTokenValid, setIsTokenValid ] = useState(false);
   const [ hasOnboarded, setHasOnboarded ] = useState(null);
   const [ isLoading, setIsLoading ] = useState(false);
   const [ isAuthReady, setIsAuthReady ] = useState(false);

   // Functions
   // ---- Checks if the user has completed onboarding
   const getOnboarding = async () => {
      const onboarded = JSON.parse(await AsyncStorage.getItem('onboarded'));
      // console.log(`[Auth Context]: Has Onboarded? ${onboarded !== null ? onboarded : false}`);
      setHasOnboarded(onboarded !== null ? onboarded : false); 
   }
   // ---- Completes the onboarding process
   const completeOnboarding = async () => {
      await AsyncStorage.setItem(`onboarded`, 'true');
   }
   // ---- Loads the token from AsyncStorage and fetches user data
   const loadToken = async () => {
      try {
      const token = JSON.parse(await AsyncStorage.getItem('token'));

      console.log(`[Auth Context] Token Set: ${token}`);

      if (token) {
         setToken(token);
         await tryFetchUser(token)
      } else {
         setIsLoading(false);
      }
      } catch (err) {
         // console.log('[Auth Context] Token Error:', err);
      }
   }
   // ---- Fetches user data using the token
   const tryFetchUser = async (token, validateToken = true) => {
      try {
         if (validateToken) {
            await api.get(`/auth/validate-token`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            // console.log("TOKEN VALIDATED");
         }

         const userResult = await api.get(`/user`, {
            headers: { Authorization: `Bearer ${token}`},
         });
         // console.log("USER FETCHED");
         const userObj = userResult?.data?.data;
         setUser(userObj);
         // console.log("---- SUCCESFULLY FETCHED USER DATA ---");
         // console.log(userObj);
         setIsTokenValid(true);
         setIsLoading(false);
      } catch (err) {
         // console.error('Fetch user failed:', err?.response?.data?.message || err?.message);
         setIsTokenValid(false);
      }
   }

   const login = async (loginData) => {
      try {
         // console.log("--- [Auth Context]: Login Attempt ---");
         // console.log("1. Loggin In");
         const tokenResult = await api.post(`/auth/login`, loginData, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         // console.log("2. Succesful Loggin In")
         const token = tokenResult.data.data.token;
         await AsyncStorage.setItem('token', JSON.stringify(token));
         setToken(token);
         // console.log("[Auth Context] Token Set:", token); 
         
         // console.log("3. Fetching User Data");
         const userResult = await api.get(`/user`, {
            headers: {
               Authorization: `Bearer ${token}`,
            }
         });

         const userObj = userResult.data.data;
         setUser(userObj);
         setIsTokenValid(true);
         // console.log("4. Succesfully Fetched User Data:", JSON.stringify(userObj));

         return { success: true, user: {...userObj, token: token} };
      } catch (err){
         // console.log("/// Failed Loggin In ///")
         const message = err.response?.data.message || "An error has ocurred when trying to login. Please try again.";

         return { success: false, message, user: null };
      }
   }
   
   // ---- Logout
   const [logoutCallbacks, setLogoutCallbacks] = useState([]);

   const registerLogoutCallback = useCallback((callback) => {
      setLogoutCallbacks((prevCallbacks) => [...prevCallbacks, callback]);
   }, []);

   const unregisterLogoutCallback = useCallback((callback) => {
      setLogoutCallbacks((prevCallbacks) =>
         prevCallbacks.filter((cb) => cb !== callback)
      );
   }, []);

   const logout = useCallback(async () => {
      try {
         const pushToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
         console.log("[LOGOUT PUSH TOKEN]:", pushToken);

         if (pushToken && user && token) {
            let route = '/user/push-token/remove';
            if (user && user.role === 'Worker') {
               route = '/worker/push-token/remove';
            }

            console.log("[LOUGOUT TOKEN REMOVAL ROUTE]:", route);

            try {
               const response = await api.post(route, {pushToken: pushToken}, {
                  headers: { Authorization: `Bearer ${token}` }
               });
               console.log(response.data);
               console.log('🗑️ Push token removed from backend');
            } catch (err) {
               console.error('❌ Failed to remove push token from backend:', err);
            }
         }

         
         await Promise.all(logoutCallbacks.map((cb) => cb()));

         await api.post('/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
         });
         
         console.log("--- [Auth Context]: Logged Out ---");
      } catch (err) {
         const message = err.response?.data.message || "An error has ocurred when trying to logout. Please try again.";
         console.log(message);
      } finally {
         await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
         await AsyncStorage.removeItem(LAST_REGISTERED_KEY);
         await AsyncStorage.removeItem('token');

         setUser(null);
         setToken(null);
         setIsTokenValid(false);

         router.replace('/authentication');
      }
      
   }, [logoutCallbacks, user, token]);

   useEffect(() => {
      if (isAuthReady) return;

      // console.log("--- [Auth Context]: Initializing Auth Context ---");
      
      const init = async () => {
         await getOnboarding();
         await loadToken();

         setIsAuthReady(true);
      };

      init();
   }, [isAuthReady]);

   return (
      <AuthContext.Provider
      value={{
         login,
         logout,
         registerLogoutCallback,
         unregisterLogoutCallback,
         token,
         setToken,
         isTokenValid,
         user,
         setUser,
         isLoading,
         hasOnboarded,
         completeOnboarding,
         isAuthReady,
         tryFetchUser
      }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => useContext(AuthContext);