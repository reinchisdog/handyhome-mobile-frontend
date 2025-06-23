/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useEffect, useState } from 'react';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
   const [emergencyInfo, setEmergencyInfo] = useState({
      bookingId: null,
      emergencyMessage: null
   });

   const clearEmergency = () => {
      setEmergencyInfo({
         bookingId: null,
         emergencyMessage: null
      });
   }

   return (
      <EmergencyContext.Provider 
      value={{
         emergencyInfo,
         setEmergencyInfo,
         clearEmergency
      }}>
         {children}
      </EmergencyContext.Provider>
   )
}

export const useEmergency = () => useContext(EmergencyContext);