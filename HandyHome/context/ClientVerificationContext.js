
// Context: Client Verification

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useState, useEffect } from 'react';
// ---- Other Components
import ErrorModal from '../components/ErrorModal'
// ---- Libraries
import api from '../lib/api'

const ClientVerificationContext = createContext();

export const ClientVerificationProvider = ({ children }) => {
   const [clientVerification, setClientVerification] = useState({
      primary_id: null,
      id_type: "",
      id_number: "",
      selfie: null,
   });
   const [verificationLoading, setVerificationLoading] = useState(false);
   const [showErrorModal, setShowErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const clearClientVerification = () => {
      setClientVerification(null);
   }

   const handleClientVerification = () => {

   }

   return (
      <ClientVerificationContext.Provider 
      value={{
         clientVerification,
         setClientVerification,
         clearClientVerification,
         handleClientVerification,
         verificationLoading,
         setErrorMessage,
         setShowErrorModal,
      }}>
         <ErrorModal
         visible={showErrorModal}
         setVisible={setShowErrorModal}
         title={"Account Verification Error"}
         message={errorMessage}
         />
         {children}
      </ClientVerificationContext.Provider>
   )
}

export const useClientVerification = () => useContext(ClientVerificationContext);