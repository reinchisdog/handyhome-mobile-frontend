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
import axios from 'axios'
import {API_URL} from '../config';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
   // States
   const [ user, setUser ] = useState(null);
   const [ token, setToken ] = useState(null);
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

      console.log(`[Auth Context]: Token? ${token}`);

      if (token) {
         setToken(token);
         await tryFetchUser(token)
      } else {
         setIsLoading(false);
      }
      } catch (err) {
         console.log('[Auth Context]: Token Error:', err);
      }
   }
   // ---- Fetches user data using the token
   const tryFetchUser = async (token) => {
      try {
         const res = await axios.get(
            `${API_URL}/auth/validate-token`,
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );

         console.log(res?.data?.user)

         setUser(res?.data?.user);
         setIsLoading(false);
      } catch (err) {
         console.log('Fetch user failed:', err.response?.data || err.message);
         logout();
      }
   }

   const login = async (loginData) => {
      try {
         console.log("--- [Auth Context]: Login Attempt ---");
         console.log("1. Loggin In");
         const tokenResult = await axios.post(`${API_URL}/auth/login`, loginData, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         console.log("2. Succesful Loggin In")
         const token = tokenResult.data.data.token;
         await AsyncStorage.setItem('token', JSON.stringify(token));
         setToken(token);
         
         console.log("3. Fetching User Data");
         const userResult = await axios.get(`${API_URL}/user`, {
            headers: {
               Authorization: `Bearer ${token}`,
            }
         });

         console.log("4. Succesfully Fetched User Data")
         const user = userResult.data.data;
         setUser(user);

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