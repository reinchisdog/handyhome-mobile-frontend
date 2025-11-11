
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
   const { token, tryFetchUser, setUser } = useAuth();
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
               // console.log(`📎 Appending file: ${key} -> ${value.name} (${value.type})`);
               formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
               appendFormData(formData, value, formKey);
            } else {
               // console.log(`📝 Appending field: ${formKey} -> ${value}`);
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

         console.log(converted);

         const formData = new FormData();
         appendFormData(formData, converted);

         console.log("[2] Submitting Verification Files");
         const response = await api.post(`/user/upload/identity`, formData, {
            headers: {
               'Authorization' : `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
            timeout: 180000,
            timeoutErrorMessage: "We're having trouble verifying your selfie. Please try again in a well-lit area with your face clearly visible."
         })
         
         console.log(response?.data?.data);
         const confidence = response?.data?.data?.confidence;

         console.log("FETCHING USER INFO BEFORE ROUTING:");
         await tryFetchUser(token, false);
         
         if (confidence >= 80) {
            console.log("[3] Succesful Submission of Verification. Routing to Success Screen");
            // Fallback
            setUser(prev => ({
               ...prev,
               identity_status: {status: "Verified"},
               can_book: true
            }))
            router.replace("/dashboard/client/verify/user/success");
         } else {
            console.log("[3] Failed Submission of Verification. Routing to Failed Screen");
            // Fallback
            setUser(prev => ({
               ...prev,
               identity_status: {status: "Pending"},
               can_book: false
            }))
            router.replace("/dashboard/client/verify/user/failed");
         }
         

      } catch (err) {
         console.log(err);
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