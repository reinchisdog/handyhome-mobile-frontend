/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ClientVerificationContext = createContext();

export const ClientVerificationProvider = ({ children }) => {
   const [clientVerification, setClientVerification] = useState({
      validIdType: "",
      validIdImage: null,
      clientImage: null
   });

   const clearClientVerification = () => {
    setClientVerification(null);
   }

   return (
      <ClientVerificationContext.Provider 
      value={{
        clientVerification,
        setClientVerification,
        clearClientVerification
      }}>
         {children}
      </ClientVerificationContext.Provider>
   )
}

export const useClientVerification = () => useContext(ClientVerificationContext);