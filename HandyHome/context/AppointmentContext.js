/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
   const [appointment, setAppointment] = useState({
      serviceName: "",
      serviceCategory: "",
      bookingDate: null,
      bookingTime: null,
      bookingNote: "",
      workerDetails: null,
   });

   const clearAppointment = () => {
      setAppointment(null);
   }

   return (
      <AppointmentContext.Provider 
      value={{
         appointment,
         setAppointment,
         clearAppointment
      }}>
         {children}
      </AppointmentContext.Provider>
   )
}

export const useAppointment = () => useContext(AppointmentContext);