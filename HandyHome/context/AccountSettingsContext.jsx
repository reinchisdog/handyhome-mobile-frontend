// Context: Account Settings Context

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';
import api from '../lib/api';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';

const AccountSettingsContext = createContext();

export const AccountSettingsProvider = ({children}) => {
   // Hooks and States
   const router = useRouter();
   const { user, token } = useAuth();

   const [accountModal, setAccountModal] = useState(false);
   const [accountMode, setAccountMode] = useState(null);
   const [accountLoading, setAccountLoading] = useState(false);
   const [accountDisabled, setAccountDisabled] = useState(true);
   const [identifier, setIdentifier] = useState("");
   const [temp, setTemp] = useState(null);
   
   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const openModal = (mode) => {
      if (mode === 'email') {
         setTemp(user?.email);
         setIdentifier(user?.email);
      } else if (mode === 'phone') {
         setTemp(user?.phone_number.replace('+63', '0'));
         setIdentifier(user?.phone_number.replace('+63', '0'));
      }

      setAccountMode(mode);
      setAccountModal(true);
   }

   const verifyInputs = (mode) => {
      if (!identifier || identifier.trim() === "") 
         throw new Error("All fields must be filled to proceed.")

      if (mode === 'email') {
         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
            throw new Error("Please enter a valid email address.");
         }
      } else if (mode === 'phone') {
         if (identifier.length !== 11) {
            throw new Error("Phone number must be 11 digits long.");
         }

         if (!/^09\d{9}$/.test(identifier)) {
            throw new Error("Please enter a valid phone number starting with 09 and followed by 9 digits.");
         }
      }  
   }

   const handleSendToken = async (mode) => {
      try {
         setAccountLoading(true);
         console.log("---- [Profile Account] Sending Token Attempt ----");
         console.log("[1] Verifying Identifier");
         verifyInputs(mode);

         console.log("[2] Sending Identifier:", identifier);
         if (mode === "email") {
            const emailBody = { email: identifier };
            await api.post('/user/email/send-token', emailBody, {
               headers: {'Authorization' : `Bearer ${token}`}
            })
         } else if (mode === "phone") {
            const phoneBody = { phone_number: identifier };
            await api.post('/user/phone_number/send-token', phoneBody, {
               headers: {'Authorization' : `Bearer ${token}`}
            })
         }

         console.log("[3] Sending Succesful, Routing to Code")
         router.push(`/dashboard/client/settings/account/identifier-code`);
      } catch(err) {
         console.log("[0] Sending Failed");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when updating your account information. Please try again";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setAccountLoading(false);
      }
   }

   const verifyCode = (code) => {
       if (!code || code.trim() === "") 
         throw new Error("Code input must be filled to proceed.");
      if (code.length !== 6)
         throw new Error("Code must be 6 digits long.");
   }

   const handleVerifyToken = async (code) => {
      try {
         setAccountLoading(true);
         console.log("---- [Profile Account] Verifying Token Attempt ----");
         console.log("[1] Verifying Code");
         verifyCode(code);

         console.log("[2] Sending Code and Identifier:", code, identifier);
         if (accountMode === "email") {
            const emailBody = { 
               email: identifier,
               token: code
            };
            console.log(emailBody);
            await api.put('/user/email', emailBody, {
               headers: {'Authorization' : `Bearer ${token}`}
            })
         } else if (accountMode === "phone") {
            const phoneBody = { 
               phone_number: identifier,
               token: code
            };
            await api.put('/user/phone_number/send-token', phoneBody, {
               headers: {'Authorization' : `Bearer ${token}`}
            })
         }

         console.log("[3] Sending Succesful, Routing to Success")
         router.replace(`/dashboard/client/settings/account/success`);
      } catch(err) {
         console.log("[0] Sending Failed");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when updating your account information. Please try again";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setAccountLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (identifier !== temp) {
         setAccountDisabled(false);
      } else {
         setAccountDisabled(true);
      }
   }, [identifier])

   return (
      <AccountSettingsContext.Provider
      value={{
         accountModal,
         setAccountModal,
         accountMode,
         accountLoading,
         accountDisabled,
         identifier,
         setIdentifier,
         openModal,
         handleSendToken,
         handleVerifyToken
      }}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong"}
         message={errorMessage}
         />

         {children}
      </AccountSettingsContext.Provider>
   )
}

export const useAccountSettings = () => useContext(AccountSettingsContext);