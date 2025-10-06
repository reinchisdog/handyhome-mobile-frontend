
// Context: Client Verification

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';
// ---- Libraries
import api from '../lib/api'
import { useAuth } from './AuthContext';
import { useConvert } from '../hooks/useConvert'

const ClientVerificationContext = createContext();

export const ClientVerificationProvider = ({ children }) => {
   // Hooks and States
   const router = useRouter();
   const { token, tryFetchUser } = useAuth();
   const { convertUriToFile } = useConvert();
   const [showErrorModal, setShowErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const [clientVerification, setClientVerification] = useState({
      primary_id: null,
      id_type: "",
      id_number: "",
      selfie: null,
   });
   const [verificationLoading, setVerificationLoading] = useState(false);

   // Functions
   const appendFormData = (formData, data, parentKey = '') => {
      for (const key in data) {
         if (data.hasOwnProperty(key)) {
            const formKey = parentKey ? `${parentKey}[${key}]` : key;
            const value = data[key];

            if (value && typeof value === 'object' && value.uri && value.type) {
               console.log(`📎 Appending file: ${key} -> ${value.name} (${value.type})`);
               formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
               appendFormData(formData, value, formKey);
            } else {
               console.log(`📝 Appending field: ${formKey} -> ${value}`);
               formData.append(formKey, value);
            }
         }
      }
   }

   const clearClientVerification = () => {
      setClientVerification({
         primary_id: null,
         id_type: "",
         id_number: "",
         selfie: null,
      });
   }

   const handleClientVerification = async () => {
      try {
         console.log("---- [Client Verification] Attempting to Submit ----");
         setVerificationLoading(true);
         console.log("[1] Preparing Verification Files");
         const converted = {
            ...clientVerification,
            primary_id: convertUriToFile(clientVerification.primary_id),
            selfie: convertUriToFile(clientVerification.selfie),
         }

         const formData = new FormData();
         appendFormData(formData, converted);

         console.log("[2] Submitting Verification Files");
         const verificationResult = await api.post(`/user/upload/identity`, formData, {
            headers: {
               'Authorization' : `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
            timeout: 60000,
         })

         await tryFetchUser(token);
         
         console.log("[3] Succesful Submission of Verification. Routing to Success Screen");
         router.replace("/dashboard/client/verify/user/success");

      } catch (err) {
         const message = err.response?.data?.message || err.message || "An unknown error has occurred when submitting your verification files. Please try again.";

         setErrorMessage(message);
         setShowErrorModal(true);
      } finally {
         setVerificationLoading(false);
      }
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