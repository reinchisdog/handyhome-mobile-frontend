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
   const [ user, setUser ] = useState(null);
   const [ token, setToken ] = useState(null);
   const [ hasOnboarded, setHasOnboarded ] = useState(null);
   const [ loading, setLoading ] = useState(false);

   const getOnboarding = async () => {
      const onboarded = JSON.parse(await AsyncStorage.getItem('onboarded'));
      console.log(`Onboarded: ${onboarded}`)
      setHasOnboarded(onboarded);
   }

   const completeOnboarding = async () => {
      await AsyncStorage.setItem(`onboarded`, 'true');
   }

   const loadToken = async () => {
      try {
      const token = JSON.parse(await AsyncStorage.getItem('token'));
      console.log('[loadToken] Raw token:', token);

      if (token) {
         setToken(token);
         await tryFetchUser(token)
      } else {
         console.log('[loadToken] No token found');
         setLoading(false);
      }
      } catch (err) {
         console.log('[loadToken] Error:', err);
      }
   }

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
         setLoading(false);
      } catch (err) {
         console.log('Fetch user failed:', err.response?.data || err.message);
         logout();
      }
   }

   const login = async (loginData) => {
      try {

         setLoading(true);

         const result = await axios.post(`${API_URL}/auth/login`, loginData, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         console.log("[Result]", result);

         const { user, token } = result.data.data;

         await AsyncStorage.setItem('token', JSON.stringify(token));

         setToken(token);
         setUser(user);

         return { success: true };
      } catch (err){
         console.log(err.message);
         const message = err.message || "An error has ocurred when trying to login. Please try again.";

         return { success: false, message };
      } finally {
         setLoading(false);
      }
   }
   
   const logout = async () => {
      try {
         setUser(null);
         setToken(null);
         await AsyncStorage.removeItem('token');

         return { success: true };
      } catch (err) {
         const message = err.response?.message || "An error has ocurred when trying to login. Please try again.";
         return { success: false, message };
      }
      
   }

   

   useEffect(() => {
      const init = async () => {
         await getOnboarding();
         await loadToken();
      };

      init();
   }, []);

   return (
      <AuthContext.Provider
      value={{
         login,
         logout,
         token,
         user,
         loading,
         hasOnboarded,
         completeOnboarding,
      }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => useContext(AuthContext);