// Context: Booking Details

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {  useRouter } from 'expo-router';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';
import GeneralModal from '../components/GeneralModal';
// ---- Other Libs
import api from '../lib/api';
import { useAuth } from './AuthContext';

const BookingDetailsContext = createContext();

export const BookingDetailsProvider = ({children}) => {
   // Hooks and States
   const {token} = useAuth();
   const router = useRouter();

   const [details, setDetails] = useState(null);
   const [detailsLoading, setDetailsLoading] = useState(true);
   const [worker, setWorker] = useState(null);
   const [workerLoading, setWorkerLoading] = useState(true);
   const [emergency, setEmergency] = useState({
      message: null
   });
   const [emergencySuccess, setEmergencySuccess] = useState(false);

   const [showError, setShowError] = useState(false);
   const [errorTitle, setErrorTitle] = useState(null);
   const [errorMessage, setErrorMessage] = useState(null);
   const [errorType, setErrorType] = useState(false);

   // Functions
   const fetchDetails = async (id) => {
      try {
         setDetailsLoading(true);
         
         console.log("---- [Booking Context] Booking Details Fetch Attempt ----");
         console.log("[1] Fetching Details");
         const detailsResult = await api.get(`/user/book/${id}/view`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         console.log("[2] Fetching Succesful");
         setDetails(detailsResult?.data?.data);
         setDetailsLoading(false);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when fetching the booking details.";
         setErrorTitle("Booking Details Error");
         setErrorMessage(message);
         setErrorType('fetch');
         setShowError(true);
      }
   }

   const fetchWorker = async (id) => {
      try {
         setWorkerLoading(true);
         
         console.log("---- [Booking Context] Worker Details Fetch Attempt ----");
         console.log("[1] Fetching Details");
         const workerResult = await api.get(`/user/book/worker/${id}/view`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         console.log("[2] Fetching Succesful");
         setWorker(workerResult?.data?.data);
         setWorkerLoading(false);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when fetching worker details.";
         setErrorTitle("Worker Details Error");
         setErrorMessage(message);
         setErrorType('fetch');
         setShowError(true);
      }
   }

   const clearEmergency = () => {
      setEmergency({
         message: null
      })
   }

   const handleEmergency = async (id) => {
      try {
         console.log("---- [Booking Context] Emergency Attempt ----");
         console.log("[1] Submitting Emergency", id);
         await api.post(`/emergency/notify-user-emergency-contacts/${id}`, emergency, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log("[2] Succesful Emergency");
         setEmergencySuccess(true);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when sending emergency alerts.";
         setErrorTitle("Emergency Error");
         setErrorMessage(message);
         setErrorType('emergency');
         setShowError(true);
      }
   }

   return (
      <BookingDetailsContext.Provider
      value={{
         details,
         detailsLoading,
         fetchDetails,

         worker,
         workerLoading,
         fetchWorker,

         emergency,
         setEmergency,
         clearEmergency,
         handleEmergency,
         emergencySuccess
      }}>
         <ErrorModal 
         visible={showError}
         setVisible={setShowError}
         title={errorTitle}
         message={errorMessage}
         buttonText={
            errorType === 'fetch' ? 'Go Back' : 
            errorType === 'emergency' ? 'Try Again' :
            'Ok'
         }
         onExit={
            errorType === 'fetch' ? () => router.back : 
            errorType === 'emergency' ? () => handleEmergency(details?.id) :
            () => setShowError(false)
         }/>

         <GeneralModal 
         visible={emergencySuccess}
         setVisible={setEmergencySuccess}
         isAlert
         title="Emergency Contacts Notified"
         message="We've successfully alerted your emergency contacts and our support team. They will reach out to you shortly. If this is a life-threatening emergency, please also call local emergency services."
         primaryText={"Ok"}
         primaryFunction={() => setEmergencySuccess(false)}
         />

         {children}
      </BookingDetailsContext.Provider>
   )
}

export const useBookingDetails = () => useContext(BookingDetailsContext);