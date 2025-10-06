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
import supabase from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useInbox } from './InboxContext'

const BookingDetailsContext = createContext();

export const BookingDetailsProvider = ({children}) => {
   // Hooks and States
   const {token, user} = useAuth();
   const router = useRouter();
   const {fetchInboxItem, setCurrentChat} = useInbox();

   const [details, setDetails] = useState(null);
   const [detailsLoading, setDetailsLoading] = useState(true);
   const [materials, setMaterials] = useState([]);
   const [worker, setWorker] = useState(null);
   const [workerLoading, setWorkerLoading] = useState(true);
   const [cameraModal, setCameraModal] = useState(false);
   const [qrPage, setQrPage] = useState(false);
   const [qrLoading, setQrLoading] = useState(false);
   const [completeLoading, setCompleteLoading] = useState(false);
   const [emergency, setEmergency] = useState({
      message: null
   });
   const [emergencySuccess, setEmergencySuccess] = useState(false);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);
   const [errorType, setErrorType] = useState(null);

   // Functions
   const fetchDetails = async (id, role) => {
      try {
         setDetailsLoading(true);
         
         // console.log("---- [Booking Context] Booking Details Fetch Attempt ----");
         // console.log("[1] Fetching Details for Booking", id);
         
         let route;
         if (role === 'user') {
            route = `/user/book/${id}/view`
         } else if (role === 'worker') {
            route = `/worker/bookings/${id}/`
         }

         const detailsResult = await api.get(route, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })
         const formattedMaterials = detailsResult?.data?.data?.booking_materials?.map(material => ({
            id: material.id,
            material_id: material.material_id,
            name: material.name,
            description: material.description,
            quantity: material.quantity,
            price: material.unit_price,
            selected: true
         }))

         // console.log("[2] Fetching Succesful");
         console.log(detailsResult?.data?.data);
         setDetails(detailsResult?.data?.data);
         setMaterials(formattedMaterials);
         setTimeout(() => {
            setDetailsLoading(false);
         }, 500); // 500ms delay
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when fetching the booking details.";
         setErrorMessage(message);
         setErrorType('fetch');
         setErrorModal(true);
      }
   }

   const fetchChatSession = async (id) => {
      const session = await fetchInboxItem(id);
      // console.log(session);
      setCurrentChat(session);
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
         setErrorMessage(message);
         setErrorType('fetch');
         setErrorModal(true);
      }
   }

   const onQrScanned = async (id, data) => {
      try {
         setQrLoading(true);
         // console.log("---- [Booking Details] QR Scan Attempt ----");
         // console.log("[1] Scanning QR with token:", data);
         const body = {token: data, booking_id: id}
         // console.log(body);
         // console.log(details);

         // console.log("[2] Updating Status of Booking", details?.id);
         await api.put(`/worker/bookings/update_status`, body, {
            headers: {'Authorization' : `Bearer ${token}`}
         });
      }  catch (err) {
         console.log("[0] Update Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when updating the booking status.";
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setQrLoading(false);
         setCameraModal(false);
      }
   }

   const subscriptionRef = useRef(null);
      
   const cleanupSubscription = () => {
      if (subscriptionRef.current) {
         subscriptionRef.current.unsubscribe();
         subscriptionRef.current = null;
      }
   }

   useEffect(() => {
      if (!details?.id) {
         cleanupSubscription();
         return;
      }

      cleanupSubscription();

      const changes = supabase
         .channel(`booking_${details.id}`)
         .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
            filter: `id=eq.${details.id}`
         }, async (payload) => {
            console.log("REAL-TIME CHANGE STATUS")

            if (user?.role === "User") {
               console.log("Updated User Details");
               await fetchDetails(details?.id, "user");
            } else if (user?.role === "Worker") {
               console.log("Updated Worker Details");
               await fetchDetails(details?.id, "worker");
            }

           
      }).subscribe();

      subscriptionRef.current = changes;

      return () => {
         cleanupSubscription();
      };
   }, [details?.id])

   useEffect(() => {
      console.log("BOOKING STATUS:", details?.status);
      if (qrPage) {
         // console.log("Routing Back");
         router.back();
      }
   }, [details?.status]);

   const handleComplete = async (id) => {
      try {
         setCompleteLoading(true);
         console.log("---- [Booking Details] Complete Attempt ----");
         console.log("[1] Completing Status of Booking", details?.id);
         await api.put(`/user/book/${id}/mark_as_completed`, {}, {
            headers: {'Authorization' : `Bearer ${token}`}
         });
         
         console.log("[3] Succesfully Updated Booking");
         await fetchDetails(id, "user");
      } catch (err) {
         console.log("[0] Update Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when updating the booking status.";
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setCompleteLoading(false);
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
         setErrorMessage(message);
         setErrorType('emergency');
         setErrorModal(true);
      }
   }

   return (
      <BookingDetailsContext.Provider
      value={{
         details,
         detailsLoading,
         fetchDetails,
         fetchChatSession,

         materials,
         setMaterials,

         worker,
         workerLoading,
         fetchWorker,

         cameraModal,
         setCameraModal,
         onQrScanned,
         setQrPage,
         qrLoading,
         handleComplete,
         completeLoading,

         emergency,
         setEmergency,
         clearEmergency,
         handleEmergency,
         emergencySuccess,

         setErrorModal,
         setErrorMessage,
         setErrorType
      }}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something Went Wrong"}
         message={errorMessage}
         buttonText={
            errorType === 'fetch' ? 'Go Back' : 
            errorType === 'emergency' ? 'Try Again' :
            'Ok'
         }
         onExit={
            errorType === 'fetch' ? () => router.back() : 
            errorType === 'emergency' ? () => handleEmergency(details?.id) :
            () => setErrorModal(false)
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