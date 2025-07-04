/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
   const {token} = useAuth();

   const [emergencyInfo, setEmergencyInfo] = useState({
      message: null
   });

   const clearEmergency = () => {
      setEmergencyInfo({
         message: null
      });
   }

   const handleEmergency = async (id) => {
      try {
         console.log('[EMERGENCY ID]', id);
         const result = await axios.post(`${API_URL}/emergency/notify-user-emergency-contacts/${id}`, emergencyInfo, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log(result);

         return {status: "success"}
      } catch (err) {
         console.log(err.status);
         return {status: "failed"}
      } 
   }

   return (
      <EmergencyContext.Provider 
      value={{
         emergencyInfo,
         setEmergencyInfo,
         clearEmergency,
         handleEmergency
      }}>
         {children}
      </EmergencyContext.Provider>
   )
}

export const useEmergency = () => useContext(EmergencyContext);