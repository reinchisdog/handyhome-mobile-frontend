// Context: AuthContext - Handles authentication state and actions.

// Imports
import 
   React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
   // States
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
      console.log(`[Auth Context]: Has Onboarded? ${onboarded !== null ? onboarded : false}`);
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
         console.log('[Auth Context] Token Error:', err);
      }
   }
   // ---- Fetches user data using the token
   const tryFetchUser = async (token) => {
      try {
         await api.get(`/auth/validate-token`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         const userResult = await api.get(`/user`, {
            headers: { Authorization: `Bearer ${token}`},
         });

         const userObj = userResult?.data?.data;
         setUser(userObj);
         console.log("4. Succesfully Fetched User Data:", JSON.stringify(userObj));
         setIsTokenValid(true);
         setIsLoading(false);
      } catch (err) {
         console.log('Fetch user failed:', err.response?.data || err.message);
         setIsTokenValid(false);
         logout();
      }
   }

   const login = async (loginData) => {
      try {
         console.log("--- [Auth Context]: Login Attempt ---");
         console.log("1. Loggin In");
         const tokenResult = await api.post(`/auth/login`, loginData, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         console.log("2. Succesful Loggin In")
         const token = tokenResult.data.data.token;
         await AsyncStorage.setItem('token', JSON.stringify(token));
         setToken(token);
         console.log("[Auth Context] Token Set:", token); 
         
         console.log("3. Fetching User Data");
         const userResult = await api.get(`/user`, {
            headers: {
               Authorization: `Bearer ${token}`,
            }
         });

         const userObj = userResult.data.data;
         setUser(userObj);
         console.log("4. Succesfully Fetched User Data:", JSON.stringify(userObj));

         return { success: true };
      } catch (err){
         console.log("/// Failed Loggin In ///")
         const message = err.response?.data.message || "An error has ocurred when trying to login. Please try again.";

         return { success: false, message };
      }
   }
   
   const logout = async () => {
      try {
         setUser(null);
         setToken(null);
         await AsyncStorage.removeItem('token');

         return { success: true };
      } catch (err) {
         const message = err.response?.data.message || "An error has ocurred when trying to login. Please try again.";
         return { success: false, message };
      }
      
   }

   useEffect(() => {
      if (isAuthReady) return;

      console.log("--- [Auth Context]: Initializing Auth Context ---");
      
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
         token,
         isTokenValid,
         user,
         isLoading,
         hasOnboarded,
         completeOnboarding,
         isAuthReady
      }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => useContext(AuthContext);