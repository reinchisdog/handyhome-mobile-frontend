/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [hasOnboarded, setHasOnboarded] = useState(false);

   useEffect(() => {
      const loadUserData = async () => {
         try {
            // Replace with real logic or simulated data for now
            // const userData = await AsyncStorage.getItem('user');
            // const onboardedFlag = await AsyncStorage.getItem('hasOnboarded');
   
            // if (userData) {
            //   setUser(JSON.parse(userData));
            // }
   
            // setHasOnboarded(onboardedFlag === 'true');
   
            // TEMPORARY SIMULATION for testing (remove later)
            setUser("merp");           
            setHasOnboarded(true);   
         } catch (error) {
            console.error('Error loading user data', error);
         } finally {
            setIsLoading(false); 
         }
      };
   
      loadUserData();
   }, []); 

   const login = async (userData) => {
      setUser(userData);
      // await AsyncStorage.setItem('user', JSON.stringify(userData));
   };

   const logout = async () => {
      setUser(null);
      // await AsyncStorage.removeItem('user');
   };

   const completeOnboarding = async () => {
      setHasOnboarded(true);
      // await AsyncStorage.setItem('onboarded', 'true');
   };

   return (
      <UserContext.Provider 
      value={{
         user, 
         login, 
         logout, 
         isLoading, 
         hasOnboarded, 
         completeOnboarding
      }}>
         {children}
      </UserContext.Provider>
   )
}

export const useUser = () => useContext(UserContext);