import 
   React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const AuthContext = createContext();

const API_URL = 'http://192.168.1.14:5001/api/v1';

export const AuthProvider = ({children}) => {
   const [ user, setUser ] = useState(null);
   const [ token, setToken ] = useState(null);
   const [ hasOnboarded, setHasOnboarded ] = useState(null);
   const [ loading, setLoading ] = useState(true);

   const getOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem('onboarded');
      setHasOnboarded(onboarded);
   }

   const completeOnboarding = async () => {
      setHasOnboarded(true);
   }

   const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
         setToken(token);
         await tryFetchUser(token)
      } else {
         setLoading(false);
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
         setUser(res.user);
         setLoading(false);
      } catch {
         logout();
      }
   }

   const login = async (loginData) => {
      try {

         console.log("1. Verifying Login Data... ", loginData);

         const res = await axios.post(`${API_URL}/auth/login`, loginData, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         console.log("test");

         const { user, token } = res.data.data;

         console.log("2. Saving Token to Async...");
         await AsyncStorage.setItem('token', token);

         setToken(token);
         setUser(user);

         console.log("3. Succesful Login...");
         return { success: true };
      } catch (err){
         console.log(err)
         const message = err.response?.message || "An error has ocurred when trying to login. Please try again.";

         return { success: false, message };
      }
   }
   
   const logout = async () => {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('token');
   }

   useEffect(() => {
      getOnboarding();
      loadToken();
   }, [])

   return (
      <AuthContext.Provider
      value={{
         login,
         logout,
         token,
         user,
         loading,
         hasOnboarded,
         completeOnboarding
      }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => useContext(AuthContext);