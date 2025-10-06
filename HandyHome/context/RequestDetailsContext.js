// Context: Request Details

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {  useRouter } from 'expo-router';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';
// ---- Other Libs
import api from '../lib/api';
import { useAuth } from './AuthContext';

const RequestDetailsContext = createContext();

export const RequestDetailsProvider = ({children}) => {
   // Hooks and States
   const {token, user} = useAuth();
   const router = useRouter();

   const [requestId, setRequestId] = useState(null);
   const [details, setDetails] = useState(null);
   const [detailsLoading, setDetailsLoading] = useState(true);
   const [materials, setMaterials] = useState([]);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);
   const [errorType, setErrorType] = useState(null);

   // Functions
   const fetchDetails = async (id) => {
      try {
         setDetailsLoading(true);
         
         const detailsResult = await api.get(`/worker/bookings/${id}/view`, {
            'headers': {'Authorization' : `Bearer ${token}`}
         });

         const requestDetails = detailsResult?.data?.data?.initial_booking_details;
         const suggestedMaterials = detailsResult?.data?.data?.materials;
         const formattedMaterials = suggestedMaterials.map((material) => ({...material, selected: false, quantity: 1}));

         // console.log('SUGGESTED MATERIALS:', suggestedMaterials);
         console.log(requestDetails);
         // console.log('FORMATED MATERIALS:', formattedMaterials);

         setDetails(requestDetails);
         setMaterials(formattedMaterials);

         setDetailsLoading(false);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when fetching the request details. Please try again."
         setErrorMessage(message);
         setErrorType('details');
         setErrorModal(true);
      }
   }

   const clearDetails = () => {
      setRequestId(null);
      setDetails(null);
      setDetailsLoading(true);
      setMaterials([]);
   }

   return ( 
      <RequestDetailsContext.Provider
      value={{
         setRequestId,
         details,
         detailsLoading,
         materials,
         setMaterials,

         fetchDetails,
         clearDetails,

         setErrorModal,
         setErrorMessage,
         setErrorType,
      }}> 
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title='Something went wrong!'
         message={errorMessage}
         buttonText={errorType ? 'Try Again' : undefined}
         onExit={errorType==='details' ? () => fetchDetails(requestId) : undefined}
         />
         {children}
      </RequestDetailsContext.Provider>
   )
}

export const useRequestDetails = () => useContext(RequestDetailsContext);